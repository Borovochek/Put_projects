import { NavLink } from 'react-router-dom';
import '../../css/Sidebar.css';

export const Sidebar = () => {
  return (
    <nav className="sidebar">
      <ul className="sidebar-menu">
        <li className='sidebar-menu__item'>
          <NavLink
            to="/"
            className={({ isActive }) => `sidebar-menu__link ${isActive ? 'active' : ''}`}
          >
            Главная
          </NavLink>
        </li>
        <li className='sidebar-menu__item'>
          <NavLink
            to="/converter"
            className={({ isActive }) => `sidebar-menu__link ${isActive ? 'active' : ''}`}
          >
            Конвертер
          </NavLink>
        </li>
        <li className='sidebar-menu__item'>
          <NavLink
            to="/other"
            className={({ isActive }) => `sidebar-menu__link ${isActive ? 'active' : ''}`}
          >
            Другое
          </NavLink>
        </li>
        <li className='sidebar-menu__item'>
          <NavLink
            to="/calculator"
            className={({ isActive }) => `sidebar-menu__link ${isActive ? 'active' : ''}`}
          >
            Калькулятор
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

