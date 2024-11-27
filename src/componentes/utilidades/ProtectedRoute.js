import { Navigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { LoginContext } from "./LoginContext";

const ProtectedRoute = ({ element, adminRequired = false }) => {
    const { currentUser, role, loading: authLoading } = useContext(LoginContext);
    const [isReady, setIsReady] = useState(false);

    console.log('Current User en ProtectedRoute:', currentUser);
    console.log('Rol del usuario:', role); 

    useEffect(() => {
        if (currentUser !== null && role !== null && !authLoading) {
          setIsReady(true); // Asegúrate de que tanto el usuario como el rol están disponibles
        }
      }, [currentUser, role, authLoading]);
    
      if (authLoading || !isReady) {
        return <div>Loading...</div>;  // Asegúrate de esperar hasta que todo esté listo
      }
    
      if (adminRequired) {
        if (!currentUser || role !== 'admin') {
          return <Navigate to="/login" />;
        }
      } else {
        if (!currentUser) {
          return <Navigate to="/login" />;
        }
      }
    
      return element;
    };

export default ProtectedRoute;
