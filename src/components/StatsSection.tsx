"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

export default function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <MotionCard
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center border-0 shadow-lg"
            >
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </CardContent>
            </MotionCard>
          ))}
        </div>
      </div>
    </section>
  );
}
