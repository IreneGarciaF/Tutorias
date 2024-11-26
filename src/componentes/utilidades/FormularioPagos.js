import React, { useState, useContext } from 'react';
import { Button, Form, Container, Col, Row } from 'react-bootstrap';
import { LoginContext } from './LoginContext';
import { useCarrito } from './CarritoContext';
import { db } from './firebase';
import { updateDoc, doc } from 'firebase/firestore';
import './FormularioPagos.css'
import Swal from 'sweetalert2'

const FormularioPagos = () => {
    const { currentUser, tokens, setTokens } = useContext(LoginContext); 
    const { carrito, total, limpiarCarrito, totalTokens } = useCarrito(); 
    const [numeroTarjeta, setNumeroTarjeta] = useState('');
    const [fechaVencimiento, setFechaVencimiento] = useState('');
    const [cvc, setCvc] = useState('');
    const [nombre, setNombre] = useState('');
   

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!numeroTarjeta || !fechaVencimiento || !cvc || !nombre) {
            alert('Por favor, complete todos los campos del formulario.');
            return;
        }

        const newTokens = tokens + totalTokens;

        try {
          const userRef = doc(db, 'usuarios', currentUser.uid);
          await updateDoc(userRef, {
            tokens:newTokens
          });

          setTokens(newTokens);
          Swal.fire({
            position: "center",
            icon: "success",
            title: 'Compra realizada con éxito. Has recibido ' + totalTokens + ' tokens',
            confirmButtonText: "Ok",
            confirmButtonColor: "#0473ba",
          });

           // Limpiar el carrito y el formulario
           limpiarCarrito();
           setNumeroTarjeta('');
           setFechaVencimiento('');
           setCvc('');
           setNombre('');

        } catch (error) {
          console.error("Error al procesar el pago: ", error)
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Hubo un error al procesar el pago.",
            showConfirmButton: false,
            timer: 2000
          });
        }
    };

  return (
    <Container className="pasarela-pago">
        <h2>Pasarela de pago</h2>
    <Form onSubmit={handleSubmit}>
    <Row className="mb-3">
      <Form.Group as={Col} md="4" controlId="formNumeroTarjeta">
        <Form.Label>Numero de Tarjeta</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="0123 4567 8901 2345 6789"
          value={numeroTarjeta}
          onChange={(e) => setNumeroTarjeta(e.target.value)}
        />

      </Form.Group>
      <Form.Group as={Col} md="4" controlId="formNombre">
        <Form.Label>Nombre Completo</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Nombre Completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

      </Form.Group>
    </Row>
    <Row className="mb-3">
      <Form.Group as={Col} md="6" controlId="FechaVencimiento">
        <Form.Label>Fecha de vencimiento</Form.Label>
        <Form.Control 
            type="text" 
            placeholder="MM/AA" 
            required 
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
        />
      </Form.Group>

      <Form.Group as={Col} md="3" controlId="CVC">
        <Form.Label>CVC</Form.Label>
        <Form.Control
            type="text" 
            placeholder="CVC" 
            required 
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
        />
        </Form.Group>
    </Row>

    <Button type="submit" className="pasarela-btn" >Pagar</Button>
  </Form>
  </Container>
  )
}

export default FormularioPagos
