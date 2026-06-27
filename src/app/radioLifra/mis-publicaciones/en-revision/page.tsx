"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getStudentPublications } from "@/lib/actions/general.actions";
import StudentPublicationCard from "@/components/StudentPublicationCard";
import NoticiaEditDialog from "@/components/NoticiaEditDialog";
import VideoEditDialog from "@/components/VideoEditDialog";
import GaleriaEditDialog from "@/components/GaleriaEditDialog";
import PodcastEditDialog from "@/components/PodcastEditDialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

type EditTarget = {
  tipo: string;
  item: PublicacionBase;
} | null;

export default function EnRevisionPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [publicaciones, setPublicaciones] = useState<PublicacionBase[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [editTarget, setEditTarget] = useState<EditTarget>(null);

  const fetchData = useCallback(async () => {
    if (!user?.uid) return;
    setLoadingData(true);
    try {
      const tipos = ["noticia", "video", "galeria", "podcast"] as const;
      const results = await Promise.all(
        tipos.map((tipo) =>
          getStudentPublications(user.uid, "pendiente", tipo)
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
      console.error("[EnRevision] Error cargando publicaciones:", error);
      toast.error("Error al cargar publicaciones: " + (error?.message || "Desconocido"));
    } finally {
      setLoadingData(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "estudiante") {
      router.push("/radioLifra");
      return;
    }
    fetchData();
  }, [user, authLoading, router, fetchData]);

  const handleSaved = () => {
    setEditTarget(null);
    fetchData();
  };

  const renderEditDialog = () => {
    if (!editTarget) return null;
    const { tipo, item } = editTarget;
    const commonProps: EditDialogProps = {
      item,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) setEditTarget(null);
      },
      onSaved: handleSaved,
      mode: "student",
    };

    switch (tipo) {
      case "noticia":
        return <NoticiaEditDialog {...commonProps} />;
      case "video":
        return <VideoEditDialog {...commonProps} />;
      case "galeria":
        return <GaleriaEditDialog {...commonProps} />;
      case "podcast":
        return <PodcastEditDialog {...commonProps} />;
      default:
        return null;
    }
  };

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
      <h2 className="text-xl font-semibold mb-4">En revision</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Publicaciones que estan pendientes de aprobacion. Podes editarlas mientras
        no hayan sido revisadas.
      </p>

      {loadingData ? (
        <div className="flex justify-center items-center mt-10">
          <Spinner className="w-8 h-8 text-Light-Green-Lifra" />
          <p className="ml-3 text-gray-500">Cargando publicaciones...</p>
        </div>
      ) : publicaciones.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No tenes publicaciones en revision.
        </p>
      ) : (
        <div className="grid gap-4">
          {publicaciones.map((pub) => (
            <StudentPublicationCard
              key={`${pub.tipo}-${pub.id}`}
              item={pub}
              onEdit={() => setEditTarget({ tipo: pub.tipo as string, item: pub })}
            />
          ))}
        </div>
      )}

      {renderEditDialog()}
    </div>
  );
}
