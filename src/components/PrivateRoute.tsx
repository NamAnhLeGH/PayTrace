// PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext/index"; // Assuming you have useAuth hook for authentication

interface Props {
  element: React.ReactNode; // The element to render if authenticated
}

const PrivateRoute = ({ element }: Props) => {
  const { userLoggedIn } = useAuth(); // Get userLoggedIn status from context

  return userLoggedIn ? <>{element}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
