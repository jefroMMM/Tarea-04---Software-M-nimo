const bcrypt = require('bcrypt');
const { enviarCorreoBienvenida } = require('./services/emailService');

const loginRoutes = (app, pool) => {
  app.post('/api/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ error: 'El correo y contraseña son requeridos' });
    }

    try {
      const query = 'SELECT id_usuario, nombre, rol, contrasena FROM usuario WHERE correo = $1';
      const result = await pool.query(query, [correo]);

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
      }

      const usuario = result.rows[0];

      const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);

      if (!passwordValida) {
        return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
      }

      res.status(200).json({
        msg: "Login exitoso",
        usuario: {
          id: usuario.id_usuario,
          nombre: usuario.nombre,
          correo: correo,
          rol: usuario.rol
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: "Error en login: " + error.message });
    }
  });

  app.post('/api/recuperar-contrasena', async (req, res) => {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({ error: 'El correo es requerido' });
    }

    try {
      const checkQuery = 'SELECT id_usuario, nombre FROM usuario WHERE correo = $1';
      const checkResult = await pool.query(checkQuery, [correo]);

      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: 'El correo no está registrado en el sistema' });
      }

      const usuario = checkResult.rows[0];
      const nuevaContrasena = Math.random().toString(36).slice(-8);

      const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

      const updateQuery = 'UPDATE usuario SET contrasena = $1 WHERE id_usuario = $2';
      await pool.query(updateQuery, [hashedPassword, usuario.id_usuario]);

      await enviarCorreoBienvenida(correo, usuario.nombre, nuevaContrasena);

      res.status(200).json({
        msg: "Se ha enviado una nueva contraseña a tu correo",
        correo: correo
      });
    } catch (error) {
      console.error('Error al recuperar contraseña:', error);
      res.status(500).json({ error: "Error al recuperar contraseña: " + error.message });
    }
  });
};

module.exports = loginRoutes;
