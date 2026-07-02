require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const usuarios = [
  { usuario: 'admin',      password: 'Admin@2024',    rol: 'administrador' },
  { usuario: 'carlos',     password: 'Carlos@456',    rol: 'editor' },
  { usuario: 'mariana',    password: 'Mariana@789',   rol: 'editor' },
  { usuario: 'vendedor1',  password: 'Venta@111',     rol: 'lector' },
  { usuario: 'vendedor2',  password: 'Venta@222',     rol: 'lector' },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    await User.deleteMany({});
    console.log('Colección de usuarios limpiada');

    // Usamos save() en cada uno para que el hook pre('save') encripte la contraseña
    for (const datos of usuarios) {
      const user = new User(datos);
      await user.save();
      console.log(`  ✓ ${user.usuario} (${user.rol}) — password encriptada`);
    }

    console.log('\nSeed completado correctamente');
  } catch (error) {
    console.error('Error en seed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
})();
