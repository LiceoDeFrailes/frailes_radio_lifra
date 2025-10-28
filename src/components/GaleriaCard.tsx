"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Check, Trash2 } from "lucide-react";
import { rechazarGaleria, aceptarGaleria } from "@/lib/actions/general.actions";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import dynamic from 'next/dynamic';

const Carousel = dynamic(() => import("@/components/ui/carousel").then(mod => mod.Carousel), {
  loading: () => <div className="min-h-[170px] flex items-center justify-center"><Spinner className="w-4 h-4" /></div>,
  ssr: false
});

const CarouselContent = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselContent));
const CarouselItem = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselItem));
const CarouselPrevious = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselPrevious));
const CarouselNext = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselNext));

const GaleriaCard = ({
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
      await aceptarGaleria(item.id);
      toast.success("Galería aprobada correctamente");
      toast.dismiss(toastId);
      setVisible(false);
    } catch (error) {
      console.error("Error al aprobar galería:", error);
      toast.dismiss(toastId);
      toast.error("Ocurrió un error");
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
      await rechazarGaleria(item.id, item.imageUrls || []);
      toast.success("Galería eliminada correctamente");
      toast.dismiss(toastId);
      setVisible(false);
    } catch (error) {
      console.error("Error al eliminar galería:", error);
      toast.dismiss(toastId);
      toast.error("Ocurrió un error");
    }
  };
  if (!visible) return null;
  return (
    <Card className="flex flex-col justify-center items-center px-3 md:py-3 gap-3 hover:shadow-md transition-all">
      <div className="flex flex-col w-full mb-auto mr-auto">
        <Link
          href={`/radioLifra/galeria/${item?.id}`}
          className={validationMode ? "pointer-events-none" : ""}
        >
          <p className="text-2xl font-bold px-1.5 hover:text-Light-Green-Lifra">
            {item?.title}
          </p>
        </Link>
        
        <p className="text-sm text-gray-600 max-h-[150px] overflow-y-auto px-1.5">
          {item?.description}
        </p>
        <div className="flex flex-col justify-center items-center lg:items-start lg:ml-12 mt-2">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full max-w-55 md:max-w-lg min-h-[170px]"
          >
            <CarouselContent>
              {item?.imageUrls && item?.imageUrls.length > 0 ? (
                item?.imageUrls.map((img: string, index: number) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex items-center justify-center p-1">
                          <div className="relative w-[150px] h-[150px] rounded-md overflow-hidden">
                            <Image
                              src={img}
                              sizes="(max-width: 768px) 150px, (max-width: 1024px) 200px, 250px"
                              alt={`Imagen ${index + 1}`}
                              fill
                              priority={index === 0}
                              fetchPriority={index === 0 ? "high" : "auto"}
                              quality={60}
                              placeholder="blur"
                              blurDataURL={img}
                              className="object-cover"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem>
                  <Card>
                    <CardContent className="flex max-h-35 items-center justify-center">
                      <span className="text-gray-500 p-0">Sin imágenes</span>
                    </CardContent>
                  </Card>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="flex gap-2 justify-end mt-2 mr-3">
          {validationMode && (
            <>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleAceptar();
                }}
                className="bg-transparent hover:bg-green-100"
              >
                <Check className="text-black size-5" />
              </Button>
            </>
          )}

          {isAdmin && (
            <>
              <Button
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
                className="bg-transparent hover:bg-red-100"
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

export default GaleriaCard;
