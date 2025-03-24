export const prerender = false;

import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

export async function POST({ request }) {
    console.log('Richiesta ricevuta!');
    try {       

        console.log('Richiesta:', request);        
        
        const { email, subject, text } = await request.json();

        console.log('Email:', email);
        console.log('Subject:', subject);
        console.log('Text:', text);

        console.log("Sono qui!");

        console.log('SMTP config:', {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            user: process.env.SMTP_USER,
        });

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
            },
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
        console.error('Errore durante l\'invio della email:', error);
        if (error instanceof Error) {
          console.error('Dettagli:', error.message);
          console.error('Stack trace:', error.stack);
        }
        return new Response(
            JSON.stringify({ 
              error: 'Errore durante l\'invio dell\'email', 
              details: error instanceof Error ? error.message : String(error) 
            }),
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