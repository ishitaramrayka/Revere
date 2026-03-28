export type ScheduleItem = {
  id: string
  time: string
  label: string
  type: 'meal' | 'medication' | 'exercise' | 'other'
  completed: boolean
}

export type FacePerson = {
  id: string
  name: string
  relationship: string
  imageUrl: string
}

export type ActivityEvent = {
  id: string
  timestamp: string
  occurredAt: string
  type: 'recognition' | 'reminder' | 'alert' | 'system'
  description: string
  severity: 'info' | 'success' | 'warning' | 'error'
}

/** Payload from GET /api/dashboard and server page props */
export type DashboardSnapshot = {
  schedule: ScheduleItem[]
  faces: FacePerson[]
  activity: ActivityEvent[]
  remindersToday: number
}
