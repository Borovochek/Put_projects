import React from 'react';
import { Tabs } from 'antd';
import { ExchangeRateTable } from '../components/ExchangeRateTable'
// import { useAuth } from '../contexts/AuthContext';



export const ConverterPage = () => {
    // const { user, handleUpdateUser } = useAuth();
  const items = [
    {
      key: '1',
      label: 'Курс валют',
      children: <ExchangeRateTable />,
      // children: <ExchangeRateTable user={user} и onUpdateUser={handleUpdateUser} />,
    },
    {
      key: '2',
      label: 'Графики',
      children: 'Графики',
    }
  ];

  return (
    <>
      <Tabs defaultActiveKey="1" items={items}  />
    </>
  )
}
