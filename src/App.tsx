import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Customers from "./pages/Customers";
import Invoices from "./pages/Invoices";
import "./App.css";

function App() {
  return (
    <div className="container">
      <Header title="PayTrace" />

      <Routes>
        <Route path="/" element={<Navigate to="/customers" replace />} />
        <Route path="/search" element={<Customers />} />
        <Route path="/invoices" element={<Invoices />} />
      </Routes>

      <Footer title="PayTrace" />
    </div>
  );
}

export default App;
