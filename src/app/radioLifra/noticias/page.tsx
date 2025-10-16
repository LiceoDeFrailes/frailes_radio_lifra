"use client";

import React from 'react'
import { CirclePlus, RollerCoaster } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import NoticiaCard from '@/components/NoticiaCard';
import { useEffect, useState } from 'react';
import { getNoticias } from '@/lib/actions/general.actions';

const AgregarNoticia = () => {
  const { user } = useAuth();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (user?.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);
  useEffect(() => {
    async function fetchNoticias(){
      const noticiasCollection = await getNoticias();
      setNoticias(noticiasCollection);
    } 
    fetchNoticias();
  },[])
  return (
    <div className='flex flex-col gap-3'>
      
      {user?.role === "estudiante" ? 
      <Link href='/radioLifra/noticias/agregarNoticia'>
        <CirclePlus/>
      </Link>
      : 
      null
      }

      {noticias.map((noticia: Noticia) => {
        return <NoticiaCard key={noticia.id} item={noticia} isAdmin={isAdmin}/>
      })}
        
    </div>


      

    
  )
}

export default AgregarNoticia