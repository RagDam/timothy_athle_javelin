import { NextResponse } from 'next/server';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const data: ContactFormData = await request.json();

    // Validation
    if (!data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // TODO: Pour le MVP, le message est juste validé
    // Plus tard, on intégrera Resend pour envoyer les emails

    // TODO: Intégrer Resend pour envoyer les emails
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'contact@timothy-montavon.fr',
    //   to: 'ton-email@gmail.com',
    //   subject: `[Contact Site] ${data.subject} - ${data.name}`,
    //   html: `<p><strong>De:</strong> ${data.name} (${data.email})</p>
    //          <p><strong>Sujet:</strong> ${data.subject}</p>
    //          <p><strong>Message:</strong></p>
    //          <p>${data.message}</p>`,
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur API contact:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
