import React, { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export const LoginContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [tokens, setTokens] = useState(0);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);  // Estado de carga general
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        try {
          // Recuperar datos del usuario desde Firestore
          const userRef = doc(db, "usuarios", user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setTokens(userData.tokens);
            setRole(userData.role);
          } else {
            console.log("El documento del usuario no existe en la base de datos.");
          }
        } catch (error) {
          console.error("Error al cargar los datos del usuario:", error);
        }
      } else {
        console.log("El usuario ha cerrado sesión, se reiniciará el estado.");
        setCurrentUser(null);
        setRole(null);
        setTokens(0);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <LoginContext.Provider value={{ currentUser, tokens, setTokens, role, loading }}>
      {children}
    </LoginContext.Provider>
  );
};