import React from 'react';
import { Select, Tooltip, Table, Spin } from 'antd';
import Icon, { EyeOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';


export const ExchangeRateTable = ({ user, onUpdateUser }) => {
    const getInitialBaseCurrency = () => {
        const saved = localStorage.getItem('selectedCurrency');
        if (saved) {
            return saved;
        }
        return user.favoriteCurrency !== null ? user.favoriteCurrency : 'USD';
    };

    const [baseCurrency, setBaseCurrency] = useState(getInitialBaseCurrency);
    // const [baseCurrency, setBaseCurrency] = useState(user.favoriteCurrency !== null ? user.favoriteCurrency : 'USD'); При обновлении страницы базовая валюта слетаетдо usd/favorite
    const [ratesData, setRatesData] = useState([]); // массив объектов {currency, rate}
    const [loading, setLoading] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem('selectedCurrency', baseCurrency);
    }, [baseCurrency]);
    // const isFavorite = (user.favoriteCurrency === baseCurrency);
    const isFavorite = user && user.favoriteCurrency === baseCurrency;
    const handleFavoriteClick = async () => {
        if (favoriteLoading) return;
        setFavoriteLoading(true);
        try {
            if (isFavorite) {
                await fetch('http://localhost:3000/api/user/favorite', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                    }),
                });
                onUpdateUser(null);
            } else {
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
            message.error(`Ошибка ${error}`);
        } finally {
            setFavoriteLoading(false);
        }
    };

    const onCurrencyChange = (value) => {
        setBaseCurrency(value);
    }

    const HeartSvg = () => (
        <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
            <title>heart icon</title>
            <path d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
        </svg>
    );
    const HeartIcon = props => <Icon component={HeartSvg} {...props} />;


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

    // const onChange = value => {
    //     setBaseCurrency(value);
    // };
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



