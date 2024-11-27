import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "./LoginContext";

const ProtectedRoute = ({ element, adminRequired = false }) => {
  const { currentUser, role, loading } = useContext(LoginContext);

 
  if (loading) {
    return <div>Loading...</div>;
  }


  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  
  if (adminRequired && role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;
