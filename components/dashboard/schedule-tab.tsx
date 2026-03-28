'use client'

import { useState, type FormEvent } from 'react'
import { cn } from '@/lib/utils'
import type { ScheduleItem } from '@/lib/dashboard-types'
import { Plus, GripVertical, Pill, Utensils, Dumbbell, Calendar, ChevronDown, SunMedium, HeartHandshake } from 'lucide-react'

type ScheduleTabProps = {
  schedule: ScheduleItem[]
  onToggleComplete?: (id: string, completed: boolean) => void | Promise<void>
  onAddReminder?: (input: {
    time: string
    label: string
    type: ScheduleItem['type']
  }) => Promise<{ ok: boolean; error?: string }>
}

const typeConfig: Record<
  ScheduleItem['type'],
  { label: string; icon: React.ElementType; badgeClass: string }
> = {
  meal: {
    label: 'Meal',
    icon: Utensils,
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-100',
  },
  medication: {
    label: 'Medication',
    icon: Pill,
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-100',
  },
  exercise: {
    label: 'Exercise',
    icon: Dumbbell,
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  other: {
    label: 'Other',
    icon: Calendar,
    badgeClass: 'bg-stone-50 text-stone-600 border-stone-100',
  },
}

const filterTypes = ['All', 'Meal', 'Medication', 'Exercise', 'Other'] as const
type FilterType = (typeof filterTypes)[number]

export function ScheduleTab({ schedule, onToggleComplete, onAddReminder }: ScheduleTabProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newType, setNewType] = useState<ScheduleItem['type']>('meal')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const resetForm = () => {
    setNewLabel('')
    setNewTime('')
    setNewType('meal')
    setFormError(null)
  }

  const closeForm = () => {
    setShowAddForm(false)
    resetForm()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!onAddReminder) {
      setFormError('Saving is not available.')
      return
    }
    const label = newLabel.trim()
    if (!label) {
      setFormError('Enter a name for this reminder.')
      return
    }
    if (!newTime) {
      setFormError('Choose a time.')
      return
    }
    setIsSaving(true)
    try {
      const result = await onAddReminder({
        time: newTime,
        label,
        type: newType,
      })
      if (!result.ok) {
        setFormError(result.error ?? 'Could not save reminder.')
        return
      }
      setActiveFilter('All')
      closeForm()
    } finally {
      setIsSaving(false)
    }
  }

  const filtered = schedule.filter((item) => {
    if (activeFilter === 'All') return true
    return typeConfig[item.type].label === activeFilter
  })

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-fade-up" style={{ animationDelay: '0ms' }}>
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-muted-foreground mb-1.5">
            Daily Support Plan
          </p>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Gentle Routine Builder
          </h1>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {schedule.length} cue{schedule.length === 1 ? '' : 's'} set up to help the day feel predictable.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (showAddForm) {
              closeForm()
            } else {
              resetForm()
              const now = new Date()
              setNewTime(
                `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
              )
              setShowAddForm(true)
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.15)] shrink-0"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          Add Cue
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-up" style={{ animationDelay: '30ms' }}>
        <div className="rounded-2xl border border-border bg-card px-4 py-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-2 text-foreground">
            <SunMedium className="w-4 h-4 text-primary" strokeWidth={1.9} />
            <p className="text-sm font-medium">Keep cues simple</p>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Short reminders for meals, medication, visits, and rest tend to be easier to follow at a glance.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card px-4 py-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-2 text-foreground">
            <HeartHandshake className="w-4 h-4 text-primary" strokeWidth={1.9} />
            <p className="text-sm font-medium">Designed for calm support</p>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            The goal is gentle orientation, not constant alerts. Add only the moments that truly help.
          </p>
        </div>
      </div>

      {/* Add form — inline slide down */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
          showAddForm ? 'max-h-[28rem] mb-5 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl border border-border shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] p-5"
        >
          <p className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-[0.12em]">
            New Support Cue
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="sr-only" htmlFor="schedule-new-time">
                Time
              </label>
              <input
                id="schedule-new-time"
                type="time"
                required
                value={newTime}
                onChange={(e) => {
                  setNewTime(e.target.value)
                  setFormError(null)
                }}
                className="font-mono text-sm px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 w-full sm:w-32 shrink-0"
              />
              <label className="sr-only" htmlFor="schedule-new-label">
                Reminder name
              </label>
              <input
                id="schedule-new-label"
                type="text"
                placeholder="e.g. Afternoon tea with Maya"
                value={newLabel}
                onChange={(e) => {
                  setNewLabel(e.target.value)
                  setFormError(null)
                }}
                autoComplete="off"
                className="text-sm px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 flex-1"
              />
              <div className="relative shrink-0 sm:min-w-[140px]">
                <label className="sr-only" htmlFor="schedule-new-type">
                  Type
                </label>
                <select
                  id="schedule-new-type"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as ScheduleItem['type'])}
                  className="appearance-none text-sm px-3 py-2 pr-7 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 w-full"
                >
                  <option value="meal">Meal</option>
                  <option value="medication">Medication</option>
                  <option value="exercise">Exercise</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <button
                type="button"
                onClick={closeForm}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:bg-muted/50 transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !onAddReminder}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-all shrink-0 disabled:opacity-60 order-1 sm:order-2"
              >
                {isSaving ? 'Saving…' : 'Save cue'}
              </button>
            </div>
            {formError && (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 mb-5 flex-wrap animate-fade-up" style={{ animationDelay: '60ms' }}>
        {filterTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={cn(
              'text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
              activeFilter === type
                ? 'bg-primary text-primary-foreground border-primary shadow-[0_2px_6px_-2px_rgba(0,0,0,0.15)]'
                : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
            )}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground animate-fade-up">
          <Calendar className="w-8 h-8 mx-auto mb-3 opacity-30" strokeWidth={1} />
          <p className="text-sm">No reminders in this category.</p>
        </div>
      ) : (
        <div className="relative animate-fade-up" style={{ animationDelay: '80ms' }}>
          {/* Vertical line */}
          <div className="absolute left-[52px] top-4 bottom-4 w-px bg-border" />

          <div className="flex flex-col gap-2">
            {filtered.map((item, index) => {
              const config = typeConfig[item.type]
              const Icon = config.icon
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 group animate-fade-up"
                  style={{ animationDelay: `${100 + index * 50}ms` }}
                >
                  {/* Time */}
                  <span className="font-mono text-xs text-muted-foreground w-11 text-right shrink-0">
                    {item.time}
                  </span>

                  {/* Timeline dot */}
                  <div className="relative z-10 shrink-0">
                    <span
                      className={cn(
                        'block w-2.5 h-2.5 rounded-full border-2 transition-colors duration-200',
                        item.completed
                          ? 'bg-primary border-primary'
                          : 'bg-card border-border group-hover:border-primary/50'
                      )}
                    />
                  </div>

                  {/* Event card */}
                  <button
                    type="button"
                    disabled={!onToggleComplete}
                    onClick={() => onToggleComplete?.(item.id, !item.completed)}
                    className={cn(
                      'flex-1 flex items-center justify-between px-4 py-3 rounded-xl border bg-card text-left',
                      'shadow-[0_1px_4px_-2px_rgba(0,0,0,0.05)]',
                      'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      'hover:-translate-y-px hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)]',
                      item.completed ? 'border-border/50 opacity-60' : 'border-border',
                      onToggleComplete && 'cursor-pointer',
                      !onToggleComplete && 'cursor-default'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          'w-3.5 h-3.5 shrink-0',
                          item.completed ? 'text-muted-foreground' : 'text-primary'
                        )}
                        strokeWidth={1.75}
                      />
                      <span
                        className={cn(
                          'text-sm',
                          item.completed
                            ? 'text-muted-foreground line-through decoration-muted-foreground/40'
                            : 'text-foreground'
                        )}
                      >
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'text-[10px] font-medium px-2 py-0.5 rounded-full border',
                          config.badgeClass
                        )}
                      >
                        {config.label}
                      </span>
                      <GripVertical
                        className="w-4 h-4 text-muted-foreground/40 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                        strokeWidth={1.75}
                      />
                    </div>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
