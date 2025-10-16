"use client";

import React from "react";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getVideos } from "@/lib/actions/general.actions";
import VideoCard from "@/components/VideoCard";

const AgregarVideos = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<any>([]);
  const [isAdmin, setIsAdmin] = useState(false);

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
    }
    fetchVideos();
  }, []);
  return (
    <div className="flex flex-col gap-3">
      {user?.role === "estudiante" ? (
        <Link href="/radioLifra/videos/agregarVideos">
          <CirclePlus />
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
        <p className="text-gray-500 text-center mt-4">
          No hay videos disponibles
        </p>
      )}
    </div>
  );
};

export default AgregarVideos;
