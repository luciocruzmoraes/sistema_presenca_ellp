import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUserGraduate, FaChalkboardTeacher, FaCalendarCheck, FaChartBar } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h1>Grupo ELLP</h1>
        </div>
        
        <div className="mobile-menu-toggle" onClick={toggleMenu}>
          <span className={isMenuOpen ? 'bar open' : 'bar'}></span>
          <span className={isMenuOpen ? 'bar open' : 'bar'}></span>
          <span className={isMenuOpen ? 'bar open' : 'bar'}></span>
        </div>
        
        <ul className={isMenuOpen ? 'navbar-menu open' : 'navbar-menu'}>
          <li>
            <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
              <FaHome /> <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/students" onClick={() => setIsMenuOpen(false)}>
              <FaUserGraduate /> <span>Alunos</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/workshops" onClick={() => setIsMenuOpen(false)}>
              <FaChalkboardTeacher /> <span>Oficinas</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/attendance" onClick={() => setIsMenuOpen(false)}>
              <FaCalendarCheck /> <span>Presença</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports" onClick={() => setIsMenuOpen(false)}>
              <FaChartBar /> <span>Relatórios</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;