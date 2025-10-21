"use client";
import React from "react";
import { use, useEffect, useState } from "react";
import { getNoticiaById } from "@/lib/actions/general.actions";
import ContentDetailCard from "@/components/ContentDetailCard";
import { Spinner } from "@/components/ui/spinner";

const Page = ({ params, }: {params: Promise<{ id: string }>}) => {
    const { id } = use(params)
    const [noticia, setNoticia] = useState<any>({});
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNoticiaById() {
      const noticiaById = await getNoticiaById(id);
      setNoticia(noticiaById);
      setLoading(false);
    }
    fetchNoticiaById();
  }, []);

  if (loading) {
  return <div className="flex justify-center items-center"> 
          <Spinner className="w-4 h-4 text-Light-Green-Lifra size-6" />
          </div>;
}
  return (
    <div>
        <ContentDetailCard item={noticia} type="noticia" />
    </div>
  )
};

export default Page;
