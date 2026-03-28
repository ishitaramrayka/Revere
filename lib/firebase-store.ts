import { Timestamp } from 'firebase-admin/firestore'
import { getAdminDb, getFirebasePatientId } from './firebase-admin'
import type { ActivityEvent, DashboardSnapshot, FacePerson, ScheduleItem } from './dashboard-types'

type FaceDoc = {
  name: string
  relationship: string
  imageUrl: string
  createdAt: Timestamp
}

type ScheduleDoc = {
  time: string
  label: string
  type: ScheduleItem['type']
  completed: boolean
  createdAt: Timestamp
}

type ActivityDoc = {
  timestamp: string
  occurredAt: Timestamp
  type: ActivityEvent['type']
  description: string
  severity: ActivityEvent['severity']
  createdAt: Timestamp
}

type AddFaceInput = {
  name: string
  relationship: string
  imageUrl: string
}

type NewScheduleInput = {
  time: string
  label: string
  type: ScheduleItem['type']
}

const DEFAULT_REMINDER: Omit<ScheduleItem, 'id'> = {
  time: '09:00',
  label: 'Example reminder',
  type: 'other',
  completed: false,
}

function patientsCollection() {
  return getAdminDb().collection('patients')
}

function patientRef() {
  return patientsCollection().doc(getFirebasePatientId())
}

function facesCollection() {
  return patientRef().collection('faces')
}

function scheduleCollection() {
  return patientRef().collection('schedule')
}

function activityCollection() {
  return patientRef().collection('activity')
}

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function validateTimeString(time: string): string | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim())
  if (!match) return null
  const hour = Number(match[1])
  const minute = Number(match[2])
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

async function ensurePatientBootstrap() {
  const patient = patientRef()
  const now = Timestamp.now()

  await patient.set(
    {
      initializedAt: now,
      updatedAt: now,
    },
    { merge: true }
  )

  const [scheduleSnapshot, activitySnapshot] = await Promise.all([
    scheduleCollection().limit(1).get(),
    activityCollection().limit(1).get(),
  ])

  if (scheduleSnapshot.empty) {
    const reminderRef = scheduleCollection().doc()
    await reminderRef.set({
      ...DEFAULT_REMINDER,
      createdAt: now,
    } satisfies ScheduleDoc)
  }

  if (activitySnapshot.empty) {
    const activityRef = activityCollection().doc()
    await activityRef.set({
      timestamp: formatTimestamp(new Date()),
      occurredAt: now,
      type: 'system',
      description: 'Firebase backend ready for caregiver updates.',
      severity: 'info',
      createdAt: now,
    } satisfies ActivityDoc)
  }
}

async function writeActivityEvent(event: Omit<ActivityEvent, 'id' | 'timestamp'> & { timestamp?: string }) {
  const now = new Date()
  await activityCollection().add({
    timestamp: event.timestamp ?? formatTimestamp(now),
    occurredAt: Timestamp.fromDate(new Date(event.occurredAt)),
    type: event.type,
    description: event.description,
    severity: event.severity,
    createdAt: Timestamp.fromDate(now),
  } satisfies ActivityDoc)
}

export async function listFaces(): Promise<FacePerson[]> {
  const snapshot = await facesCollection().orderBy('createdAt', 'desc').get()
  return snapshot.docs.map((doc) => {
    const data = doc.data() as FaceDoc
    return {
      id: doc.id,
      name: data.name,
      relationship: data.relationship,
      imageUrl: data.imageUrl,
    } satisfies FacePerson
  })
}

async function listSchedule(): Promise<ScheduleItem[]> {
  const snapshot = await scheduleCollection().orderBy('time', 'asc').get()
  return snapshot.docs.map((doc) => {
    const data = doc.data() as ScheduleDoc
    return {
      id: doc.id,
      time: data.time,
      label: data.label,
      type: data.type,
      completed: data.completed,
    } satisfies ScheduleItem
  })
}

async function listActivity(): Promise<ActivityEvent[]> {
  const snapshot = await activityCollection().orderBy('createdAt', 'desc').limit(25).get()
  return snapshot.docs.map((doc) => {
    const data = doc.data() as ActivityDoc
    return {
      id: doc.id,
      timestamp: data.timestamp,
      occurredAt: (data.occurredAt ?? data.createdAt).toDate().toISOString(),
      type: data.type,
      description: data.description,
      severity: data.severity,
    } satisfies ActivityEvent
  })
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  await ensurePatientBootstrap()

  const [schedule, faces, activity] = await Promise.all([
    listSchedule(),
    listFaces(),
    listActivity(),
  ])

  return {
    schedule,
    faces,
    activity,
    remindersToday: schedule.filter((item) => !item.completed).length,
  }
}

export async function addFace(input: AddFaceInput): Promise<FacePerson> {
  await ensurePatientBootstrap()

  const createdAt = Timestamp.now()
  const faceRef = facesCollection().doc()

  await faceRef.set({
    name: input.name.trim(),
    relationship: input.relationship.trim(),
    imageUrl: input.imageUrl,
    createdAt,
  } satisfies FaceDoc)

  await writeActivityEvent({
    occurredAt: new Date().toISOString(),
    type: 'system',
    description: `Added ${input.name.trim()} to the face gallery.`,
    severity: 'success',
  })

  return {
    id: faceRef.id,
    name: input.name.trim(),
    relationship: input.relationship.trim(),
    imageUrl: input.imageUrl,
  }
}

export async function deleteFace(id: string): Promise<Pick<FacePerson, 'imageUrl' | 'name'> | null> {
  await ensurePatientBootstrap()

  const faceRef = facesCollection().doc(id)
  const snapshot = await faceRef.get()
  if (!snapshot.exists) {
    return null
  }

  const data = snapshot.data() as FaceDoc

  await faceRef.delete()

  await writeActivityEvent({
    occurredAt: new Date().toISOString(),
    type: 'system',
    description: `Removed ${data.name} from the face gallery.`,
    severity: 'info',
  })

  return {
    imageUrl: data.imageUrl,
    name: data.name,
  }
}

export async function addScheduleReminder(input: NewScheduleInput): Promise<string | null> {
  await ensurePatientBootstrap()

  const label = input.label.trim()
  if (!label) {
    return 'Please enter a reminder name.'
  }

  const time = validateTimeString(input.time)
  if (!time) {
    return 'Please choose a valid time.'
  }

  await scheduleCollection().add({
    time,
    label,
    type: input.type,
    completed: false,
    createdAt: Timestamp.now(),
  } satisfies ScheduleDoc)

  await writeActivityEvent({
    occurredAt: new Date().toISOString(),
    type: 'reminder',
    description: `Added reminder: ${label}.`,
    severity: 'info',
  })

  return null
}

export async function setScheduleItemCompleted(id: string, completed: boolean): Promise<boolean> {
  await ensurePatientBootstrap()

  const reminderRef = scheduleCollection().doc(id)
  const snapshot = await reminderRef.get()
  if (!snapshot.exists) {
    return false
  }

  const data = snapshot.data() as ScheduleDoc
  await reminderRef.update({ completed })

  await writeActivityEvent({
    occurredAt: new Date().toISOString(),
    type: 'reminder',
    description: completed
      ? `Marked "${data.label}" as complete.`
      : `Marked "${data.label}" as incomplete.`,
    severity: 'info',
  })

  return true
}
