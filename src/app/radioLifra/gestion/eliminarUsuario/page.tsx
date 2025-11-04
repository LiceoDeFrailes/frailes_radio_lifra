"use client";

import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/actions/auth.action";
import { deleteUser } from "@/lib/actions/auth.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import DeleteUserCard from "@/components/DeleteUserCard";

export default function PageEliminarUsuarios() {
  const { user } = useAuth();
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.info("Nivel de Acceso Prohibido");
      return router.push("/radioLifra");
    }
  }, []);

  useEffect(() => {
    async function fetchUsuarios() {
      const data = await getAllUsers();
      setUsuarios(data);
    }
    fetchUsuarios();
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-17">
      <h1 className="text-2xl font-bold  ">Eliminar Usuarios</h1>
      {usuarios.length > 0 ? (
        <p className="text-center text-gray-500 mt-10">No hay usuarios.</p>
      ) : (
        <div className="grid gap-6">
          {usuarios.map((user) => <DeleteUserCard key={user.id} user={user} />)}
        </div>
      )}
    </div>
  );
}
