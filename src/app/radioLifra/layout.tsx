import Footer from '@/components/Layout/Footer'
import HeaderRadioLifra  from '@/components/Layout/HeaderRadioLifra'
export default function RadioLifraLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className=''>
        <HeaderRadioLifra/>
        <main>{children}</main>
        <Footer/>
    </div>
  );
}
