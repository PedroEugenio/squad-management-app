import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, Plus, Trash2, Star, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { INITIAL_MATCHES } from '@/pages/MatchesPage'
import { INITIAL_PLAYERS } from '@/pages/SquadPage'

// ─── Star picker (1-5) ────────────────────────────────────────────────────
function RatingPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(value === n ? 0 : n)}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <Star className={`h-6 w-6 transition-colors ${n <= (hovered || value) ? 'fill-amber-400 stroke-amber-400' : 'fill-muted stroke-muted-foreground/40'}`} />
        </button>
      ))}
    </div>
  )
}

const RATING_LABELS = ['', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent']
const RATING_COLORS = ['', 'text-red-500', 'text-orange-500', 'text-yellow-600', 'text-blue-600', 'text-green-600']

// ─── Goal event row ───────────────────────────────────────────────────────
interface GoalEvent {
  id: number
  minute: string
  player: string
  team: 'us' | 'opponent'
  type: 'goal' | 'penalty' | 'own-goal'
}

function formatMatchLabel(m: { date: string; opponent: string; competition: string; result: string }) {
  const d = new Date(m.date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const res = m.result !== 'Upcoming' ? ` · ${m.result}` : ' · Upcoming'
  return `vs ${m.opponent} — ${d}${res} (${m.competition})`
}

// ─── Main component ────────────────────────────────────────────────────────
export default function CreateMatchReportPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const preselectedId = (location.state as { matchId?: number })?.matchId

  const [matchId, setMatchId] = useState<string>(preselectedId ? String(preselectedId) : '')
  const [summary, setSummary] = useState('')
  const [tacticalNotes, setTacticalNotes] = useState('')
  const [rating, setRating] = useState(0)

  // Key stats
  const [stats, setStats] = useState({
    possession: '',
    shotsOnTarget: '',
    shotsTotal: '',
    passes: '',
    passAccuracy: '',
    corners: '',
    yellowCards: '',
    redCards: '',
    distanceCovered: '',
  })

  // Goal events
  const [goals, setGoals] = useState<GoalEvent[]>([])
  const [goalCounter, setGoalCounter] = useState(1)

  function addGoal() {
    setGoals((prev) => [...prev, { id: goalCounter, minute: '', player: '', team: 'us', type: 'goal' }])
    setGoalCounter((c) => c + 1)
  }

  function updateGoal<K extends keyof GoalEvent>(id: number, key: K, value: GoalEvent[K]) {
    setGoals((prev) => prev.map((g) => g.id === id ? { ...g, [key]: value } : g))
  }

  function removeGoal(id: number) {
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  // Standout players
  const [standouts, setStandouts] = useState<{ id: number; playerId: string; note: string }[]>([])
  const [standoutCounter, setStandoutCounter] = useState(1)

  function addStandout() {
    setStandouts((prev) => [...prev, { id: standoutCounter, playerId: '', note: '' }])
    setStandoutCounter((c) => c + 1)
  }

  function updateStandout(id: number, key: 'playerId' | 'note', value: string) {
    setStandouts((prev) => prev.map((s) => s.id === id ? { ...s, [key]: value } : s))
  }

  function removeStandout(id: number) {
    setStandouts((prev) => prev.filter((s) => s.id !== id))
  }

  // Submit
  const [saved, setSaved] = useState(false)

  function handleSave() {
    if (!matchId) return
    setSaved(true)
  }

  const selectedMatch = INITIAL_MATCHES.find((m) => String(m.id) === matchId)
  const canSave = !!matchId && summary.trim().length > 0

  if (saved && selectedMatch) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <div>
          <h2 className="text-2xl font-bold">Report Saved</h2>
          <p className="text-muted-foreground mt-1">
            Match report for <span className="font-medium">vs {selectedMatch.opponent}</span> has been created.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/reports')}>View All Reports</Button>
          <Button onClick={() => { setSaved(false); setMatchId(''); setSummary(''); setTacticalNotes(''); setRating(0); setGoals([]); setStandouts([]) }}>
            Create Another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Match Report</h1>
          <p className="text-muted-foreground">Document the match performance and key events</p>
        </div>
      </div>

      <div className="space-y-6 max-w-3xl mx-auto">
      {/* Match selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Select Match</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={matchId} onValueChange={setMatchId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a match…" />
            </SelectTrigger>
            <SelectContent>
              {INITIAL_MATCHES.map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {formatMatchLabel(m)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedMatch && (
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline">{selectedMatch.competition}</Badge>
              <Badge variant="secondary">{selectedMatch.venue}</Badge>
              <Badge variant={selectedMatch.result === 'Win' ? 'default' : selectedMatch.result === 'Loss' ? 'destructive' : 'outline'}>
                {selectedMatch.result}
              </Badge>
              {selectedMatch.goalsFor !== null && (
                <Badge variant="outline" className="font-mono">
                  {selectedMatch.goalsFor} – {selectedMatch.goalsAgainst}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Match Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Overall Rating</Label>
            <RatingPicker value={rating} onChange={setRating} />
            {rating > 0 && (
              <p className={`text-sm font-medium ${RATING_COLORS[rating]}`}>{RATING_LABELS[rating]}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Narrative Summary <span className="text-destructive">*</span></Label>
            <Textarea
              rows={4}
              placeholder="Describe the match — key moments, team performance, turning points…"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Key Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Key Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {([
              { key: 'possession',     label: 'Possession (%)',    placeholder: '51' },
              { key: 'shotsOnTarget',  label: 'Shots on Target',   placeholder: '7' },
              { key: 'shotsTotal',     label: 'Shots Total',        placeholder: '14' },
              { key: 'passes',         label: 'Total Passes',       placeholder: '487' },
              { key: 'passAccuracy',   label: 'Pass Accuracy (%)',  placeholder: '83' },
              { key: 'corners',        label: 'Corners',            placeholder: '6' },
              { key: 'yellowCards',    label: 'Yellow Cards',       placeholder: '2' },
              { key: 'redCards',       label: 'Red Cards',          placeholder: '0' },
              { key: 'distanceCovered',label: 'Distance (km)',      placeholder: '108' },
            ] as { key: keyof typeof stats; label: string; placeholder: string }[]).map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <Label className="text-xs">{label}</Label>
                <Input
                  type="number"
                  min={0}
                  placeholder={placeholder}
                  value={stats[key]}
                  onChange={(e) => setStats((s) => ({ ...s, [key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goal Events */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Goal Events
              {goals.length > 0 && <Badge variant="secondary" className="ml-2 text-xs">{goals.length}</Badge>}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={addGoal} className="gap-1">
              <Plus className="h-3.5 w-3.5" /> Add Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {goals.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No goals added yet.</p>
          ) : (
            <div className="space-y-3">
              {goals.map((g) => (
                <div key={g.id} className="grid grid-cols-[60px_1fr_120px_130px_36px] gap-2 items-end">
                  <div className="space-y-1">
                    <Label className="text-xs">Min</Label>
                    <Input
                      type="number" min={1} max={120}
                      placeholder="52"
                      value={g.minute}
                      onChange={(e) => updateGoal(g.id, 'minute', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Player / Description</Label>
                    <Select value={g.player} onValueChange={(v) => updateGoal(g.id, 'player', v)}>
                      <SelectTrigger><SelectValue placeholder="Select player…" /></SelectTrigger>
                      <SelectContent>
                        {INITIAL_PLAYERS.map((p) => (
                          <SelectItem key={p.id} value={p.name}>{p.name} — {p.position}</SelectItem>
                        ))}
                        <SelectItem value="opponent">Opponent player</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Team</Label>
                    <Select value={g.team} onValueChange={(v) => updateGoal(g.id, 'team', v as GoalEvent['team'])}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">Us</SelectItem>
                        <SelectItem value="opponent">Opponent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Type</Label>
                    <Select value={g.type} onValueChange={(v) => updateGoal(g.id, 'type', v as GoalEvent['type'])}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="goal">Goal</SelectItem>
                        <SelectItem value="penalty">Penalty</SelectItem>
                        <SelectItem value="own-goal">Own Goal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-9 w-9 self-end" onClick={() => removeGoal(g.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Standout Players */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Standout Players
              {standouts.length > 0 && <Badge variant="secondary" className="ml-2 text-xs">{standouts.length}</Badge>}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={addStandout} className="gap-1">
              <Plus className="h-3.5 w-3.5" /> Add Player
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {standouts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Highlight individual performances.</p>
          ) : (
            <div className="space-y-3">
              {standouts.map((s) => (
                <div key={s.id} className="grid grid-cols-[1fr_1fr_36px] gap-2 items-end">
                  <div className="space-y-1">
                    <Label className="text-xs">Player</Label>
                    <Select value={s.playerId} onValueChange={(v) => updateStandout(s.id, 'playerId', v)}>
                      <SelectTrigger><SelectValue placeholder="Select player…" /></SelectTrigger>
                      <SelectContent>
                        {INITIAL_PLAYERS.map((p) => (
                          <SelectItem key={p.id} value={String(p.id)}>{p.name} — {p.position}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Note</Label>
                    <Input
                      placeholder="e.g. Man of the match, great pressing…"
                      value={s.note}
                      onChange={(e) => updateStandout(s.id, 'note', e.target.value)}
                    />
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-9 w-9 self-end" onClick={() => removeStandout(s.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tactical Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tactical Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={4}
            placeholder="Formation, press triggers, defensive shape, transition observations, areas to improve…"
            value={tacticalNotes}
            onChange={(e) => setTacticalNotes(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Footer actions */}
      <Separator />
      <div className="flex items-center justify-between pb-8">
        <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        <Button onClick={handleSave} disabled={!canSave} className="min-w-32">
          Save Report
        </Button>
      </div>
      </div>
    </div>
  )
}
