
//Componentes react
import React, { useState, useContext, useEffect } from 'react';

// Componentes calendar
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './calendar.css'

//base de datos y demás
import { LoginContext } from './LoginContext';
import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, Timestamp, getDoc } from 'firebase/firestore';

const Calendar = () => {
    const { currentUser, tokens, setTokens } = useContext(LoginContext);
    const [ events, setEvents ] = useState([]);
    const [userEvents, setUserEvents] = useState ([]);
    const [adminEvents, setAdminEvents] = useState ([]);
    const [loading, setLoading] = useState(true);
    

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



    const handleEventClick = async (info) => {
        const event = info.event;
        const selectedDate = event.start;
        const selectedTime = event.start.toLocaleTimeString();

        if (!event.extendedProps.available) {
            alert("Este horario ya ha sido reservado.");
            return;  
        }

        if (tokens <= 0) {
            alert("No tienes tokens suficientes para reservar la cita.");
            return;
        }

        const confirmarReserva = window.confirm(`¿Estás seguro que quieres reservar la cita el ${selectedDate.toLocaleString()}?`);
        if (confirmarReserva) {
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
                        title: `Tutoría a las ${timeString}}`
                    });

                    const newUserEvent = {
                        title: `Tutoría a las ${timeString}`,
                        date: selectedDate,
                        status: "reservada",
                        
                    };
                    setUserEvents(prevUserEvents => [...prevUserEvents, newUserEvent]);

                    setEvents(prevEvents => prevEvents.filter(event => event.id !== citaDoc.id));

                    alert("Cita reservada con éxito");
                    
                } else {
                    alert("La cita ya no está disponible.");
                }
            } catch (error) {
                console.error("Error al reservar la cita:", error);
                alert("Hubo un error al reservar la cita.");
            }
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
                     const event = info.event;
                     if (!event.extendedProps.available) {
                         info.jsEvent.preventDefault();
                         alert("Este horario ya ha sido reservado.");
                     } else {
                         handleEventClick(info);
                     }
                 }}
                 eventContent={renderEventContent}
            />

        </div>
    );
}



export default Calendar;
