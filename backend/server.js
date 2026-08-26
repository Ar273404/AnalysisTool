const http = require("http");
const fs = require("fs");
const path = require("path");
const { WebSocketServer } = require("ws");
const DataReaderService = require("./dataReaderService");
const { outputDirectory, STREAM_CONFIG } = require("./config");

const PORT = Number(process.env.DATA_READER_API_PORT || 47831);
const service = new DataReaderService();
let server;

function json(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  response.end(JSON.stringify(body));
}

function filenameFromUrl(value) {
  const filename = decodeURIComponent(value);
  if (
    !filename ||
    filename !== path.basename(filename) ||
    filename.includes("..")
  )
    return null;
  return filename;
}

async function requestBody(request) {
  let body = "";
  for await (const chunk of request) body += chunk;
  return body ? JSON.parse(body) : {};
}

function attachEvents(ws) {
  const send = (type, payload) => {
    if (ws.readyState === ws.OPEN)
      ws.send(JSON.stringify({ type, ...payload }));
  };
  const handlers = new Map();
  [
    "receiverStarted",
    "receiverStopped",
    "receiverError",
    "packetReceived",
    "recordingStarted",
    "recordingStopped",
  ].forEach((type) => {
    const handler = (payload) => send(type, payload);
    handlers.set(type, handler);
    service.on(type, handler);
  });
  ws.on("close", () =>
    handlers.forEach((handler, type) => service.off(type, handler)),
  );
  send("status", service.snapshot());
}

function createServer() {
  server = http.createServer(async (request, response) => {
    if (request.method === "OPTIONS") return json(response, 204, {});
    try {
      if (
        request.method === "POST" &&
        request.url === "/api/data-reader/start"
      ) {
        const body = await requestBody(request);
        return json(
          response,
          200,
          await service.start(body.streams, body.format),
        );
      }
      if (request.method === "POST" && request.url === "/api/data-reader/stop")
        return json(response, 200, {
          status: "stopped",
          streams: Object.fromEntries(
            (await service.stop()).map((item) => [
              item.stream,
              { packetCount: item.packetCount, bytes: item.totalBytes },
            ]),
          ),
        });
      if (request.method === "GET" && request.url === "/api/data-reader/status")
        return json(response, 200, service.snapshot());
      if (
        request.method === "GET" &&
        request.url === "/api/data-reader/files"
      ) {
        await fs.promises.mkdir(outputDirectory, { recursive: true });
        const names = await fs.promises.readdir(outputDirectory);
        const files = await Promise.all(
          names.map(async (name) => {
            const stat = await fs.promises.stat(
              path.join(outputDirectory, name),
            );
            const stream = Object.entries(STREAM_CONFIG).find(([, config]) =>
              name.startsWith(`${config.name}_`),
            );
            return {
              name,
              stream: stream ? stream[0] : null,
              type: path.extname(name).slice(1),
              size: stat.size,
              createdAt: stat.birthtime.toISOString(),
            };
          }),
        );
        return json(
          response,
          200,
          files.filter((file) => file.stream),
        );
      }
      const match = request.url.match(
        /^\/api\/data-reader\/files\/([^/]+)(\/download)?$/,
      );
      if (match) {
        const filename = filenameFromUrl(match[1]);
        if (!filename)
          return json(response, 400, { error: "Invalid filename." });
        const filePath = path.join(outputDirectory, filename);
        if (request.method === "DELETE" && !match[2]) {
          await fs.promises.unlink(filePath);
          return json(response, 200, { status: "deleted", name: filename });
        }
        if (request.method === "GET" && match[2]) {
          if (!fs.existsSync(filePath))
            return json(response, 404, { error: "File not found." });
          response.writeHead(200, {
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Type": "application/octet-stream",
          });
          return fs.createReadStream(filePath).pipe(response);
        }
      }
      return json(response, 404, { error: "Not found." });
    } catch (error) {
      return json(response, 400, { error: error.message });
    }
  });
  const wss = new WebSocketServer({ server, path: "/ws" });
  wss.on("connection", attachEvents);
  return server;
}

function startServer() {
  if (server) return server;
  server = createServer();
  server.listen(PORT, "127.0.0.1");
  return server;
}

async function stopServer() {
  await service.stop();
  if (server) await new Promise((resolve) => server.close(resolve));
  server = null;
}

module.exports = { startServer, stopServer, service, PORT };
