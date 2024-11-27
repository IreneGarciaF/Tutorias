import React, { useState } from 'react';
import {Container, Col, Button, Form, } from 'react-bootstrap/';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';

//base de datos
import { db } from './utilidades/firebase';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from 'firebase/firestore';


//imagenes y alert
import plantas from '../assets/plantas.png'
import logo2 from '../assets/logo2.png'
import Swal from 'sweetalert2'

function Register() {

    //las variables de estado
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

    // Validación de campos
        if (!nombre || !email || !password) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const auth = getAuth();

    try {
        // Crear un nuevo usuario con email y contraseña
        const userCredential = await createUserWithEmailAndPassword(auth, email, password); 
        const user = userCredential.user;

        console.log(user);
        console.log(user?.uid)

        await updateProfile(user, {displayName: nombre});
        
        // Guardar el usuario en Firestore 
        await setDoc(doc(db, "usuarios", user.uid), {
            uid: user.uid, 
            email: email,
            nombre: nombre,
            tokens: 0, 
            role: isAdmin ? 'admin' : 'user', 
        }, { merge: true });
          

        await Swal.fire({
            position: "center",
            icon: "success",
            title: "Te has registrado con éxito. Ya puedes iniciar sesión.",
            confirmButtonText: "Ok",
            confirmButtonColor: "#0473ba",
          });
        setEmail('');
        setPassword('');
        setNombre ('');
        
        // se redirige a la página de login
        navigate('/login'); 
        
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error al registrar: ", errorCode, errorMessage);
        alert(`Error: ${errorMessage}`);
    }
};


  return (
    <Container fluid className="seccion-register">
        <Col xs={6} md={6} className="col1-register">
        <div className="recuadro-register">
        <img className="plantas-register" src={plantas} alt="Fondo-plantas" ></img>
        </div>

        </Col>
        <Col xs={6} md={6} className="col2-register">
            <div className="cabecera-formulario">   
                <img className="logo-register" src={logo2} alt="Fondo-plantas" ></img>
            </div>
            <Form className="formulario-register" onSubmit={handleSubmit}>
            <Form.Group className="campos-register" controlId="formBasicText">
                    <Form.Label> Nombre y apellidos </Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Introduce tu nombre y apellidos" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="campos-register" controlId="formBasicEmail">
                    <Form.Label>Email </Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Introduce tu email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="campos-register" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Contraseña"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </Form.Group>

                <Form.Group className="campos-register" controlId="formBasicCheckbox">
                        <Form.Check
                            type="checkbox"
                            label="¿Eres administrador?"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)} // Cambiar el estado del checkbox
                        />
                    </Form.Group>

                <div className="recuperar-register">
                    <Link to="/login">¿Ya estás registrado?</Link>
                </div>
                
                <Button variant="primary" type="submit" className="boton-register">
                    Registrarse
                </Button>
            </Form>     
        </Col>
    </Container>
  )
}


export default Register;
