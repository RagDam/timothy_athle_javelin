import { type NavLink } from '@/types';

/**
 * Configuration globale du site
 */
export const siteConfig = {
  name: 'Timothy Montavon',
  title: 'Timothy Montavon - Athlète Javelot',
  description: 'Site officiel de Timothy Montavon, double Champion de France Minime 2025 au lancer de javelot. Découvrez mon parcours, mes résultats et mes actualités.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://timothy-montavon-athle.vercel.app',

  author: {
    name: 'Timothy Montavon',
    location: 'Le Mans / Poitiers, France',
    sport: 'Athlétisme - Javelot',
  },

  // Liens de navigation
  navLinks: [
    { label: 'Accueil', href: '/' },
    { label: 'À propos', href: '/a-propos' },
    { label: 'Palmarès', href: '/palmares' },
    { label: 'Médias', href: '/medias' },
    { label: 'Agenda', href: '/agenda' },
    { label: 'Découvrir', href: '/decouvrir' },
    { label: 'Contact', href: '/contact' },
  ] satisfies NavLink[],

  // Réseaux sociaux
  social: {
    instagram: 'timothy_athletisme',
    twitter: '',
    youtube: '',
  },

  // Couleurs du thème
  theme: {
    primary: '#0F172A',    // Slate 900
    secondary: '#1E293B',  // Slate 800
    accent: '#3B82F6',     // Blue 500
    accentAlt: '#F59E0B',  // Amber 500
    text: '#F8FAFC',       // Slate 50
    textMuted: '#94A3B8',  // Slate 400
  },
} as const;

export type SiteConfig = typeof siteConfig;
