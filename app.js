// Servicio web simple para registro e inicio de sesión
// Evidencia: GA7-220501096-AA5-EV01
// Autor: Carlos (adaptar nombre si desea)
//
// Endpoints:
// POST /register  -> { "username": "...", "password": "..." }
// POST /login     -> { "username": "...", "password": "..." }
//
// Respuestas:
// - Autenticación satisfactoria -> 200 { message: "Autenticación satisfactoria" }
// - Error en la autenticación     -> 401 { error: "Error en la autenticación" }

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

app.use(bodyParser.json());

// Asegura que la carpeta data exista y que users.json exista
function ensureUsersFile() {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([],{spaces:2}));
  }
}

// Lee usuarios desde el archivo JSON
function readUsers() {
  ensureUsersFile();
  const raw = fs.readFileSync(USERS_FILE, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

// Guarda el arreglo de usuarios en el archivo JSON
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// Endpoint para registro
app.post('/register', (req, res) => {
  // Validación básica de entrada
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username y password son requeridos' });
  }

  const users = readUsers();
  const existing = users.find(u => u.username === username);
  if (existing) {
    return res.status(409).json({ error: 'El usuario ya existe' });
  }

  // Hash de la contraseña antes de guardar
  const salt = bcrypt.genSaltSync(10);
  const hashed = bcrypt.hashSync(password, salt);

  const newUser = { username, password: hashed, createdAt: new Date().toISOString() };
  users.push(newUser);
  saveUsers(users);

  // Respuesta de éxito
  res.status(201).json({ message: 'Registro exitoso' });
});

// Endpoint para inicio de sesión
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username y password son requeridos' });
  }

  const users = readUsers();
  const user = users.find(u => u.username === username);
  if (!user) {
    // No revelar si el usuario no existe — devolvemos error genérico
    return res.status(401).json({ error: 'Error en la autenticación' });
  }

  // Comparar contraseña con bcrypt
  const ok = bcrypt.compareSync(password, user.password);
  if (!ok) {
    return res.status(401).json({ error: 'Error en la autenticación' });
  }

  // Si llegó aquí, la autenticación es correcta
  return res.status(200).json({ message: 'Autenticación satisfactoria' });
});

// Endpoint raíz para comprobar que el servicio está activo
app.get('/', (req, res) => {
  res.json({ message: 'Servicio de autenticación activo' });
});

app.listen(PORT, () => {
  console.log(`Auth service escuchando en http://localhost:${PORT}`);
});
