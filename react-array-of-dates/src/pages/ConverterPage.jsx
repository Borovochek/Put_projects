import React from 'react';
import { Tabs } from 'antd';
import { ExchangeRateTable } from '../components/ExchangeRate/ExchangeRateTable'
const onChange = key => {
  console.log(key);
};
const items = [
  {
    key: '1',
    label: 'Курс валют',
    children: <ExchangeRateTable />,
  },
  {
    key: '2',
    label: 'Графики',
    children: 'Графики',
  }
];
export const ConverterPage = () => {

  return (
    <>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </>
  )
}
