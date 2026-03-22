const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { enviarCorreoBienvenida } = require('./services/emailService');
require('dotenv').config();

const app = express();

// Middleware para CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Pool de conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.status(200).json({ msg: "Backend conectado correctamente" });
});

// Ruta POST para crear usuario
app.post('/api/usuarios', async (req, res) => {
  const { nombre, correo, rol } = req.body;

  // Validar datos
  if (!nombre || !correo || !rol) {
    return res.status(400).json({ error: 'El nombre, correo y rol son requeridos' });
  }

  // Generar contraseña temporal de 8 caracteres
  const passwordTemporal = Math.random().toString(36).slice(-8);

  try {
    // Encriptar la contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(passwordTemporal, 10);

    // Insertar usuario en la BD
    const query = 'INSERT INTO usuario (nombre, correo, contrasena, rol) VALUES ($1, $2, $3, $4) RETURNING id_usuario';
    const values = [nombre, correo, hashedPassword, rol];
    
    await pool.query(query, values);

    // Enviar correo con la contraseña temporal
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

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});

module.exports = app;