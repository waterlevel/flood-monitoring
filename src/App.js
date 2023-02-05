/* eslint-disable */
import { Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./components/dashboard"
import Reports from "./components/reports"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/reports" element={<Reports />} />
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;
