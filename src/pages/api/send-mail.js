export const prerender = false;

import nodemailer from 'nodemailer';

export async function POST({ request }) {
    console.log('Richiesta ricevuta!');
    try {       

        console.log('Richiesta:', request);        
        
        const { email, subject, text } = await request.json();

        console.log('Email:', email);
        console.log('Subject:', subject);
        console.log('Text:', text);

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_PORT == 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            }
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: subject,
            text: text,
        };

        const info = await transporter.sendMail(mailOptions);

        return new Response(
            JSON.stringify({ message: 'Email inviata con successo!', info }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('Errore durante l\'invio dell\'email:', error);
        return new Response(
          JSON.stringify({ error: 'Errore durante l\'invio dell\'email' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
}

export async function GET() {
    return new Response(
        JSON.stringify({ message: 'Ciao dalle API di Astro!' }),
        { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
        }
    );
}