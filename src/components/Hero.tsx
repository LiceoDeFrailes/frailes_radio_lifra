// components/UI/Hero.tsx
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface HeroProps {
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  secondaryText?: string
  secondaryLink?: string
}

export default function Hero({ 
  title, 
  subtitle, 
  ctaText, 
  ctaLink, 
  secondaryText, 
  secondaryLink 
}: HeroProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary to-primary/90">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      
      <div className="relative container mx-auto px-4 text-center text-primary-foreground">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            {title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/80 leading-relaxed">
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-base">
              <Link href={ctaLink}>
                {ctaText}
              </Link>
            </Button>
            
            {secondaryText && secondaryLink && (
              <Button size="lg" variant="outline" asChild className="text-black">
                <Link href={secondaryLink}>
                  {secondaryText}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-foreground/50 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  )
}