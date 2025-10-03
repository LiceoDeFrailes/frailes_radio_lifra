import React from 'react'
import { Button } from '@/components/ui/button'
import { CirclePlus } from 'lucide-react';
import Link from 'next/link';

const RadioLifra = () => {
  return (
    <div className='flex flex-col gap-3'>
      <CirclePlus>
        <Link href='/'></Link>
      </CirclePlus>
      <div>Noticias</div>
    </div>


      

    
  )
}

export default RadioLifra