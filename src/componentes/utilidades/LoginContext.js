
import React, { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export const LoginContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [tokens, setTokens] = useState(0);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    useEffect(() => {     
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user); 

                const userRef = doc(db, "usuarios", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()){
                    const userData = userDoc.data();
                    setTokens(userData.tokens);  
                    setRole(userDoc.data().role);
                
                } else {
                    console.log("El documento del usuario no existe en la base de datos.");
                }
                } else {
                    console.log('El usuario ha cerrado sesión, se reiniciará el estado.');
                    setCurrentUser(null);
                    setRole(null);
                    setTokens(0);
                }
                setLoading(false);    
        });
        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        if (role !== null) {
            console.log("Se ha cargado el rol de usuario:", role);
        }
    }, [role]);
       
    
    return (
        <LoginContext.Provider value={{ currentUser, tokens, setTokens, role, loading }}>
            {children}
        </LoginContext.Provider>
    );
};
