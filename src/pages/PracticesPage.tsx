import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, CalendarDays, Clock, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type PracticeType = 'Tactical' | 'Physical' | 'Technical' | 'Recovery' | 'Set Pieces'

export interface Practice {
  id: number
  date: string
  time: string
  type: PracticeType
  duration: string
  location: string
  attendance: number
  notes: string
}

export const INITIAL_PRACTICES: Practice[] = [
  { id: 1, date: '2026-03-06', time: '09:00', type: 'Tactical', duration: '90 min', location: 'Main Pitch', attendance: 22, notes: 'Pre-match shape work — 4-3-3 press triggers' },
  { id: 2, date: '2026-03-05', time: '10:00', type: 'Technical', duration: '75 min', location: 'Training Ground B', attendance: 20, notes: 'Finishing drills and crossing patterns' },
  { id: 3, date: '2026-03-04', time: '09:30', type: 'Physical', duration: '60 min', location: 'Gym', attendance: 18, notes: 'High-intensity interval training' },
  { id: 4, date: '2026-03-03', time: '09:00', type: 'Recovery', duration: '45 min', location: 'Indoor Facility', attendance: 22, notes: 'Post-match recovery session — pool and mobility work' },
  { id: 5, date: '2026-02-28', time: '10:30', type: 'Set Pieces', duration: '60 min', location: 'Main Pitch', attendance: 21, notes: 'Corner kick routines and defensive organization' },
]

const TYPE_VARIANT: Record<PracticeType, 'default' | 'secondary' | 'outline'> = {
  Tactical: 'default',
  Physical: 'secondary',
  Technical: 'outline',
  Recovery: 'outline',
  'Set Pieces': 'secondary',
}

const EMPTY: Omit<Practice, 'id'> = {
  date: '', time: '09:00', type: 'Tactical', duration: '90 min', location: '', attendance: 0, notes: '',
}

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function PracticesPage() {
  const navigate = useNavigate()
  const [practices, setPractices] = useState<Practice[]>(INITIAL_PRACTICES)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Practice | null>(null)
  const [form, setForm] = useState<Omit<Practice, 'id'>>(EMPTY)
  const [preview, setPreview] = useState<Practice | null>(null)

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setOpen(true)
  }

  function openEdit(p: Practice) {
    setEditing(p)
    setForm({ date: p.date, time: p.time, type: p.type, duration: p.duration, location: p.location, attendance: p.attendance, notes: p.notes })
    setOpen(true)
  }

  function handleSave() {
    if (!form.date || !form.location.trim()) return
    if (editing) {
      setPractices((prev) => prev.map((p) => p.id === editing.id ? { ...form, id: editing.id } : p))
    } else {
      setPractices((prev) => [{ ...form, id: Date.now() }, ...prev])
    }
    setOpen(false)
  }

  function handleDelete(id: number) {
    setPractices((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Practices</h1>
          <p className="text-muted-foreground">Schedule and manage training sessions</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Session
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Training Sessions <Badge className="ml-2">{practices.length}</Badge></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {practices
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((p) => (
                <div key={p.id} className="flex items-start justify-between gap-4 rounded-lg border p-4 hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => setPreview(p)}>
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center justify-center h-10 w-10 rounded-lg bg-muted shrink-0">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm">{formatDate(p.date)}</p>
                        <span className="text-muted-foreground text-xs flex items-center gap-1">
                          <Clock className="h-3 w-3" />{p.time} · {p.duration}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{p.location} · {p.attendance} players</p>
                      {p.notes && <p className="text-xs text-muted-foreground mt-1 max-w-lg">{p.notes}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Badge variant={TYPE_VARIANT[p.type]}>{p.type}</Badge>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)} aria-label="Edit">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} aria-label="Delete" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Session' : 'New Training Session'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Time</Label>
                <Input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Session Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as PracticeType }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(['Tactical', 'Physical', 'Technical', 'Recovery', 'Set Pieces'] as PracticeType[]).map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Duration</Label>
                <Input value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="e.g. 90 min" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="e.g. Main Pitch" />
              </div>
              <div className="space-y-1.5">
                <Label>Expected Attendance</Label>
                <Input type="number" value={form.attendance || ''} onChange={(e) => setForm((f) => ({ ...f, attendance: Number(e.target.value) }))} placeholder="e.g. 22" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Session objectives, key drills, tactical focus..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>{editing ? 'Save Changes' : 'Create Session'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview modal */}
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
              {preview.notes && (
                <div className="rounded-md bg-muted p-2.5 text-xs text-muted-foreground">{preview.notes}</div>
              )}
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="flex-1">Close</Button>
              </DialogClose>
              <Button variant="outline" className="flex-1" onClick={() => { openEdit(preview); setPreview(null) }}>
                <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
              </Button>
              <Button className="flex-1" onClick={() => navigate(`/practices/${preview.id}`, { state: { practice: preview } })}>
                <Eye className="h-3.5 w-3.5 mr-1" /> View Session
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
