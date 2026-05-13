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

// Функция чтения пользователей из файла json
// function readUsers() {
//   try {
//     const data = fs.readFileSync('users.json', 'utf8');
//     return JSON.parse(data);
//   } catch (error) {
//     // Если файла нет или он пустой — возвращаем пустую структуру
//     return { users: [] };
//   }
// }

// Функция чтения пользователей из файла TXT
function readUsers() {
  try {
    const data = fs.readFileSync('users.txt', 'utf8');
    // Разбиваем весь файл на массив строк
    const lines = data.trim().split('\n').filter(line => line.trim() !== '');

    // Каждая строка это один пользователь прим "1|ant|hash123|null"
    const users = lines.map(line => {
      const [id, login, password, favoriteCurrency] = line.split('|');// деструктуризацией создаю 4 переменные, сплитом разбиваю строку на их значения
      return {
        id: parseInt(id, 10),        // id как число
        login: login,
        password: password,         
        favoriteCurrency: favoriteCurrency === 'null' ? null : favoriteCurrency
      };//возвращает объект свойство: значение
    });

    // Возвращаемт js объект с массивом пользователей
    return { users };
  } catch (error) {
    // Если файла нет или он пустой, то возвращается пустой объект
    console.log('users.txt не найден, создадим при первой регистрации');
    return { users: [] };
  }
}

// Функция записи пользователей в файл
// function writeUsers(data) {
//   fs.writeFileSync('users.json', JSON.stringify(data, null, 2));
// }

function writeUsers(data) {
  // Берем массив пользователей
  const users = data.users || [];

  // Превращаем каждого пользователя в строку: "1|ant|hash123|null"
  const lines = users.map(user => {
    const favoriteCurrency = user.favoriteCurrency === null ? 'null' : user.favoriteCurrency;
    return `${user.id}|${user.login}|${user.password}|${favoriteCurrency}`;
  });

  // Объединяем строки через \n и записываем в файл
  const txtContent = lines.join('\n');
  fs.writeFileSync('users.txt', txtContent, 'utf8');

  console.log(`users.txt обновлен, записано ${users.length} пользователей`);
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
    password: hashPassword(password),
    favoriteCurrency: null
  };

  usersData.users.push(newUser);
  writeUsers(usersData);

  res.json({
    success: true,
    message: 'Регистрация успешна',
    userId: newUser.id,
    favoriteCurrency: newUser.favoriteCurrency
  });
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

  res.json({ success: true, message: 'Вход выполнен успешно', userId: user.id, favoriteCurrency: user.favoriteCurrency });
});

// 3. Проверка авторизации (опционально)
app.get('/verify', (req, res) => {
  // В простейшем случае просто возвращаем, что сервер жив
  // При желании можно добавить проверку токена
  res.json({ success: true, message: 'Сервер работает' });
});

app.post('/api/user/favorite', (req, res) => {
  const { userId, currency } = req.body;
  const usersData = readUsers();
  const user = usersData.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ success: false });
  user.favoriteCurrency = currency;
  writeUsers(usersData);
  res.json({ success: true, favoriteCurrency: currency });
});

// DELETE – удалить любимую валюту (установить null)
app.delete('/api/user/favorite', (req, res) => {
  const { userId } = req.body;
  const usersData = readUsers();
  const user = usersData.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ success: false });
  user.favoriteCurrency = null;
  writeUsers(usersData);
  res.json({ success: true, favoriteCurrency: null });
});

// Запуск сервера
app.listen(PORT, () => {
  // добавить favoriteCurrency: null всем пользователям, у кого его нет
  const usersData = readUsers();
  let needUpdate = false;

  for (let i = 0; i < usersData.users.length; i++) {
    if (usersData.users[i].favoriteCurrency === undefined) {
      usersData.users[i].favoriteCurrency = null;
      needUpdate = true;
    }
  }

  if (needUpdate) {
    writeUsers(usersData);
  }
  console.log(`Бэкенд запущен на http://localhost:${PORT}`);
});