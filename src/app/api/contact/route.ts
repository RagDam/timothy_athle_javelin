import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Rate limiting simple en mémoire (reset au redémarrage)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 heure
const MAX_REQUESTS = 5; // Max 5 emails par heure par IP

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string; // Champ invisible pour les bots
}

function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0]?.trim() || realIP || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= MAX_REQUESTS) {
    return true;
  }

  record.count++;
  return false;
}

export async function POST(request: Request) {
  try {
    const clientIP = getClientIP(request);

    // Rate limiting
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { error: 'Trop de messages envoyés. Réessayez plus tard.' },
        { status: 429 }
      );
    }

    const data: ContactFormData = await request.json();

    // Protection honeypot - si rempli, c'est un bot
    if (data.honeypot) {
      // On retourne succès pour ne pas alerter le bot
      return NextResponse.json({ success: true });
    }

    // Validation
    if (!data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    // Validation longueur pour éviter les abus
    if (data.name.length > 100 || data.message.length > 5000) {
      return NextResponse.json(
        { error: 'Message trop long' },
        { status: 400 }
      );
    }

    // Email destinataire (un seul avec onboarding@resend.dev)
    const contactEmail = (process.env.CONTACT_EMAIL || 'contact@timothy-montavon.fr').split(',')[0].trim();

    // Initialiser Resend au runtime (pas au build)
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Envoi de l'email avec Resend
    const { error } = await resend.emails.send({
      from: 'Site Timothy <onboarding@resend.dev>',
      to: contactEmail,
      replyTo: data.email,
      subject: `[Contact Site] ${data.subject} - ${data.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Nouveau message de contact</h2>
          <p><strong>De :</strong> ${data.name}</p>
          <p><strong>Email :</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Sujet :</strong> ${data.subject}</p>
          <hr style="border: 1px solid #e2e8f0; margin: 20px 0;" />
          <p><strong>Message :</strong></p>
          <p style="white-space: pre-wrap; background: #f8fafc; padding: 15px; border-radius: 8px;">${data.message}</p>
          <hr style="border: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #64748b; font-size: 12px;">IP: ${clientIP}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur API contact:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json(
      { error: `Erreur serveur: ${errorMessage}` },
      { status: 500 }
    );
  }
}
