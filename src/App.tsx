import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Customers from "./pages/Customers";
import Invoices from "./pages/Invoices";
import { Customer } from './types';
import "./App.css";

function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/customers')
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load customers:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <Header title="PayTrace"/>

      <Routes>
        <Route path="/" element={<Navigate to="/customers" replace />} />
        <Route
          path="/customers"
          element={loading ? <p>Loading...</p> : <Customers customers={customers} />}
        />
        <Route path="/invoices" element={<Invoices />} />
      </Routes>

      <Footer title="PayTrace"/>
    </div>
  );
}

export default App;
