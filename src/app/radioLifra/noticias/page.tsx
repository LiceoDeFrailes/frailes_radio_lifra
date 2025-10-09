import React from 'react'
import { CirclePlus } from 'lucide-react';
import Link from 'next/link';

const RadioLifra = () => {
  return (
    <div className='flex flex-col gap-3'>
      
        <Link href='/radioLifra/noticias/agregarNoticia'>
          <CirclePlus/>
        </Link>
    </div>


      

    
  )
}

export default RadioLifra