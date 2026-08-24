import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import AnalysisTools from "./pages/AnalysisTools";
import DataReader from "./pages/DataReader";
import ReportGeneration from "./pages/ReportGeneration";
import UtilityTool from "./pages/UtilityTool";
import SummaryControl from "./pages/SummaryControl";
import PlotGeneration from "./pages/PlotGeneration";

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analysis" element={<AnalysisTools />} />
        <Route path="/data-reader" element={<DataReader />} />
        <Route path="/report-generation" element={<ReportGeneration />} />
        <Route path="/utility" element={<UtilityTool />} />
        <Route path="/summary" element={<SummaryControl />} />
        <Route path="/plot-generation" element={<PlotGeneration />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
