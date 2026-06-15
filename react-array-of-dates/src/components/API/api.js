import { useState } from 'react';

const API_BASE = 'http://localhost:3000';

export async function loginUser(login, password) {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Ошибка входа');
  }
  return data;
}

export async function registerUser(login, password) {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Ошибка регистрации');
  }
  return data;
}

export async function setFavoriteCurrency(isFavorite, userId, baseCurrency) {
  const method = isFavorite ? 'DELETE' : 'POST';
  const body = isFavorite
    ? { userId }
    : { userId, currency: baseCurrency };

  const response = await fetch('http://localhost:3000/api/user/favorite', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.status}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Ошибка запроса');
  }
  return data;
}


