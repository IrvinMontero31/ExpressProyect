const express = require('express');
const router = express.Router();

// Almacenamiento temporal en memoria
let users = [
  { id: 1, usuario: 'admin',   password: 'admin123',  rol: 'administrador' },
  { id: 2, usuario: 'jlopez',  password: 'pass456',   rol: 'editor' },
  { id: 3, usuario: 'mgarcia', password: 'secret789', rol: 'lector' },
];

let nextId = 4;

// GET /api/users — lista todos los usuarios
router.get('/', (req, res) => {
  const publicUsers = users.map(({ password, ...rest }) => rest);
  res.json(publicUsers);
});

// GET /api/users/:id — obtiene un usuario por id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: `Usuario con id ${id} no encontrado` });
  }

  const { password, ...publicUser } = user;
  res.json(publicUser);
});

// POST /api/users — crea un nuevo usuario
router.post('/', (req, res) => {
  const { usuario, password, rol } = req.body;

  if (!usuario || !password || !rol) {
    return res.status(400).json({ error: 'Los campos usuario, password y rol son requeridos' });
  }

  const existe = users.find(u => u.usuario === usuario);
  if (existe) {
    return res.status(409).json({ error: `El usuario '${usuario}' ya existe` });
  }

  const newUser = { id: nextId++, usuario, password, rol };
  users.push(newUser);

  const { password: _pwd, ...publicUser } = newUser;
  res.status(201).json(publicUser);
});

// PUT /api/users/:id — actualiza un usuario existente
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Usuario con id ${id} no encontrado` });
  }

  const { usuario, password, rol } = req.body;

  if (!usuario && !password && !rol) {
    return res.status(400).json({ error: 'Debes enviar al menos un campo a actualizar' });
  }

  if (usuario && usuario !== users[index].usuario) {
    const duplicado = users.find(u => u.usuario === usuario);
    if (duplicado) {
      return res.status(409).json({ error: `El usuario '${usuario}' ya existe` });
    }
  }

  users[index] = {
    ...users[index],
    ...(usuario   && { usuario }),
    ...(password  && { password }),
    ...(rol       && { rol }),
  };

  const { password: _pwd, ...publicUser } = users[index];
  res.json(publicUser);
});

// DELETE /api/users/:id — elimina un usuario
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Usuario con id ${id} no encontrado` });
  }

  const [deleted] = users.splice(index, 1);
  const { password, ...publicUser } = deleted;
  res.json({ message: 'Usuario eliminado', usuario: publicUser });
});

module.exports = router;
