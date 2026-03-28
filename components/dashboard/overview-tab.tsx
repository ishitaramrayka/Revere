'use client'

import { cn } from '@/lib/utils'
import { StatCard } from './stat-card'
import type { ScheduleItem } from '@/lib/mock-data'
import { ArrowRight, Pill, Utensils, Dumbbell, Calendar } from 'lucide-react'

type OverviewTabProps = {
  schedule: ScheduleItem[]
  remindersToday: number
  facesLoaded: number
}

const typeConfig: Record<
  ScheduleItem['type'],
  { label: string; icon: React.ElementType; color: string }
> = {
  meal: { label: 'Meal', icon: Utensils, color: 'text-amber-500' },
  medication: { label: 'Medication', icon: Pill, color: 'text-primary' },
  exercise: { label: 'Exercise', icon: Dumbbell, color: 'text-emerald-600' },
  other: { label: 'Other', icon: Calendar, color: 'text-muted-foreground' },
}

export function OverviewTab({ schedule, remindersToday, facesLoaded }: OverviewTabProps) {
  // Show today's upcoming + recent items, max 6
  const displayItems = schedule.slice(0, 6)
  const completedCount = schedule.filter((s) => s.completed).length
  const totalCount = schedule.length

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8 animate-fade-up" style={{ animationDelay: '0ms' }}>
        <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-muted-foreground mb-1.5">
          Caregiver Dashboard
        </p>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight text-balance">
          Good morning, Caregiver
        </h1>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
          {completedCount} of {totalCount} reminders completed today.
        </p>
      </div>

      {/* Stat cards */}
      <div
        className="grid grid-cols-2 gap-4 mb-8 animate-fade-up"
        style={{ animationDelay: '60ms' }}
      >
        <StatCard
          label="Reminders Today"
          value={remindersToday}
          maxValue={10}
        />
        <StatCard
          label="Faces Loaded"
          value={facesLoaded}
          maxValue={16}
        />
      </div>

      {/* Today's schedule */}
      <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[10px] uppercase tracking-[0.14em] font-medium text-muted-foreground">
            Today&apos;s Schedule
          </h2>
          <button className="flex items-center gap-1 text-xs text-primary hover:opacity-70 transition-opacity duration-200">
            View all
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] divide-y divide-border">
          {displayItems.map((item, index) => {
            const config = typeConfig[item.type]
            const Icon = config.icon
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 px-5 py-3.5 animate-fade-up"
                style={{ animationDelay: `${150 + index * 60}ms` }}
              >
                {/* Status dot */}
                <span
                  className={cn(
                    'w-2 h-2 rounded-full shrink-0 transition-colors duration-200',
                    item.completed
                      ? 'bg-primary'
                      : 'bg-border ring-2 ring-inset ring-border'
                  )}
                />

                {/* Time */}
                <span className="font-mono text-xs text-muted-foreground w-11 shrink-0">
                  {item.time}
                </span>

                {/* Label */}
                <span
                  className={cn(
                    'flex-1 text-sm leading-relaxed',
                    item.completed
                      ? 'text-muted-foreground line-through decoration-muted-foreground/40'
                      : 'text-foreground'
                  )}
                >
                  {item.label}
                </span>

                {/* Type icon */}
                <Icon
                  className={cn('w-3.5 h-3.5 shrink-0', config.color, item.completed && 'opacity-40')}
                  strokeWidth={1.75}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
