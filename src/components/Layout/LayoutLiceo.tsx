import Header from './Header'
import Footer from './Footer'



export default function LayoutLiceo({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}