import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Trophy, MapPin, Eye } from 'lucide-react'
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

export type MatchVenue = 'Home' | 'Away' | 'Neutral'
export type MatchResult = 'Win' | 'Draw' | 'Loss' | 'Upcoming'

export interface Match {
  id: number
  date: string
  time: string
  competition: string
  opponent: string
  venue: MatchVenue
  location: string
  goalsFor: number | null
  goalsAgainst: number | null
  result: MatchResult
  notes: string
}

export const INITIAL_MATCHES: Match[] = [
  { id: 1, date: '2026-03-08', time: '15:00', competition: 'Primeira Liga', opponent: 'FC Porto', venue: 'Away', location: 'Estádio do Dragão', goalsFor: null, goalsAgainst: null, result: 'Upcoming', notes: 'Derby match — high intensity expected' },
  { id: 2, date: '2026-03-01', time: '18:00', competition: 'Primeira Liga', opponent: 'Sporting CP', venue: 'Home', location: 'Estádio Municipal', goalsFor: 2, goalsAgainst: 1, result: 'Win', notes: 'Great second-half performance. Goals by Neves (52\') and Ramos (78\')' },
  { id: 3, date: '2026-02-22', time: '20:00', competition: 'Taça de Portugal', opponent: 'SC Braga', venue: 'Away', location: 'Estádio Municipal de Braga', goalsFor: 1, goalsAgainst: 1, result: 'Draw', notes: 'Overtime played. Progressed on penalties (4-3)' },
  { id: 4, date: '2026-02-15', time: '16:00', competition: 'Primeira Liga', opponent: 'Benfica', venue: 'Home', location: 'Estádio Municipal', goalsFor: 0, goalsAgainst: 2, result: 'Loss', notes: 'Poor defensive shape in first half. Review set piece conceding.' },
  { id: 5, date: '2026-02-08', time: '18:00', competition: 'Primeira Liga', opponent: 'Vitória SC', venue: 'Away', location: 'Estádio D. Afonso Henriques', goalsFor: 3, goalsAgainst: 0, result: 'Win', notes: 'Dominant display. Clean sheet. Pressing worked well.' },
]

const RESULT_VARIANT: Record<MatchResult, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Win: 'default',
  Draw: 'secondary',
  Loss: 'destructive',
  Upcoming: 'outline',
}

