import type { Report } from '@/lib/types'
import { MOCK_REPORTS } from '@/lib/mock-data'
import { delay } from './utils'

export async function getReports(): Promise<Report[]> {
  await delay()
  return [...MOCK_REPORTS]
}

export async function getReport(id: number): Promise<Report | undefined> {
  await delay()
  return MOCK_REPORTS.find((r) => r.id === id)
}
