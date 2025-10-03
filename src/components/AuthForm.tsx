import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const FormIniciarSesion = () => {
  return (
    <Card className="w-full max-w-sm mb-35">
      <CardHeader className='flex flex-col items-center justify-center gap-8'>
        <CardTitle className='text-xl'>Iniciar Sesión</CardTitle>
        <div className='flex items-center justify-center'>
            <Separator className='max-w-27'/>
                <Label className='text-gray-400 text-xs whitespace-nowrap px-2'>Bienvenidos Devuelta</Label>
            <Separator className='max-w-27'/>
        </div>
        
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@ejemplo.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full bg-Light-Green-Lifra">
          Iniciar Sesión
        </Button>
      </CardFooter>
    </Card>
  )
}

export default FormIniciarSesion