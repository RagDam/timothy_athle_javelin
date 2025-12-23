import { type Metadata } from 'next';
import { AnimatedSection } from '@/components/ui';
import { Button } from '@/components/ui';
import { ExternalLink, Building2, MapPin, Star, GraduationCap, Trophy, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Découvrir - Timothy Montavon',
  description: 'Découvrez mon parcours sportif, mes clubs et les structures qui m\'accompagnent vers le haut niveau.',
};

// Parcours sportif - Timeline
const parcours = [
  {
    periode: '2019 - 2024',
    titre: 'Les débuts',
    lieu: 'Le Mans',
    items: [
      {
        name: 'US Arnage',
        role: 'Club formateur',
        description: 'Mon club de cœur où tout a commencé. C\'est ici que j\'ai découvert le javelot et développé mes bases techniques.',
        url: 'https://usarnage.athle.fr',
        highlight: true,
      },
      {
        name: 'Entente Sarthe Athlétisme (ESA)',
        role: 'Entente départementale',
        description: 'Structure regroupant les clubs de la Sarthe pour les compétitions.',
        url: 'https://esa72.athle.fr',
      },
    ],
  },
  {
    periode: 'Depuis 2024',
    titre: 'Vers le haut niveau',
    lieu: 'Poitiers',
    items: [
      {
        name: 'Pôle Espoir Poitiers',
        role: 'Structure de haut niveau',
        description: 'Intégration au Pôle Espoir pour un entraînement intensif et un suivi personnalisé vers le haut niveau.',
        url: '',
        highlight: true,
        badge: 'Actuel',
      },
      {
        name: 'EC Poitiers',
        role: 'Club d\'entraînement',
        description: 'Mon club dans le cadre du sport-études, pour les compétitions en Nouvelle-Aquitaine.',
        url: 'https://ecpoitiers.athle.fr',
        badge: 'Actuel',
      },
    ],
  },
];

// Institutions
const institutions = [
  {
    name: 'Fédération Française d\'Athlétisme',
    description: 'La fédération nationale qui régit l\'athlétisme en France',
    url: 'https://www.athle.fr',
  },
  {
    name: 'Ligue Pays de la Loire',
    description: 'Ma ligue régionale d\'origine',
    url: 'https://paysdelaloire.athle.fr',
  },
  {
    name: 'Ligue Nouvelle-Aquitaine',
    description: 'Ma nouvelle ligue régionale à Poitiers',
    url: 'https://nouvelleaquitaine.athle.fr',
  },
];

export default function DecouvrirPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/20 to-slate-900" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-sm mb-6">
              <MapPin size={16} />
              <span>Mon parcours sportif</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Découvrir
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Les clubs et structures qui m&apos;accompagnent vers le haut niveau
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Timeline Parcours */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Trophy className="text-amber-500" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white">Mon parcours</h2>
            </div>
            <p className="text-slate-400 ml-15">Du club formateur au Pôle Espoir</p>
          </AnimatedSection>

          <div className="relative">
            {/* Ligne verticale de la timeline */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-blue-500 to-indigo-500" />

            {parcours.map((etape, etapeIndex) => (
              <AnimatedSection key={etapeIndex} animation="fadeUp" delay={0.2 * etapeIndex}>
                <div className="relative pl-12 md:pl-20 pb-12 last:pb-0">
                  {/* Point sur la timeline */}
                  <div className={`absolute left-2 md:left-6 w-4 h-4 rounded-full border-2 ${
                    etapeIndex === parcours.length - 1
                      ? 'bg-indigo-500 border-indigo-400'
                      : 'bg-amber-500 border-amber-400'
                  }`} />

                  {/* En-tête de l'étape */}
                  <div className="mb-6">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        etapeIndex === parcours.length - 1
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {etape.periode}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400 text-sm">
                        <MapPin size={14} />
                        {etape.lieu}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{etape.titre}</h3>
                  </div>

                  {/* Cards des structures */}
                  <div className="space-y-4">
                    {etape.items.map((item, itemIndex) => (
                      <StructureCard key={itemIndex} item={item} />
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Institutions */}
      <section className="py-16 bg-slate-800/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Globe className="text-blue-500" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white">Fédérations & Ligues</h2>
            </div>
            <p className="text-slate-400 ml-15">Les institutions de l&apos;athlétisme français</p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {institutions.map((institution, index) => (
              <AnimatedSection key={index} animation="fadeUp" delay={0.1 * index}>
                <a
                  href={institution.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-slate-800/50 rounded-xl p-5 hover:bg-slate-800/70 transition-all hover:scale-[1.02] group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors mb-1">
                        {institution.name}
                      </h3>
                      <p className="text-sm text-slate-400">{institution.description}</p>
                    </div>
                    <ExternalLink className="text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0" size={16} />
                  </div>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Partenariat */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 text-center">
              <Building2 className="mx-auto text-purple-500 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-white mb-4">
                Devenir partenaire
              </h2>
              <p className="text-slate-300 mb-6 max-w-xl mx-auto">
                Vous souhaitez soutenir mon parcours vers le haut niveau ?
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

interface StructureItem {
  name: string;
  role: string;
  description: string;
  url: string;
  highlight?: boolean;
  badge?: string;
}

interface StructureCardProps {
  item: StructureItem;
}

function StructureCard({ item }: StructureCardProps) {
  const CardWrapper = item.url ? 'a' : 'div';
  const cardProps = item.url
    ? { href: item.url, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <CardWrapper
      {...cardProps}
      className={`block rounded-xl p-5 transition-all ${
        item.highlight
          ? 'bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30 hover:border-amber-500/50'
          : 'bg-slate-800/50 hover:bg-slate-800/70'
      } ${item.url ? 'cursor-pointer group' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {item.highlight && <Star className="text-amber-500" size={16} />}
            <h4 className={`font-bold ${item.url ? 'group-hover:text-blue-400 transition-colors' : ''} ${
              item.highlight ? 'text-white' : 'text-white'
            }`}>
              {item.name}
            </h4>
            {item.badge && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                {item.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mb-2">{item.role}</p>
          <p className="text-slate-400 text-sm">{item.description}</p>
        </div>
        {item.url && (
          <ExternalLink className="text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-1" size={18} />
        )}
      </div>
    </CardWrapper>
  );
}
