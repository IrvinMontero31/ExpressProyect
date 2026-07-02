const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    usuario:  { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    rol:      { type: String, required: true, enum: ['administrador', 'editor', 'lector'] },
  },
  { timestamps: true }
);

// Encripta la contraseña antes de guardar solo si fue modificada
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);
