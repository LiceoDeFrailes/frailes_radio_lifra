'use client'
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { loginUser } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const FormIniciarSesion = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    toast.custom((t) => (
        <div className="flex gap-2 justify-center items-center bg-white px-5 py-3 rounded-xl shadow-md border border-gray-100">
          <Spinner className="w-4 h-4 text-Light-Green-Lifra" />
          <h1 className="text-gray-700 font-medium">Cargando</h1>
        </div>
      ));
    try {

      const user = await loginUser(email, password);
      // Guardar datos en localStorage o estado global
      localStorage.setItem("user", JSON.stringify(user));
      // Redirigir según el rol
        router.push("/radioLifra");

    } catch (error: any) {
      console.log('Error: ', error)
      toast.error('Credenciales Incorrectos');
    }



  };



  return (
    <Card className="w-full max-w-sm mb-35">
      <CardHeader className="flex flex-col items-center justify-center gap-8">
        <CardTitle className="text-xl">Iniciar Sesión</CardTitle>
        <div className="flex items-center justify-center">
          <Separator className="max-w-27" />
          <Label className="text-gray-400 text-xs whitespace-nowrap px-2">
            Bienvenidos Devuelta
          </Label>
          <Separator className="max-w-27" />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@ejemplo.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
              </div>
              <Input 
              id="password" 
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required />
            </div>
          </div>
                  <Button type="submit" className="w-full bg-Light-Green-Lifra mt-6">
          Iniciar Sesión
        </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormIniciarSesion;
