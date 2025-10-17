import React from "react";
import { Card, CardContent } from "./ui/card";
import { CircleUserRound, Divide } from "lucide-react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
  CarouselItem,
} from "@/components/ui/carousel";

const ContentDetailCard = ({ item, type }: DetailCardType) => {
  return (
    <div>
      <Card className="flex flex-col -mx-4 items-start px-5">
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
          <div className=" flex flex-col justify-center items-center gap-4 ">
            <div>
              <p className="text-sm text-gray-600 max-h-[360px] overflow-y-auto px-1.5">
                {item?.description}
              </p>
            </div>

            <div>
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full max-w-55 md:max-w-lg lg:max-w-4xl"
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
                            <CardContent className="flex items-center justify-center">
                              <div className="relative w-[150px] h-[150px] lg:h-[200px] rounded-md overflow-hidden">
                                <Image
                                  src={img}
                                  alt={`Imagen ${index + 1}`}
                                  fill
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
                          <span className="text-gray-500 p-0">
                            Sin imágenes
                          </span>
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
            className="max-h-[450px] md:max-h-[900px] overflow-y-auto"
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
