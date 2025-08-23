import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import formidable from "formidable";
import fs from "fs";

// Desactiva el bodyParser de Next
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const form = formidable({ multiples: false });

  return new Promise((resolve, reject) => {
    form.parse(req as any, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return resolve(NextResponse.json({ error: "Error parsing form" }, { status: 500 }));
      }

      try {
        const transporter = nodemailer.createTransport({
          host: "smtp-relay.brevo.com",
          port: 587,
          secure: false,
          auth: {
            user: "95683d001@smtp-brevo.com",
            pass: process.env.BREVO_SMTP_KEY,
          },
        });

        const cvFile = files.cv as formidable.File | undefined;

        const mailOptions: any = {
          from: '"Iron Voice Solutions" <davidferrer1773@gmail.com>',
          to: "davidferrer1773@gmail.com",
          subject: "Nueva aplicación recibida",
          html: `
            <h2>Nueva aplicación</h2>
            <p><b>Nombre:</b> ${fields.name}</p>
            <p><b>Email:</b> ${fields.email}</p>
            <p><b>Teléfono:</b> ${fields.phone}</p>
            <p><b>Posición:</b> ${fields.position}</p>
          `,
        };

        if (cvFile) {
          mailOptions.attachments = [
            {
              filename: cvFile.originalFilename,
              path: cvFile.filepath,
            },
          ];
        }

        await transporter.sendMail(mailOptions);

        resolve(NextResponse.json({ message: "✅ Tu aplicación ha sido enviada con éxito!" }));
      } catch (error: any) {
        console.error("Error al enviar correo:", error);
        resolve(NextResponse.json({ error: error.message }, { status: 500 }));
      }
    });
  });
}
