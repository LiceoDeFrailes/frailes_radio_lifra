"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createUser } from "@/lib/actions/auth.action";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function CrearUsuarioPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);


    useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.info("Nivel de Acceso Prohibido");
      return router.push("/radioLifra");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(password != confirmPassword){
      return toast.info('Contraseñas no Iguales');
    }
    const toastId = toast.custom(
      (t) => (
        <div className="flex gap-2 justify-center items-center bg-white px-5 py-3 rounded-xl shadow-md border border-gray-100">
          <Spinner className="w-4 h-4 text-Light-Green-Lifra" />
          <h1 className="text-gray-700 font-medium">Cargando</h1>
        </div>
      ), { duration: Infinity });
      try {
            const res = await createUser({name, email, password, isAdmin});

            if (res.ok) {
              toast.success('Usuario Creado Exitosamente')
              toast.dismiss(toastId);
              setName("");
              setEmail("");
              setPassword("");
              setConfirmPassword("");
              setIsAdmin(false);
            } else {
              console.log('Error: ')
              toast.dismiss(toastId);
              toast.error('Error al Crear el Usuario')
            }
      } catch (error) {
        toast.error('Error al Crear el Usuario')
        console.log('Error: ', error)
      }
    



  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto mt-20">
      <div className="bg-white shadow rounded-2xl p-6">
        <h1 className="text-2xl text-center font-bold text-gray-800 mb-6">
          Crear Nuevo Usuario
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nombreCompleto" className="text-sm font-medium text-gray-700">
              Nombre Completo
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Ingrese el nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Contraseña
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="········"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmarPassword" className="text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="········"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAdmin"
              name="isAdmin"
              checked={isAdmin}
              onCheckedChange={(checked) => setIsAdmin(checked as boolean)}
            />
            <Label htmlFor="esAdministrador" className="text-sm font-medium text-gray-700">
              Administrador
            </Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="bg-Light-Green-Lifra hover:bg-Dark-Green-Lifra text-white flex-1 py-3 text-base font-medium"
            >
              Crear Usuario
            </Button>
            <Link href="/radioLifra" className="flex-1">
              <Button 
                type="button"
                variant="outline" 
                className="w-full py-3 text-base font-medium"
              >
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}