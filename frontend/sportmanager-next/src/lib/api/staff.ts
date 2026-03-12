import type { StaffMember } from '@/lib/types'
import { MOCK_STAFF } from '@/lib/mock-data'
import { delay } from './utils'

export async function getStaff(): Promise<StaffMember[]> {
  await delay()
  return [...MOCK_STAFF]
}

export async function getStaffMember(id: number): Promise<StaffMember | undefined> {
  await delay()
  return MOCK_STAFF.find((s) => s.id === id)
}

export async function createStaffMember(data: Omit<StaffMember, 'id'>): Promise<StaffMember> {
  await delay()
  return { ...data, id: Date.now() }
}

export async function updateStaffMember(
  id: number,
  data: Omit<StaffMember, 'id'>,
): Promise<StaffMember> {
  await delay()
  return { ...data, id }
}

export async function deleteStaffMember(id: number): Promise<void> {
  await delay()
  void id
}
