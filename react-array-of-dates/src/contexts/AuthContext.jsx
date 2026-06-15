import { createContext, useState, useEffect, useContext } from 'react'

const AuthContext = createContext(null);



export const AuthProvider = ({ children }) => {
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
        const user = { id: userData.userId, favoriteCurrency: userData.favoriteCurrency };
        setUser(user);
        localStorage.setItem('isAuth', 'true');
        localStorage.setItem('user', JSON.stringify(user));

    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.clear();
    };

    const handleUpdateUser = (newFavoriteCurrency) => {//newFavoriteCurrency поднимается из дочернего компонента
        // console.log(newFavoriteCurrency)
        setUser(user => {
            const updatedUser = { ...user, favoriteCurrency: newFavoriteCurrency };//из useState берём user, сохраняем новый объект в updatedUser, устанавливаем нов 
            // значение user и localStorage 
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    };

    const value={ user, isAuthenticated, handleLogin, handleLogout, handleUpdateUser }; 

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth должен использоваться внутри AuthProvider');
    }
    return context;
};