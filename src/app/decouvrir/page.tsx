import { type Metadata } from 'next';
import Image from 'next/image';
import { AnimatedSection } from '@/components/ui';
import { Button } from '@/components/ui';
import { ExternalLink, Building2, Globe, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Découvrir - Timothy Montavon',
  description: 'Découvrez les clubs, comités et fédérations qui m\'accompagnent dans mon parcours sportif.',
};

// Clubs et structures locales
const clubs = [
  {
    name: 'US Arnage',
    description: 'L\'US Arnage Athlétisme est un club dynamique en Sarthe, regroupant des passionnés de piste, de cross, de trail et de course sur route. Depuis l\'âge de 6 ans, je m\'y entraîne trois fois par semaine, entouré d\'une équipe motivante et d\'entraîneurs expérimentés.',
    url: 'https://usarnage.athle.fr',
    logo: '/images/partners/logo-us-arnage.png',
  },
  {
    name: 'Sarthe ESA',
    description: 'L\'Entente Sarthe Athlétisme (ESA) est une association créée en 2016, regroupant neuf clubs historiques de la Sarthe, dont l\'US Arnage. Elle est reconnue comme le plus grand club de France en nombre de licenciés.',
    url: 'https://esa72.athle.fr',
    logo: '/images/partners/logo-esa.png',
  },
  {
    name: 'Comité Athlé 72',
    description: 'Le Comité Départemental d\'Athlétisme de la Sarthe (CD72) supervise et promeut les activités d\'athlétisme dans le département, offrant des informations sur les compétitions, les formations, et les clubs affiliés.',
    url: 'https://cd72.athle.fr',
    logo: '/images/partners/logo-cd72.png',
  },
  {
    name: 'Pôle Espoir Athlétisme',
    description: 'Le Pôle Espoir Athlétisme de Poitiers, au Lycée Camille Guérin, permet aux jeunes athlètes de haut niveau de combiner scolarité aménagée et entraînement intensif. Intégré depuis 2024, j\'y bénéficie d\'un suivi personnalisé vers le haut niveau.',
    url: 'https://lyc-camilleguerin.fr/section-athletisme/',
    logo: '/images/partners/logo-ligue-na.png',
  },
];

// Ligues et fédération
const institutions = [
  {
    name: 'Ligue Pays de la Loire',
    description: 'La Ligue d\'Athlétisme des Pays de la Loire est le cœur battant de l\'athlétisme dans la région, reliant passionnés et compétiteurs à travers cinq départements. Plus qu\'une simple organisation, elle inspire et soutient les athlètes avec des événements, des formations, et un véritable réseau de clubs dynamiques.',
    url: 'https://paysdelaloire.athle.fr',
    logo: '/images/partners/logo-ligue-pdl.png',
  },
  {
    name: 'Ligue Nouvelle-Aquitaine',
    description: 'La Ligue Nouvelle-Aquitaine d\'Athlétisme encadre la pratique de l\'athlétisme dans la région. C\'est ma nouvelle ligue régionale depuis mon intégration au Pôle Espoir de Poitiers.',
    url: 'https://nouvelleaquitaine.athle.fr',
    logo: '/images/partners/logo-ligue-na.png',
  },
  {
    name: 'FFA Athlétisme',
    description: 'La Fédération Française d\'Athlétisme (FFA), fondée en 1920, encadre et développe la pratique de l\'athlétisme en France. Son site web propose actualités, résultats, calendriers, et ressources pour athlètes, clubs, entraîneurs et officiels.',
    url: 'https://www.athle.fr',
    logo: '/images/partners/logo-ffa.png',
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

      {/* Clubs et structures */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <Users className="text-amber-500" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-white">Clubs & Structures</h2>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clubs.map((structure, index) => (
              <AnimatedSection key={index} animation="fadeUp" delay={0.1 * index}>
                <StructureCard structure={structure} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Ligues et Fédération */}
      <section className="py-16 bg-slate-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Globe className="text-blue-500" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-white">Ligues & Fédération</h2>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutions.map((structure, index) => (
              <AnimatedSection key={index} animation="fadeUp" delay={0.1 * index}>
                <StructureCard structure={structure} />
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

interface Structure {
  name: string;
  description: string;
  url: string;
  logo: string;
}

function StructureCard({ structure }: { structure: Structure }) {
  return (
    <a
      href={structure.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col h-full bg-slate-800/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all hover:scale-[1.02] group"
    >
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
      <h3 className="text-lg font-bold text-white text-center mb-3 group-hover:text-blue-400 transition-colors">
        {structure.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-400 text-center flex-grow leading-relaxed">
        {structure.description}
      </p>

      {/* Lien */}
      <div className="flex justify-center items-center gap-2 mt-4 text-blue-400 text-sm">
        <span>Site Web</span>
        <ExternalLink size={14} />
      </div>
    </a>
  );
}
