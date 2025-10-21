"use client";
import React from "react";
import { use, useEffect, useState } from "react";
import { getGaleriaById } from "@/lib/actions/general.actions";
import ContentDetailCard from "@/components/ContentDetailCard";
import { Spinner } from "@/components/ui/spinner";

const Page = ({ params, }: {params: Promise<{ id: string }>}) => {
    const { id } = use(params)
    const [galeria, setGaleria] = useState<any>({});
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGaleriaById() {
      const galeriaById = await getGaleriaById(id);
      setGaleria(galeriaById);
      setLoading(false);
    }
    fetchGaleriaById();
  }, []);

  if (loading) {
  return <div className="flex justify-center items-center"> 
          <Spinner className="w-4 h-4 text-Light-Green-Lifra size-6" />
          </div>;
}
  return (
    <div>
        <ContentDetailCard item={galeria} type="galeria" />
    </div>
  )
};

export default Page;
