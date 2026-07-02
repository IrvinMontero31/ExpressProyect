const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users — lista todos los usuarios (sin password)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// GET /api/users/:id — obtiene un usuario por id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: `Usuario con id ${req.params.id} no encontrado` });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

// POST /api/users — crea un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { usuario, password, rol } = req.body;

    if (!usuario || !password || !rol) {
      return res.status(400).json({ error: 'Los campos usuario, password y rol son requeridos' });
    }

    const newUser = await User.create({ usuario, password, rol });
    const { password: _pwd, ...publicUser } = newUser.toObject();
    res.status(201).json(publicUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: `El usuario '${req.body.usuario}' ya existe` });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// PUT /api/users/:id — actualiza un usuario existente
router.put('/:id', async (req, res) => {
  try {
    const { usuario, password, rol } = req.body;

    if (!usuario && !password && !rol) {
      return res.status(400).json({ error: 'Debes enviar al menos un campo a actualizar' });
    }

    const updates = {};
    if (usuario)  updates.usuario  = usuario;
    if (password) updates.password = password;
    if (rol)      updates.rol      = rol;

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updated) {
      return res.status(404).json({ error: `Usuario con id ${req.params.id} no encontrado` });
    }

    res.json(updated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: `El usuario '${req.body.usuario}' ya existe` });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// DELETE /api/users/:id — elimina un usuario
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id).select('-password');
    if (!deleted) {
      return res.status(404).json({ error: `Usuario con id ${req.params.id} no encontrado` });
    }
    res.json({ message: 'Usuario eliminado', usuario: deleted });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

module.exports = router;
