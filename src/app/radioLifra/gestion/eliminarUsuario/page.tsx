"use client";

import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import DeleteUserCard from "@/components/DeleteUserCard";
import { Spinner } from "@/components/ui/spinner";

export default function PageEliminarUsuarios() {
  const { user, loading } = useAuth();
  const router = useRouter();
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (loading) return;
    
    if (!user || user.role !== "admin") {
      toast.info("Nivel de Acceso Prohibido");
      return router.push("/radioLifra");
    }
  }, [loading]);

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        setLoadingUsers(true);
        const data = await getAllUsers();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        toast.error("Error al cargar usuarios");
      } finally {
        setLoadingUsers(false);
      }
    }
    fetchUsuarios();
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-17">
      <h1 className="text-2xl font-bold  ">Eliminar Usuarios</h1>
      {loadingUsers ? (
        <div className="flex justify-center items-center mt-20">
          <Spinner className="w-8 h-8 text-Light-Green-Lifra" />
          <p className="ml-3 text-gray-500">Cargando usuarios...</p>
        </div>
      ) : usuarios.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No hay usuarios.</p>
      ) : (
        <div className="grid gap-6">
          {usuarios.map((user) => (
            <DeleteUserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
