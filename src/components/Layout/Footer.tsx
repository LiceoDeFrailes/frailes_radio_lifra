import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { href: '/sobreNosotros', label: 'Nosotros' },
    { href: '/contacto', label: 'Contacto' },
    { href: '/radioLifra', label: 'RadioLifra' },
  ]

  const contactInfo = [
    { icon: <Phone className="w-4 h-4" />, text: '(+506) 2544-0166' },
    { icon: <Mail className="w-4 h-4" />, text: 'lic.defrailes@mep.go.cr' },
    { icon: <MapPin className="w-4 h-4" />, text: 'Liceo de Frailes, Desamparados' },
  ]

  const socialLinks = [
    { href: 'https://www.facebook.com/people/Liceo-De-Frailes/100057346785579/', label: 'Facebook' },
    { href: 'https://www.instagram.com/liceo_de_frailes/', label: 'Instagram' },
    { href: 'https://www.tiktok.com/@liceo_de_frailes', label: 'TikTok' },
  ]

  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">

          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image 
                src='/escudoFrailes.webp' 
                alt='Escudo Liceo de Frailes' 
                width={40} 
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-bold text-slate-900">Liceo de Frailes</span>
            </div>
            <p className="text-slate-600 mb-6 max-w-md leading-relaxed">
              Institución educativa con orientación tecnológica, comprometida con la excelencia académica 
              y la formación integral de nuestros estudiantes para un futuro brillante.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="border-Dark-Green-Lifra text-Dark-Green-Lifra hover:bg-Dark-Green-Lifra hover:text-white"
            >
              <Link href="/contacto">Contáctanos</Link>
            </Button>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-slate-900">Enlaces rápidos</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-slate-600 hover:text-Dark-Green-Lifra transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-slate-900">Contacto</h3>
            <ul className="space-y-3">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-center space-x-3 text-slate-600">
                  <span className="text-Dark-Green-Lifra">{info.icon}</span>
                  <span>{info.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-slate-900">Redes Sociales</h3>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-Dark-Green-Lifra transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-200 mt-10 pt-8 text-center text-slate-500 text-sm">
          <p>&copy; {currentYear} Liceo de Frailes. Todos los derechos reservados.</p>
          <p className="mt-1">Ministerio de Educación Pública de Costa Rica</p>
        </div>
      </div>
    </footer>
  )
}
