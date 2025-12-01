import { cn } from "@/lib/utils"
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  iconColor?: string
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-primary",
}: StatsCardProps) {
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10",
            iconColor
              .replace("text-", "bg-")
              .replace("primary", "primary/10")
              .replace("accent", "accent/10")
              .replace("chart-3", "chart-3/10"),
          )}
        >
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
        {change && (
          <div
            className={cn(
              "flex items-center gap-1 text-sm font-medium",
              changeType === "positive" && "text-green-500",
              changeType === "negative" && "text-red-500",
              changeType === "neutral" && "text-muted-foreground",
            )}
          >
            {changeType === "positive" && <TrendingUp className="h-4 w-4" />}
            {changeType === "negative" && <TrendingDown className="h-4 w-4" />}
            {change}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  )
}
