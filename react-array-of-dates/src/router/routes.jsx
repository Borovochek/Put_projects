import React from 'react'
import { JSPage } from '../pages/JSPage';
import { ConverterPage } from '../pages/ConverterPage';
import { OtherPage } from '../pages/OtherPage';
import { CalculatorPage } from '../pages/CalculatorPage';
import { LoginPage } from '../pages/LoginPage';


export const privatRoutes = [
  { path: "/", element: <JSPage /> },
  { path: "/converter", element: <ConverterPage /> },
  { path: "/other", element: <OtherPage /> },
  { path: "/calculator", element: <CalculatorPage /> }
];

export const publicRoutes = [
  { path: "/login", element: <LoginPage /> },
]

