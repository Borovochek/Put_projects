import React, { useState, useEffect } from 'react';
import { Select, Tooltip, Table, Spin, message } from 'antd';
import { HeartIcon } from '../assets/icons/HeartIcon'
import { setFavoriteCurrency } from './API/api';
import { Currency } from '../Data/currencyArray';
import { columns } from '../Data/exchangeRateColumns';
import { useCurrencyRates } from './Hooks/useCurrencyRates';
import { useLocalStorageCurrency } from './Hooks/useLocalStorageCurrency';
import { useAuth } from '../contexts/AuthContext';



export const ExchangeRateTable = () => {
    const { user, handleUpdateUser } = useAuth();
    const [baseCurrency, setBaseCurrency] = useLocalStorageCurrency(user.favoriteCurrency); // любимая валюта и local storare
    const [favoriteLoading, setFavoriteLoading] = useState(false);// состояние для защиты от даблклика
    const { ratesData, ratesLoading } = useCurrencyRates(baseCurrency);

    const isFavorite = user.favoriteCurrency === baseCurrency;

    const handleFavoriteClick = async () => {
        if (favoriteLoading) return;
        setFavoriteLoading(true);
        try {
            const data = await setFavoriteCurrency(isFavorite, user.id, baseCurrency);
            console.log(data.favoriteCurrency);
            handleUpdateUser(data.favoriteCurrency);
        } catch (error) {
            console.error('Favorite error:', error);
            message.error(`Ошибка: ${error.message}`);
        } finally {
            setFavoriteLoading(false);
        }
    };

    const onCurrencyChange = (value) => {
        setBaseCurrency(value);
    }

    return (
        <>
            {ratesLoading && <Spin />}
            <Select
                showSearch={{ optionFilterProp: 'label' }}
                value={baseCurrency}
                onChange={onCurrencyChange}
                options={Currency}
            />
            <Tooltip title="Любимая валюта">
                <HeartIcon style={{ color: isFavorite ? '#ff4d4f' : 'black', cursor: 'pointer' }} onClick={handleFavoriteClick} />
            </Tooltip>
            <Table
                dataSource={ratesData}
                columns={columns}
                loading={ratesLoading}
                rowKey="currency"
            />
        </>
    );
}


