import { type Metadata } from 'next';
import { PressContent } from '@/components/features/PressContent';
import { type PressArticle, type Interview } from '@/types';
import presseData from '@/../content/medias/presse.json';

export const metadata: Metadata = {
  title: 'Presse - Timothy Montavon',
  description: 'Articles de presse, interviews et couverture médiatique de Timothy Montavon, lanceur de javelot.',
};

// Données chargées depuis content/medias/presse.json (triées par date décroissante)
const pressArticles = ([...presseData.articles] as PressArticle[]).sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);
const interviews = ([...presseData.interviews] as Interview[]).sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export default function PressePage() {
  return (
    <main className="min-h-screen bg-slate-900">
      <PressContent articles={pressArticles} interviews={interviews} />
    </main>
  );
}
