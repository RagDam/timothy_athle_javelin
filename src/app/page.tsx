import { HeroSection } from '@/components/sections';
import { AnimatedSection } from '@/components/ui';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { Button } from '@/components/ui';
import { Target, Medal, Calendar, ArrowRight } from 'lucide-react';
import { getHomeContent } from '@/lib/content';

export default async function HomePage() {
  const homeContent = await getHomeContent();
  const { meta } = homeContent;

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title={meta.subtitle}
        subtitle="15 ans, athlète spécialiste du lancer de javelot."
        heroImage={meta.heroImage}
        stats={meta.stats}
      />

      {/* Section Présentation */}
      <section className="py-24 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Bienvenue sur mon univers
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Découvrez ma passion pour l&apos;athlétisme et le lancer de javelot.
              Suivez mon parcours, mes résultats et mes prochaines compétitions.
            </p>
          </AnimatedSection>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection animation="fadeUp" delay={0.1}>
              <Card hover className="h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Target className="text-blue-500" size={24} />
                  </div>
                  <CardTitle>Le Javelot</CardTitle>
                  <CardDescription>
                    Une discipline alliant puissance, technique et précision
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm mb-4">
                    Le lancer de javelot est une épreuve d&apos;athlétisme qui demande une combinaison
                    unique de force, de vitesse et de coordination.
                  </p>
                  <Button href="/a-propos" variant="ghost" size="sm">
                    En savoir plus <ArrowRight size={16} />
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={0.2}>
              <Card hover className="h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Medal className="text-amber-500" size={24} />
                  </div>
                  <CardTitle>Palmarès</CardTitle>
                  <CardDescription>
                    Mes résultats et performances en compétition
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm mb-4">
                    Retrouvez l&apos;ensemble de mes résultats sportifs, mes records personnels
                    et les compétitions marquantes de ma carrière.
                  </p>
                  <Button href="/palmares" variant="ghost" size="sm">
                    Voir les résultats <ArrowRight size={16} />
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={0.3}>
              <Card hover className="h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Calendar className="text-green-500" size={24} />
                  </div>
                  <CardTitle>Agenda</CardTitle>
                  <CardDescription>
                    Les prochaines compétitions et événements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm mb-4">
                    Consultez mon calendrier sportif pour connaître mes prochaines échéances
                    et suivre mon parcours en temps réel.
                  </p>
                  <Button href="/agenda" variant="ghost" size="sm">
                    Voir l&apos;agenda <ArrowRight size={16} />
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-24 bg-gradient-to-b from-slate-800/50 to-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              On reste en contact ?
            </h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Une question, une idée ou juste envie de discuter ?
              N&apos;hésite pas à m&apos;écrire !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" variant="accent" size="lg">
                Me contacter
              </Button>
              <Button href="/medias" variant="outline" size="lg">
                Voir les médias
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
