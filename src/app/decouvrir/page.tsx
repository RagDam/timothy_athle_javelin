import { type Metadata } from 'next';
import { AnimatedSection } from '@/components/ui';
import { Button } from '@/components/ui';
import { ExternalLink, Building2, Users, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Découvrir - Timothy Montavon',
  description: 'Découvrez les fédérations, clubs et partenaires liés à Timothy Montavon.',
};

interface Partner {
  name: string;
  description: string;
  url: string;
  category: 'federation' | 'club' | 'partner';
}

const partners: Partner[] = [
  {
    name: 'Fédération Française d\'Athlétisme',
    description: 'La fédération nationale qui gère l\'athlétisme en France',
    url: 'https://www.athle.fr',
    category: 'federation',
  },
  {
    name: 'Entente Sarthe Athlétisme (ESA)',
    description: 'L\'entente départementale regroupant les clubs de la Sarthe',
    url: 'https://esa72.athle.fr',
    category: 'federation',
  },
  {
    name: 'US Arnage',
    description: 'Mon club formateur depuis mes débuts',
    url: 'https://usarnage.athle.fr',
    category: 'club',
  },
  {
    name: 'EC Poitiers',
    description: 'Club d\'entraînement dans le cadre du sport-études',
    url: 'https://ecpoitiers.athle.fr',
    category: 'club',
  },
];

const categories = {
  federation: {
    icon: Globe,
    label: 'Fédérations',
    color: 'text-blue-500',
  },
  club: {
    icon: Users,
    label: 'Clubs',
    color: 'text-green-500',
  },
  partner: {
    icon: Building2,
    label: 'Partenaires',
    color: 'text-purple-500',
  },
};

export default function DecouvrirPage() {
  const federations = partners.filter(p => p.category === 'federation');
  const clubs = partners.filter(p => p.category === 'club');

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/20 to-slate-900" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Découvrir
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Fédérations, clubs et acteurs de l&apos;athlétisme
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Fédérations */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Globe className="text-blue-500" size={28} />
              Fédérations
            </h2>
          </AnimatedSection>

          <div className="grid gap-6">
            {federations.map((partner, index) => (
              <AnimatedSection key={index} animation="fadeUp" delay={0.1 * index}>
                <PartnerCard partner={partner} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Clubs */}
      <section className="py-16 bg-slate-800/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Users className="text-green-500" size={28} />
              Mes clubs
            </h2>
          </AnimatedSection>

          <div className="grid gap-6">
            {clubs.map((partner, index) => (
              <AnimatedSection key={index} animation="fadeUp" delay={0.1 * index}>
                <PartnerCard partner={partner} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Partenariat */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 text-center">
              <Building2 className="mx-auto text-purple-500 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-white mb-4">
                Devenir partenaire
              </h2>
              <p className="text-slate-300 mb-6 max-w-xl mx-auto">
                Vous souhaitez soutenir mon parcours sportif ?
                N&apos;hésitez pas à me contacter pour discuter d&apos;un éventuel partenariat.
              </p>
              <Button href="/contact" variant="accent" size="lg">
                Me contacter
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}

interface PartnerCardProps {
  partner: Partner;
}

function PartnerCard({ partner }: PartnerCardProps) {
  const category = categories[partner.category];
  const Icon = category.icon;

  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-colors group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center ${category.color}`}>
            <Icon size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {partner.name}
            </h3>
            <p className="text-slate-400 mt-1">{partner.description}</p>
          </div>
        </div>
        <ExternalLink className="text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0" size={20} />
      </div>
    </a>
  );
}
