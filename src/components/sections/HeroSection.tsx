'use client';

import { type FC } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronDown, Trophy, Medal } from 'lucide-react';
import { Button } from '@/components/ui';

interface HeroStats {
  label: string;
  value: string;
}

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  heroImage?: string;
  stats?: HeroStats[];
}

export const HeroSection: FC<HeroSectionProps> = ({
  title = 'Double Champion de France Minime 2025',
  subtitle = '15 ans, athlète spécialiste du lancer de javelot.',
  heroImage = '/images/hero/timothy-lancer.jpg',
  stats = [
    { value: '50.70', label: 'Record (m)' },
    { value: '2', label: 'Titres France' },
    { value: '60', label: 'Objectif (m)' },
    { value: '15', label: 'Âge' },
  ],
}) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Image de fond */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Timothy Montavon en plein lancer de javelot"
          fill
          priority
          className="object-cover object-right md:object-center"
          sizes="100vw"
        />
        {/* Overlay sombre pour lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/90" />
      </div>

      {/* Contenu */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm mb-8"
        >
          <Medal size={16} />
          <span>{title}</span>
        </motion.div>

        {/* Titre principal */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
        >
          Timothy
          <span className="block text-gradient">Montavon</span>
        </motion.h1>

        {/* Sous-titre */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl sm:text-2xl text-slate-300 max-w-2xl mx-auto mb-12"
        >
          {subtitle}
          <br className="hidden sm:block" />
          Toujours aller plus loin.
        </motion.p>

        {/* Boutons CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button href="/palmares" variant="accent" size="lg">
            <Trophy size={20} />
            Voir mon palmarès
          </Button>
          <Button href="/contact" variant="outline" size="lg">
            Me contacter
          </Button>
        </motion.div>

        {/* Stats rapides */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
        >
          {stats.map((stat, index) => (
            <StatItem key={index} value={stat.value} label={stat.label} />
          ))}
        </motion.div>
      </div>

      {/* Indicateur de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-slate-400"
        >
          <ChevronDown size={32} />
        </motion.div>
      </motion.div>
    </section>
  );
};

// Composant pour les statistiques
interface StatItemProps {
  value: string;
  label: string;
}

const StatItem: FC<StatItemProps> = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-slate-400">{label}</div>
  </div>
);
