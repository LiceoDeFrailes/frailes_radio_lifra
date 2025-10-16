"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from '@/context/AuthContext'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  NavigationMenuTrigger,
  NavigationMenuContent,
  ListItem,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '../ui/sheet'
import { Menu, User, LogOut } from 'lucide-react'
import { Separator } from "@/components/ui/separator";
import { signUserOut } from '@/lib/actions/general.actions'
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems: { title: string; href: string; }[] = [
  {
    title: "Noticias",
    href: "/radioLifra",
  },
  {
    title: "Galería",
    href: "/radioLifra/galeria",
  },
  {
    title: "Videos",
    href: "/radioLifra/videos",
  },
  {
    title: "Podcasts",
    href: "/radioLifra/podcasts",
  },
]
const gestionItems: { title: string; href: string; }[] = [
  {
    title: "Crear Nuevo Usuario",
    href: "/radioLifra/gestion/nuevoUsuario",
  },
  {
    title: "Recuperar Contraseña",
    href: "/radioLifra/gestion/recuperarClave",
  },
  {
    title: "Validar Publicación",
    href: "/radioLifra/gestion/validarPublicacion",
  },
]

export default function HeaderRadioLifra() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

    useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Evita el render en SSR (nada se genera hasta estar en cliente)
    return null;
  }

  const handleSignOut = async () => {
    const result = await signUserOut();
    if (result.ok) {
      toast.success('Sesión Cerrada')
      router.push('/iniciarSesion')
    } else {
      toast.error('Error: No se pudo cerrar la sesión')
    }
  }

  const getRoleDisplayName = (role: string) => {
    const roleNames: { [key: string]: string } = {
      'admin': 'Administrador',
      'estudiante': 'Estudiante',
    };
    return roleNames[role] || role;
  }

  return (
    <div>
      <div className="flex flex-row items-center gap-1 m-2">
        <Image 
          src='/LogoRadioLifra.png' 
          alt='Escudo Frailes' 
          width={70} 
          height={70}
          className="max-sm:ml-auto"
        />
        
        <NavigationMenu viewport={false} className="max-md:hidden">
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href={item.href}>{item.title}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem> 
            ))}

            {user?.role === 'admin' && (
              <NavigationMenuItem>
                <NavigationMenuTrigger>Gestión</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 md:w-[150px] md:grid-cols-1">
                    {gestionItems.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

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
                  {item.title}
                </Link>
              ))}
              
              {user?.role === 'admin' && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Gestión</h3>
                  <div className="flex flex-col gap-2 ml-4">
                    {gestionItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-base font-medium transition-colors hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
    
              {user === null ? (
                <Button className="bg-Light-Green-Lifra hover:bg-Dark-Green-Lifra flex w-full rounded-md mt-3">
                  <Link href="/iniciarSesion" className="w-full text-center">Iniciar Sesión</Link>
                </Button>  
              ) : (
                <div className="space-y-3 mt-3">
                  <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {getRoleDisplayName(user.role)}
                    </span>
                  </div>
                  <Button 
                    className="bg-red-600 hover:bg-red-700 flex w-full rounded-md" 
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet> 

        <div className="ml-auto mr-3 mt-2 max-md:hidden">
          {user === null ? (
            <Button className="bg-Light-Green-Lifra hover:bg-Dark-Green-Lifra flex rounded-md">
              <Link href="/iniciarSesion">Iniciar Sesión</Link>
            </Button>  
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{getRoleDisplayName(user.role)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="text-red-600 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <Separator className="mt-4"/>
    </div>
  );
}