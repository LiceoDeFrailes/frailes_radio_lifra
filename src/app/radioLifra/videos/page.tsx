"use client";

import React from 'react'
import { CirclePlus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const AgregarVideos = () => {
  const { user } = useAuth();
  return (
    <div className='flex flex-col gap-3'>
      
      {user?.role === "estudiante" ? 
      <Link href='/radioLifra/videos/agregarVideos'>
        <CirclePlus/>
      </Link>
      : 
      null
      }
        
    </div>


      

    
  )
}

export default AgregarVideos