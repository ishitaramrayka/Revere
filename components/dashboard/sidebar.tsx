'use client'

import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ScrollText,
  Wifi,
} from 'lucide-react'

type Tab = 'overview' | 'gallery' | 'schedule' | 'activity'

const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'gallery', label: 'Face Gallery', icon: Users },
  { id: 'schedule', label: 'Schedule', icon: CalendarDays },
  { id: 'activity', label: 'Activity Log', icon: ScrollText },
]

type SidebarProps = {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-card md:flex">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-border">
        <div>
          <span className="text-xl font-serif tracking-wide text-foreground select-none">
            Re<span className="text-primary">v</span>ere
          </span>
          <p className="mt-1 text-[11px] text-muted-foreground">
            One patient, one familiar support space
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 pt-4 flex-1">
        <p className="px-3 pb-1 text-[10px] uppercase tracking-[0.12em] font-medium text-muted-foreground">
          Dashboard
        </p>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] w-full text-left',
                isActive
                  ? 'bg-accent text-accent-foreground font-medium border-l-2 border-primary pl-[10px]'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground border-l-2 border-transparent'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors duration-200',
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                )}
                strokeWidth={isActive ? 2 : 1.75}
              />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Device status */}
      <div className="px-4 py-4 border-t border-border m-3 rounded-xl bg-muted">
        <p className="text-[10px] uppercase tracking-[0.12em] font-medium text-muted-foreground mb-2">
          Glasses Status
        </p>
        <div className="flex items-center gap-2 mb-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-medium text-foreground">Device Online</span>
        </div>
        <p className="text-[11px] text-muted-foreground pl-4 leading-relaxed">
          Last sync: 2 min ago
        </p>
        <div className="flex items-center gap-1.5 pl-4 mt-1">
          <Wifi className="w-3 h-3 text-muted-foreground" strokeWidth={1.75} />
          <span className="text-[11px] text-muted-foreground">firmware v2.4.1</span>
        </div>
        <p className="text-[11px] text-muted-foreground pl-4 mt-2 leading-relaxed">
          Ready to surface familiar-face cues and gentle routine prompts.
        </p>
      </div>
    </aside>
  )
}

// Mobile bottom navigation
export function BottomNav({ activeTab, onTabChange }: SidebarProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur border-t border-border flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.id
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              'flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 flex-1',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Icon
              className="w-5 h-5"
              strokeWidth={isActive ? 2 : 1.75}
            />
            <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
          </button>
        )
      })}
    </nav>
  )
}
