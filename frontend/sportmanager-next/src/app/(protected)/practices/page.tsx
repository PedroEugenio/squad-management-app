'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil, Trash2, CalendarDays, Clock, Eye, MoreVertical } from 'lucide-react'
import WeekCalendar from '@/components/practices/WeekCalendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { usePractices, useMatches, useCreatePractice, useUpdatePractice, useDeletePractice } from '@/lib/queries'
import { practiceSchema, type PracticeFormValues } from '@/schemas/practice'
import type { Practice, PracticeType } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

const TYPE_VARIANT: Record<PracticeType, 'default' | 'secondary' | 'outline'> = {
  Tactical: 'default', Physical: 'secondary', Technical: 'outline',
  Recovery: 'outline', 'Set Pieces': 'secondary',
}

const EMPTY_DEFAULTS: PracticeFormValues = {
  date: '', time: '09:00', type: 'Tactical', duration: '90 min', location: '', attendance: 0, notes: '',
}

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function PracticesPage() {
  const router = useRouter()
  const { data: practices = [], isLoading } = usePractices()
  const { data: matches = [] } = useMatches()
  const createPractice = useCreatePractice()
  const updatePractice = useUpdatePractice()
  const deletePractice = useDeletePractice()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Practice | null>(null)
  const [preview, setPreview] = useState<Practice | null>(null)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PracticeFormValues>({
    resolver: zodResolver(practiceSchema),
    defaultValues: EMPTY_DEFAULTS,
  })

  function openCreate() {
    setEditing(null)
    reset(EMPTY_DEFAULTS)
    setOpen(true)
  }

  function openEdit(p: Practice) {
    setEditing(p)
    reset({ date: p.date, time: p.time, type: p.type, duration: p.duration, location: p.location, attendance: p.attendance, notes: p.notes })
    setOpen(true)
  }

  async function onSubmit(values: PracticeFormValues) {
    if (editing) {
      await updatePractice.mutateAsync({ id: editing.id, data: values })
    } else {
      await createPractice.mutateAsync(values)
    }
    setOpen(false)
  }

  const isSaving = createPractice.isPending || updatePractice.isPending

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Practices</h1>
          <p className="text-muted-foreground">Schedule and manage training sessions</p>
        </div>
        <Button size="icon" className="rounded-full sm:hidden" onClick={openCreate}>
          <Plus className="h-5 w-5" />
        </Button>
        <Button className="hidden sm:flex" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Session
        </Button>
      </div>

      <WeekCalendar
        practices={practices}
        matches={matches}
        onViewSession={(p) => router.push(`/practices/${p.id}`)}
        onEditSession={(p) => openEdit(p)}
        onViewMatch={(m) => router.push(`/matches/${m.id}`)}
      />

      <Card>
        <CardHeader>
          <CardTitle>Training Sessions <Badge className="ml-2">{practices.length}</Badge></CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border p-4">
                  <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[...practices].sort((a, b) => b.date.localeCompare(a.date)).map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 rounded-lg border p-4 hover:bg-muted/40 transition-colors cursor-pointer"
                  onClick={() => setPreview(p)}
                >
                  {/* Row 1: icon + info */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex flex-col items-center justify-center h-10 w-10 rounded-lg bg-muted shrink-0">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm">{formatDate(p.date)}</p>
                        <span className="text-muted-foreground text-xs flex items-center gap-1">
                          <Clock className="h-3 w-3" />{p.time} · {p.duration}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{p.location} · {p.attendance} players</p>
                      {p.notes && <p className="text-xs text-muted-foreground mt-1 max-w-lg line-clamp-2">{p.notes}</p>}
                    </div>
                  </div>

                  {/* Row 2 (mobile) / right side (desktop): badge + actions */}
                  <div
                    className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pl-13 sm:pl-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Badge variant={TYPE_VARIANT[p.type]}>{p.type}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setPreview(p)}>
                          <Eye className="h-4 w-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(p)}>
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => deletePractice.mutate(p.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Session' : 'New Training Session'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" {...register('date')} />
                {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" {...register('time')} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Session Type</Label>
                <Select value={watch('type')} onValueChange={(v) => setValue('type', v as PracticeType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(['Tactical', 'Physical', 'Technical', 'Recovery', 'Set Pieces'] as PracticeType[]).map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" placeholder="e.g. 90 min" {...register('duration')} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g. Main Pitch" {...register('location')} />
                {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="attendance">Expected Attendance</Label>
                <Input id="attendance" type="number" placeholder="e.g. 22" {...register('attendance', { valueAsNumber: true })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Session objectives, key drills, tactical focus..." rows={3} {...register('notes')} />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving…' : (editing ? 'Save Changes' : 'Create Session')}
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
              <DialogTitle className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                {formatDate(preview.date)}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-1">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Type</p>
                  <Badge variant={TYPE_VARIANT[preview.type]}>{preview.type}</Badge>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Time</p>
                  <p className="font-medium flex items-center gap-1"><Clock className="h-3 w-3" />{preview.time} · {preview.duration}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                  <p className="font-medium">{preview.location}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Attendance</p>
                  <p className="font-medium">{preview.attendance} players</p>
                </div>
              </div>
              {preview.notes && <div className="rounded-md bg-muted p-2.5 text-xs text-muted-foreground">{preview.notes}</div>}
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="flex-1">Close</Button>
              </DialogClose>
              <Button variant="outline" className="flex-1" onClick={() => { openEdit(preview); setPreview(null) }}>
                <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
              </Button>
              <Button className="flex-1" onClick={() => router.push(`/practices/${preview.id}`)}>
                <Eye className="h-3.5 w-3.5 mr-1" /> View Session
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
