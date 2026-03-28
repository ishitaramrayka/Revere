'use client'

import { cn } from '@/lib/utils'
import { StatCard } from './stat-card'
import type { ScheduleItem } from '@/lib/dashboard-types'
import { ArrowRight, Pill, Utensils, Dumbbell, Calendar, HeartHandshake, Clock3 } from 'lucide-react'

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
  const incomplete = schedule.filter((s) => !s.completed)
  // Prefer next incomplete items so new reminders aren’t hidden behind earlier completed rows
  const displayItems =
    incomplete.length > 0 ? incomplete.slice(0, 6) : schedule.slice(0, 6)
  const completedCount = schedule.filter((s) => s.completed).length
  const totalCount = schedule.length
  const nextReminder = incomplete[0] ?? schedule[0] ?? null

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8 animate-fade-up" style={{ animationDelay: '0ms' }}>
        <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-muted-foreground mb-1.5">
          Caregiver Companion
        </p>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight text-balance">
          Reassurance for everyday moments
        </h1>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
          Track familiar faces, gentle routine support, and the moments that help your loved one feel oriented.
        </p>
      </div>

      {/* Stat cards */}
      <div
        className="grid grid-cols-2 gap-4 mb-8 animate-fade-up"
        style={{ animationDelay: '60ms' }}
      >
        <StatCard
          label="Routine Support"
          value={remindersToday}
          maxValue={10}
          hint={
            remindersToday === 0
              ? 'Today looks calm right now.'
              : `${completedCount} of ${totalCount} reminders have already been handled.`
          }
        />
        <StatCard
          label="Familiar Faces"
          value={facesLoaded}
          maxValue={16}
          hint={
            facesLoaded === 0
              ? 'Add loved ones and trusted people the glasses should help identify.'
              : 'These are the people the glasses can help the patient recognize.'
          }
        />
      </div>

      <div
        className="mb-8 grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-4 animate-fade-up"
        style={{ animationDelay: '100ms' }}
      >
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-2 text-foreground">
            <HeartHandshake className="w-4 h-4 text-primary" strokeWidth={1.9} />
            <h2 className="text-sm font-medium">Support Snapshot</h2>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Keep the dashboard focused on the people, reminders, and reassuring cues that reduce confusion during the day.
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/60 px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Recognize</p>
              <p className="mt-1 text-sm text-foreground">Add family and trusted visitors.</p>
            </div>
            <div className="rounded-xl bg-muted/60 px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Guide</p>
              <p className="mt-1 text-sm text-foreground">Keep routines simple and visible.</p>
            </div>
            <div className="rounded-xl bg-muted/60 px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Reassure</p>
              <p className="mt-1 text-sm text-foreground">Use activity updates to spot patterns early.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-2 text-foreground">
            <Clock3 className="w-4 h-4 text-primary" strokeWidth={1.9} />
            <h2 className="text-sm font-medium">Next Focus</h2>
          </div>
          {nextReminder ? (
            <>
              <p className="mt-3 font-mono text-xl text-primary">{nextReminder.time}</p>
              <p className="mt-1 text-sm font-medium text-foreground">{nextReminder.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                A single clear reminder can help the patient stay oriented without overwhelming them.
              </p>
            </>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              No reminders yet. Add one gentle anchor for the day, like a meal, medication, or family check-in.
            </p>
          )}
        </div>
      </div>

      <div className="mb-8">
        {/* Today's schedule */}
        <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[10px] uppercase tracking-[0.14em] font-medium text-muted-foreground">
              Gentle Routine
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
    </div>
  )
}
