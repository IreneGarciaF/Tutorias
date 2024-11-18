import {Container, Nav, Navbar } from 'react-bootstrap/';
import { Link } from 'react-router-dom';
import { LoginContext } from './utilidades/LoginContext';
import { useContext } from 'react';
import { getAuth, signOut } from "firebase/auth";
import './header.css';

//imagenes 
import logo from '../assets/logo.png'
import logoByN from '../assets/logoByN.png'

function Header() {

  const { currentUser, tokens, role } = useContext(LoginContext);
  

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary ">
      <Container fluid className="cabecera">
        <div className="logo-container">
          <Navbar.Brand className="logo" href="#">
              <img className="logo-img" src={logo} alt="Logo" ></img>
          </Navbar.Brand>
          <Container className="usuario-header">
            <Container className="nombre-header">
            {currentUser && currentUser.displayName ? (
                  <h6>Hola, {currentUser.displayName}!</h6>
              ) : (
                  <h6>Bienvenido, invitado!</h6>
              )}
            </Container>
            <Container className="unicoins-header">
                <img className="logoByN" src={logoByN} alt="LogoByN"  ></img>
                <p>Tus tokens: {tokens} </p>
            </Container>
         </Container> 
        </div>
        <Navbar.Collapse className="navegacion" id="basic-navbar-nav">          
            <Nav className="header-links">       
              <Link className="header-link" to="/" > Inicio </Link>
              {role === 'user' && <Link className="header-link" to="/catalogo" > Catálogo </Link>}
              {role === 'user' && <Link className="header-link" to="/tienda"> Tienda </Link>}
              <Link className="header-link" to="/tutorias"> Calendario </Link>

              {role === 'admin' && <Link className="header-link" to="/admin">Panel de Administrador</Link>}
              
              {role === 'user' && <Link className="header-link" to="/usuario"> Usuario </Link>}
              <Link className="header-link" onClick={handleLogout}>Cerrar Sesión </Link>
            </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
