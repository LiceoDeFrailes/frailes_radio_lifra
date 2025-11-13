
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks: FooterLink[] = [
    { href: '/sobreNosotros', label: 'Nosotros' },
    { href: '/contacto', label: 'Contacto' },
    { href: '/RadioLifra', label: 'RadioLifra' },
  ]

  const contactInfo: ContactInfo[] = [
    { icon: '📞', text: '(+506) 2544-0166' },
    { icon: '✉️', text: 'lic.defrailes@mep.go.cr' },
    { icon: '📍', text: 'Liceo de Frailes, Desamparados' },
  ]

    const socialLinks: SocialLink[] = [
    { href: 'https://www.facebook.com/people/Liceo-De-Frailes/100057346785579/', label: 'Facebook' },
    { href: 'https://www.instagram.com/liceo_de_frailes/', label: 'Instagram' },
    { href: 'https://www.tiktok.com/@liceo_de_frailes', label: 'TikTok' },
  
  ]

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">

          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
                <Image src='/escudoFrailes.webp' 
                alt='Escudo Frailes' 
                width={40} 
                 height={40}/>
              <span className="text-xl font-bold">Liceo de Frailes</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Institución educativa comprometida con la excelencia académica 
              y la formación integral de nuestros estudiantes para un futuro brillante.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/contacto">Contáctanos</Link>
            </Button>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3 text-muted-foreground">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span>{info.icon}</span>
                  <span>{info.text}</span>
                </li>
              ))}
            </ul>
          </div>

                    <div>
            <h3 className="font-semibold mb-4">Redes Sociales</h3>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        



        

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {currentYear} Liceo de Frailes. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}