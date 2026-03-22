const { enviarCorreoBienvenida } = require('./services/emailService');

app.post('/usuarios', async (req, res) => {
  const { nombre, correo, rol } = req.body;
  const passwordTemporal = Math.random().toString(36).slice(-8); 

  try {
    await enviarCorreoBienvenida(correo, nombre, passwordTemporal);
    
    res.status(201).send({ msg: "Usuario creado y correo enviado" });
  } catch (error) {
    res.status(500).send({ error: "Error al crear usuario" });
  }
});