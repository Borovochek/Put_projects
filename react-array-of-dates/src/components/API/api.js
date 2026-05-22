import { useState } from 'react';

// services/api.js
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