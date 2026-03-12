'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogClose,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useStaff, useCreateStaffMember, useUpdateStaffMember, useDeleteStaffMember } from '@/lib/queries'
import { staffSchema, type StaffFormValues } from '@/schemas/staff'
import type { StaffMember, StaffStatus } from '@/lib/types'
import type { BadgeProps } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const STATUS_VARIANT: Record<StaffStatus, BadgeProps['variant']> = {
  Active: 'default', Inactive: 'secondary', Pending: 'outline',
}

const EMPTY_DEFAULTS: StaffFormValues = {
  name: '', email: '', role: '', status: 'Active', phone: '', joined: '',
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function UsersPage() {
  const router = useRouter()
  const { data: staff = [], isLoading } = useStaff()
  const createStaff = useCreateStaffMember()
  const updateStaff = useUpdateStaffMember()
  const deleteStaff = useDeleteStaffMember()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<StaffMember | null>(null)
  const [preview, setPreview] = useState<StaffMember | null>(null)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: EMPTY_DEFAULTS,
  })

  function openCreate() {
    setEditing(null)
    reset(EMPTY_DEFAULTS)
    setOpen(true)
  }

  function openEdit(s: StaffMember) {
    setEditing(s)
    reset({ name: s.name, email: s.email, role: s.role, status: s.status, phone: s.phone ?? '', joined: s.joined ?? '' })
    setOpen(true)
  }

  async function onSubmit(values: StaffFormValues) {
    if (editing) { await updateStaff.mutateAsync({ id: editing.id, data: values }) }
    else { await createStaff.mutateAsync(values) }
    setOpen(false)
  }

  const isSaving = createStaff.isPending || updateStaff.isPending

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff</h1>
          <p className="text-muted-foreground">Manage coaching and support team</p>
        </div>
        <Button size="icon" className="rounded-full sm:hidden" onClick={openCreate}>
          <Plus className="h-5 w-5" />
        </Button>
        <Button className="hidden sm:flex" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Staff Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Staff <Badge variant="outline" className="ml-2">{staff.length}</Badge></CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                  <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-52" />
                  </div>
                  <Skeleton className="hidden md:block h-4 w-24" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {staff.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/40 transition-colors cursor-pointer"
                  onClick={() => setPreview(s)}
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="text-sm">{initials(s.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.email}</p>
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                    {s.role}
                  </div>
                  <Badge variant={STATUS_VARIANT[s.status]}>{s.status}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/staff/${s.id}`) }}>
                        <Eye className="h-4 w-4 mr-2" /> View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openEdit(s) }}>
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => { e.stopPropagation(); deleteStaff.mutate(s.id) }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="e.g. João Santos" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="coach@club.com" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <Input id="role" placeholder="e.g. Head Coach" {...register('role')} />
                {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={watch('status')} onValueChange={(v) => setValue('status', v as StaffStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input id="phone" placeholder="+351 9xx xxx xxx" {...register('phone')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="joined">Joined Date <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input id="joined" type="date" {...register('joined')} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving…' : (editing ? 'Save Changes' : 'Add Member')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview dialog */}
      <Dialog open={!!preview} onOpenChange={(v) => !v && setPreview(null)}>
        {preview && (
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-sm">{initials(preview.name)}</AvatarFallback>
                </Avatar>
                {preview.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-1">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Role</p>
                  <p className="font-medium">{preview.role}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                  <Badge variant={STATUS_VARIANT[preview.status]}>{preview.status}</Badge>
                </div>
                <div className="space-y-0.5 col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                  <p className="font-medium">{preview.email}</p>
                </div>
                {preview.phone && (
                  <div className="space-y-0.5 col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Phone</p>
                    <p className="font-medium">{preview.phone}</p>
                  </div>
                )}
                {preview.joined && (
                  <div className="space-y-0.5 col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Joined</p>
                    <p className="font-medium">{preview.joined}</p>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="flex-1">Close</Button>
              </DialogClose>
              <Button variant="outline" className="flex-1" onClick={() => { openEdit(preview); setPreview(null) }}>
                <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
              </Button>
              <Button className="flex-1" onClick={() => router.push(`/staff/${preview.id}`)}>
                <Eye className="h-3.5 w-3.5 mr-1" /> View Profile
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
