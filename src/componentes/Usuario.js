import {Container, Button, Col, ListGroup, Dropdown, Card} from 'react-bootstrap/';
import  { useState, useEffect, useContext } from 'react';
import './usuario.css'
import { BsChevronDoubleDown,  BsChevronDoubleUp } from "react-icons/bs";
import { getFirestore, collection, getDocs, getDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { LoginContext } from './utilidades/LoginContext';


// imagen, alerts
import agenda from '../assets/agenda.png'
import Swal from 'sweetalert2'


const db = getFirestore();
const auth = getAuth();


function Usuario() {

    {/* Para el desplegable de citas */}
    const [userAppointments, setUserAppointments] = useState([]);
    const [historialCitasPasadas, setHistorialCitasPasadas] = useState([]);
    const [historialCitasFuturas, setHistorialCitasFuturas] = useState([]);
    const [showHistory, setShowHistory] = useState(false); 
    const [isOpen, setIsOpen] = useState(false); 


    const { currentUser, setTokens } = useContext(LoginContext);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        
        if (isOpen) {
            setShowHistory(false);
        }
    };

    // Función para alternar la visibilidad de las citas pasadas/futuras
    const toggleHistory = () => {
        setShowHistory(!showHistory); 
    };

   

    useEffect(() => {
      const fetchCitas = async () => {
        try {
          const currentUser = auth.currentUser;
          if (!currentUser) {
            console.error ("El usuario no está autenticado");
            return;
          }
          
          const collectionCitas = collection(db, 'citas');
          const querySnapshot = await getDocs(collectionCitas);

          const citaData = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(cita => cita.userUid === currentUser.uid)
            .map(cita => ({
             ...cita,
             date: cita.date?.toDate ? cita.date.toDate() : new Date(),
          }));

        console.log("fetchCitas superada");
        setUserAppointments(citaData)
        } catch (error) {
          console.error("Error al cargar las citas:", error);
        }
      }
      fetchCitas();
    }, []); 


    useEffect(() => {

        if (userAppointments && Array.isArray(userAppointments)) {
          // Filtrar las citas pasadas
          const citasPasadas = userAppointments.filter(appointment => {
          const today = new Date();
            return appointment.date.getTime() <= today.getTime();  
          });
          setHistorialCitasPasadas(citasPasadas);
    
          // Filtrar las citas futuras
          const citasFuturas = userAppointments.filter(appointment => {
            const today = new Date();
              return appointment.date.getTime() > today.getTime();
          });
          setHistorialCitasFuturas(citasFuturas);
        }
      }, [userAppointments]);
    

      // Para la tarjeta de próxima cita
      const proximaCita = historialCitasFuturas.sort((a, b) => a.date - b.date)[0];
      
      console.log("se hacargado la proxima cita", proximaCita)

      
        const eliminarCita = async (appointmentId) => {
          try {

            if (!appointmentId) {
              throw new Error("ID de cita no válido");
            }

            const citaRef = doc(db, 'citas', appointmentId);
            const citaDoc = await getDoc(citaRef);

              if (!citaDoc.exists()) {
                throw new Error("La cita no existe");
              }

              const horarioId = citaDoc.data().horarioId;
                if (!horarioId) {
                    throw new Error("La cita no tiene horario asociado");
                }

              const horarioRef = doc(db, 'horarios_disponibles', horarioId);
              const horarioDoc = await getDoc(horarioRef);
      
              if (horarioDoc.exists() && horarioDoc.data().available === false) {
                const eventDate = citaDoc.data().date.toDate();
                const dateString = eventDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' });
                
                  const confirmarEliminar = await Swal.fire({
                      title: "Eliminar citas",
                      text: `¿Estás seguro que quieres eliminar la cita el ${dateString}?`,
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#0473ba",
                      cancelButtonColor: "#ff9100",
                      confirmButtonText: "Confirmar",
                    })
              
                  
                if (confirmarEliminar.isConfirmed) {
                try {
                
                await updateDoc(horarioRef, {
                      available: true,
                      userUid: null, 
                  });
      
                  await deleteDoc(citaRef); 
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "La cita se ha eliminado con éxito. Se ha vuelto a poner el horario como disponible.",
                    showConfirmButton: false,
                    timer: 2500
                  });

                  const userRef = doc(db, 'usuarios', currentUser.uid);
                  const userDoc = await getDoc(userRef);
                  const newTokens = userDoc.data().tokens + 1;

                    await updateDoc(userRef, { tokens: newTokens });
                    setTokens(newTokens);
      
                  setUserAppointments(prevAppointments => prevAppointments.filter(appointment => appointment.id !== appointmentId));
                } catch (error) {
                  console.error("Error al eliminar la cita: ", error);
                  Swal.fire({
                      icon: "error",
                      title: "Error",
                      text: "Hubo un problema al eliminar la cita.",
                  });
              }
          }
        }
        } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un problema al obtener los datos de la cita.",
          });
          }
        };  
    
   


  return (
    <Container fluid className="seccion-usuario">
        <Col xs={6} md={6} className="col1-usuario">
          <div className="recuadro-usuario">
          <Dropdown show={isOpen} onToggle={toggleDropdown}>
                <Dropdown.Toggle variant="success" id="dropdown-basic" onClick={toggleDropdown}>
                    Historial de consultas
                    {isOpen ? (
                    <BsChevronDoubleUp className="flechas-desplegable" />
                    ) : (
                    <BsChevronDoubleDown className="flechas-desplegable" />
                    )}
                </Dropdown.Toggle>

            <Dropdown.Menu>
              {/* Botón para mostrar u ocultar el historial */}
              {isOpen && (
                <Button className="dropdown-mostrar" onClick={toggleHistory} >
                    {showHistory ? "Ocultar historial"  : "Mostrar historial"}
                    {showHistory ? (
                    <BsChevronDoubleUp className="flechas-desplegable" />
                    ) : (
                    <BsChevronDoubleDown className="flechas-desplegable" />
                    )}
                </Button>
                )}

              {/* Mostrar citas futuras */}
              {showHistory && historialCitasFuturas.length > 0 && (
                <div>
                  <h5>Citas Futuras</h5>
                  <ListGroup className="citas-futuras">
                    {historialCitasFuturas.map(appointment => (
                      <ListGroup.Item key={appointment.id}>
                        <p>
                        {`Cita para el ${new Date(appointment.date).toLocaleString()}`}
                        </p>
                        <Button 
                          className="eliminar-cita"
                          variant="primary" 
                          style={{ display: 'block', margin: '10px 0' }}
                          onClick={() => eliminarCita(appointment.id)}
                          >Eliminar</Button>           
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              )}

              {/* Mostrar citas pasadas */}
              {showHistory && historialCitasPasadas.length > 0 && (
                <div>
                  <h5>Citas Pasadas</h5>
                  <ListGroup>
                    {historialCitasPasadas.map(appointment => (
                      <ListGroup.Item key={appointment.id}>
                        <p>
                        {`Cita para el ${new Date(appointment.date).toLocaleString()}`}
                        </p>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              )}

              {/* Si no hay citas */}
              {showHistory && historialCitasFuturas.length === 0 && historialCitasPasadas.length === 0 && (
                <ListGroup.Item>No tienes citas agendadas.</ListGroup.Item>
              )}
            </Dropdown.Menu>
    </Dropdown>

          </div>
        </Col>
        <Col xs={6} md={6} className="col2-usuario">
            <div >
            <Card className="proxima-cita">
                <Card.Body>
                    <img className="agenda-usuario" src={agenda} alt="agenda" />
                    <Card.Title>Tu próxima tutoría</Card.Title>

                    {proximaCita ? (
                      <Card.Subtitle className="subtitulo-cita">
                        {new Date(proximaCita.date).toLocaleString()}
                      </Card.Subtitle>
                    ) : (
                      <Card.Subtitle className="subtitulo-cita">No tienes tutorías próximas</Card.Subtitle>
                    )}

                    <Card.Text>
                    Hemos creado una sala de Zoom para tu próxima tutoría, podrás acceder a ella 5 minutos antes de que comience, a través del siguiente enlace: 
                    </Card.Text>
                    <Card.Link href="https://zoom.us/es" target="_blank" rel="noopener noreferrer" >Acceso a la sala</Card.Link>
                </Card.Body>
                </Card>    
            </div>
            
          </Col>
    </Container>
  )
}

export default Usuario
