import { Container, Col, Row, Button } from 'react-bootstrap';
import { useState } from 'react';
import FormularioPagos from './utilidades/FormularioPagos';
import { useCarrito } from './utilidades/CarritoContext';
import './tienda.css';

// imágenes
import token1 from '../assets/token1.png';
import token2 from '../assets/token2.png';
import token3 from '../assets/token3.png';

function Tienda() {
    const { carrito, total, añadirAlCarrito } = useCarrito();

    const productos = [
        { id: 1, nombre: '1 Token', precio: 10, cantidad: 1, imagen: token1 },
        { id: 2, nombre: '3 Tokens', precio: 26, cantidad: 3, imagen: token2 },
        { id: 3, nombre: '6 Tokens', precio: 50, cantidad: 6, imagen: token3 },
    ];


    return (
        <Container fluid className="seccion-tienda">
                <Col xs={6} md={6} className="col1-tienda">
                    <Row className="objetos-carrito">
                        {productos.map((producto) => (
                            <Col key={producto.id} xs={12} md={4} className={`token${producto.id}-tienda`}>
                                <div className={`carta${producto.id}-tienda`}>
                                    <img className={`img${producto.id}-tienda`} src={producto.imagen} alt={producto.nombre} />
                                    <h4>{producto.nombre}</h4>
                                    <h5>{producto.precio} euros</h5>
                                    <Button 
                                        variant="primary" 
                                        className="tienda-btn"
                                        onClick={() => añadirAlCarrito(producto)}>
                                        Añadir al carrito
                                    </Button>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Col>

                <Col xs={6} md={6} className="col2-tienda">
                    <div className="cabecera-tienda"> 
                    <h3>Carrito</h3>
                    <ul>
                        {carrito.map((item, index) => (
                            <li key={index}>{item.nombre}</li>
                        ))}
                    </ul>
                    <h4>Total: {total} euros</h4>
                    <FormularioPagos carrito={carrito} total={total} /> 
                    </div>
                </Col>
        </Container>
    );
}

export default Tienda;
