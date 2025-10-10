import Footer from '@/components/Layout/Footer'
import HeaderRadioLifra  from '@/components/Layout/HeaderRadioLifra'

export default function RadioLifraLayout({ children }: { children: React.ReactNode }) {

  return (
    <div >
        <HeaderRadioLifra/>
        <main className='mx-15 my-5'>{children}</main>
        <Footer/>
    </div>
  );
}
