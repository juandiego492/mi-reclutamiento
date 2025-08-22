import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Si hay archivo adjunto, lo convertimos a base64
    let attachments = [];
    if (cvFile) {
      const buffer = Buffer.from(await cvFile.arrayBuffer());
      attachments.push({
        filename: cvFile.name || "cv.pdf",
        content: buffer.toString("base64"),
      });
    }

    await resend.emails.send({
      from: "IronVoice Careers <onboarding@resend.dev>", // remitente (usa el dominio de Resend)
      to: "davidferrer1773@gmail.com", // tu correo
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
  } catch (error) {
    console.error("Error enviando correo:", error);
    return NextResponse.json({ success: false, message: "Error al enviar correo." }, { status: 500 });
  }
}

