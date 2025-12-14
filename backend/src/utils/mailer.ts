import nodemailer from 'nodemailer';

// CONFIGURACIÓN (Pon esto en tus variables de entorno .env)
// EMAIL_HOST=smtp.gmail.com
// EMAIL_PORT=587
// EMAIL_USER=tuemail@gmail.com
// EMAIL_PASS=tupasswordgenerado

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.ethereal.email",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER || "test@test.com",
    pass: process.env.EMAIL_PASS || "pass",
  },
});

export const sendResetEmail = async (email: string, token: string) => {
  // En producción, cambia esta URL por la de tu Frontend (React)
  const resetLink = `http://localhost:5173/reset-password?token=${token}`;

  await transporter.sendMail({
    from: '"Soporte Tech" <no-reply@tudominio.com>',
    to: email,
    subject: "Recuperar Contraseña",
    html: `
      <h1>Recuperación de contraseña</h1>
      <p>Has solicitado restablecer tu contraseña. Haz clic en el enlace de abajo:</p>
      <a href="${resetLink}" style="background-color: #00bcd4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
      <p>Este enlace expira en 1 hora.</p>
    `,
  });
};