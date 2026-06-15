import { useState, useEffect } from 'react';
import { Currency } from '../../Data/currencyArray';

const getCurrencyRates = async (baseCurrency) => {
    if (!baseCurrency) return [];
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    const data = await response.json();
    const filtered = Currency.map(curr => ({
        currency: curr.value,
        rate: data.rates[curr.value]  //через скобки, а не через точку, потому что имя свойства = переменная 
    }));
    return filtered;
}


export const useCurrencyRates = (baseCurrency) => {
    const [ratesData, setRatesData] = useState([]); // массив объектов {currency, rate}
    const [ratesLoading , setRatesLoading ] = useState(false);

    useEffect(() => {
        if (!baseCurrency) return; // не делать запрос, если нет валюты
        const fetchData = async () => {
            setRatesLoading(true);
            try {
                const data = await getCurrencyRates(baseCurrency);
                setRatesData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setRatesLoading(false);
            }
        };
        fetchData();
    }, [baseCurrency]);
    return { ratesData, ratesLoading };
}

