import {Container, Button, Col} from 'react-bootstrap/';
import { Link } from 'react-router-dom';
import './inicio.css'



function Inicio() {
  return (
    <Container fluid className="seccion-inicio">
        <Col xs={6} md={6} className="col1-header">
          <div className="recuadro-header">
            <p>Plataforma de gestión de citas</p>

          </div>
        </Col>
        <Col xs={6} md={6} className="col2-header">
            <div className="texto-inicio">
                <p>A través de esta plataforma podrás gestionar y consultar tus citas online. </p>
                <p>Para concertar una nueva cita deberás comprar un paquete a través de nuestra web, para después agendarla en el momento que te venga bien. </p>
                <p>Una vez concertada, podrás consultar tus citas en el calendario del enlace de tu perfil. </p>
                <p>Regístrate o inicia sesión para comprar tus paquetes y concertar una nueva cita</p>
            </div>
            <Link to="/register"> 
              <Button variant="primary" className="header-btn">
                Registrarme
              </Button>
            </Link>
          </Col>
    </Container>
  )
}

export default Inicio
