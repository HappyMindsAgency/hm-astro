export const prerender = false;

import nodemailer from 'nodemailer';

export async function POST({ request }) {
    console.log('Richiesta ricevuta!');
    try {   
        console.log('Invio email...');
        const { email, subject, text } = await request.json();

        const smtpPort = parseInt(import.meta.env.SMTP_PORT);
        
        let transporter = nodemailer.createTransport({
            host: import.meta.env.SMTP_HOST,
            port: smtpPort,
            /* secure: smtpPort === 465, */
            tls: {
                rejectUnauthorized: false
            },
            auth: {
                user: import.meta.env.SMTP_USER,
                pass: import.meta.env.SMTP_PASS,
            }
        });
        //console.log('Trasportatore:', transporter);

        if (!transporter) {
            throw new Error('Errore durante la creazione del trasportatore!');
        }

        const mailOptions = {
            from: '"HappyMinds" <'+ import.meta.env.SMTP_USER+'>',
            to: email,
            subject: subject,
            text: text,
            bcc: ['hello@happyminds.it', 'assistenzaweb@happyminds.it'],
            replyTo: 'hello@happyminds.it',
        };

        const info = await transporter.sendMail(mailOptions);

        return new Response(
            JSON.stringify({ message: 'Email inviata con successo!', info }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            console.log('Email inviata con successo!')
        );
    } catch (error) {
        console.error("Errore durante l'invio dell'email:", error); // Log the full error object
        let errorMessage = "Errore durante l'invio dell'email";
        if (error.response) {
            errorMessage += `: ${error.response.body}`; // Include server response if available
        } else if (error.message) {
            errorMessage += `: ${error.message}`; // Include error message if available
        }
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
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