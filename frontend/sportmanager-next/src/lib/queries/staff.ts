import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getStaff,
  getStaffMember,
  createStaffMember,
  updateStaffMember,
  deleteStaffMember,
} from '@/lib/api/staff'
import type { StaffMember } from '@/lib/types'
import { toast } from 'sonner'

export function useStaff() {
  return useQuery({ queryKey: ['staff'], queryFn: getStaff })
}

export function useStaffMember(id: number) {
  return useQuery({ queryKey: ['staff', id], queryFn: () => getStaffMember(id) })
}

export function useCreateStaffMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<StaffMember, 'id'>) => createStaffMember(data),
    onSuccess: (newItem) => {
      qc.setQueryData<StaffMember[]>(['staff'], (old = []) => [...old, newItem])
      toast.success('Staff member added')
    },
  })
}

export function useUpdateStaffMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<StaffMember, 'id'> }) =>
      updateStaffMember(id, data),
    onSuccess: (updated) => {
      qc.setQueryData<StaffMember[]>(['staff'], (old = []) =>
        old.map((s) => (s.id === updated.id ? updated : s)),
      )
      qc.setQueryData(['staff', updated.id], updated)
      toast.success('Staff member updated')
    },
  })
}

export function useDeleteStaffMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteStaffMember(id),
    onSuccess: (_, id) => {
      qc.setQueryData<StaffMember[]>(['staff'], (old = []) => old.filter((s) => s.id !== id))
      toast.success('Staff member removed')
    },
  })
}
