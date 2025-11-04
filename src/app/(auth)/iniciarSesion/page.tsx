'use client'
import React from 'react'
import Image from 'next/image';
import AuthForm from '@/components/AuthForm'
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  return (
      <div className='min-h-screen flex flex-col items-center 
      justify-center gap-10'>
        <Image src='/LogoRadioLifraProducciones.png' height={150} 
        width={150} alt='LogoRadioLifra'
        onClick={() => {router.push('/radioLifra')}}/>
        <AuthForm/>
      </div>
    
  )
}

export default Page