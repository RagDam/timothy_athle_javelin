import { type Metadata } from 'next';
import Image from 'next/image';
import { AnimatedSection } from '@/components/ui';
import { ContactForm } from './ContactForm';
import { Mail, Instagram, MapPin } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Contact - Timothy Montavon',
  description: 'Contactez Timothy Montavon pour échanger, poser une question ou simplement discuter.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/contact.jpg"
            alt="Timothy Montavon"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Contact
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Une question ou envie de discuter ?
              <br />
              N&apos;hésite pas à m&apos;écrire !
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Infos de contact */}
            <AnimatedSection animation="fadeUp">
              <h2 className="text-2xl font-bold text-white mb-6">
                Restons en contact
              </h2>
              <p className="text-slate-300 mb-8">
                Que ce soit pour me poser une question, me proposer quelque chose
                ou simplement échanger, je te réponds avec plaisir !
              </p>

              <div className="space-y-6">
                <ContactInfo
                  icon={<Instagram className="text-pink-500" size={24} />}
                  label="Instagram"
                  value={`@${siteConfig.social.instagram}`}
                  href={`https://instagram.com/${siteConfig.social.instagram}`}
                />
                <ContactInfo
                  icon={<Mail className="text-blue-500" size={24} />}
                  label="Email"
                  value="Via le formulaire"
                />
                <ContactInfo
                  icon={<MapPin className="text-red-500" size={24} />}
                  label="Localisation"
                  value="Poitiers / Le Mans, France"
                />
              </div>

              {/* Clubs */}
              <div className="mt-12">
                <h3 className="text-lg font-semibold text-white mb-4">Mes clubs</h3>
                <div className="grid grid-cols-2 gap-3">
                  <ClubCard
                    name="US Arnage (ESA)"
                    location="Sarthe@PDL"
                    role="Club formateur"
                  />
                  <ClubCard
                    name="Pôle Espoir Poitiers"
                    location="Vienne@NA"
                    role="Sport-études"
                  />
                </div>
              </div>
            </AnimatedSection>

            {/* Formulaire */}
            <AnimatedSection animation="fadeUp" delay={0.2}>
              <div className="bg-slate-800/50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Envoyer un message
                </h2>
                <ContactForm />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </main>
  );
}

interface ContactInfoProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}

function ContactInfo({ icon, label, value, href }: ContactInfoProps) {
  const content = (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-sm text-slate-400">{label}</div>
        <div className="text-white font-medium">{value}</div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:bg-slate-800/30 -mx-4 px-4 py-2 rounded-lg transition-colors"
      >
        {content}
      </a>
    );
  }

  return content;
}

interface ClubCardProps {
  name: string;
  location: string;
  role: string;
}

function ClubCard({ name, location, role }: ClubCardProps) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 text-center">
      <div className="text-white font-medium text-sm mb-1">{name}</div>
      <div className="text-slate-500 text-xs mb-2">{location}</div>
      <div className="text-xs text-blue-400">{role}</div>
    </div>
  );
}
