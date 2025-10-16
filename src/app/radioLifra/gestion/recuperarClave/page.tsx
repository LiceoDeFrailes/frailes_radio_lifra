"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { updateUserPassword } from "@/lib/actions/auth.action";
import Link from "next/link";

export default function RecuperarContrasenaPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(user?.role !== 'admin') 
      return toast.info('Solo los Administradores pueden recuperar contraseñas.');
    if (!email || !password || !confirmPassword) 
      return toast.info('Por favor completa todos los campos.');
    if (password !== confirmPassword) 
      return toast.info('Las contraseñas deben ser Iguales');
        const toastId = toast.custom((t) => (
      <div className="flex gap-2 justify-center items-center bg-white px-5 py-3 rounded-xl shadow-md border border-gray-100">
        <Spinner className="w-4 h-4 text-Light-Green-Lifra" />
        <h1 className="text-gray-700 font-medium">Cargando</h1>
      </div>
    ), { duration: Infinity });

    try {
      await updateUserPassword(email, password);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      toast.dismiss(toastId);
      toast.success("Contraseña Cambiada");
    } catch (error) {
      console.log("Ocurrio un error" , error);
      toast.dismiss(toastId);
      toast.success("Error. No se pudo cambiar la contraseña");

    }
  };

  return (
    <div className="min-h-screen flex justify-center py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-md w-full space-y-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-2xl p-6 space-y-6"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Recuperar Contraseña
            </h1>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="nuevaContrasena"
              className="text-sm font-medium text-gray-700"
            >
              Nueva Contraseña
            </Label>
            <Input
              id="nuevaContrasena"
              name="nuevaContrasena"
              type="password"
              placeholder="***********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmarContrasena"
              className="text-sm font-medium text-gray-700"
            >
              Confirmar Nueva Contraseña
            </Label>
            <Input
              id="confirmarContrasena"
              name="confirmarContrasena"
              type="password"
              placeholder="***********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="bg-Light-Green-Lifra hover:bg-Dark-Green-Lifra text-white flex-1 py-3 text-base font-medium"
            >
              Recuperar Contraseña
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
