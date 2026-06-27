"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getStudentPublications } from "@/lib/actions/general.actions";
import StudentPublicationCard from "@/components/StudentPublicationCard";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const DETAIL_URLS: Record<string, (id: string) => string> = {
  noticia: (id) => `/radioLifra/noticias/${id}`,
  video: (id) => `/radioLifra/videos/${id}`,
  galeria: (id) => `/radioLifra/galeria/${id}`,
  podcast: (id) => `/radioLifra/podcasts/${id}`,
};

export default function AprobadasPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [publicaciones, setPublicaciones] = useState<PublicacionBase[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "estudiante") {
      router.push("/radioLifra");
      return;
    }

    async function fetchData() {
      if (!user?.uid) return;
      setLoadingData(true);
      try {
        const tipos = ["noticia", "video", "galeria", "podcast"] as const;
        const results = await Promise.all(
          tipos.map((tipo) =>
            getStudentPublications(user.uid, "aprobado", tipo)
          )
        );
        const all = results.flat();
        all.sort((a, b) => {
          const dateA = a.createdAt?.toMillis?.() ?? 0;
          const dateB = b.createdAt?.toMillis?.() ?? 0;
          return dateB - dateA;
        });
        setPublicaciones(all);
      } catch (error: any) {
        console.error("[Aprobadas] Error cargando publicaciones:", error);
        toast.error("Error al cargar publicaciones: " + (error?.message || "Desconocido"));
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <Spinner className="w-8 h-8 text-Light-Green-Lifra" />
      </div>
    );
  }

  if (!user || user.role !== "estudiante") return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Aprobadas</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Publicaciones que ya fueron aprobadas. Solo podes ver los detalles.
      </p>

      {loadingData ? (
        <div className="flex justify-center items-center mt-10">
          <Spinner className="w-8 h-8 text-Light-Green-Lifra" />
          <p className="ml-3 text-gray-500">Cargando publicaciones...</p>
        </div>
      ) : publicaciones.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No tenes publicaciones aprobadas.
        </p>
      ) : (
        <div className="grid gap-4">
          {publicaciones.map((pub) => {
            const tipo = pub.tipo as string;
            const urlFn = DETAIL_URLS[tipo];
            return (
              <StudentPublicationCard
                key={`${tipo}-${pub.id}`}
                item={pub}
                readOnly
                publicUrl={urlFn ? urlFn(pub.id) : undefined}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
