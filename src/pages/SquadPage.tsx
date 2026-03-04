import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

export interface Player {
  id: number
  number: number
  name: string
  position: string
  nationality: string
  age: number
  status: 'Fit' | 'Injured' | 'Suspended' | 'Doubtful'
}

export const INITIAL_PLAYERS: Player[] = [
  { id: 1, number: 1, name: 'Diogo Alves', position: 'Goalkeeper', nationality: '🇵🇹 Portugal', age: 28, status: 'Fit' },
  { id: 2, number: 2, name: 'Tiago Santos', position: 'Right Back', nationality: '🇵🇹 Portugal', age: 24, status: 'Fit' },
  { id: 3, number: 5, name: 'André Brito', position: 'Centre Back', nationality: '🇧🇷 Brazil', age: 27, status: 'Fit' },
  { id: 4, number: 6, name: 'Luís Dias', position: 'Centre Back', nationality: '🇵🇹 Portugal', age: 26, status: 'Injured' },
  { id: 5, number: 3, name: 'Fábio Sousa', position: 'Left Back', nationality: '🇵🇹 Portugal', age: 23, status: 'Fit' },
  { id: 6, number: 8, name: 'Rafael Costa', position: 'Defensive Mid', nationality: '🇧🇷 Brazil', age: 29, status: 'Fit' },
  { id: 7, number: 10, name: 'Bruno Lopes', position: 'Attacking Mid', nationality: '🇵🇹 Portugal', age: 25, status: 'Fit' },
  { id: 8, number: 7, name: 'Marco Oliveira', position: 'Right Winger', nationality: '🇵🇹 Portugal', age: 22, status: 'Doubtful' },
  { id: 9, number: 11, name: 'João Ferreira', position: 'Left Winger', nationality: '🇵🇹 Portugal', age: 24, status: 'Suspended' },
  { id: 10, number: 9, name: 'Paulo Neves', position: 'Striker', nationality: '🇳🇬 Nigeria', age: 27, status: 'Fit' },
  { id: 11, number: 19, name: 'Carlos Ramos', position: 'Striker', nationality: '🇵🇹 Portugal', age: 21, status: 'Fit' },
]

const POSITIONS = [
  'Goalkeeper', 'Right Back', 'Left Back', 'Centre Back',
  'Defensive Mid', 'Central Mid', 'Attacking Mid',
  'Right Winger', 'Left Winger', 'Striker',
]

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Fit: 'default',
  Injured: 'destructive',
  Suspended: 'secondary',
  Doubtful: 'outline',
}

const EMPTY: Omit<Player, 'id'> = {
  number: 0, name: '', position: 'Striker', nationality: '', age: 0, status: 'Fit',
}

export default function SquadPage() {
  const navigate = useNavigate()
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Player | null>(null)
  const [form, setForm] = useState<Omit<Player, 'id'>>(EMPTY)
  const [preview, setPreview] = useState<Player | null>(null)

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setOpen(true)
  }

  function openEdit(p: Player) {
    setEditing(p)
    setForm({ number: p.number, name: p.name, position: p.position, nationality: p.nationality, age: p.age, status: p.status })
    setOpen(true)
  }

  function handleSave() {
    if (!form.name.trim()) return
    if (editing) {
      setPlayers((prev) => prev.map((p) => p.id === editing.id ? { ...form, id: editing.id } : p))
    } else {
      setPlayers((prev) => [...prev, { ...form, id: Date.now() }])
    }
    setOpen(false)
  }

  function handleDelete(id: number) {
    setPlayers((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Squad</h1>
          <p className="text-muted-foreground">Manage your registered players</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Player
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Players <Badge className="ml-2">{players.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="text-left py-2 px-3 w-10">#</th>
                  <th className="text-left py-2 px-3">Name</th>
                  <th className="text-left py-2 px-3 hidden md:table-cell">Position</th>
                  <th className="text-left py-2 px-3 hidden lg:table-cell">Nationality</th>
                  <th className="text-left py-2 px-3 hidden lg:table-cell">Age</th>
                  <th className="text-left py-2 px-3">Status</th>
                  <th className="py-2 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {players.sort((a, b) => a.number - b.number).map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => setPreview(p)}>
                    <td className="py-2.5 px-3 font-bold text-muted-foreground">{p.number}</td>
                    <td className="py-2.5 px-3 font-medium">{p.name}</td>
                    <td className="py-2.5 px-3 hidden md:table-cell text-muted-foreground">{p.position}</td>
                    <td className="py-2.5 px-3 hidden lg:table-cell text-muted-foreground">{p.nationality}</td>
                    <td className="py-2.5 px-3 hidden lg:table-cell text-muted-foreground">{p.age}</td>
                    <td className="py-2.5 px-3">
                      <Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge>
                    </td>
                    <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)} aria-label="Edit">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} aria-label="Delete" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Preview modal */}
      <Dialog open={!!preview} onOpenChange={(v) => !v && setPreview(null)}>
        {preview && (
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-2xl font-black text-muted-foreground w-8 text-center">#{preview.number}</span>
                {preview.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-1">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Position</p>
                  <p className="font-medium">{preview.position}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Age</p>
                  <p className="font-medium">{preview.age}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Nationality</p>
                  <p className="font-medium">{preview.nationality}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                  <Badge variant={STATUS_VARIANT[preview.status]}>{preview.status}</Badge>
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="flex-1">Close</Button>
              </DialogClose>
              <Button variant="outline" className="flex-1" onClick={() => { openEdit(preview); setPreview(null) }}>
                <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
              </Button>
              <Button className="flex-1" onClick={() => navigate(`/squad/${preview.id}`, { state: { player: preview } })}>
                <Eye className="h-3.5 w-3.5 mr-1" /> View Profile
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Edit / Create modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Player' : 'Add Player'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Squad Number</Label>
                <Input
                  type="number"
                  value={form.number || ''}
                  onChange={(e) => setForm((f) => ({ ...f, number: Number(e.target.value) }))}
                  placeholder="e.g. 9"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Age</Label>
                <Input
                  type="number"
                  value={form.age || ''}
                  onChange={(e) => setForm((f) => ({ ...f, age: Number(e.target.value) }))}
                  placeholder="e.g. 24"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Paulo Neves"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Nationality</Label>
              <Input
                value={form.nationality}
                onChange={(e) => setForm((f) => ({ ...f, nationality: e.target.value }))}
                placeholder="e.g. 🇵🇹 Portugal"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Position</Label>
                <Select value={form.position} onValueChange={(v) => setForm((f) => ({ ...f, position: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POSITIONS.map((pos) => (
                      <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as Player['status'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fit">Fit</SelectItem>
                    <SelectItem value="Injured">Injured</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                    <SelectItem value="Doubtful">Doubtful</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>{editing ? 'Save Changes' : 'Add Player'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
