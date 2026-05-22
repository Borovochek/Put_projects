import React from 'react';
import { Select, Tooltip, Table, Spin, message } from 'antd';
import Icon, { EyeOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { HeartIcon } from '../../assets/icons/HeartIcon'


export const ExchangeRateTable = ({ user, onUpdateUser }) => {

    const getInitialBaseCurrency = () => {
        const saved = localStorage.getItem('selectedCurrency');
        if (saved) {
            return saved;
        }
        return user.favoriteCurrency !== null ? user.favoriteCurrency : 'USD';
    };

    const [baseCurrency, setBaseCurrency] = useState(getInitialBaseCurrency());
    // const [baseCurrency, setBaseCurrency] = useState(user.favoriteCurrency !== null ? user.favoriteCurrency : 'USD'); При обновлении страницы базовая валюта 
    // слетает до usd/favorite, заменил на функцию getInitialBaseCurrency
    const [ratesData, setRatesData] = useState([]); // массив объектов {currency, rate}
    const [loading, setLoading] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);// состояние для защиты от даблклика

    useEffect(() => {
        localStorage.setItem('selectedCurrency', baseCurrency);
    }, [baseCurrency]);// состояние для обновления страницы и сохранения значения выбранной валюты

    useEffect(() => {
        setBaseCurrency(getInitialBaseCurrency());
    }, [user.favoriteCurrency]);

    const isFavorite = user.favoriteCurrency === baseCurrency;

    const handleFavoriteClick = async () => {
        if (favoriteLoading) return;
        setFavoriteLoading(true);
        try {
            if (isFavorite) {
                console.log('запрос на удаление')
                await fetch('http://localhost:3000/api/user/favorite', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                    }),
                });
                onUpdateUser(null);
            } else {
                console.log('запрос на добавление', baseCurrency);
                await fetch('http://localhost:3000/api/user/favorite', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        currency: baseCurrency,
                    }),
                });
                onUpdateUser(baseCurrency);
            }
        } catch (error) {
            console.error('Favorite error:', error);  // ← ЛОГИРУЕМ В КОНСОЛЬ
            message.error(`Ошибка: ${error.message}`);  // ← ТЕПЕРЬ message импортирован
        } finally {
            setFavoriteLoading(false);
        }
    };

    const onCurrencyChange = (value) => {
        setBaseCurrency(value);
    }

    useEffect(() => {
        if (!baseCurrency) return; // не делать запрос, если нет валюты
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getCurrencyRates(baseCurrency);
                setRatesData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [baseCurrency]);

    async function getCurrencyRates(baseCurrency) {
        if (!baseCurrency) return [];
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
        const data = await response.json();
        const allowedCurrencies = ['USD', 'EUR', 'RUB', 'JPY', 'CNY'];
        const filtered = allowedCurrencies.map(curr => ({
            currency: curr,
            rate: data.rates[curr]  //через скобки, а не через точку, потому что имя свойства = переменная 
        }));
        return filtered;
    }

    const onSearch = value => {
        console.log('search:', value);
    };

    const columns = [
        { title: 'Валюта', dataIndex: 'currency', key: 'currency' },
        { title: 'Курс', dataIndex: 'rate', key: 'rate' },
        { title: 'Действие', key: 'action', render: () => <a><EyeOutlined /></a> }
    ];

    return (
        <>
            {loading && <Spin />}
            <Select
                showSearch={{ optionFilterProp: 'label', onSearch }}
                // placeholder="USD"
                value={baseCurrency}
                onChange={onCurrencyChange}
                options={[
                    {
                        value: 'USD',
                        label: 'USD',
                    },
                    {
                        value: 'EUR',
                        label: 'EUR',
                    },
                    {
                        value: 'RUB',
                        label: 'RUB',
                    },
                    {
                        value: 'JPY',
                        label: 'JPY',
                    },
                    {
                        value: 'CNY',
                        label: 'CNY',
                    }
                ]}
            />
            <Tooltip title="Любимая валюта">
                {isFavorite ? (
                    <HeartIcon style={{ color: '#ff4d4f', cursor: 'pointer' }} onClick={handleFavoriteClick} />
                ) : (
                    <HeartIcon style={{ color: 'black', cursor: 'pointer' }} onClick={handleFavoriteClick} />
                )}

            </Tooltip>
            {!loading && <Table
                dataSource={ratesData}
                columns={columns}
                loading={loading}
                rowKey="currency"
            />}
        </>
    );
}



