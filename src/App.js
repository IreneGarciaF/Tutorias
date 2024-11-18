import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import  { useState } from 'react';



// Rutas
import Header from './componentes/header';
import Inicio from './componentes/inicio';
import Register from './componentes/register';
import Login from './componentes/login';
import Catalogo from './componentes/catalogo';
import Tienda from './componentes/tienda';
import Tutorias from './componentes/Tutorias';
import Usuario from './componentes/Usuario';
import AdminPanel from './componentes/AdminPanel';  


// Inicio de sesión 
import { AuthProvider } from './componentes/utilidades/LoginContext';
import ProtectedRoute from './componentes/utilidades/ProtectedRoute';
// Carrito
import { CarritoProvider } from './componentes/utilidades/CarritoContext';

function App() {
  const [userAppointments, setUserAppointments] = useState([]);

  return (
    <AuthProvider>
      <CarritoProvider>
        <Router>
          <div className="App" style={{ display: 'flex', flexDirection: 'column' }}>
            <header>
              <Header id="header" />
            </header>
            <main>
              <Routes>
                <Route path="/" element={<Inicio />} />

                <Route path="/register" element={<Register />} />

                <Route path="/login" element={<Login />} />

                <Route path="/catalogo" element={<ProtectedRoute element={<Catalogo />} redirectTo="/login" />} />

                <Route path="/tienda" element={<ProtectedRoute element={<Tienda />} redirectTo="/login" />} />

                <Route path="/tutorias" 
                element={<ProtectedRoute element={<Tutorias setUserAppointments={setUserAppointments} />} redirectTo="/login" />} />

                <Route path="/usuario" 
                element={<ProtectedRoute element={<Usuario userAppointments={userAppointments} />} redirectTo="/login" />} />

                <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} adminRequired={true} />} />
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;
