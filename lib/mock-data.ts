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
  type: 'recognition' | 'reminder' | 'alert' | 'system'
  description: string
  severity: 'info' | 'success' | 'warning' | 'error'
}

export const scheduleItems: ScheduleItem[] = [
  { id: '1', time: '07:00', label: 'Morning Medication', type: 'medication', completed: true },
  { id: '2', time: '08:00', label: 'Breakfast', type: 'meal', completed: true },
  { id: '3', time: '10:30', label: 'Morning Walk', type: 'exercise', completed: true },
  { id: '4', time: '12:30', label: 'Lunch', type: 'meal', completed: false },
  { id: '5', time: '14:00', label: 'Medication — Blue Pill', type: 'medication', completed: false },
  { id: '6', time: '15:30', label: 'Physical Therapy', type: 'exercise', completed: false },
  { id: '7', time: '17:00', label: 'Family Call', type: 'other', completed: false },
  { id: '8', time: '18:30', label: 'Dinner', type: 'meal', completed: false },
  { id: '9', time: '20:00', label: 'Evening Medication', type: 'medication', completed: false },
  { id: '10', time: '21:30', label: 'Lights Out', type: 'other', completed: false },
]

export const facePeople: FacePerson[] = [
  { id: '1', name: 'Marcus Delacroix', relationship: 'Son', imageUrl: 'https://picsum.photos/seed/marcus/200/200' },
  { id: '2', name: 'Priya Anand', relationship: 'Home Nurse', imageUrl: 'https://picsum.photos/seed/priya/200/200' },
  { id: '3', name: 'Elena Vasquez', relationship: 'Daughter', imageUrl: 'https://picsum.photos/seed/elena/200/200' },
  { id: '4', name: 'Thomas Owusu', relationship: 'Son-in-law', imageUrl: 'https://picsum.photos/seed/thomas/200/200' },
  { id: '5', name: 'Isabelle Chen', relationship: 'Granddaughter', imageUrl: 'https://picsum.photos/seed/isabelle/200/200' },
  { id: '6', name: 'Raj Patel', relationship: 'Doctor', imageUrl: 'https://picsum.photos/seed/raj/200/200' },
  { id: '7', name: 'Nadia Fontaine', relationship: 'Neighbor', imageUrl: 'https://picsum.photos/seed/nadia/200/200' },
  { id: '8', name: 'Samuel Brooks', relationship: 'Grandson', imageUrl: 'https://picsum.photos/seed/samuel/200/200' },
  { id: '9', name: 'Aiko Tanaka', relationship: 'Therapist', imageUrl: 'https://picsum.photos/seed/aiko/200/200' },
  { id: '10', name: 'Laurent Moreau', relationship: 'Brother', imageUrl: 'https://picsum.photos/seed/laurent/200/200' },
  { id: '11', name: 'Grace Okafor', relationship: 'Sister', imageUrl: 'https://picsum.photos/seed/grace/200/200' },
  { id: '12', name: 'Diego Rivera', relationship: 'Caregiver', imageUrl: 'https://picsum.photos/seed/diego/200/200' },
  { id: '13', name: 'Mia Johansson', relationship: 'Granddaughter', imageUrl: 'https://picsum.photos/seed/mia/200/200' },
  { id: '14', name: 'Victor Nwosu', relationship: 'Friend', imageUrl: 'https://picsum.photos/seed/victor/200/200' },
]

export const activityLog: ActivityEvent[] = [
  {
    id: '1',
    timestamp: '10:34 AM',
    type: 'recognition',
    description: 'Recognized Marcus Delacroix — Son (confidence 98%)',
    severity: 'success',
  },
  {
    id: '2',
    timestamp: '10:30 AM',
    type: 'reminder',
    description: 'Morning Walk reminder delivered',
    severity: 'info',
  },
  {
    id: '3',
    timestamp: '09:12 AM',
    type: 'recognition',
    description: 'Recognized Priya Anand — Home Nurse (confidence 95%)',
    severity: 'success',
  },
  {
    id: '4',
    timestamp: '08:05 AM',
    type: 'reminder',
    description: 'Breakfast reminder delivered',
    severity: 'info',
  },
  {
    id: '5',
    timestamp: '07:58 AM',
    type: 'alert',
    description: 'Device battery at 22% — please charge soon',
    severity: 'warning',
  },
  {
    id: '6',
    timestamp: '07:02 AM',
    type: 'reminder',
    description: 'Morning Medication reminder delivered',
    severity: 'info',
  },
  {
    id: '7',
    timestamp: '06:45 AM',
    type: 'system',
    description: 'Device powered on — firmware v2.4.1',
    severity: 'info',
  },
  {
    id: '8',
    timestamp: 'Yesterday 8:10 PM',
    type: 'alert',
    description: 'Evening Medication reminder — no confirmation received',
    severity: 'error',
  },
  {
    id: '9',
    timestamp: 'Yesterday 6:21 PM',
    type: 'recognition',
    description: 'Unrecognized face detected — low confidence (31%)',
    severity: 'warning',
  },
  {
    id: '10',
    timestamp: 'Yesterday 3:00 PM',
    type: 'recognition',
    description: 'Recognized Elena Vasquez — Daughter (confidence 97%)',
    severity: 'success',
  },
  {
    id: '11',
    timestamp: 'Yesterday 2:15 PM',
    type: 'reminder',
    description: 'Afternoon Medication reminder delivered',
    severity: 'info',
  },
  {
    id: '12',
    timestamp: 'Yesterday 8:30 AM',
    type: 'system',
    description: 'Face gallery synced — 14 faces loaded',
    severity: 'info',
  },
]
