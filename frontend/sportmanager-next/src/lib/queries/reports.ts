import { useQuery } from '@tanstack/react-query'
import { getReports, getReport } from '@/lib/api/reports'

export function useReports() {
  return useQuery({ queryKey: ['reports'], queryFn: getReports })
}

export function useReport(id: number) {
  return useQuery({ queryKey: ['reports', id], queryFn: () => getReport(id) })
}
