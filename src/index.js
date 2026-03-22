const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { enviarCorreoBienvenida } = require('./services/emailService');
const loginRoutes = require('./LoginApi');
require('dotenv').config();

const app = express();

app.use(cors());

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.get('/api/test', (req, res) => {
  res.status(200).json({ msg: "Backend conectado " });
});

app.post('/api/usuarios', async (req, res) => {
  const { nombre, correo, rol } = req.body;

  if (!nombre || !correo || !rol) {
    return res.status(400).json({ error: 'El nombre, correo y rol son requeridos' });
  }

  const passwordTemporal = Math.random().toString(36).slice(-8);

  try {
    const checkQuery = 'SELECT id_usuario FROM usuario WHERE correo = $1';
    const checkResult = await pool.query(checkQuery, [correo]);
    
    if (checkResult.rows.length > 0) {
      return res.status(409).json({ error: 'El correo ya está registrado en el sistema' });
    }

    const hashedPassword = await bcrypt.hash(passwordTemporal, 10);

    const query = 'INSERT INTO usuario (nombre, correo, contrasena, rol) VALUES ($1, $2, $3, $4) RETURNING id_usuario';
    const values = [nombre, correo, hashedPassword, rol];
    
    await pool.query(query, values);

    await enviarCorreoBienvenida(correo, nombre, passwordTemporal);

    res.status(201).json({ 
      msg: "Usuario creado y correo enviado",
      correo: correo
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: "Error al crear usuario: " + error.message });
  }
});

loginRoutes(app, pool);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});

module.exports = app;