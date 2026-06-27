import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { aceptarVideo, rechazarVideo } from "@/lib/actions/general.actions";
import VideoEditDialog from "@/components/VideoEditDialog";

const VideoCard = ({
  item,
  validationMode = false,
  isAdmin = false,
}: any) => {  const [visible, setVisible] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAceptar = async () => {
    const toastId = toast.custom(
      (t) => (
        <div className="flex gap-2 justify-center items-center bg-white px-5 py-3 rounded-xl shadow-md border border-gray-100">
          <Spinner className="w-4 h-4 text-Light-Green-Lifra" />
          <h1 className="text-gray-700 font-medium">Cargando</h1>
        </div>
      ),
      { duration: Infinity }
    );
    try {
      await aceptarVideo(item.id);
      toast.success("Video Aprobado");
      toast.dismiss(toastId);
      setVisible(false);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Ocurrio un Error");
    }
  };

  const handleRechazar = async () => {
    const toastId = toast.custom(
      (t) => (
        <div className="flex gap-2 justify-center items-center bg-white px-5 py-3 rounded-xl shadow-md border border-gray-100">
          <Spinner className="w-4 h-4 text-Light-Green-Lifra" />
          <h1 className="text-gray-700 font-medium">Cargando</h1>
        </div>
      ),
      { duration: Infinity }
    );
    try {
      await rechazarVideo(item.id);
      toast.success("Video Eliminado Correctamente");
      setVisible(false);
      toast.dismiss(toastId);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Ocurrio un Error");
    }
  };
  if (!visible) return null;
  return (
    <>
    <Card className="flex flex-col md:flex-row-reverse justify-center items-center px-3 md:py-3 gap-3">
      <div className="flex flex-col gap-2 ">
        <iframe
          src={item.url}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="eager"
          className="min-h-[190px] min-w-[300px]"
        ></iframe>

        <div className="hidden md:flex gap-2 justify-end mt-2">
          {validationMode && (
            <>
              <Button
                type="button"
                className="bg-transparent hover:bg-blue-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setDialogOpen(true);
                }}
              >
                <Pencil className="text-black size-5" />
              </Button>
              <Button
                className="bg-transparent hover:bg-green-100"
                onClick={(e) => {
                  e.preventDefault();
                  handleAceptar();
                }}
              >
                <Check className="text-black size-5" />
              </Button>
            </>
          )}

          {isAdmin && (
            <>
              <Button
                className="bg-transparent hover:bg-red-100"
                onClick={(e) => {
                  e.preventDefault();
                  toast.warning("Eliminar Contenido", {
                    description: "Desea eliminar este contenido? Esta accion no es revercible.",
                    action: {
                      label: "Confirmar",
                      onClick: () => handleRechazar(),
                    },
                  })}
                }
              >
                <Trash2 className="text-black size-5" />
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 mx-2 mb-auto mr-auto">
        <Link
          href={`/radioLifra/videos/${item?.id}`}
          className={validationMode ? "pointer-events-none" : ""}
        >
          <p className="text-2xl font-bold hover:text-Light-Green-Lifra">{item?.title}</p>
        </Link>
        <p className="text-sm text-gray-600 max-h-[150] overflow-y-auto px-1.5">
          {item?.description}
        </p>
        <div className="flex gap-2 justify-center mt-2 md:hidden ml-auto mr-2">
          {validationMode && (
            <>
              <Button
                type="button"
                className="bg-transparent hover:bg-blue-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setDialogOpen(true);
                }}
              >
                <Pencil className="text-black size-5" />
              </Button>
              <Button
                className="bg-transparent hover:bg-green-100"
                onClick={(e) => {
                  e.preventDefault();
                  handleAceptar();
                }}
              >
                <Check className="text-black size-5" />
              </Button>
            </>
          )}

          {isAdmin && (
            <>
              <Button
                className="bg-transparent hover:bg-red-100"
                onClick={(e) => {
                  e.preventDefault();
                  toast.warning("Eliminar Contenido", {
                    description: "Desea eliminar este contenido? Esta accion no es revercible.",
                    action: {
                      label: "Confirmar",
                      onClick: () => handleRechazar(),
                    },
                  })}
                }
              >
                <Trash2 className="text-black size-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
    <VideoEditDialog
      item={item}
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      onSaved={(approved) => {
        if (approved) setVisible(false);
        setDialogOpen(false);
      }}
    />
    </>
  );
};

export default VideoCard;
