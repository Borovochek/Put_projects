import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import { JSPage } from '../pages/JSPage'
import { ConverterPage } from '../pages/ConverterPage'
import { OtherPage } from '../pages/OtherPage'
import { CalculatorPage } from '../pages/CalculatorPage';
import { privatRoutes, publicRoutes } from '../router/routes';
import { useAuth } from '../contexts/AuthContext';



export const AppRouter = () => {
    const { isAuthenticated } = useAuth();
    return (
        <div>
            <Routes>
                {isAuthenticated
                    ? privatRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))
                    : publicRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))
                }
                <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
            </Routes>
        </div>
    )
}
