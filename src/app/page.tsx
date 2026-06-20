"use client";

import { useEffect, useState } from "react";
import Layout from '@/components/Layout/LayoutLiceo'
import FeatureCard from '@/components/FeatureCard'
import StatsSection from '@/components/StatsSection'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from "framer-motion";
import { getConfigStats } from "@/lib/actions/configuracion.actions";
import { GraduationCap, Building2, HeartHandshake } from "lucide-react";

export default function Home() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    getConfigStats().then((data) => { setStats(data); setStatsLoading(false); });
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 }
  };

  const features = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: 'Excelencia Académica',
      description: 'Programas educativos de vanguardia con profesores altamente calificados'
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: 'Ambientes Educativos Innovadores',
      description: 'Espacios diseñados para inspirar la creatividad y el aprendizaje'
    },
    {
      icon: <HeartHandshake className="w-8 h-8" />,
      title: 'Formación Integral',
      description: 'Desarrollo de habilidades académicas, sociales y emocionales'
    }
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
                Bienvenidos al{' '}
                <span className="text-Light-Green-Lifra">Liceo de Frailes</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 max-w-2xl text-white/90">
                Formando líderes del mañana con educación de calidad y valores humanos
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="bg-Light-Green-Lifra hover:bg-white text-slate-900 hover:text-Dark-Green-Lifra font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  asChild
                >
                  <Link href="/sobreNosotros">Conoce más</Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-Dark-Green-Lifra font-semibold transition-all duration-300"
                  asChild
                >
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
              <div className="bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 max-w-lg transform hover:scale-[1.02] transition-transform duration-300">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
                  <Image 
                    src="/images/equipo-grupal.jpg" 
                    alt="Equipo directivo del Liceo de Frailes"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="mt-4 text-center px-2">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    Nuestro Equipo Directivo
                  </h3>
                  <p className="text-sm text-gray-600">
                    Profesionales comprometidos con la excelencia educativa
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
        {statsLoading ? (
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[1,2,3,4].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            </div>
          </section>
        ) : (
          <StatsSection stats={stats} />
        )}
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
