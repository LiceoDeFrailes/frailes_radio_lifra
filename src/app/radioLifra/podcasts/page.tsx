"use client";

import React from 'react'
import { CirclePlus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { getPodcasts } from '@/lib/actions/general.actions';
import PodcastCard from '@/components/PodcastCard'

const PodcastPage = () => {
  const { user } = useAuth();
  const [podcasts, setPodcasts] = useState<any>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
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
      }
      fetchPodcasts();
    }, []);

  return (
    <div className='flex flex-col gap-3'>
      
      {user?.role === "estudiante" ? 
      <Link href='/radioLifra/podcasts/agregarPodcast'>
        <CirclePlus/>
      </Link>
      : 
      null
      }

            {podcasts.length > 0 ? (
        podcasts.map((p: any) => (
          <PodcastCard key={p.id} item={p} validationMode={false} isAdmin={isAdmin} />
        ))
      ) : (
        <p className="text-gray-500 text-center mt-4">
          No hay podcasts disponibles
        </p>
      )}
        
    </div>


      

    
  )
}

export default PodcastPage