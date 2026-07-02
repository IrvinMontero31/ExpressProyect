require('dotenv').config();
const express = require('express');
const connectDB = require('./database/connection');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API de usuarios funcionando', version: '2.0.0' });
});

app.use('/api/users', usersRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});

module.exports = app;
