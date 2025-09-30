// pages/about.tsx
import Layout from '@/components/Layout/Layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function About() {
  const values = [
    {
      title: "Misión",
      description: "Promover el desarrollo integral, mediante una oferta educativa académica y tecnológica; que permita a la persona estudiante la adquisición de destrezas, habilidades, valores y principios de tal manera que pueda continuar con sus estudios superiores y enfrentarse a las demandas de la sociedad actual."
    },
    {
      title: "Visión",
      description: "Ser una institución que promueva el desarrollo integral, fomentando en la Comunidad Educativa un protagonismo activo entre sus estudiantes."
    },
    {
      title: "Valores",
      description: "Familiaridad, Compromiso, Respeto, Responsabilidad, Igualdad, Solidaridad."
    }
  ]

  const team = [
    {
      role: "Directora",
      name: "Dra. María González",
      description: "Más de 20 años de experiencia en educación"
    },
    {
      role: "Subdirector Académico",
      name: "Lic. Carlos Rodríguez",
      description: "Especialista en pedagogía innovadora"
    },
    {
      role: "Coordinador de Disciplina",
      name: "Prof. Ana Martínez",
      description: "Enfoque en desarrollo integral del estudiante."
    }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-Dark-Green-Lifra to-primary/95 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">Sobre Nosotros</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Nuestra Historia</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Más de 25 años formando líderes con excelencia académica y valores humanos
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((item, index) => (
              <Card key={item.title} className="text-center border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-primary mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nuestro Equipo Directivo</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Profesionales comprometidos con la excelencia educativa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <Card key={member.role} className="text-center border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <Badge variant="outline" className="mb-2">{member.role}</Badge>
                  <h3 className="text-lg font-semibold mb-2">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}