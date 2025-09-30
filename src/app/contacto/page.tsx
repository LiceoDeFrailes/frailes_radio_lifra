// pages/contact.tsx
import Layout from '@/components/Layout/Layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'

export default function Contact() {
  const contactInfo = [
    {
      icon: "📞",
      title: "Teléfono",
      content: "(+506) 2544-0166",
      description: "Lunes a Viernes 7:00 AM - 4:00 PM"
    },
    {
      icon: "✉️",
      title: "Email",
      content: "liceodefrailes@gmail.com",
      description: "Respondemos en 24 horas"
    },
    {
      icon: "📍",
      title: "Dirección",
      content: "Liceo de Frailes, Desamparados",
      description: "San Jose, #10306"
    },
    {
      icon: "🕒",
      title: "Horario",
      content: "7:00 AM - 4:15 PM",
      description: "Lunes a Viernes"
    }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-Dark-Green-Lifra to-primary/95 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">Contáctanos</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Estamos para Ayudarte</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Resolvemos todas tus dudas sobre admisiones, programas académicos y más.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Información de Contacto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactInfo.map((info) => (
                  <Card key={info.title} className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="text-2xl mb-3">{info.icon}</div>
                      <h3 className="font-semibold mb-2">{info.title}</h3>
                      <p className="text-primary font-medium mb-1">{info.content}</p>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Envíanos un Mensaje</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input id="firstName" placeholder="Tu nombre" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input id="lastName" placeholder="Tu apellido" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="tu@email.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" placeholder="(123) 456-7890" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Asunto</Label>
                  <Input id="subject" placeholder="Motivo de tu consulta" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Escribe tu mensaje aquí..." 
                    rows={5}
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full">
                  Enviar Mensaje
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Visítanos</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Te esperamos en nuestras instalaciones para mostrarte todo lo que tenemos para ofrecer
            </p>
          </div>
          
          {/* Map Placeholder */}
          <div className="bg-muted rounded-lg h-96 flex items-center justify-center">

              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3932.166590472664!2d-84.05935712426326!3d9.751952677252266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa11b9ef81951c1%3A0x7b726c5c763de31d!2sLiceo%20de%20Frailes!5e0!3m2!1ses-419!2scr!4v1759167826947!5m2!1ses-419!2scr" className='h-full w-full'   loading="lazy" ></iframe>

          </div>
        </div>
      </section>
    </Layout>
  )
}