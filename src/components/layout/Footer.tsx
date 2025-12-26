'use client';

import { type FC } from 'react';
import { Instagram } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Nom et copyright */}
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="font-semibold text-white">Timothy Montavon</span>
            <span className="text-slate-600">•</span>
            <span>Athlé & Javelot</span>
            <span className="text-slate-600">•</span>
            <span>&copy; {currentYear}</span>
          </div>

          {/* Réseaux sociaux */}
          {siteConfig.social.instagram && (
            <a
              href={`https://instagram.com/${siteConfig.social.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};
