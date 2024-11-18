import { Navigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { LoginContext } from "./LoginContext";

const ProtectedRoute = ({ element, adminRequired = false }) => {
    const { currentUser, role } = useContext(LoginContext);
    const [loading, setLoading] = useState(true);

    console.log('Current User en ProtectedRoute:', currentUser);
    console.log('Rol del usuario:', role); 

    useEffect(() => {
    if (currentUser !== null && role !== null) {
        setLoading(false); 
      }
    }, [currentUser, role]);

    if (loading) {
        return <div>Loading...</div>; 
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
