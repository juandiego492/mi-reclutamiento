// app/api/submit-application/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const phone = data.get("phone") as string;
    const position = data.get("position") as string;
    const cvFile = data.get("cv") as File | null;

    if (!name || !email || !phone || !position) {
      return NextResponse.json({ success: false, message: "Faltan datos." }, { status: 400 });
    }

    // Convertir CV a buffer
    let attachments = [];
    if (cvFile) {
      const buffer = Buffer.from(await cvFile.arrayBuffer());
      attachments.push({
        filename: cvFile.name || "cv.pdf",
        content: buffer,
      });
    }

    // Configurar Nodemailer con Yandex SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verificar conexión SMTP
    await transporter.verify();

    // Enviar correo
    await transporter.sendMail({
      from: `"IronVoice Careers" <${process.env.SMTP_USER}>`,
      to: "f3rrer.david@yandex.com",
      subject: `Nueva Aplicación: ${name} para ${position}`,
      html: `
        <h2>Nueva Aplicación de Empleo</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Puesto Solicitado:</strong> ${position}</p>
      `,
      attachments,
    });

    return NextResponse.json({ success: true, message: "Aplicación enviada con éxito." }, { status: 200 });
  } catch (error: any) {
    console.error("Error enviando correo completo:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error al enviar correo.",
    }, { status: 500 });
  }
}
