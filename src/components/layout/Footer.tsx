'use client';

import { type FC } from 'react';
import Link from 'next/link';
import { Instagram, Youtube, Mail } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne 1: Logo et description */}
          <div>
            <Link
              href="/"
              className="text-2xl font-bold text-white hover:text-blue-400 transition-colors"
            >
              Timothy<span className="text-blue-500">.</span>
            </Link>
            <p className="mt-4 text-slate-400 text-sm leading-relaxed">
              Athlète spécialiste du lancer de javelot.
              Passionné par la performance et le dépassement de soi.
            </p>
          </div>

          {/* Colonne 2: Navigation rapide */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {siteConfig.navLinks.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3: Contact et Réseaux */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="flex gap-4 mb-4">
              {siteConfig.social.instagram && (
                <a
                  href={`https://instagram.com/${siteConfig.social.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              )}
              {siteConfig.social.youtube && (
                <a
                  href={`https://youtube.com/${siteConfig.social.youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                  aria-label="YouTube"
                >
                  <Youtube size={20} />
                </a>
              )}
              <Link
                href="/contact"
                className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                aria-label="Contact"
              >
                <Mail size={20} />
              </Link>
            </div>
            <Link
              href="/contact"
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              Me contacter &rarr;
            </Link>
          </div>
        </div>

        {/* Ligne de séparation et copyright */}
        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {currentYear} Timothy Montavon. Tous droits réservés.
          </p>
          <p className="text-slate-600 text-xs">
            Site développé avec Next.js
          </p>
        </div>
      </div>
    </footer>
  );
};
