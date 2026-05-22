import { Button } from 'antd';
import '../../css/Header.css';

export const Header = ({ onLogout }) => {
  return (
    <header className="header">
      <h1 className="header-title">Put Projects</h1>
      <Button className="header-button" onClick={onLogout} type="primary" danger>
        Выйти
      </Button>
    </header>
  );
};