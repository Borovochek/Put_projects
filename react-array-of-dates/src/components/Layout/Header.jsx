import { Button } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import '../../css/Header.css';


export const Header = () => {
    const { handleLogout } = useAuth();
  return (
    <header className="header">
      <h1 className="header-title">Put Projects</h1>
      <Button className="header-button" onClick={handleLogout} type="primary" danger>
        Выйти
      </Button>
    </header>
  );
};