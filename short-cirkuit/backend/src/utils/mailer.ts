import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async (email: string, token: string) => {
  const frontendUrl = process.env.FRONTEND_URL || process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
  const resetLink = `${frontendUrl}/reset-password?token=${token}`;

  try {
    // cambiar el 'from'
    // a algo como 'soporte@shortcirkuit.com'.

    const { data, error } = await resend.emails.send({
      from: 'Short Cirkuit <onboarding@resend.dev>',
      to: [email],
      subject: "Restablecer tu contraseña",
      html: `
        <div style="font-family: 'Arial', sans-serif; background-color: #050507; color: #ffffff; padding: 40px; border-radius: 10px;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #13131a; padding: 30px; border-radius: 15px; border: 1px solid #333;">
            
            <h2 style="color: #06b6d4; text-align: center; margin-bottom: 30px; font-weight: 900; text-transform: uppercase;">
              ⚡ Short Cirkuit
            </h2>
            
            <p style="color: #d1d5db; font-size: 16px; line-height: 1.5;">Hola,</p>
            <p style="color: #d1d5db; font-size: 16px; line-height: 1.5;">
              Recibimos una solicitud para restablecer tu contraseña. Si fuiste tú, haz clic en el botón de abajo:
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetLink}" style="background-color: #06b6d4; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 0 15px rgba(6,182,212,0.4);">
                Restablecer Contraseña
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 30px;">
              Si no solicitaste este cambio, ignora este mensaje. El enlace expirará en 10 minutos.
            </p>
            
          </div>
        </div>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }
    return data;

  } catch (error) {
    throw new Error("No se pudo enviar el correo");
  }
};
