import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { aceptarPodcast, rechazarPodcast } from "@/lib/actions/general.actions";
import { Spinner } from "./ui/spinner";

const NoticiaCard = ({
  item,
  validationMode = false,
  isAdmin = false,
}: any) => {
  const [visible, setVisible] = useState(true);

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
      await aceptarPodcast(item.id);
      toast.success("Podcast Aprobado");
      setVisible(false);
      toast.dismiss(toastId);
    } catch (error) {
      console.log("Ocurrio un Error", error);
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
      await rechazarPodcast(item.id);
      toast.success("Podcast Eliminado Correctamente");
      setVisible(false);
      toast.dismiss(toastId);
    } catch (error) {
      console.log("Ocurrio un Error", error);
      toast.dismiss(toastId);
      toast.error("Ocurrio un Error");
    }
  };
  if (!visible) return null;
  return (
    <Card className="flex flex-col md:flex-row-reverse justify-center items-center px-3 md:py-3 gap-3">
      <div className="flex flex-col gap-2 justify-center">
        <iframe
          src={item.url}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="min-h-[190px] min-w-full bg-transparent"
        />

        <div className="hidden md:flex gap-2 justify-end mt-2 md:-mt-10">
          {validationMode && (
            <>
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

      <div className="flex flex-col gap-1 mx-2 mb-auto mr-auto -mt-10 md:mt-2">
        <p className="text-3xl font-bold">{item?.title}</p>

        <p className="text-sm text-gray-600 max-h-[150] overflow-y-auto px-1.5">
          {item?.description}
        </p>
        <div className="flex gap-2 justify-center mt-2 md:hidden ml-auto mr-2">
          {validationMode && (
            <>
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
  );
};

export default NoticiaCard;
