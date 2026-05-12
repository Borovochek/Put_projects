import React from 'react';
import { Tabs } from 'antd';
import { ExchangeRateTable } from '../components/ExchangeRate/ExchangeRateTable'



export const ConverterPage = ({ user, onUpdateUser }) => {
  const items = [
    {
      key: '1',
      label: 'Курс валют',
      children: <ExchangeRateTable user={user} и onUpdateUser={onUpdateUser} />,
    },
    {
      key: '2',
      label: 'Графики',
      children: 'Графики',
    }
  ];
//   const onChange = key => {
//   console.log(key);
// };
  return (
    <>
      <Tabs defaultActiveKey="1" items={items}  />
    </>
  )
}
