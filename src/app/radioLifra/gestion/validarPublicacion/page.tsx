"use client";
import React from "react";
import { useEffect, useState } from "react";
import { getAllPendingPublications } from "@/lib/actions/general.actions";
import CardNoticia from "@/components/NoticiaCard";
import VideoCard from "@/components/VideoCard";
import CardGaleria from "@/components/GaleriaCard";
import PodcastCard from "@/components/PodcastCard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ValidarPublicacion = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [publicaciones, setPublicaciones] = useState<PublicacionBase[]>([]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.info("Nivel de Acceso Prohibido");
      return router.push("/radioLifra");
    } else {
      async function fetchData() {
        const data = await getAllPendingPublications();
        setPublicaciones(data);
      }
      fetchData();
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-17">
      <h1 className="text-2xl font-bold">
        Validar Publicaciones
      </h1>
      {publicaciones.length === 0 ? 
      (
      <p className="text-center text-gray-500 mt-10">
        No hay publicaciones pendientes.
      </p>
    ) : <div className="grid gap-6">
        {publicaciones.map((pub) => {
          switch (pub.tipo) {
            case "noticia":
              return (
                <CardNoticia
                  key={pub.id}
                  item={pub}
                  validationMode={true}
                  isAdmin={true}
                />
              );
            case "video":
              return (
                <VideoCard
                  key={pub.id}
                  item={pub}
                  validationMode={true}
                  isAdmin={true}
                />
              );
            case "galeria":
              return (
                <CardGaleria
                  key={pub.id}
                  item={pub}
                  validationMode={true}
                  isAdmin={true}
                />
              );
            case "podcast":
              return (
                <PodcastCard
                  key={pub.id}
                  item={pub}
                  validationMode={true}
                  isAdmin={true}
                />
              );
            default:
              return null;
          }
        })}
      </div>
      }
      
    </div>
  );
};

export default ValidarPublicacion;
