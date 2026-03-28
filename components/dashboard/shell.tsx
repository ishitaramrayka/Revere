'use client'

import { useCallback, useState } from 'react'
import type { DashboardSnapshot, ScheduleItem } from '@/lib/dashboard-types'
import { Sidebar, BottomNav } from './sidebar'
import { OverviewTab } from './overview-tab'
import { FaceGalleryTab } from './face-gallery-tab'
import { ScheduleTab } from './schedule-tab'
import { ActivityLogTab } from './activity-log-tab'

type Tab = 'overview' | 'gallery' | 'schedule' | 'activity'

type DashboardShellProps = {
  initialData: DashboardSnapshot
}

export function DashboardShell({ initialData }: DashboardShellProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [data, setData] = useState(initialData)

  const patchScheduleItem = useCallback(async (id: string, completed: boolean) => {
    const res = await fetch(`/api/schedule/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    })
    if (!res.ok) return
    const next: DashboardSnapshot = await res.json()
    setData(next)
  }, [])

  const addReminder = useCallback(
    async (input: { time: string; label: string; type: ScheduleItem['type'] }) => {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      let payload: (DashboardSnapshot & { error?: string }) | null = null
      try {
        payload = (await res.json()) as DashboardSnapshot & { error?: string }
      } catch {
        return { ok: false as const, error: 'Could not add reminder.' }
      }
      if (!res.ok) {
        return {
          ok: false as const,
          error: typeof payload?.error === 'string' ? payload.error : 'Could not add reminder.',
        }
      }
      if (!payload?.schedule) {
        return { ok: false as const, error: 'Invalid response from server.' }
      }
      setData({
        schedule: payload.schedule,
        faces: payload.faces,
        activity: payload.activity,
        remindersToday: payload.remindersToday,
      })
      return { ok: true as const }
    },
    []
  )

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 md:pb-0 md:ml-60">
        {/* Top bar (mobile) */}
        <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-5 py-4 border-b border-border bg-card/95 backdrop-blur">
          <span className="text-lg font-serif tracking-wide text-foreground select-none">
            Re<span className="text-primary">v</span>ere
          </span>
        </header>

        {/* Content area */}
        <div className="flex-1 px-6 py-8 md:px-10 md:py-10 animate-fade-up">
          {activeTab === 'overview' && (
            <OverviewTab
              schedule={data.schedule}
              remindersToday={data.remindersToday}
              facesLoaded={data.faces.length}
            />
          )}
          {activeTab === 'gallery' && <FaceGalleryTab people={data.faces} />}
          {activeTab === 'schedule' && (
            <ScheduleTab
              schedule={data.schedule}
              onToggleComplete={patchScheduleItem}
              onAddReminder={addReminder}
            />
          )}
          {activeTab === 'activity' && <ActivityLogTab events={data.activity} />}
        </div>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
