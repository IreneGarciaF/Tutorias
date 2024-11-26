import React, { useState, useContext, useEffect } from 'react';
import { Button, Form, Container, Card, Col } from 'react-bootstrap';
import { db } from './utilidades/firebase';
import { collection, addDoc, Timestamp, doc, getDoc, where, orderBy, query, getDocs, updateDoc } from 'firebase/firestore'; 
import { LoginContext } from './utilidades/LoginContext';
import './adminPanel.css';

//imagen y alert
import agenda from '../assets/agenda.png'
import Swal from 'sweetalert2'

const AdminPanel = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [adminName, setAdminName] = useState("Admin");
  const [proxTutoria, setProxTutoria] = useState("");

  const { currentUser } = useContext(LoginContext);

  const handleDisponibilidad = async () => {
    if (!selectedDate || !selectedTime) {
      setMensaje("Por favor selecciona una fecha y una hora.");
      return;
    }

    const userRef = doc(db, "usuarios", currentUser.uid); 
    const userDoc = await getDoc(userRef); 

    if (userDoc.exists() && userDoc.data().role === 'admin') {
      const dateString = `${selectedDate} ${selectedTime}`;

      console.log("Fecha formateada: ", dateString);

      const hoy = new Date();
      const citaDate = new Date(dateString)

      if (citaDate < hoy) {
        Swal.fire({
          position: "center",
          icon: "alert",
          title: "No se pueden crear horarios en el pasado",
          showConfirmButton: false,
          timer: 2000
        });
       return;
      }
      
      try {
          // Para no duplicar citas
        const citasRef = collection(db, 'horarios_disponibles');
        const q = query(citasRef, where("dateString", "==", dateString));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          Swal.fire({
            position: "center",
            icon: "alert",
            title: "Ya existe una cita en esa fecha y hora",
            showConfirmButton: false,
            timer: 2000
          });
        }else {

          const dateTime =new Date(dateString);
          const citaDisponible = {
            date: Timestamp.fromDate(dateTime),
            available: true,
            adminName: adminName,
            adminUid: currentUser.uid,
            dateString: dateString, 
          };
          const horarioRef = await addDoc(collection(db, 'horarios_disponibles'), citaDisponible);
          const horarioId = horarioRef.id;
          await updateDoc(horarioRef, {
            horarioId: horarioId, 
          });

          setMensaje("Horario guardado con éxito");
          
        }
      } catch (error) {
            console.error("Error al guardar el horario: ", error);
            setMensaje("Hubo un error al guardar el horario");
      }
      } else {
        setMensaje("No tienes permisos para establecer horarios.");
      }
    };

  const fetchProximaTutoria = async () => {
    try {
      const citasRef = collection (db, "citas");
      const q = query(
        citasRef,
        where("adminUid", "==", currentUser.uid),
        where ("status", "==", "reservada"),
        orderBy("date", "asc")
      );

      const querySnapshot = await getDocs(q);
      const citas = querySnapshot.docs.map(doc => doc.data()); 
      
      const now = new Date();
      const proxima = citas.find(cita => cita.date.toDate() > now)
      const usuario = citas.find(cita => cita.nombreUsuario)

      if (proxima) {
        setProxTutoria(proxima, usuario);
      }else {
        setProxTutoria(null)
      }
    } catch (error) {
      console.error("No se han podido cargar las tutorías: ", error)
    }
  };

  useEffect (()=>{
    if (currentUser.uid) {
      fetchProximaTutoria();
    }
  }, [currentUser]);
 

  return (
    <Container fluid className="seccion-admin">
      <Col xs={6} md={6} className="col1-admin">
      <div>
        <h3> Establecer horarios disponibles</h3>
        <Form>
          <Form.Group controlId="time">
            <Form.Label>Selecciona una fecha: </Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="time">
            <Form.Label>Selecciona una hora: </Form.Label>
            <Form.Control
              type="time"
              onChange={(e) => setSelectedTime(e.target.value)}
            />
          </Form.Group>

          <Button className="admin-btn" variant="primary" onClick={handleDisponibilidad}>
            Guardar disponibilidad
          </Button>
        </Form>

        {mensaje && <p>{mensaje}</p>}
      </div>
    </Col>  
    <Col xs={6} md={6} className="col2-admin">
            <div >
            <Card className="proxima-tutoria">
                <Card.Body>
                    <img className="agenda-admin" src={agenda} alt="agenda" />
                    <Card.Title>Tu próxima tutoría</Card.Title>

                        <Card.Subtitle className="subtitulo-admin">
                            {proxTutoria ? (
                              new Date(proxTutoria.date.toDate()).toLocaleString()
                              ):(
                                "No hay reservas de tutorías próximas"
                              )}
                        </Card.Subtitle>

                    <Card.Text>
                    Este es el enlace de Zoom para que puedas dar tu próxima tutoría: 
                    </Card.Text>
                    <Card.Link href="https://zoom.us/es" target="_blank" rel="noopener noreferrer" >Acceso a la sala</Card.Link>
                </Card.Body>
                </Card>    
            </div>
            
          </Col>   
  </Container>
  );
};

export default AdminPanel;
