import Calendar from "./utilidades/Calendar"; 
import './tutorias.css';

const Tutorias = ({ setUserAppointments }) => {
  return (
    <div className="contenedor-tutorias">
      <h1>Tutorías</h1>
      <Calendar setUserAppointments={setUserAppointments} />
    </div>
  );
};

export default Tutorias;