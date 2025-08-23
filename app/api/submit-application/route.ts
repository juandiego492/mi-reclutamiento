// app/api/submit-application/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ⚡ Configuración del transporte SMTP (Brevo)
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "95683d001@smtp-brevo.com", // Login SMTP (NO cambia)
        pass: process.env.BREVO_SMTP_KEY!, // Tu contraseña SMTP
      },
    });

    // ⚡ Enviar correo
    await transporter.sendMail({
      from: '"Iron Voice Solutions" <davidferrer1773@gmail.com>', 
      // 👆 Usa aquí un remitente que ya hayas validado en Brevo
      replyTo: body.email, // para que puedas responder al solicitante
      to: "davidferrer1773@gmail.com", // tu bandeja de entrada
      subject: "Nueva aplicación recibida",
      html: `
        <h2>📩 Nueva aplicación</h2>
        <p><b>Nombre:</b> ${body.name}</p>
        <p><b>Email:</b> ${body.email}</p>
        <p><b>Teléfono:</b> ${body.phone}</p>
        <p><b>Mensaje:</b> ${body.message}</p>
      `,
    });

    return NextResponse.json({ message: "✅ Tu aplicación ha sido enviada con éxito!" });
  } catch (error: any) {
    console.error("Error al enviar correo:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
