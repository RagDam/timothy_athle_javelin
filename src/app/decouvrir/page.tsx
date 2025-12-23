import { type Metadata } from 'next';
import Image from 'next/image';
import { AnimatedSection } from '@/components/ui';
import { Button } from '@/components/ui';
import { ExternalLink, Building2, Globe, Users, Facebook, Instagram } from 'lucide-react';
import { getPartners, type PartnerItem, type PartnerSection } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Découvrir - Timothy Montavon',
  description: 'Découvrez les clubs, comités et fédérations qui m\'accompagnent dans mon parcours sportif.',
};

// Map des icônes par type
const iconMap = {
  users: Users,
  globe: Globe,
} as const;

// Map des couleurs par type
const colorMap = {
  amber: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-500',
  },
  blue: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-500',
  },
} as const;

export default function DecouvrirPage() {
  const partnersData = getPartners();

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/decouvrir.jpg"
            alt="Timothy Montavon avec ses structures sportives"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-sm mb-6">
              <Globe size={16} />
              <span>Clubs & Fédérations</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              À Découvrir
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Les structures qui m&apos;accompagnent dans mon parcours sportif
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Sections dynamiques */}
      {partnersData.sections.map((section, sectionIndex) => (
        <SectionBlock
          key={section.id}
          section={section}
          isAlternate={sectionIndex % 2 === 1}
        />
      ))}

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

interface SectionBlockProps {
  section: PartnerSection;
  isAlternate: boolean;
}

function SectionBlock({ section, isAlternate }: SectionBlockProps) {
  const IconComponent = iconMap[section.icon];
  const colors = colorMap[section.iconColor];

  return (
    <section className={`py-16 ${isAlternate ? 'bg-slate-800/30' : ''}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
              <IconComponent className={colors.text} size={20} />
            </div>
            <h2 className="text-2xl font-bold text-white">{section.title}</h2>
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.items.map((item, index) => (
            <AnimatedSection key={item.id} animation="fadeUp" delay={0.1 * index}>
              <StructureCard structure={item} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function StructureCard({ structure }: { structure: PartnerItem }) {
  const hasLinks = structure.url || structure.facebook || structure.instagram;

  return (
    <div className="flex flex-col h-full bg-slate-800/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all group">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center p-3">
          <Image
            src={structure.logo}
            alt={`Logo ${structure.name}`}
            width={80}
            height={80}
            className="object-contain w-full h-full"
          />
        </div>
      </div>

      {/* Nom */}
      <h3 className="text-lg font-bold text-white text-center mb-3">
        {structure.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-400 text-center flex-grow leading-relaxed">
        {structure.description}
      </p>

      {/* Liens sociaux */}
      {hasLinks && (
        <div className="flex justify-center items-center gap-4 mt-4 pt-4 border-t border-slate-700/50">
          {structure.url && (
            <a
              href={structure.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors text-sm"
              title="Site web"
            >
              <ExternalLink size={16} />
              <span>Site</span>
            </a>
          )}
          {structure.facebook && (
            <a
              href={structure.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-500 hover:text-blue-400 transition-colors text-sm"
              title="Facebook"
            >
              <Facebook size={16} />
            </a>
          )}
          {structure.instagram && (
            <a
              href={structure.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-pink-500 hover:text-pink-400 transition-colors text-sm"
              title="Instagram"
            >
              <Instagram size={16} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
