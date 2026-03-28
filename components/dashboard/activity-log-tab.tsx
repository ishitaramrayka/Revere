'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { ActivityEvent } from '@/lib/dashboard-types'
import { CalendarLume } from '@/components/ui/calendar-lume'
import {
  ScanFace,
  BellRing,
  TriangleAlert,
  Settings2,
  CheckCircle2,
  Info,
  AlertCircle,
  XCircle,
  CalendarDays,
  Sparkles,
} from 'lucide-react'
import { format, isSameDay } from 'date-fns'

type ActivityLogTabProps = {
  events: ActivityEvent[]
}

const eventTypeConfig: Record<
  ActivityEvent['type'],
  { label: string; icon: React.ElementType; iconClass: string }
> = {
  recognition: {
    label: 'Recognition',
    icon: ScanFace,
    iconClass: 'text-primary',
  },
  reminder: {
    label: 'Reminder',
    icon: BellRing,
    iconClass: 'text-amber-500',
  },
  alert: {
    label: 'Alert',
    icon: TriangleAlert,
    iconClass: 'text-rose-500',
  },
  system: {
    label: 'System',
    icon: Settings2,
    iconClass: 'text-muted-foreground',
  },
}

const severityConfig: Record<
  ActivityEvent['severity'],
  { icon: React.ElementType; class: string; dot: string }
> = {
  success: {
    icon: CheckCircle2,
    class: 'text-emerald-600',
    dot: 'bg-emerald-500',
  },
  info: {
    icon: Info,
    class: 'text-primary',
    dot: 'bg-primary',
  },
  warning: {
    icon: AlertCircle,
    class: 'text-amber-500',
    dot: 'bg-amber-400',
  },
  error: {
    icon: XCircle,
    class: 'text-rose-500',
    dot: 'bg-rose-500',
  },
}

const filterLabels = ['All', 'Recognitions', 'Reminders', 'Alerts'] as const
type FilterLabel = (typeof filterLabels)[number]

const filterMap: Record<FilterLabel, ActivityEvent['type'] | null> = {
  All: null,
  Recognitions: 'recognition',
  Reminders: 'reminder',
  Alerts: 'alert',
}

export function ActivityLogTab({ events }: ActivityLogTabProps) {
  const [activeFilter, setActiveFilter] = useState<FilterLabel>('All')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const filtered = events.filter((event) => {
    const type = filterMap[activeFilter]
    const matchesType = !type || event.type === type
    const matchesDate = !selectedDate || isSameDay(new Date(event.occurredAt), selectedDate)
    return matchesType && matchesDate
  })

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8 animate-fade-up" style={{ animationDelay: '0ms' }}>
        <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-muted-foreground mb-1.5">
          Care Timeline
        </p>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
          Support History
        </h1>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
          A quiet record of recognitions, reminders, and device moments that may matter to care.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-8">
        <div>
          {/* Filter pills */}
          <div className="flex items-center gap-2 mb-6 flex-wrap animate-fade-up" style={{ animationDelay: '60ms' }}>
            {filterLabels.map((label) => (
              <button
                key={label}
                onClick={() => setActiveFilter(label)}
                className={cn(
                  'text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  activeFilter === label
                    ? 'bg-primary text-primary-foreground border-primary shadow-[0_2px_6px_-2px_rgba(0,0,0,0.15)]'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                )}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => setSelectedDate(undefined)}
              className={cn(
                'text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
                !selectedDate
                  ? 'bg-primary text-primary-foreground border-primary shadow-[0_2px_6px_-2px_rgba(0,0,0,0.15)]'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
              )}
            >
              All dates
            </button>
            <span className="ml-auto text-xs text-muted-foreground">
              {filtered.length} event{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {selectedDate ? (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground animate-fade-up">
              <CalendarDays className="w-3.5 h-3.5 text-primary" strokeWidth={1.9} />
              Showing {format(selectedDate, 'MMMM d, yyyy')}
            </div>
          ) : null}

          {/* Events list */}
          <div
            className="bg-card rounded-2xl border border-border shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] divide-y divide-border overflow-hidden animate-fade-up"
            style={{ animationDelay: '80ms' }}
          >
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Settings2 className="w-8 h-8 mx-auto mb-3 opacity-30" strokeWidth={1} />
                <p className="text-sm">No events match this date and category.</p>
              </div>
            ) : (
              filtered.map((event, index) => {
                const typeConf = eventTypeConfig[event.type]
                const sevConf = severityConfig[event.severity]
                const TypeIcon = typeConf.icon
                const SevIcon = sevConf.icon

                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 px-5 py-4 hover:bg-muted/40 transition-colors duration-150 animate-fade-up"
                    style={{ animationDelay: `${100 + index * 40}ms` }}
                  >
                    {/* Severity dot + type icon */}
                    <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
                      <div className={cn('w-7 h-7 rounded-lg bg-muted flex items-center justify-center', typeConf.iconClass)}>
                        <TypeIcon className="w-3.5 h-3.5" strokeWidth={1.75} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm text-foreground leading-relaxed">
                          {event.description}
                        </p>
                        <SevIcon
                          className={cn('w-4 h-4 shrink-0 mt-0.5', sevConf.class)}
                          strokeWidth={1.75}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {event.timestamp}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-[11px] text-muted-foreground">
                          {typeConf.label}
                        </span>
                        <span className={cn('w-1.5 h-1.5 rounded-full ml-auto', sevConf.dot)} />
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '70ms' }}>
          <div className="xl:sticky xl:top-8">
            <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] font-medium text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary" strokeWidth={1.9} />
              Date Filter
            </div>
            <div className="flex items-center justify-center">
              <CalendarLume selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Use the calendar to focus on one day at a time when reviewing reminders, recognition moments, or changes in routine.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