const EMPTY: Omit<Match, 'id'> = {
  date: '', time: '15:00', competition: 'Primeira Liga', opponent: '',
  venue: 'Home', location: '', goalsFor: null, goalsAgainst: null,
  result: 'Upcoming', notes: '',
}

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function MatchesPage() {
  const navigate = useNavigate()
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Match | null>(null)
  const [form, setForm] = useState<Omit<Match, 'id'>>(EMPTY)
  const [showScore, setShowScore] = useState(false)
  const [preview, setPreview] = useState<Match | null>(null)

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setShowScore(false)
    setOpen(true)
  }

  function openEdit(m: Match) {
    setEditing(m)
    setForm({ date: m.date, time: m.time, competition: m.competition, opponent: m.opponent, venue: m.venue, location: m.location, goalsFor: m.goalsFor, goalsAgainst: m.goalsAgainst, result: m.result, notes: m.notes })
    setShowScore(m.result !== 'Upcoming')
    setOpen(true)
  }

  function handleSave() {
    if (!form.date || !form.opponent.trim()) return
    const entry: Omit<Match, 'id'> = {
      ...form,
      goalsFor: showScore ? form.goalsFor : null,
      goalsAgainst: showScore ? form.goalsAgainst : null,
      result: showScore ? form.result : 'Upcoming',
    }
    if (editing) {
      setMatches((prev) => prev.map((m) => m.id === editing.id ? { ...entry, id: editing.id } : m))
    } else {
      setMatches((prev) => [{ ...entry, id: Date.now() }, ...prev])
    }
    setOpen(false)
  }

  function handleDelete(id: number) {
    setMatches((prev) => prev.filter((m) => m.id !== id))
  }

  const upcoming = matches.filter((m) => m.result === 'Upcoming').sort((a, b) => a.date.localeCompare(b.date))
  const past = matches.filter((m) => m.result !== 'Upcoming').sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Matches</h1>
          <p className="text-muted-foreground">Fixtures, results and match notes</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Match
        </Button>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming <Badge variant="outline" className="ml-2">{upcoming.length}</Badge></CardTitle>
          </CardHeader>
          <CardContent>
            <MatchList matches={upcoming} onEdit={openEdit} onDelete={handleDelete} onPreview={setPreview} />
          </CardContent>
        </Card>
      )}

      {/* Past */}
      <Card>
        <CardHeader>
          <CardTitle>Results <Badge className="ml-2">{past.length}</Badge></CardTitle>
        </CardHeader>
        <CardContent>
          <MatchList matches={past} onEdit={openEdit} onDelete={handleDelete} onPreview={setPreview} />
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Match' : 'Add Match'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Kick-off Time</Label>
                <Input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Competition</Label>
              <Input value={form.competition} onChange={(e) => setForm((f) => ({ ...f, competition: e.target.value }))} placeholder="e.g. Primeira Liga" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Opponent</Label>
                <Input value={form.opponent} onChange={(e) => setForm((f) => ({ ...f, opponent: e.target.value }))} placeholder="e.g. FC Porto" />
              </div>
              <div className="space-y-1.5">
                <Label>Venue</Label>
                <Select value={form.venue} onValueChange={(v) => setForm((f) => ({ ...f, venue: v as MatchVenue }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Away">Away</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Stadium / Location</Label>
              <Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="e.g. Estádio do Dragão" />
            </div>

            {/* Toggle score entry */}
            <div className="flex items-center gap-2">
              <input
                id="has-result"
                type="checkbox"
                checked={showScore}
                onChange={(e) => setShowScore(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              <Label htmlFor="has-result" className="cursor-pointer">Match has been played — enter result</Label>
            </div>

            {showScore && (
              <div className="grid grid-cols-3 gap-4 items-end">
                <div className="space-y-1.5">
                  <Label>Goals For</Label>
                  <Input type="number" min={0} value={form.goalsFor ?? ''} onChange={(e) => setForm((f) => ({ ...f, goalsFor: Number(e.target.value) }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Goals Against</Label>
                  <Input type="number" min={0} value={form.goalsAgainst ?? ''} onChange={(e) => setForm((f) => ({ ...f, goalsAgainst: Number(e.target.value) }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Result</Label>
                  <Select value={form.result} onValueChange={(v) => setForm((f) => ({ ...f, result: v as MatchResult }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Win">Win</SelectItem>
                      <SelectItem value="Draw">Draw</SelectItem>
                      <SelectItem value="Loss">Loss</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Match notes, key events, observations..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>{editing ? 'Save Changes' : 'Add Match'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview modal */}
      <Dialog open={!!preview} onOpenChange={(v) => !v && setPreview(null)}>
        {preview && (
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                {preview.opponent}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-1">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Date</p>
                  <p className="font-medium">{formatDate(preview.date)} · {preview.time}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Result</p>
                  <div className="flex items-center gap-1.5">
                    {preview.result !== 'Upcoming' && <ScoreBadge m={preview} />}
                    <Badge variant={RESULT_VARIANT[preview.result]}>{preview.result}</Badge>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Competition</p>
                  <p className="font-medium">{preview.competition}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Venue</p>
                  <Badge variant="outline">{preview.venue}</Badge>
                </div>
                {preview.location && (
                  <div className="space-y-0.5 col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                    <p className="font-medium flex items-center gap-1"><MapPin className="h-3 w-3" />{preview.location}</p>
                  </div>
                )}
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
              <Button className="flex-1" onClick={() => navigate(`/matches/${preview.id}`, { state: { match: preview } })}>
                <Eye className="h-3.5 w-3.5 mr-1" /> View Report
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

function MatchList({ matches, onEdit, onDelete, onPreview }: { matches: Match[]; onEdit: (m: Match) => void; onDelete: (id: number) => void; onPreview: (m: Match) => void }) {
  return (
    <div className="space-y-3">
      {matches.map((m) => (
        <div key={m.id} className="flex items-start justify-between gap-4 rounded-lg border p-4 hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => onPreview(m)}>
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center justify-center h-10 w-10 rounded-lg bg-muted shrink-0">
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="font-semibold text-sm">{m.opponent}</p>
                <ScoreBadge m={m} />
                <Badge variant={RESULT_VARIANT[m.result]}>{m.result}</Badge>
                <Badge variant="outline">{m.venue}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDate(m.date)} · {m.time} · {m.competition}
              </p>
              {m.location && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {m.location}
                </p>
              )}
              {m.notes && <p className="text-xs text-muted-foreground mt-1 max-w-lg">{m.notes}</p>}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" onClick={() => onEdit(m)} aria-label="Edit">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(m.id)} aria-label="Delete" className="text-destructive hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

function ScoreBadge({ m }: { m: Match }) {
  if (m.result === 'Upcoming') return <span className="text-sm text-muted-foreground italic">Upcoming</span>
  return (
    <span className={`text-base font-bold tabular-nums ${m.result === 'Win' ? 'text-green-600' : m.result === 'Loss' ? 'text-red-500' : 'text-yellow-600'}`}>
      {m.goalsFor} – {m.goalsAgainst}
    </span>
  )
}
