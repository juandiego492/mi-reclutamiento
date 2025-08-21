// app/api/submit-application/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const OAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
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
    const cvFile = data.get('cv') as Blob | null;

    if (!name || !email || !phone || !position) {
      return NextResponse.json({ success: false, message: 'Faltan datos en el formulario.' }, { status: 400 });
    }
    if (!cvFile) {
      return NextResponse.json({ success: false, message: 'Falta el archivo CV.' }, { status: 400 });
    }

    const accessTokenResponse = await OAuth2Client.getAccessToken();
    const accessToken = accessTokenResponse?.token;
    if (!accessToken) {
      return NextResponse.json({ success: false, message: 'No se pudo obtener token de acceso.' }, { status: 500 });
    }

   const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
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
      to: 'davidferrer1773@gmail.com',
      subject: `Nueva Aplicación: ${name} para ${position}`,
      html: `
        <h2>Nueva Aplicación de Empleo</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Correo Electrónico:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Puesto Solicitado:</strong> ${position}</p>
      `,
      attachments: [{
        filename: cvFile instanceof File ? cvFile.name : 'cv.pdf',
        content: fileBuffer,
        contentType: cvFile instanceof File ? cvFile.type : 'application/pdf',
      }],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Aplicación recibida y enviada por correo con éxito.' }, { status: 200 });

  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return NextResponse.json({ success: false, message: 'Error interno del servidor. No se pudo enviar el correo.' }, { status: 500 });
  }
}
