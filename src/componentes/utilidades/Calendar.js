
//Componentes react
import React, { useState, useContext, useEffect } from 'react';

// Componentes calendar
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './calendar.css'
import Swal from 'sweetalert2'

//base de datos y demás
import { LoginContext } from './LoginContext';
import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, Timestamp, getDoc, deleteDoc } from 'firebase/firestore';

const Calendar = () => {
    const { currentUser, tokens, setTokens, role } = useContext(LoginContext);
    const [ events, setEvents ] = useState([]);
    const [userEvents, setUserEvents] = useState ([]);
    const [adminEvents, setAdminEvents] = useState ([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        console.log("currentUser:", currentUser); 
        console.log("Rol de usuario:", role); 
      }, [currentUser, role]);

    useEffect(() => {
        if (!currentUser) {
            setLoading(true); 
            return;
        }

        setLoading(false);

        const fetchEvents = async () => {
            try {
                const q = query(collection(db, 'horarios_disponibles'), where('available', "==", true));
                const querySnapshot = await getDocs(q);
                
                const fetchedEvents = querySnapshot.docs.map(doc => {
                    const eventData = doc.data();
                    const eventDate = eventData.date.toDate();
                    const timeString = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return {
                    id: doc.id,
                    title: `Disponible con ${doc.data().adminName} a las ${timeString}`, 
                    date: eventDate,
                    adminName: eventData.adminName, 
                    adminUid: eventData.adminUid, 
                    available: eventData.available,  
                    } 
                });
                console.log("FetchEvents superada")
                setEvents(fetchedEvents);
            } catch (error) {
                console.error("Error al cargar las citas disponibles");
            }
        };

        const fetchAdminEvents = async () => {
            try {
                const q = query(collection(db, 'citas'), where('adminUid', "==", currentUser.uid));
                const querySnapshot = await getDocs(q);

                const fetchedAdminEvents = querySnapshot.docs.map(doc=> {
                    const eventDate = doc.data().date.toDate();
                    const timeString = eventDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

                    return {
                        id: doc.id,
                        title: `Tutoría con ${doc.data().userNombre} a las ${timeString}`,
                        date: eventDate,
                        status: doc.data().status,
                        userNombre: doc.data().userNombre, 
                        adminName: doc.data().adminName,
                        adminUid: doc.data().adminUid,
                    };
                });

                setAdminEvents(fetchedAdminEvents);
            } catch (error) {
                console.error("Error al cargar las citas que han reservado los usuarios: ", error);
            }
        }
        fetchAdminEvents();
        fetchEvents();
    }, [currentUser]);

    


    useEffect (() => {
            const fetchUserEvents = async () => {
                try {
                    const q = query(collection(db, 'citas'), where('userUid', "==", currentUser.uid));
                    const querySnapshot = await getDocs(q);
                    
                    const userEvents = querySnapshot.docs.map(doc => {
                        console.log(doc.data())
                        const eventDate = doc.data().date.toDate();
                        const timeString = eventDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

                        return {
                        id: doc.id,
                        title: `Tutoría a las  ${timeString}`,
                        date: eventDate, 
                        status: doc.data().status,
                        adminName: doc.data().adminName, 
                        adminUid: doc.data().adminUid,  
                        };
                    });
                    console.log("FetchUSerEvents superada")
                    setUserEvents(userEvents);
                } catch (error) {
                    console.error("Error al cargar eventos: ", error);
                }
            };
        fetchUserEvents();
    }, [currentUser.uid]);


    const handleAdminClick = async (info) => {
        const event = info.event;
        const selectedDate = event.start;
        
        if (role !== 'admin') {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Solo los administradores pueden eliminar horarios.",
                showConfirmButton: false,
                timer: 2000
              });
            return;
        }

        const eliminarHorario = window.confirm(`¿Estás seguro que quieres eliminar el horario disponible el ${selectedDate.toLocaleString()}?`);
        if (eliminarHorario) {
            try {
                const citaRef = doc(db, 'horarios_disponibles', event.id);
                const citaDoc = await getDoc(citaRef);

                if (citaDoc.exists() && citaDoc.data().available) {
                     await deleteDoc(citaRef);

                setEvents(prevEvents => prevEvents.filter(e => e.id !== event.id));
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Horario eliminado con éxito",
                    showConfirmButton: false,
                    timer: 2000
                  });
        } else {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Esta cita ya no está disponible",
                showConfirmButton: false,
                timer: 2000
              });
        }
        }catch (error) {
        console.error("Error al eliminar el horario: ", error);
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Hubo un error al eliminar el horario.",
            showConfirmButton: false,
            timer: 2000
          });
        }
     }
    };
    


    const handleEventClick = async (info) => {
        const event = info.event;
        const selectedDate = event.start;
        const selectedTime = selectedDate.toLocaleTimeString();;

        
        const hoy = new Date();
        
        if (selectedDate < hoy) {
            Swal.fire({
                position: "center",
                icon: "warning",
                title: "No puedes reservar citas en horarios ya pasados. Por favor, selecciona otro.",
                showConfirmButton: false,
                timer: 2000
              });
            return;
            }


        if (currentUser.role === 'admin') {
            handleAdminClick(info);
            return;
        } else {
        

        if (!event.extendedProps.available) {
            Swal.fire({
                position: "center",
                icon: "warning",
                title: "Este horario ya ha sido reservado.",
                showConfirmButton: false,
                timer: 2000
              });
            info.jsEvent.preventDefault();
            return;  
        }

        if (tokens <= 0) {
            Swal.fire({
                position: "center",
                icon: "warning",
                title: "No tienes tokens suficientes para reservar la cita.",
                showConfirmButton: false,
                timer: 2000
              });
            return;
        }


        const confirmarReserva = async() => {
            const result = await Swal.fire({
                title: "Confirmación de reserva",
                text: `¿Estás seguro que quieres reservar la cita el ${selectedDate.toLocaleString()}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#0473ba",
                cancelButtonColor: "#ff9100",
                confirmButtonText: "Confirmar",
              })
        
        
        if (result.isConfirmed) {
            try {
                const citaRef = doc(db, 'horarios_disponibles', event.id);
                const citaDoc = await getDoc(citaRef);

                if (citaDoc.exists() && citaDoc.data().available) {
                    const adminName = citaDoc.data().adminName;
                    const adminUid = citaDoc.data().adminUid;

                    await updateDoc(citaRef, {
                        available: false,
                        userUid: currentUser.uid
                    });
                    

                    const userRef = doc(db, 'usuarios', currentUser.uid);
                    const userDoc = await getDoc(userRef);
                    const newTokens = userDoc.data().tokens - 1;

                    const userNombre = userDoc.exists() ? userDoc.data().nombre : 'Nombre no disponible';

                    await updateDoc(userRef, { tokens: newTokens });
                    setTokens(newTokens);
                    
                    const timeString = selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    await addDoc(collection(db, 'citas'), {
                        userNombre: userNombre,
                        userUid: currentUser.uid,
                        date:  Timestamp.fromDate(selectedDate),
                        time: selectedTime,
                        status: "reservada",
                        adminName: adminName, 
                        adminUid: adminUid, 
                        title: `Tutoría a las ${timeString}`,
                        horarioId: event.id 
                    });

                    const newUserEvent = {
                        title: `Tutoría a las ${timeString}`,
                        date: selectedDate,
                        status: "reservada",
                        
                    };
                    setUserEvents(prevUserEvents => [...prevUserEvents, newUserEvent]);

                    setEvents(prevEvents => prevEvents.filter(event => event.id !== citaDoc.id));

                    Swal.fire({
                        title: "¡Cita reservada con éxito!",
                        text: `Has reservado una cita para el ${selectedDate.toLocaleString()}.`,
                        icon: "success",
                        confirmButtonText: "Ok",
                        confirmButtonColor: "#0473ba",
                        
                      });
                    
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "La cita ya no está disponible.",
                        icon: "error",
                        confirmButtonText: "Ok",
                        confirmButtonColor: "#0473ba",
                    });
                }
            } catch (error) {
                console.error("Error al reservar la cita:", error);
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Hubo un error al reservar la cita.",
                    showConfirmButton: false,
                    timer: 2000
                  });
                }
        }
        };
        await confirmarReserva();
    }
    };

    const renderEventContent = (eventInfo) => {
        const { event } = eventInfo;
        const isTutoría = event.extendedProps.status === 'reservada';
        
        return (
            <div className={isTutoría ? 'tutoria-event' : 'disponible-event'}>
                <span>{event.title}</span>
            </div>
        );
    };

    const allEvents = [...events, ...userEvents, ...adminEvents];

    return (
        <div className="contenedor-calendario">
            <FullCalendar
                 plugins={[dayGridPlugin, interactionPlugin]}
                 initialView="dayGridMonth"
                 events={allEvents} 
                 eventClick={(info) => {
                    console.log("currentUser:", currentUser); 
                    console.log("Rol de usuario:", currentUser.role);
                    if (role === 'admin') {
                        console.log("Ejecutando handleAdminClick");
                        handleAdminClick(info);
                        return;
                      } else {
                        console.log("Ejecutando handleEventClick");
                        handleEventClick(info);
                      }
                      
                }}
                eventContent={renderEventContent}
            />

        </div>
    );
}



export default Calendar;
