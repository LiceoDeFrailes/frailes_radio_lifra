"use client";

import React from "react";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getVideos } from "@/lib/actions/general.actions";
import VideoCard from "@/components/VideoCard";
import { Spinner } from "@/components/ui/spinner";


const AgregarVideos = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<any>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (user?.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);
  useEffect(() => {
    async function fetchVideos() {
      const videosCollection = await getVideos();
      setVideos(videosCollection);
      setLoading(false);
    }
    fetchVideos();
  }, []);
  return (
    <div className="flex flex-col gap-3">
      {user?.role === "estudiante" ? (
        <Link href="/radioLifra/videos/agregarVideos">
          <CirclePlus className="hover:text-Light-Green-Lifra"/>
        </Link>
      ) : null}

      {videos && videos.length > 0 ? (
        videos.map((v: any) => (
          <VideoCard
            key={v.id}
            item={v}
            validationMode={false}
            isAdmin={isAdmin}
          />
        ))
      ) : (
        <div className="flex justify-center items-center mt-20">
          {loading && <Spinner className="w-8 h-8 text-Light-Green-Lifra" />}
          <p className="text-gray-500 text-center">
          {loading ? 
          <>
            Cargando publicaciones...
          </>
           : 
           <>
           No hay galerias disponibles
           </>
           }
        </p>
        </div>
      )}
    </div>
  );
};

export default AgregarVideos;
