   import { useState, useEffect } from 'react';

      const getInitialBaseCurrency = (favoriteCurrency) => {
        const saved = localStorage.getItem('selectedCurrency');
        if (saved) {
            return saved;
        }
        return favoriteCurrency !== null ? favoriteCurrency : 'USD';
    };

   export const useLocalStorageCurrency = (favoriteCurrency) => {


    const [baseCurrency, setBaseCurrency] = useState(getInitialBaseCurrency(favoriteCurrency));  // const [baseCurrency, setBaseCurrency] = useState(user.favoriteCurrency !== null ? user.favoriteCurrency : 'USD'); При обновлении страницы базовая валюта слетает до usd/favorite, заменил на функцию getInitialBaseCurrency
    

    useEffect(() => {
        localStorage.setItem('selectedCurrency', baseCurrency);
    }, [baseCurrency]);// состояние для обновления страницы и сохранения значения выбранной валюты
    return [baseCurrency, setBaseCurrency]
}
