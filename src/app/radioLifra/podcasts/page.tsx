"use client";

import React from "react";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getPodcasts } from "@/lib/actions/general.actions";
import PodcastCard from "@/components/PodcastCard";
import { Spinner } from "@/components/ui/spinner";

const PodcastPage = () => {
  const { user } = useAuth();
  const [podcasts, setPodcasts] = useState<any>([]);
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
    async function fetchPodcasts() {
      const podcastsCollection = await getPodcasts();
      setPodcasts(podcastsCollection);
      setLoading(false);
    }
    fetchPodcasts();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {user?.role === "estudiante" ? (
        <Link href="/radioLifra/podcasts/agregarPodcast">
          <CirclePlus className="hover:text-Light-Green-Lifra" />
        </Link>
      ) : null}

      {podcasts.length > 0 ? (
        podcasts.map((p: any) => (
          <PodcastCard
            key={p.id}
            item={p}
            validationMode={false}
            isAdmin={isAdmin}
          />
        ))
      ) : (
        <div className="flex justify-center items-center mt-20">
          {loading && <Spinner className="w-8 h-8 text-Light-Green-Lifra" />}
          <p className="text-gray-500 text-center">
            {loading ? (
              <>Cargando publicaciones...</>
            ) : (
              <>No hay podcasts disponibles</>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default PodcastPage;
