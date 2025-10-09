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
import { useState } from "react";
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '../ui/sheet'
import { Menu } from 'lucide-react'
import { Separator } from "@/components/ui/separator";
import { signUserOut } from '@/lib/actions/auth.action'
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const navItems: { title: string; href: string; }[] = [
  {
    title: "Noticias",
    href: "/radioLifra",
  },
  {
    title: "Galeria",
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleSignOut = async () => {
    const result = await signUserOut();
  if (result.ok) {
    toast.success('Sesión Cerrada')
    router.push('/iniciarSesion')
  } else {
    toast.success('Error: No se pudo cerrar la sesión')
  }
  }
  return (
    <div>
        <div className="flex flex-row items-center gap-1 m-2">
        <Image src='/LogoRadioLifra.png' 
          alt='Escudo Frailes' 
          width={70} 
          height={70}/>
      <NavigationMenu viewport={false} className="max-md:hidden">
        <NavigationMenuList>
            {navItems.map((item) => (

            <NavigationMenuItem key={item.href}>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href={item.href}>{item.title}</Link>
            </NavigationMenuLink>
            </NavigationMenuItem> 
            ))}


            {/*Gestion seccion*/}
            {user?.role === 'admin' ? 
            <NavigationMenuItem>
          <NavigationMenuTrigger>Gestión</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-1 lg:w-[600px]">
              {gestionItems.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
              : 
              null
            }
          

        
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
                
                {/* Sección de Gestión para móvil */}
                {user?.role === 'admin' ?
              <div className="">
                  <h3 className="text-lg font-semibold mb-2">Gestión</h3>
                  <div className="flex flex-col gap-2 ml-8">
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
              :
               null}
    
                {user === null ? 
                <Button className="bg-Light-Green-Lifra hover:bg-Dark-Green-Lifra flex w-full rounded-md mt-3">
                <Link href="/iniciarSesion">Iniciar Sesión</Link>
                </Button>  
                : 
                <Button className="bg-red-600 hover:bg-red-700 flex w-full rounded-md mt-3" onClick={handleSignOut}>
                Cerrar Sesión
                </Button>
                }
          
              </div>

            </SheetContent>
          </Sheet> 
                {user === null ? 
                <Button className="bg-Light-Green-Lifra hover:bg-Dark-Green-Lifra flex rounded-md mt-3 w-auto max-md:hidden ml-auto">
                <Link href="/iniciarSesion">Iniciar Sesión</Link>
                </Button>  
                : 
                <Button className="bg-red-600 hover:bg-red-700 flex rounded-md mt-3 w-auto max-md:hidden ml-auto" onClick={handleSignOut}>
                Cerrar Sesión
                </Button>
                }
    </div>
        <Separator className="mt-4"/>
    </div>
    
  );
}