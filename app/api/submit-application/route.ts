// app/api/submit-application/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const name = data.get("name") as string || "Nombre de prueba";
    const position = data.get("position") as string || "Puesto de prueba";

    // Envío de correo simple sin adjuntos
    await resend.emails.send({
      from: "IronVoice Careers <onboarding@resend.dev>",
      to: "davidferrer1773@gmail.com",
      subject: `Prueba de envío: ${name} para ${position}`,
      html: `<p>Hola! Este es un correo de prueba desde tu app con Resend.</p>
             <p>Nombre: ${name}</p>
             <p>Puesto: ${position}</p>`,
    });

    return NextResponse.json({ success: true, message: "Correo de prueba enviado correctamente." }, { status: 200 });
  } catch (error) {
    console.error("Error enviando correo:", error);
    return NextResponse.json({ success: false, message: "Error al enviar correo." }, { status: 500 });
  }
}

