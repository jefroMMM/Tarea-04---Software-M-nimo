const nodemailer = require('nodemailer');

const enviarCorreoBienvenida = async (correo, nombre, passwordTemporal) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const options = {
    from: `Admin Reservas <${process.env.EMAIL_USER}>`,
    to: correo,
    subject: 'Acceso al Sistema de Reservas',
    html: `<h1>Hola ${nombre}</h1>
           <p>Tu cuenta ha sido creada por el admin.</p>
           <p>Contraseña temporal: <b>${passwordTemporal}</b></p>`
  };

  return transporter.sendMail(options);
};

module.exports = { enviarCorreoBienvenida };