import { NextResponse } from 'next/server'
import { getDashboardSnapshot } from '@/lib/firebase-store'

export async function GET() {
  try {
    return NextResponse.json(await getDashboardSnapshot())
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load dashboard data.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
