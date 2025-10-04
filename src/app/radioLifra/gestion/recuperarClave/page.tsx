"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RecuperarContrasenaPage() {
  const [formData, setFormData] = useState({
    email: "",
    nuevaContrasena: "",
    confirmarContrasena: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (formData.nuevaContrasena !== formData.confirmarContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }

    console.log("Datos para recuperar contraseña:", formData);
    // Aquí iría la lógica para recuperar/actualizar la contraseña
    alert("Contraseña actualizada correctamente");
  };

  return (
    <div className="min-h-screen flex justify-center py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-md w-full space-y-8">
        {/* Encabezado */}


        <form onSubmit={handleSubmit} className="bg-white shadow rounded-2xl p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Recuperar Contraseña
            </h1>
          </div>          
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          {/* Nueva Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="nuevaContrasena" className="text-sm font-medium text-gray-700">
              Nueva Contraseña
            </Label>
            <Input
              id="nuevaContrasena"
              name="nuevaContrasena"
              type="password"
              placeholder="***********"
              value={formData.nuevaContrasena}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full"
            />
          </div>

          {/* Confirmar Nueva Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="confirmarContrasena" className="text-sm font-medium text-gray-700">
              Confirmar Nueva Contraseña
            </Label>
            <Input
              id="confirmarContrasena"
              name="confirmarContrasena"
              type="password"
              placeholder="***********"
              value={formData.confirmarContrasena}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full"
            />
          </div>

          {/* Botón Principal */}
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