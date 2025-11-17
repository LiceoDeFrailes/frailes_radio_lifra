"use client";
import React, { useEffect, useState } from "react";
import { getAllPendingPublications } from "@/lib/actions/general.actions";
import CardNoticia from "@/components/NoticiaCard";
import VideoCard from "@/components/VideoCard";
import CardGaleria from "@/components/GaleriaCard";
import PodcastCard from "@/components/PodcastCard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";

const ValidarPublicacion = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [publicaciones, setPublicaciones] = useState<PublicacionBase[]>([]);
  const [loadingData, setLoadingData] = useState(true); 

  useEffect(() => {
    if (loading) return;
    
    if (!user || user.role !== "admin") {
      toast.info("Nivel de Acceso Prohibido");
      router.push("/radioLifra");
      return;
    }

    async function fetchData() {
      try {
        setLoadingData(true);
        const data = await getAllPendingPublications();
        setPublicaciones(data);
      } catch (error) {
        console.error("Error al obtener publicaciones:", error);
        toast.error("Error al cargar publicaciones");
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, [loading]);

  return (
    <div className="max-w-7xl mx-auto mt-17">
      <h1 className="text-2xl font-bold">Validar Publicaciones</h1>

      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <Spinner className="w-8 h-8 text-Light-Green-Lifra" />
          <p className="ml-3 text-gray-500">Cargando publicaciones...</p>
        </div>
      ) : publicaciones.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No hay publicaciones pendientes.
        </p>
      ) : (
        <div className="grid gap-6">
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
      )}
    </div>
  );
};

export default ValidarPublicacion;
