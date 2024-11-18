import React, { useState } from 'react';
import {Container, Col, Button, Form, } from 'react-bootstrap/';
import { Link, useNavigate } from 'react-router-dom';
import './login.css'

//base de datos
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// imagenes
import plantas from '../assets/plantas.png'
import logo2 from '../assets/logo2.png'


function Login() {
  
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        const auth = getAuth();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('Inicio de sesión exitoso');

            // Redirigir a otra página tras el inicio de sesión
            navigate('/tutorias'); 
        } catch (error) {
            const errorMessage = error.message;
            console.error("Error al iniciar sesión: ", errorMessage);
            alert(`Error: ${errorMessage}`);
        }
    };

  return (
    <Container fluid className="seccion-login">
        <Col xs={6} md={6} className="col1-login">
        <div className="recuadro-login">
        <img className="plantas-login" src={plantas} alt="Fondo-plantas" ></img>
        </div>

        </Col>
        <Col xs={6} md={6} className="col2-login">
            <div className="cabecera-login">   
                <img className="logo-login" src={logo2} alt="Fondo-plantas" ></img>
            </div>
            <Form className="formulario-login" onSubmit={handleSubmit}>
                <Form.Group className="campos-login" controlId="formBasicEmail">
                    <Form.Label>Email </Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Introduce tu email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="campos-login" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Contraseña"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </Form.Group>

                <div className="recuperar-login">
                    <Link to="/register">¿No tienes cuenta? Registrate aquí</Link>
                </div>
                
                <Button variant="primary" type="submit" className="boton-login">
                    Iniciar Sesión
                </Button>
            </Form>     
        </Col>
    </Container>
  )
}

export default Login
