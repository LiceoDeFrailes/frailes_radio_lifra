import type { NextApiRequest, NextApiResponse } from "next";
const nodemailer = require("nodemailer");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Método no permitido" });
  }

  try {
    const { tipo, title, author, admins } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Radio Lifra" <${process.env.MAIL_USER}>`,
      to: admins,
      subject: `📢 Nueva publicación pendiente: ${tipo}`,
      html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Inter', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">📢 Nueva Publicación</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px; font-weight: 400;">
            Pendiente de revisión
          </p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <div style="background: #f1f5f9; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
            <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">
              ¡Hola administrador! 👋
            </h2>
            <p style="color: #475569; margin: 0; line-height: 1.6;">
              Se ha enviado una nueva publicación que requiere tu revisión antes de ser publicada.
            </p>
          </div>
          
          <!-- Info Cards -->
          <div style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 0; overflow: hidden;">
            <!-- Tipo -->
            <div style="padding: 20px 25px; border-bottom: 1px solid #e2e8f0;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="background: #6366f1; width: 8px; height: 8px; border-radius: 50%;"></div>
                <span style="color: #64748b; font-weight: 500; min-width: 80px;">Tipo:</span>
                <span style="color: #1e293b; font-weight: 600;">${tipo}</span>
              </div>
            </div>
            
            <!-- Título -->
            <div style="padding: 20px 25px; border-bottom: 1px solid #e2e8f0;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="background: #10b981; width: 8px; height: 8px; border-radius: 50%;"></div>
                <span style="color: #64748b; font-weight: 500; min-width: 80px;">Título:</span>
                <span style="color: #1e293b; font-weight: 600;">${title}</span>
              </div>
            </div>
            
            <!-- Autor -->
            <div style="padding: 20px 25px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="background: #f59e0b; width: 8px; height: 8px; border-radius: 50%;"></div>
                <span style="color: #64748b; font-weight: 500; min-width: 80px;">Autor:</span>
                <span style="color: #1e293b; font-weight: 600;">${author}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #1e293b; padding: 25px 30px; text-align: center;">
          <p style="color: #94a3b8; margin: 0; font-size: 14px;">
            © ${new Date().getFullYear()} Radio Lifra. Todos los derechos reservados.
          </p>
          <p style="color: #64748b; margin: 8px 0 0 0; font-size: 13px;">
            Este es un mensaje automático, por favor no responder.
          </p>
        </div>
      </div>
    </body>
    </html>
  `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error("Error al enviar correo:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }
}
