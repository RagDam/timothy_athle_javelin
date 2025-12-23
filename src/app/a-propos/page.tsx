import { type Metadata } from 'next';
import Image from 'next/image';
import { AnimatedSection } from '@/components/ui';
import { Button } from '@/components/ui';
import {
  User,
  Target,
  Heart,
  Trophy,
  MapPin,
  GraduationCap,
  Users,
  Flame,
  Quote,
  Gamepad2,
  Mountain,
  Stethoscope,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'À propos - Timothy Montavon',
  description:
    'Découvrez le parcours de Timothy Montavon, double Champion de France Minime 2025 au lancer de javelot.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-slate-900" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texte */}
            <AnimatedSection>
              <p className="text-blue-400 font-medium mb-4">À propos</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Timothy
                <span className="block text-gradient">Montavon</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                15 ans, athlète spécialiste du lancer de javelot.
                Double Champion de France Minime 2025.
              </p>
              <div className="flex flex-wrap gap-4">
                <InfoBadge icon={<MapPin size={16} />} text="Arnage / Poitiers" />
                <InfoBadge icon={<GraduationCap size={16} />} text="Sport-études" />
                <InfoBadge icon={<Trophy size={16} />} text="50.70m record" />
              </div>
            </AnimatedSection>

            {/* Photo */}
            <AnimatedSection animation="fadeUp" delay={0.2}>
              <div className="relative">
                <div className="relative aspect-[3/4] max-w-md mx-auto rounded-2xl overflow-hidden">
                  <Image
                    src="/images/hero/timothy-lancer2.jpg"
                    alt="Timothy Montavon"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
                {/* Stats flottantes */}
                <div className="absolute -bottom-6 -left-6 bg-slate-800 rounded-xl p-4 shadow-xl">
                  <div className="text-3xl font-bold text-amber-500">2</div>
                  <div className="text-sm text-slate-400">Titres France</div>
                </div>
                <div className="absolute -top-6 -right-6 bg-slate-800 rounded-xl p-4 shadow-xl">
                  <div className="text-3xl font-bold text-blue-500">50.70m</div>
                  <div className="text-sm text-slate-400">Record perso</div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section Présentation */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <User className="text-blue-500" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white">Qui suis-je</h2>
            </div>
            <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
              <p>
                Je m&apos;appelle <strong className="text-white">Timothy Montavon</strong>, j&apos;ai 15 ans
                et je suis athlète spécialiste du lancer de javelot.
              </p>
              <p>
                Originaire d&apos;<strong className="text-white">Arnage</strong>, près du Mans (Sarthe),
                je suis actuellement en sport-études au{' '}
                <strong className="text-white">lycée Camille Guérin à Poitiers</strong>,
                où je peux concilier mes études et ma passion pour l&apos;athlétisme.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section Encadrement */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Users className="text-green-500" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white">Mon encadrement</h2>
            </div>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Je bénéficie d&apos;un double encadrement entre mon club formateur et mon pôle sport-études
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            <AnimatedSection animation="fadeUp" delay={0.1}>
              <CoachCard
                name="Noël Patinec"
                role="Entraîneur principal"
                club="US Arnage (ESA)"
                description="Mon coach depuis mes débuts, il m'accompagne dans ma progression technique."
              />
            </AnimatedSection>
            <AnimatedSection animation="fadeUp" delay={0.2}>
              <CoachCard
                name="Luc Duquerroy"
                role="Entraîneur fédéral"
                club="EC Poitiers (Pôle Espoir)"
                description="Il supervise tous mes entraînements de javelot au quotidien dans le cadre de mon sport-études."
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section Javelot */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Target className="text-amber-500" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white">Ma spécialité : le javelot</h2>
            </div>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              Le lancer de javelot est bien plus qu&apos;une discipline pour moi : c&apos;est un{' '}
              <strong className="text-white">art technique</strong> qui allie puissance,
              explosivité, souplesse et équilibre.
            </p>
          </AnimatedSection>

          {/* Encart Roger Collas */}
          <AnimatedSection animation="fadeUp" delay={0.2}>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <Quote className="absolute top-4 right-4 text-slate-700" size={48} />
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Flame className="text-amber-500" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Une histoire de famille</h3>
                  <p className="text-amber-400 font-medium">L&apos;héritage de Roger Collas</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                Mon père, lui-même lanceur, a été formé par mon arrière-grand-père{' '}
                <strong className="text-white">Roger Collas</strong>, figure emblématique
                de l&apos;athlétisme sarthois.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Le <strong className="text-amber-400">stade de Coulaines</strong> porte d&apos;ailleurs
                son nom, un hommage à son engagement pour ce sport. Son exemple de combativité
                m&apos;inspire à donner le meilleur de moi-même à chaque entraînement et en compétition.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section Objectifs */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <Target className="text-red-500" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white">Mes ambitions 2025-2026</h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            <AnimatedSection animation="fadeUp" delay={0.1}>
              <ObjectiveCard
                value="55m"
                label="Premier objectif"
                description="Dépasser les 55 mètres au javelot"
                color="blue"
              />
            </AnimatedSection>
            <AnimatedSection animation="fadeUp" delay={0.2}>
              <ObjectiveCard
                value="60m"
                label="Objectif saison"
                description="Viser les 60 mètres d'ici fin de saison"
                color="amber"
                highlight
              />
            </AnimatedSection>
            <AnimatedSection animation="fadeUp" delay={0.3}>
              <ObjectiveCard
                value="+"
                label="Polyvalence"
                description="Progresser en longueur, sprint et haies"
                color="green"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section Au-delà du javelot */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Heart className="text-purple-500" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white">Au-delà du javelot</h2>
            </div>
            <p className="text-lg text-slate-300 max-w-3xl">
              L&apos;athlétisme, c&apos;est plus qu&apos;un sport pour moi : c&apos;est une manière de vivre.
              Des légendes comme <strong className="text-white">Carl Lewis</strong>,{' '}
              <strong className="text-white">Jan Železný</strong>,{' '}
              <strong className="text-white">Kevin Mayer</strong> ou{' '}
              <strong className="text-white">Armand Duplantis</strong> m&apos;inspirent à rester
              compétiteur et à embrasser les défis avec passion.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            <AnimatedSection animation="fadeUp" delay={0.1}>
              <PassionCard
                icon={<Gamepad2 className="text-purple-500" size={28} />}
                title="E-sport"
                description="Une passion pour le gaming et la compétition virtuelle"
              />
            </AnimatedSection>
            <AnimatedSection animation="fadeUp" delay={0.2}>
              <PassionCard
                icon={<Mountain className="text-cyan-500" size={28} />}
                title="Ski"
                description="Sur les pistes depuis mes 3 ans"
              />
            </AnimatedSection>
            <AnimatedSection animation="fadeUp" delay={0.3}>
              <PassionCard
                icon={<Stethoscope className="text-green-500" size={28} />}
                title="Kinésithérapie"
                description="Mon projet d'études pour aider les autres sportifs"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section Valeurs */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Mes valeurs</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Ce qui me guide au quotidien dans ma pratique sportive
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection animation="fadeUp" delay={0.1}>
              <ValueCard
                icon={<Target className="text-blue-500" size={32} />}
                title="Persévérance"
                description="Chaque entraînement est une opportunité de progresser. Je ne lâche jamais."
              />
            </AnimatedSection>
            <AnimatedSection animation="fadeUp" delay={0.2}>
              <ValueCard
                icon={<Heart className="text-red-500" size={32} />}
                title="Passion"
                description="L'amour du javelot et de l'athlétisme me pousse à donner le meilleur."
              />
            </AnimatedSection>
            <AnimatedSection animation="fadeUp" delay={0.3}>
              <ValueCard
                icon={<User className="text-green-500" size={32} />}
                title="Humilité"
                description="Apprendre de mes coachs, de mes adversaires et de chaque compétition."
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-slate-800/50 to-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-white mb-4">
              Envie d&apos;en savoir plus ?
            </h2>
            <p className="text-slate-400 mb-8">
              Découvrez mon palmarès ou contactez-moi pour toute opportunité
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/palmares" variant="accent" size="lg">
                <Trophy size={20} />
                Voir mon palmarès
              </Button>
              <Button href="/contact" variant="outline" size="lg">
                Me contacter
                <ArrowRight size={18} />
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}

