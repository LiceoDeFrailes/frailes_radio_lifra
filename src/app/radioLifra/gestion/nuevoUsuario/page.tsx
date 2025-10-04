"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function CrearUsuarioPage() {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    email: "",
    password: "",
    confirmarPassword: "",
    esAdministrador: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    // Aquí iría la lógica para crear el usuario
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto mt-20">
      <div className="bg-white shadow rounded-2xl p-6">
        {/* Título */}
        <h1 className="text-2xl text-center font-bold text-gray-800 mb-6">
          Crear Nuevo Usuario
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre Completo */}
          <div className="space-y-2">
            <Label htmlFor="nombreCompleto" className="text-sm font-medium text-gray-700">
              Nombre Completo
            </Label>
            <Input
              id="nombreCompleto"
              name="nombreCompleto"
              type="text"
              placeholder="Ingrese el nombre completo"
              value={formData.nombreCompleto}
              onChange={handleChange}
              required
            />
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
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Contraseña
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="········"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirmar Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="confirmarPassword" className="text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </Label>
            <Input
              id="confirmarPassword"
              name="confirmarPassword"
              type="password"
              placeholder="········"
              value={formData.confirmarPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Checkbox Administrador */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="esAdministrador"
              name="esAdministrador"
              checked={formData.esAdministrador}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, esAdministrador: checked as boolean }))
              }
            />
            <Label htmlFor="esAdministrador" className="text-sm font-medium text-gray-700">
              Administrador
            </Label>
          </div>

          {/* Botones */}
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