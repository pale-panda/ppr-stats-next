import { Timer, Gauge, TrendingUp, Trophy } from "lucide-react"

const stats = [
  {
    icon: Timer,
    value: "1:42.847",
    label: "Personal Best",
    sublabel: "Spa-Francorchamps",
  },
  {
    icon: Gauge,
    value: "287",
    label: "Top Speed",
    sublabel: "km/h",
  },
  {
    icon: TrendingUp,
    value: "24",
    label: "Sessions",
    sublabel: "This Season",
  },
  {
    icon: Trophy,
    value: "3",
    label: "Track Records",
    sublabel: "Held",
  },
]

export function StatsBar() {
  return (
    <section className="border-y border-border bg-card/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {stats.map((stat, index) => (
            <div key={index} className="py-6 px-4 md:px-6 text-center">
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-2xl md:text-3xl font-bold font-mono text-foreground">{stat.value}</p>
              <p className="text-sm text-foreground font-medium">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
