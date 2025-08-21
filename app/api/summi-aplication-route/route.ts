// app/api/submit-application/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const OAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'https://developers.google.com/oauthplayground' // Este es el URI de redirección para obtener el token
);

OAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const name = data.get('name') as string;
    const email = data.get('email') as string;
    const phone = data.get('phone') as string;
    const position = data.get('position') as string;
    const cvFile = data.get('cv') as File | null;

    // Validación de datos: si falta algo, no se procede.
    if (!name || !email || !phone || !position) {
      return NextResponse.json({ success: false, message: 'Faltan datos en el formulario.' }, { status: 400 });
    }
    if (!cvFile) {
      return NextResponse.json({ success: false, message: 'Falta el archivo CV.' }, { status: 400 });
    }

    // Obtener el token de acceso. Si esto falla, el correo no se enviará.
    const accessTokenResponse = await OAuth2Client.getAccessToken();
    const accessToken = accessTokenResponse.token;

    // Configuración de Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const fileBuffer = Buffer.from(await cvFile.arrayBuffer());

    const mailOptions = {
      from: `Next.js App <${process.env.GMAIL_USER}>`,
      to: 'davidferrer1773@gmail.com', // El correo que recibirá el CV
      subject: `Nueva Aplicación: ${name} para ${position}`,
      html: `
        <h2>Nueva Aplicación de Empleo</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Correo Electrónico:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Puesto Solicitado:</strong> ${position}</p>
      `,
      attachments: [{
        filename: cvFile.name,
        content: fileBuffer,
        contentType: cvFile.type,
      }],
    };

    // Intenta enviar el correo. Si hay un error, el 'catch' lo manejará.
    const result = await transporter.sendMail(mailOptions);
    console.log("Correo enviado con éxito:", result);

    // Si el envío fue exitoso, envía una respuesta 200 al frontend.
    return NextResponse.json({ success: true, message: 'Aplicación recibida y enviada por correo con éxito.' }, { status: 200 });

  } catch (error) {
    console.error('Error en el backend al enviar el correo:', error);
    // Si hay un error, envía una respuesta 500 al frontend.
    return NextResponse.json({ success: false, message: 'Error interno del servidor. No se pudo enviar el correo.' }, { status: 500 });
  }
}