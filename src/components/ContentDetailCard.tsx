import React from "react";
import { Card, CardContent } from "./ui/card";
import { CircleUserRound, Divide } from "lucide-react";
import Image from "next/image";
import dynamic from 'next/dynamic';
import { Spinner } from "./ui/spinner";

const Carousel = dynamic(() => import("@/components/ui/carousel").then(mod => mod.Carousel), {
  loading: () => <div className="min-h-[170px] flex items-center justify-center"><Spinner className="w-4 h-4" /></div>,
  ssr: false
});

const CarouselContent = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselContent));
const CarouselItem = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselItem));
const CarouselPrevious = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselPrevious));
const CarouselNext = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselNext));


const ContentDetailCard = ({ item, type }: DetailCardType) => {
  return (
    <div>
      <Card className="flex flex-col items-start px-5">
        <div className="flex flex-col justify-center">
          <p className="text-2xl font-bold">{item?.title}</p>
          <p className="flex text-lg items-center gap-1">
            <CircleUserRound className="size-5" />
            Publicado Por: {item?.nameAuthor}
          </p>
        </div>
        {type === "noticia" ? (
          <div>
            <Image
              src={item?.imageUrl}
              alt="Foto de Noticia"
              height={200}
              width={200}
              className="rounded-lg max-h-[250] max-w-[260] lg:min-h-[150] lg:min-w-[250] lg:max-h-[200] lg:max-w-[300]"
            />
          </div>
        ) : null}

        {type === "galeria" ? (
          <div className="flex flex-col gap-4 w-full">
            <div className="w-full">
              <p className="text-sm text-gray-600 max-h-[360px] overflow-y-auto px-1.5">
                {item?.description}
              </p>
            </div>

            <div className="flex items-center justify-center w-full">
              <Carousel
                opts={{
                  align: item?.imageUrls?.length <= 3 ? "start" : "center",
                }}
                className={`w-full ${
                  item?.imageUrls?.length === 1
                    ? "max-w-[300px]"
                    : item?.imageUrls?.length === 2
                    ? "max-w-[500px]"
                    : "max-w-55 md:max-w-lg lg:max-w-4xl"
                } mx-auto`}
              >
                <CarouselContent
                  className={item?.imageUrls?.length <= 3 ? "ml-0" : ""}
                >
                  {item?.imageUrls && item?.imageUrls.length > 0 ? (
                    item?.imageUrls.map((img: string, index: number) => (
                      <CarouselItem
                        key={index}
                        className={`${
                          // EN MÓVIL: siempre basis-full (1 imagen por vista)
                          // EN DESKTOP: comportamiento adaptativo según cantidad
                          item?.imageUrls?.length === 1
                            ? "basis-full" // 1 imagen: 100% siempre
                            : item?.imageUrls?.length === 2
                            ? "basis-full md:basis-1/2" // Móvil: 100%, Desktop: 50%
                            : item?.imageUrls?.length === 3
                            ? "basis-full md:basis-1/2 lg:basis-1/3" // Móvil: 100%, Desktop: 50%/33%
                            : item?.imageUrls?.length === 4
                            ? "basis-full md:basis-1/2 lg:basis-1/4" // Móvil: 100%, Desktop: 50%/25%
                            : "basis-full md:basis-1/2 lg:basis-1/3" // Móvil: 100%, Desktop: 50%/33%
                        } flex justify-center px-2`}
                      >
                        <div className="p-1 w-full">
                          <Card
                            className={`mx-auto ${
                              item?.imageUrls?.length === 1
                                ? "max-w-[280px]"
                                : item?.imageUrls?.length === 2
                                ? "max-w-[280px] md:max-w-[200px]"
                                : "max-w-[280px] md:max-w-[180px]"
                            }`}
                          >
                            <CardContent className="flex items-center justify-center p-4">
                              <div
                                className={`relative rounded-md overflow-hidden ${
                                  item?.imageUrls?.length === 1
                                    ? "w-[250px] h-[250px] md:w-[250px] md:h-[250px]"
                                    : item?.imageUrls?.length === 2
                                    ? "w-[250px] h-[250px] md:w-[180px] md:h-[180px]"
                                    : "w-[250px] h-[250px] md:w-[150px] md:h-[150px]"
                                }`}
                              >
                                <Image
                                  src={img}
                                  alt={`Imagen ${index + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 250px, 150px"
                                />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))
                  ) : (
                    <CarouselItem className="basis-full">
                      <Card>
                        <CardContent className="flex h-20 items-center justify-center">
                          <span className="text-gray-500">Sin imágenes</span>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  )}
                </CarouselContent>


                    <CarouselPrevious />
                    <CarouselNext />
              </Carousel>
            </div>
          </div>
        ) : null}

        {type === "noticia" ? (
          <div
            dangerouslySetInnerHTML={{ __html: item.content }}
            className="max-h-[450px] md:max-h-[900px] overflow-y-auto p-2"
          ></div>
        ) : null}

        {type === "video" ? (
          <div className=" flex flex-col justify-center items-center gap-4 ">
            <div>
              <p className="text-sm text-gray-600 max-h-[360px] overflow-y-auto px-1.5">
                {item?.description}
              </p>
            </div>

            <div>
              <iframe
                src={item.url}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="min-h-[190px] min-w-[300px] md:min-h-[350px] md:min-w-[600px]"
              ></iframe>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
};

export default ContentDetailCard;
