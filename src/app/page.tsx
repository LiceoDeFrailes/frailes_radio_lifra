"use client";

import Layout from '@/components/Layout/LayoutLiceo'
import FeatureCard from '@/components/FeatureCard'
import StatsSection from '@/components/StatsSection'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from "framer-motion";

export default function Home() {

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 }
  };

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
    { number: '250+', label: 'Estudiantes' },
    { number: '25+', label: 'Años de experiencia' },
    { number: '9+', label: 'Alumnos de Distintos Sectores' },
    { number: '3+', label: 'Talleres Tecnologicos' }
  ]

  return (
    <Layout>

      {/* HERO */}
      <section className="relative py-5 min-h-[80vh] flex items-center bg-gradient-to-br from-Dark-Green-Lifra to-primary/95 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
                Bienvenidos al Liceo de Frailes
              </h1>
              <p className="text-xl lg:text-2xl mb-8 max-w-2xl">
                Formando líderes del mañana con educación de calidad y valores humanos
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" variant="outline" asChild>
                  <Link href="/sobreNosotros" className='text-black'>Conoce más</Link>
                </Button>
                <Button size="lg" variant="outline" className='text-black' asChild>
                  <Link href="/contacto">Solicitar información</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0, y: -40 },
                show: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.7 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 max-w-md transform hover:scale-105 transition-transform duration-300">
                <Image 
                  src="/entradaFrailes.webp" 
                  alt="Ciclo Diversificado Vocacional - Liceo de Frailes"
                  width={400}
                  height={300}
                  className="rounded-md w-full h-auto border-1 border-gray-300"
                  priority
                />
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Liceo en Orientacion Tecnologica
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Programas especializados para el desarrollo profesional y académico
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>



      {/* FEATURES */}
      <section className="py-20 bg-muted/50">
        <motion.div 
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          variants={fadeUp}
        >
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
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>



      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        <StatsSection stats={stats} />
      </motion.div>


      <section className="py-20 bg-Dark-Green-Lifra text-primary-foreground">
        <motion.div 
          className="container mx-auto px-4 text-center"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-4">Únete a nosotros</Badge>
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para formar parte de nuestra comunidad?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Descubre un mundo de oportunidades educativas y forma parte de 
            una institución con tradición y visión de futuro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/contacto" className='text-black'>Solicitar información</Link>
            </Button>
          </div>
        </motion.div>
      </section>

    </Layout>
  )
}
