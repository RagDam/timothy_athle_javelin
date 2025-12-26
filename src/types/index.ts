// Types globaux du projet

// Export des types admin
export * from './admin';

/**
 * Navigation
 */
export interface NavLink {
  label: string;
  href: string;
  icon?: string;
}

/**
 * Palmarès
 */
export interface Record {
  discipline: string;
  performance: string;
  date: string;
  location: string;
}

export interface Result {
  date: string;
  competition: string;
  location: string;
  performance: string;
  rank: number;
  medal?: 'gold' | 'silver' | 'bronze';
}

export interface PalmaresYear {
  year: number;
  season: string;
  highlight?: boolean;
  results: Result[];
}

/**
 * Agenda / Événements
 */
export interface Event {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  location: {
    venue: string;
    city: string;
    country: string;
  };
  type: 'competition' | 'meeting' | 'training' | 'other';
  importance: 'major' | 'medium' | 'minor';
  description?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  result?: string;
  links?: {
    event?: string;
    results?: string;
  };
}

/**
 * Médias
 */
export interface Photo {
  id: string;
  src: string;
  alt: string;
  category: string;
  date?: string;
  featured?: boolean;
  width: number;
  height: number;
}

export interface Video {
  id: string;
  type: 'youtube' | 'vimeo' | 'local';
  videoId: string;
  title: string;
  thumbnail?: string;
  date?: string;
  featured?: boolean;
}

export interface MediaGallery {
  categories: {
    id: string;
    name: string;
    description?: string;
  }[];
  photos: Photo[];
  videos: Video[];
}

/**
 * Presse & Interviews
 */
export interface PressArticle {
  id: string;
  title: string;
  source: string;
  date: string;
  url: string;
  excerpt?: string;
  tag?: string;
}

export interface Interview {
  id: string;
  title: string;
  media: string;
  date: string;
  url: string;
  sourceUrl?: string;
  type: 'video' | 'audio' | 'article';
}

/**
 * Page Découvrir - Liens partenaires
 */
export interface PartnerLink {
  id: string;
  name: string;
  description: string;
  url: string;
  logo?: string;
  category: 'federation' | 'club' | 'sponsor' | 'other';
}

/**
 * Contact
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

/**
 * SEO / Metadata
 */
export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
}
