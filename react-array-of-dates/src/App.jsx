import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { JSPage } from './pages/JSPage';
import { ConverterPage } from './pages/ConverterPage';
import { OtherPage } from './pages/OtherPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { LoginPage } from './pages/LoginPage';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => { //сохранение состояния аут и данных пользователя при обновлении страницы
    const authStatus = localStorage.getItem('isAuth') === 'true';
    const userData = localStorage.getItem('user');
    console.log(user);
    setIsAuthenticated(authStatus);
    if (userData) setUser(JSON.parse(userData));
  }, []);


  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser({ id: userData.userId, favoriteCurrency: userData.favoriteCurrency });
    localStorage.setItem('isAuth', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuth');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedCurrency'); 
  };

  const handleUpdateUser = (newFavoriteCurrency) => {//newFavoriteCurrency поднимается из дочернего компонента
    setUser(user => {
      const updatedUser = { ...user, favoriteCurrency: newFavoriteCurrency };//из useState берём user, сохраняем новый объект в updatedUser, устанавливаем нов 
      // значение user и localStorage 
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Header onLogout={handleLogout} />
      <div className="app-main">
        <div className="app-sidebar">
          <Sidebar />
        </div>
        <div className="app-content">
          <Routes>
            <Route path="/" element={<JSPage />} />
            <Route path="/converter" element={<ConverterPage user={user} onUpdateUser={handleUpdateUser} />} />
            <Route path="/other" element={<OtherPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
