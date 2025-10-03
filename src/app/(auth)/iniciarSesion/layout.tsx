import Footer from '@/components/Layout/Footer'
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className=''>
        <main>{children}</main>
        <Footer/>
    </div>
  );
}