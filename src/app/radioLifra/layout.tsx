import Footer from '@/components/Layout/Footer'
import HeaderRadioLifra  from '@/components/Layout/HeaderRadioLifra'
import { Button } from '@/components/ui/button'

export default function RadioLifraLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className=''>
        <HeaderRadioLifra/>
        <main className='mx-15 mt-5'>{children}</main>
        <Footer/>
    </div>
  );
}
