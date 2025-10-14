import React, { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Check, Trash2 } from 'lucide-react'
import { rechazarNoticia } from '@/lib/actions/general.actions'
import { toast } from 'sonner'
import { aceptarNoticia } from '@/lib/actions/general.actions'

const NoticiaCard = ({item, validationMode=false}: any) => {
const [visible, setVisible] = useState(true);


    const handleAceptar = async () => {
        try {
            await aceptarNoticia(item.id);
            toast.success("Noticia Aprobada");
            setVisible(false);
        } catch (error) {
            console.log('Ocurrio un Error', error)
            toast.error('Ocurrio un Error')
        }
    }

    const handleRechazar = async ()  => {
        try {
            await rechazarNoticia(item.id, item.imageUrl)
            toast.error("Noticia Eliminada");
            setVisible(false);
        } catch (error) {
            console.log('Ocurrio un Error', error)
            toast.error('Ocurrio un Error')
        }
    }
  return (
    <Link href='/' about=''>
        <Card className='flex flex-col md:flex-row-reverse justify-center items-center px-3 md:py-3 gap-3'>
            {/* Contenedor de imagen + botones (solo en md y superior) */}
            <div className='flex flex-col gap-2 '>
                <Image src={item?.imageUrl} 
                height={250} 
                width={260} 
                alt='Foto de Liceo'
                className='rounded-2xl max-h-[250] max-w-[260] lg:min-h-[150] lg:min-w-[250] lg:max-h-[200] lg:max-w-[300]'/>
                
                {/* Botones debajo de la imagen SOLO en md y superior */}
                <div className='hidden md:flex gap-2 justify-end mt-2'>
                    <Button className='bg-transparent'>
                        <Check className='text-black size-5'/>
                    </Button>
                    <Button className='bg-transparent'>
                        <Trash2 className='text-black size-5'/>
                    </Button>
                </div>
            </div>
            
            <div className='flex flex-col gap-1 mx-2'>
                <p className='text-2xl font-bold'>{item?.title}</p>
                <p className='max-h-[150] overflow-y-auto px-1.5'>
                    {item?.description}
                </p>
                
                {/* Botones debajo del texto SOLO en móvil */}
                <div className='flex gap-2 justify-center mt-2 md:hidden ml-auto mr-2'>
                    <Button className='bg-transparent' onClick={(e) => {
                  e.preventDefault();
                  handleAceptar();
                }}>
                        <Check className='text-black size-5'/>
                    </Button>
                    <Button className='bg-transparent' onClick={(e) => {
                  e.preventDefault();
                  handleRechazar();
                }}>
                        <Trash2 className='text-black size-5'/>
                    </Button>
                </div>
            </div>
        </Card>
    </Link>
  )
}

export default NoticiaCard