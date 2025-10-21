"use client";
import React from "react";
import { use, useEffect, useState } from "react";
import { getVideoById } from "@/lib/actions/general.actions";
import ContentDetailCard from "@/components/ContentDetailCard";
import { Spinner } from "@/components/ui/spinner";

const Page = ({ params, }: {params: Promise<{ id: string }>}) => {
    const { id } = use(params)
    const [video, setVideo] = useState<any>({});
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideoById() {
      const videoById = await getVideoById(id);
      setVideo(videoById);
      setLoading(false);
    }
    fetchVideoById();
  }, []);

  if (loading) {
  return <div className="flex justify-center items-center"> 
          <Spinner className="w-4 h-4 text-Light-Green-Lifra size-6" />
          </div>;
}
  return (
    <div>
        <ContentDetailCard item={video} type="video" />
    </div>
  )
};

export default Page;
