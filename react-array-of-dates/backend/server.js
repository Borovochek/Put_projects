const express = require('express');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// Разрешаем JSON в теле запроса
app.use(express.json());

// Разрешаем CORS (чтобы фронт с localhost:5173 мог обращаться к localhost:3000)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ---------- Вспомогательные функции ----------

// Функция чтения пользователей из файла
function readUsers() {
  try {
    const data = fs.readFileSync('users.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Если файла нет или он пустой — возвращаем пустую структуру
    return { users: [] };
  }
}

// Функция записи пользователей в файл
function writeUsers(data) {
  fs.writeFileSync('users.json', JSON.stringify(data, null, 2));
}

// Функция хэширования пароля (SHA-256)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// ---------- Эндпоинты ----------

// 1. Регистрация
app.post('/register', (req, res) => {
  const { login, password } = req.body;
  
  // Проверяем, что логин и пароль переданы
  if (!login || !password) {
    return res.status(400).json({ success: false, message: 'Логин и пароль обязательны' });
  }
  
  const usersData = readUsers();
  
  // Проверяем, не занят ли логин
  const userExists = usersData.users.some(user => user.login === login);
  if (userExists) {
    return res.status(400).json({ success: false, message: 'Пользователь с таким логином уже существует' });
  }
  
  // Создаём нового пользователя
  const newId = usersData.users.length > 0 
    ? Math.max(...usersData.users.map(u => u.id)) + 1 
    : 1;
  
  const newUser = {
    id: newId,
    login: login,
    password: hashPassword(password)
  };
  
  usersData.users.push(newUser);
  writeUsers(usersData);
  
  res.json({ success: true, message: 'Регистрация успешна' });
});

// 2. Логин (вход)
app.post('/login', (req, res) => {
  const { login, password } = req.body;
  
  if (!login || !password) {
    return res.status(400).json({ success: false, message: 'Логин и пароль обязательны' });
  }
  
  const usersData = readUsers();
  const user = usersData.users.find(u => u.login === login);
  
  if (!user) {
    return res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
  }
  
  const hashedInputPassword = hashPassword(password);
  if (user.password !== hashedInputPassword) {
    return res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
  }
  
  res.json({ success: true, message: 'Вход выполнен успешно', userId: user.id });
});

// 3. Проверка авторизации (опционально)
app.get('/verify', (req, res) => {
  // В простейшем случае просто возвращаем, что сервер жив
  // При желании можно добавить проверку токена
  res.json({ success: true, message: 'Сервер работает' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Бэкенд запущен на http://localhost:${PORT}`);
});