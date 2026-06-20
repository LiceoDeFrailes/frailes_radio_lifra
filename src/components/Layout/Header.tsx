'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '../ui/sheet'
import { Menu, GraduationCap } from 'lucide-react'
import Image from 'next/image'

interface NavItem {
  href: string
  label: string
}

export default function Header() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { href: '/', label: 'Inicio' },
    { href: '/sobreNosotros', label: 'Nosotros' },
    { href: '/contacto', label: 'Contacto' },
    { href: '/radioLifra', label: 'RadioLiFra' },
  ]

  const isActive = (href: string) => {
    if (!pathname) return false
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-Light-Green-Lifra group-hover:border-Dark-Green-Lifra transition-colors">
              <Image 
                src='/escudoFrailes.webp' 
                alt='Escudo Liceo de Frailes' 
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 group-hover:text-Dark-Green-Lifra transition-colors">Liceo De Frailes</span>
              <p className="text-xs text-slate-500 font-medium">Excelencia Educativa</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-Dark-Green-Lifra text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-Dark-Green-Lifra'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button 
              asChild
              className="bg-Dark-Green-Lifra hover:bg-Light-Green-Lifra text-white hover:text-slate-900 transition-colors shadow-md"
            >
              <Link href="/contacto" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Solicitar Info
              </Link>
            </Button>
          </div>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="ml-auto hover:bg-slate-100">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" aria-describedby={undefined} className="w-[280px]">
              <SheetHeader className="pb-4">
                <SheetTitle className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-Light-Green-Lifra">
                    <Image src='/escudoFrailes.webp' alt='Escudo' fill className="object-cover" />
                  </div>
                  <span className="text-lg font-bold">Menu</span>
                </SheetTitle>
                <Separator/>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${
                      isActive(item.href)
                        ? 'bg-Dark-Green-Lifra text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-Dark-Green-Lifra'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button 
                  className="mt-4 bg-Dark-Green-Lifra hover:bg-Light-Green-Lifra text-white hover:text-slate-900" 
                  asChild
                >
                  <Link href="/contacto">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Solicitar Información
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
