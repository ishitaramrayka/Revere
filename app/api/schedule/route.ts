import { NextResponse } from 'next/server'
import { addScheduleReminder, getDashboardSnapshot } from '@/lib/firebase-store'
import type { ScheduleItem } from '@/lib/dashboard-types'

const types: ScheduleItem['type'][] = ['meal', 'medication', 'exercise', 'other']

export async function POST(request: Request) {
  let body: { time?: unknown; label?: unknown; type?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const time = typeof body.time === 'string' ? body.time : ''
  const label = typeof body.label === 'string' ? body.label : ''
  const type = typeof body.type === 'string' && types.includes(body.type as ScheduleItem['type'])
    ? (body.type as ScheduleItem['type'])
    : null

  if (!type) {
    return NextResponse.json({ error: 'Invalid reminder type.' }, { status: 400 })
  }

  const err = await addScheduleReminder({ time, label, type })
  if (err) {
    return NextResponse.json({ error: err }, { status: 400 })
  }

  return NextResponse.json(await getDashboardSnapshot())
}
