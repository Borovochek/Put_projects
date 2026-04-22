import { NavLink } from 'react-router-dom';
import '../../css/Sidebar.css';

export const Sidebar = () => {
  return (
    <nav className="sidebar">
      <ul className="sidebar-menu">
        <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Главная</NavLink></li>
        <li><NavLink to="/converter" className={({ isActive }) => isActive ? 'active' : ''}>Конвертер</NavLink></li>
        <li><NavLink to="/other" className={({ isActive }) => isActive ? 'active' : ''}>Другое</NavLink></li>
        <li><NavLink to="/calculator" className={({ isActive }) => isActive ? 'active' : ''}>Калькулятор</NavLink></li>
      </ul>
    </nav>
  );
};

