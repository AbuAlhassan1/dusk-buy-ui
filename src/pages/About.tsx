import { Star, Award, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">{t('about.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Star,
              title: t('about.features.selection.title'),
              description: t('about.features.selection.description'),
            },
            {
              icon: Award,
              title: t('about.features.excellence.title'),
              description: t('about.features.excellence.description'),
            },
            {
              icon: Users,
              title: t('about.features.customer.title'),
              description: t('about.features.customer.description'),
            },
          ].map((item, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg glass-effect hover-lift"
            >
              <item.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="prose prose-invert max-w-none">
          <h2 className="text-3xl font-bold mb-4">{t('about.story.title')}</h2>
          <p className="text-lg text-muted-foreground mb-6">
            {t('about.story.paragraph1')}
          </p>
          <p className="text-lg text-muted-foreground mb-6">
            {t('about.story.paragraph2')}
          </p>
          <p className="text-lg text-muted-foreground">
            {t('about.story.paragraph3')}
          </p>
        </div>
      </div>
    </div>
  );
}
