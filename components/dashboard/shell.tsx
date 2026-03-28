'use client'

import { useState } from 'react'
import { Sidebar, BottomNav } from './sidebar'
import { OverviewTab } from './overview-tab'
import { FaceGalleryTab } from './face-gallery-tab'
import { ScheduleTab } from './schedule-tab'
import { ActivityLogTab } from './activity-log-tab'
import { scheduleItems, facePeople, activityLog } from '@/lib/mock-data'

type Tab = 'overview' | 'gallery' | 'schedule' | 'activity'

export function DashboardShell() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  return (
    <div className="flex min-h-[100dvh] bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        {/* Top bar (mobile) */}
        <header className="md:hidden flex items-center gap-3 px-5 py-4 border-b border-border bg-card">
          <span className="text-lg font-serif tracking-wide text-foreground select-none">
            Re<span className="text-primary">v</span>ere
          </span>
        </header>

        {/* Content area */}
        <div className="flex-1 px-6 py-8 md:px-10 md:py-10 animate-fade-up">
          {activeTab === 'overview' && (
            <OverviewTab schedule={scheduleItems} remindersToday={6} facesLoaded={facePeople.length} />
          )}
          {activeTab === 'gallery' && (
            <FaceGalleryTab people={facePeople} />
          )}
          {activeTab === 'schedule' && (
            <ScheduleTab schedule={scheduleItems} />
          )}
          {activeTab === 'activity' && (
            <ActivityLogTab events={activityLog} />
          )}
        </div>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
