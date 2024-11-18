import {Container, Button, Col, Row} from 'react-bootstrap/';
import { Link } from 'react-router-dom';
import { useCarrito } from './utilidades/CarritoContext';
import './catalogo.css'

//imagenes
import token1 from '../assets/token1.png';
import token2 from '../assets/token2.png';
import token3 from '../assets/token3.png'

function Catalogo() {
  const { añadirAlCarrito } = useCarrito();

  return (
    <Container fluid className="seccion-catalogo"> 
        <Row className="contenedor-catalgo">   
        <Col xs={12} md={4} className="col1-catalogo">
            <div className="carta1-catalogo">
            <div className="contenedor-imagen">
                <img className="token1-catalogo" src={token1} alt="Token1" ></img>  
            </div>
            <h4> 1 Token </h4>
            <h5> 10 euros </h5>
            <p> Un token te permite comprar una cita de tutoría. </p>
            <Link to="r"> 
              <Button 
              variant="primary" 
              className="catalogo-btn"
              onClick={() => añadirAlCarrito({ id: 1, nombre: '1 Token', precio: 10, imagen: token1 })}
              >
                Comprar
              </Button>
            </Link>
            </div>
          </Col>

          <Col xs={12} md={4} className="col2-catalogo">         
            <div className="carta2-catalogo">
            <div className="contenedor-imagen">
                <img className="token2-catalogo" src={token2} alt="Token2" ></img>  
            </div>
            <h4> 3 Token </h4>
            <h5> 26 euros </h5>
            <p> Un token te permite comprar una cita de tutoría, podrás comprar tres tutorías con tus token. </p>
            <Link to=""> 
              <Button 
              variant="primary" 
              className="catalogo-btn"
              onClick={() => añadirAlCarrito({ id: 3, nombre: '3 Token', precio: 26, imagen: token2 })}
              >
                Comprar
              </Button>
            </Link>
            </div>
          </Col>

          <Col xs={12} md={4} className="col3-catalogo">
            <div className="carta3-catalogo">
            <div className="contenedor-imagen">   
                <img className="token3-catalogo" src={token3} alt="Token3" ></img>
            </div>  
            <h4> 6 Token </h4>
            <h5> 50 euros </h5>
            <p> Un token te permite comprar una cita de tutoría, podrás comprar seis tutorías con tus token. </p>
            <Link to=""> 
              <Button 
              variant="primary" 
              className="catalogo-btn"
              onClick={() => añadirAlCarrito({ id: 3, nombre: '6 Tokens', precio: 50, imagen: token3 })}
              >
                Comprar
              </Button>
            </Link>
            </div>
          </Col>
        </Row>
        <Link to="/tienda">
        <Button 
          variant="primary" 
          className="ir-carrito"
          >
          Ir al carrito
        </Button>
        </Link>
    </Container>
  )
}

export default Catalogo
