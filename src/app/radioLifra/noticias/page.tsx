"use client";

import React from "react";
import { PenLine } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import NoticiaCard from "@/components/NoticiaCard";
import { useEffect, useState } from "react";
import { getNoticias } from "@/lib/actions/general.actions";
import { Spinner } from "@/components/ui/spinner";


const AgregarNoticia = () => {
  const { user } = useAuth();
  const [noticias, setNoticias] = useState<any>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  

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
      setLoading(false)
    }
    fetchNoticias();
  }, []);
  return (
    <div className="flex flex-col gap-3">
      {user?.role === "estudiante" ? (
        <Link href="/radioLifra/noticias/agregarNoticia">
          <Button className="w-fit gap-2 bg-Light-Green-Lifra hover:bg-Dark-Green-Lifra text-white">
            <PenLine className="size-4" />
            Publicar una noticia
          </Button>
        </Link>
      ) : null}

      {noticias.length > 0 ? (
        noticias.map((noticia: any) => (
          <NoticiaCard key={noticia.id} item={noticia} isAdmin={isAdmin} />
        ))
      ) : (
        <div className="flex justify-center items-center mt-20">
          {loading && <Spinner className="w-8 h-8 text-Light-Green-Lifra" />}
          <p className="text-gray-500 text-center">
          {loading ? 
          <>
            Cargando publicaciones...
          </>
           : 
           <>
           No hay noticias disponibles
           </>
           }
        </p>
        </div>
      )}
    </div>
  );
};

export default AgregarNoticia;
