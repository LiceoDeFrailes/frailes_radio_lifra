import React from 'react'
import Image from 'next/image';
import AuthForm from '@/components/AuthForm'

const Page = () => {
  return (
      <div className='min-h-screen flex flex-col items-center 
      justify-center gap-10'>
        <Image src='/LogoRadioLifra.png' height={150} 
        width={150} alt='LogoRadioLifra'/>
        <AuthForm/>



      </div>
    
  )
}

export default Page