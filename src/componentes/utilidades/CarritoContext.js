import React, { createContext, useState, useContext } from 'react';

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
    const [carrito, setCarrito] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalTokens, setTotalTokens] = useState(0);

    const añadirAlCarrito = (producto) => {
        setCarrito((prevCarrito) => {
            const productoExistente = prevCarrito.find(item => item.id === producto.id);
            if (productoExistente) {
                return prevCarrito.map(item =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            } else {
                return [...prevCarrito, { ...producto, cantidad: 1 }];
            }
        });

        setTotalTokens(prevTokens => prevTokens + producto.cantidad);  
        setTotal(prevTotal => prevTotal + producto.precio); 
    };

    const aumentarCantidad = (id) => {
        const producto = carrito.find(item => item.id === id);

        if (producto) {
            const nuevaCantidad = producto.cantidad + 1;
            console.log("La nueva cantidad es: ", nuevaCantidad)

            setCarrito(prevCarrito =>
                prevCarrito.map(item =>
                    item.id === id
                        ? { ...item, cantidad: nuevaCantidad }
                        : item
                )
            );

            console.log("La cantidad de producto es: ", producto.tokens)
            console.log("El id del producto es: ", producto.id)

            const tokensAumentados = nuevaCantidad * producto.tokens; 
            
            console.log("Los tokens aumentados son: ", tokensAumentados)

            setTotalTokens(prevTokens => {
                const nuevosTokens = prevTokens + producto.tokens; 
                console.log("Tokens totales actualizados: ", nuevosTokens);
                return nuevosTokens;  
            });
        setTotal(prevTotal => prevTotal + producto.precio);
        }
        console.log("SetTokens ha dado: ", totalTokens)
    };

    const disminuirCantidad = (id) => {
        const producto = carrito.find(item => item.id === id);

        if (producto && producto.cantidad > 1) {
            const nuevaCantidad = producto.cantidad - 1;
            
            setCarrito(prevCarrito =>
                prevCarrito.map(item =>
                    item.id === id && item.cantidad > 1
                        ? { ...item, cantidad: nuevaCantidad }
                        : item
                )
            );

        const tokensDisminuidos = nuevaCantidad * producto.tokens;
        console.log("Los tokens disminuidos son: ", tokensDisminuidos)

        setTotalTokens(prevTokens => {
                const nuevosTokens = prevTokens - producto.tokens; 
                console.log("Tokens totales actualizados: ", nuevosTokens);
                return nuevosTokens;  
            });
        setTotal(prevTotal => prevTotal - producto.precio);
        }
        console.log("SetTokens ha dado: ", totalTokens)

        if (producto && producto.cantidad === 1) {
            setTotalTokens(prevTokens => {
                const nuevosTokens = prevTokens - producto.tokens; 
                console.log("Tokens totales actualizados: ", nuevosTokens);
                return nuevosTokens;  
            });
            setTotal(prevTotal => prevTotal - producto.precio);
            setCarrito(prevCarrito =>
                prevCarrito.filter(item => item.id !== id)
            );
        }
    };


    const limpiarCarrito = () => {
        setCarrito([]);
        setTotalTokens(0);
        setTotal(0);
    };

    return (
        <CarritoContext.Provider value={{
            carrito, total, totalTokens, añadirAlCarrito, aumentarCantidad, disminuirCantidad, limpiarCarrito
        }}>
            {children}
        </CarritoContext.Provider>
    );
};

export const useCarrito = () => useContext(CarritoContext);
