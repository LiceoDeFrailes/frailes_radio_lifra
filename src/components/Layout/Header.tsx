// components/Layout/Header.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '../ui/sheet'
import { Menu } from 'lucide-react'
import Image from 'next/image'


interface NavItem {
  href: string
  label: string
}

export default function Header() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const navItems: NavItem[] = [
    { href: '/', label: 'Inicio' },
    { href: '/sobreNosotros', label: 'Nosotros' },
    { href: '/contacto', label: 'Contacto' },
    { href: '/radioLifra', label: 'RadioLifra' },

  ]

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
          <Image src='/escudoFrailes.png' 
          alt='Escudo Frailes' 
          width={40} 
          height={40}/>
            <div>
              <span className="text-xl font-bold">Liceo De Frailes</span>
              <p className="text-sm text-muted-foreground">Excelencia Educativa</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button Desktop */}
          <div className="hidden md:block">
            <Button asChild>
              <Link href="/contacto">Solicitar Info</Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="ml-auto">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <Separator/>
              </SheetHeader>
              <div className="flex flex-col gap-3 m-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium transition-colors hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button className="mt-4" asChild>
                  <Link href="/contacto">Solicitar Información</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}