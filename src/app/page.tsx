// pages/index.tsx
import Layout from '@/components/Layout/LayoutLiceo'
import Hero from '@/components/Hero'
import FeatureCard from '@/components/FeatureCard'
import StatsSection from '@/components/StatsSection'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function Home() {
  const features: Feature[] = [
    {
      icon: '🎓',
      title: 'Excelencia Académica',
      description: 'Programas educativos de vanguardia con profesores altamente calificados'
    },
    {
      icon: '🏫',
      title: 'Ambientes Educativos Innovadores',
      description: 'Espacios diseñados para inspirar la creatividad y el aprendizaje'
    },
    {
      icon: '🌟',
      title: 'Formación Integral',
      description: 'Desarrollo de habilidades académicas, sociales y emocionales'
    }
  ]

  const stats: Stat[] = [
    { number: '500+', label: 'Estudiantes' },
    { number: '25+', label: 'Años de experiencia' },
    { number: '98%', label: 'Egresados universitarios' },
    { number: '15+', label: 'Actividades extracurriculares' }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title="Bienvenidos al Liceo de Frailes"
        subtitle="Formando líderes del mañana con educación de calidad y valores humanos"
        ctaText="Conoce más"
        ctaLink="/sobreNosotros"
        secondaryText="Solicitar información"
        secondaryLink="/contacto"
      />

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Por qué elegirnos</Badge>
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Educación de Calidad Comprobada
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ofrecemos una educación integral que combina excelencia académica 
              con valores humanos para el desarrollo completo de cada estudiante.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* CTA Section */}
      <section className="py-20 bg-Dark-Green-Lifra text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">Únete a nosotros</Badge>
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para formar parte de nuestra comunidad?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Descubre un mundo de oportunidades educativas y forma parte de 
            una institución con tradición y visión de futuro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contacto">Solicitar información</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  )
}