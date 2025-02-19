import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/login";
import Dashboard from './component/Dashboard';
import Round1 from './component/Round1';
import Round2 from './component/Round2';
import Round3 from './component/Round3';
import Round4 from './component/Round4';
import Round6 from './component/Round6';
import ExportData from './component/ExportData';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/round1" element={<Round1 />} />
        <Route path="/round2" element={<Round2 />} />
        <Route path="/round3" element={<Round3 />} />
        <Route path="/round4" element={<Round4 />} />
        <Route path="/round6" element={<Round6 />} />
        {/* New route for exporting data */}
        <Route path="/export" element={<ExportData />} />
      </Routes>
    </Router>
  );
}

export default App;
