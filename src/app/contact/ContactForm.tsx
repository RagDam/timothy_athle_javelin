'use client';

import { type FC, useState } from 'react';
import { Button } from '@/components/ui';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface FormState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export const ContactForm: FC = () => {
  const [formState, setFormState] = useState<FormState>({ status: 'idle' });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState({ status: 'loading' });

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi');
      }

      setFormState({
        status: 'success',
        message: 'Message envoyé avec succès !',
      });
      (e.target as HTMLFormElement).reset();
    } catch {
      setFormState({
        status: 'error',
        message: 'Une erreur est survenue. Veuillez réessayer.',
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            Nom complet
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="votre@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
          Sujet
        </label>
        <select
          id="subject"
          name="subject"
          required
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          <option value="">Sélectionnez un sujet</option>
          <option value="sponsoring">Sponsoring / Partenariat</option>
          <option value="media">Demande média / Interview</option>
          <option value="event">Événement / Compétition</option>
          <option value="other">Autre</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
          placeholder="Votre message..."
        />
      </div>

      {/* Status messages */}
      {formState.status === 'success' && (
        <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-3 rounded-lg">
          <CheckCircle size={20} />
          <span>{formState.message}</span>
        </div>
      )}
      {formState.status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-3 rounded-lg">
          <AlertCircle size={20} />
          <span>{formState.message}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="accent"
        size="lg"
        className="w-full"
        disabled={formState.status === 'loading'}
      >
        {formState.status === 'loading' ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send size={20} />
            Envoyer le message
          </>
        )}
      </Button>
    </form>
  );
};
