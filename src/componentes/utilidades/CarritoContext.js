import React, { createContext, useState, useContext } from 'react';
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { LoginContext } from './LoginContext';

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
    const [carrito, setCarrito] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalTokens, setTotalTokens] = useState(0);

    const añadirAlCarrito = (producto) => {
        setCarrito((prevCarrito) => [...prevCarrito, producto]);
        setTotalTokens ((prevTokens) => prevTokens + producto.cantidad);
        setTotal((prevTotal) => prevTotal + producto.precio);
        
    };

    const limpiarCarrito = () => {
        setCarrito([]);
        setTotalTokens(0);
        setTotal(0);
    };

    return (
        <CarritoContext.Provider value={{
            carrito, total, totalTokens, añadirAlCarrito, limpiarCarrito
        }}>
            {children}
        </CarritoContext.Provider>
    );
};

export const useCarrito = () => useContext(CarritoContext);
