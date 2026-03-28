'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type StatCardProps = {
  label: string
  value: number
  maxValue: number
  className?: string
  style?: React.CSSProperties
}

export function StatCard({ label, value, maxValue, className, style }: StatCardProps) {
  const [barWidth, setBarWidth] = useState(0)
  const percentage = Math.round((value / maxValue) * 100)

  useEffect(() => {
    // Trigger bar animation after mount
    const timer = setTimeout(() => setBarWidth(percentage), 120)
    return () => clearTimeout(timer)
  }, [percentage])

  return (
    <div
      className={cn(
        'bg-card rounded-2xl border border-border p-6 flex flex-col gap-5',
        'shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]',
        'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_-6px_rgba(0,0,0,0.10)]',
        className
      )}
      style={style}
    >
      <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-muted-foreground">
        {label}
      </p>

      <span className="font-mono text-5xl font-light tabular-nums text-primary leading-none">
        {value}
      </span>

      {/* Teal progress bar */}
      <div className="h-0.5 w-full bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  )
}
