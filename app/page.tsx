import { DashboardShell } from '@/components/dashboard/shell'
import { getDashboardSnapshot } from '@/lib/firebase-store'

/** Fresh snapshot each request so SSR matches the live Firebase-backed API. */
export const dynamic = 'force-dynamic'

export default async function Page() {
  const initialData = await getDashboardSnapshot()
  return <DashboardShell initialData={initialData} />
}
