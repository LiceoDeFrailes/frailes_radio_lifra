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
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Hola administrador 👋</h2>
          <p>Se ha enviado una nueva publicación que requiere revisión.</p>
          <ul>
            <li><b>Tipo:</b> ${tipo}</li>
            <li><b>Título:</b> ${title}</li>
            <li><b>Autor:</b> ${author}</li>
          </ul>
          <p>Revisa la publicación en el panel:</p>
          <a href="https://radiolifra.vercel.app/radioLifra/gestion/validarPublicacion"
             style="background-color:#006400;color:white;padding:10px 16px;border-radius:6px;text-decoration:none">
             Revisar publicación
          </a>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error("Error al enviar correo:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }
}
