// components/UI/FeatureCard.tsx
import { Card, CardContent } from '@/components/ui/card'

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  delay?: number
}

export default function FeatureCard({ 
  icon, 
  title, 
  description, 
  delay = 0 
}: FeatureCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
      <CardContent className="p-8 text-center">
        <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}