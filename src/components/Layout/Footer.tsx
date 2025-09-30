// components/Layout/Footer.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface FooterLink {
  href: string
  label: string
}

interface ContactInfo {
  icon: string
  text: string
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks: FooterLink[] = [
    { href: '/sobreNosotros', label: 'Nosotros' },
    { href: '/contacto', label: 'Contacto' },
    { href: '/RadioLifra', label: 'RadioLifra' },
  ]

  const contactInfo: ContactInfo[] = [
    { icon: '📞', text: '(+506) 2544-0166' },
    { icon: '✉️', text: 'liceodefrailes@gmail.com' },
    { icon: '📍', text: 'Liceo de Frailes, Desamparados' },
  ]

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
                <Image src='/escudoFrailes.png' 
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

          {/* Quick Links */}
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

          {/* Contact Info */}
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
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {currentYear} Liceo de Frailes. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}