// components/UI/StatsSection.tsx
import { Card, CardContent } from '@/components/ui/card'

interface Stat {
  number: string
  label: string
}

interface StatsSectionProps {
  stats: Stat[]
}

export default function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={stat.label} className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div 
                  className="text-3xl font-bold text-primary mb-2"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.6s ease-out both'
                  } as React.CSSProperties}
                >
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}