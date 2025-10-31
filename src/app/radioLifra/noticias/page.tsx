"use client";

import React from "react";
import { CirclePlus, RollerCoaster } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import NoticiaCard from "@/components/NoticiaCard";
import { useEffect, useState } from "react";
import { getNoticias } from "@/lib/actions/general.actions";

const AgregarNoticia = () => {
  const { user } = useAuth();
  const [noticias, setNoticias] = useState<any>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user?.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);
  useEffect(() => {
    async function fetchNoticias() {
      const noticiasCollection = await getNoticias();
      setNoticias(noticiasCollection);
    }
    fetchNoticias();
  }, []);
  return (
    <div className="flex flex-col gap-3">
      {user?.role === "estudiante" ? (
        <Link href="/radioLifra/noticias/agregarNoticia">
          <CirclePlus className="hover:text-Light-Green-Lifra"/>
        </Link>
      ) : null}

      {noticias.length > 0 ? (
        noticias.map((noticia: any) => (
          <NoticiaCard key={noticia.id} item={noticia} isAdmin={isAdmin} />
        ))
      ) : (
        <p className="text-gray-500 text-center mt-4">
          No hay noticias disponibles
        </p>
      )}
    </div>
  );
};

export default AgregarNoticia;
