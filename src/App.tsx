import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Search from "./pages/Search";
import SignIn from "./pages/SignIn"; // Import the SignIn component
import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute component
import "./App.css";

function App() {
  return (
    <div className="container">
      <Header title="PayTrace" />

      <Routes>
        {/* Public route for SignIn */}
        <Route path="/login" element={<SignIn />} />

        {/* Redirect to /search by default */}
        <Route path="/" element={<Navigate to="/search" replace />} />

        {/* Private Route for authenticated users */}
        <Route path="/search" element={<PrivateRoute element={<Search />} />} />
      </Routes>

      <Footer title="PayTrace" />
    </div>
  );
}

export default App;
