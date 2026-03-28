import { NextResponse } from 'next/server'
import { getDashboardSnapshot, setScheduleItemCompleted } from '@/lib/firebase-store'

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  let body: { completed?: boolean }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (typeof body.completed !== 'boolean') {
    return NextResponse.json({ error: 'completed must be a boolean' }, { status: 400 })
  }
  const ok = await setScheduleItemCompleted(id, body.completed)
  if (!ok) {
    return NextResponse.json({ error: 'Schedule item not found' }, { status: 404 })
  }
  return NextResponse.json(await getDashboardSnapshot())
}
