'use client'
import React from 'react'
import { useEffect, useState } from "react";
import { getAllPendingPublications } from "@/lib/actions/general.actions";
import CardNoticia from "@/components/NoticiaCard";
import VideoCard from "@/components/VideoCard";
import CardGaleria from "@/components/GaleriaCard";
import PodcastCard from "@/components/PodcastCard";
import { Spinner } from "@/components/ui/spinner";

const validarPublicacion = () => {
    const [publicaciones, setPublicaciones] = useState<PublicacionBase[]>([]);;

      useEffect(() => {
    async function fetchData() {
      const data = await getAllPendingPublications();
      setPublicaciones(data);
    }
    fetchData();
  }, []);

  if (publicaciones.length === 0)
    return <p className="text-center text-gray-500 mt-10">No hay publicaciones pendientes.</p>;

  return (
     <div className="max-w-7xl mx-auto mt-10 space-y-8">
      <h1 className="text-2xl font-bold max-sm:hidden">Validar Publicaciones</h1>

      <div className="grid gap-6">
        {publicaciones.map((pub) => {
          switch (pub.tipo) {
            case "noticia":
              return <CardNoticia key={pub.id} item={pub} validationMode={true}/>;
            case "video":
              return <VideoCard key={pub.id} item={pub} validationMode={true}/>;
            case "galeria":
              return <CardGaleria key={pub.id} item={pub} validationMode={true} />;
            case "podcast":
              return <PodcastCard key={pub.id} item={pub} validationMode={true}/>;
            default:
              return null;
          }
        })}
      </div>
    </div>
  )
}

export default validarPublicacion