// Composants

interface InfoBadgeProps {
  icon: React.ReactNode;
  text: string;
}

function InfoBadge({ icon, text }: InfoBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 rounded-full text-slate-300">
      <span className="text-blue-400">{icon}</span>
      {text}
    </div>
  );
}

interface CoachCardProps {
  name: string;
  role: string;
  club: string;
  description: string;
}

function CoachCard({ name, role, club, description }: CoachCardProps) {
  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 h-full border border-slate-700/50 hover:border-slate-600 transition-colors">
      <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
        <User className="text-green-500" size={28} />
      </div>
      <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
      <p className="text-green-400 font-medium mb-1">{role}</p>
      <p className="text-slate-500 text-sm mb-4">{club}</p>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

interface ObjectiveCardProps {
  value: string;
  label: string;
  description: string;
  color: 'blue' | 'amber' | 'green';
  highlight?: boolean;
}

function ObjectiveCard({ value, label, description, color, highlight }: ObjectiveCardProps) {
  const colors = {
    blue: 'text-blue-500 bg-blue-500/20',
    amber: 'text-amber-500 bg-amber-500/20',
    green: 'text-green-500 bg-green-500/20',
  };

  return (
    <div
      className={`rounded-2xl p-6 text-center h-full flex flex-col ${
        highlight
          ? 'bg-gradient-to-br from-amber-500/20 to-amber-500/5 border-2 border-amber-500/30'
          : 'bg-slate-800/50 border border-slate-700/50'
      }`}
    >
      <div
        className={`w-16 h-16 ${colors[color]} rounded-full flex items-center justify-center mx-auto mb-4`}
      >
        <span className={`text-2xl font-bold ${colors[color].split(' ')[0]}`}>{value}</span>
      </div>
      <p className="text-sm text-slate-400 mb-2">{label}</p>
      <p className="text-white font-medium flex-grow">{description}</p>
    </div>
  );
}

interface PassionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function PassionCard({ icon, title, description }: PassionCardProps) {
  return (
    <div className="bg-slate-800/30 rounded-xl p-6 text-center hover:bg-slate-800/50 transition-colors h-full flex flex-col">
      <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm flex-grow">{description}</p>
    </div>
  );
}

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 text-center h-full flex flex-col">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 flex-grow">{description}</p>
    </div>
  );
}
