const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { startServer, stopServer } = require("../backend/server");

const isDev = !app.isPackaged;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1100,
    minHeight: 720,
    backgroundColor: "#f8fafc",
    titleBarStyle: "hiddenInset",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
      enableRemoteModule: false,
    },
  });

  const startUrl =
    process.env.ELECTRON_START_URL ||
    `file://${path.join(__dirname, "../dist/index.html")}`;
  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }
}

app.whenReady().then(() => {
  startServer();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    stopServer().finally(() => app.quit());
  }
});

app.on("before-quit", (event) => {
  if (process.platform === "darwin") return;
  event.preventDefault();
  stopServer().finally(() => app.exit(0));
});

ipcMain.handle("dialog:openFile", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [
      {
        name: "All supported files",
        extensions: ["txt", "csv", "json", "log", "dat"],
      },
      { name: "Text files", extensions: ["txt", "csv", "json", "log"] },
    ],
  });

  if (canceled || !filePaths.length) {
    return { canceled: true, path: null };
  }

  return { canceled: false, path: filePaths[0] };
});
