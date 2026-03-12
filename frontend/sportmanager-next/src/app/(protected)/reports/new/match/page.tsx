'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Star, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { usePlayers, useMatches } from '@/lib/queries'

type GoalTeam = 'us' | 'opponent'
type GoalType = 'goal' | 'penalty' | 'own-goal'

interface GoalEvent { id: number; minute: string; player: string; team: GoalTeam; type: GoalType }
interface StandoutPlayer { id: number; playerId: string; note: string }

const RATING_LABELS: Record<number, string> = { 1: 'Poor', 2: 'Below Average', 3: 'Average', 4: 'Good', 5: 'Excellent' }
const RATING_COLORS: Record<number, string> = { 1: 'text-red-500', 2: 'text-orange-500', 3: 'text-yellow-600', 4: 'text-blue-600', 5: 'text-green-600' }

const EMPTY_STATS = {
  possession: '', shotsOnTarget: '', shotsTotal: '', passes: '',
  passAccuracy: '', corners: '', yellowCards: '', redCards: '', distanceCovered: '',
}

function RatingPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`h-8 w-8 flex items-center justify-center rounded transition-colors ${value >= n ? 'text-yellow-500' : 'text-muted-foreground/40 hover:text-yellow-400'}`}
        >
          <Star className="h-5 w-5 fill-current" />
        </button>
      ))}
    </div>
  )
}

export default function CreateMatchReportPage() {
  const router = useRouter()
  const { data: players = [] } = usePlayers()
  const { data: matches = [] } = useMatches()

  const [selectedMatchId, setSelectedMatchId] = useState<string>('')
  const [summary, setSummary] = useState('')
  const [rating, setRating] = useState(0)
  const [stats, setStats] = useState(EMPTY_STATS)
  const [goals, setGoals] = useState<GoalEvent[]>([])
  const [standouts, setStandouts] = useState<StandoutPlayer[]>([])
  const [tacticalNotes, setTacticalNotes] = useState('')
  const [saved, setSaved] = useState(false)

  function addGoal() {
    setGoals((g) => [...g, { id: Date.now(), minute: '', player: '', team: 'us', type: 'goal' }])
  }
  function removeGoal(id: number) { setGoals((g) => g.filter((x) => x.id !== id)) }
  function updateGoal<K extends keyof GoalEvent>(id: number, key: K, value: GoalEvent[K]) {
    setGoals((g) => g.map((x) => x.id === id ? { ...x, [key]: value } : x))
  }

  function addStandout() {
    setStandouts((s) => [...s, { id: Date.now(), playerId: '', note: '' }])
  }
  function removeStandout(id: number) { setStandouts((s) => s.filter((x) => x.id !== id)) }
  function updateStandout<K extends keyof StandoutPlayer>(id: number, key: K, value: StandoutPlayer[K]) {
    setStandouts((s) => s.map((x) => x.id === id ? { ...x, [key]: value } : x))
  }

  const canSave = !!selectedMatchId && summary.trim().length > 0

  function handleSave() {
    if (!canSave) return
    setSaved(true)
  }

  if (saved) return (
    <div className="flex flex-col items-center justify-center gap-5 py-20">
      <CheckCircle2 className="h-16 w-16 text-green-500" />
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Report Saved</h2>
        <p className="text-muted-foreground mt-1">Your match report has been submitted for processing.</p>
      </div>
      <Button onClick={() => router.push('/reports')}>View All Reports</Button>
    </div>
  )

  const playedMatches = matches.filter((m) => m.result !== 'Upcoming')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Match Report</h1>
          <p className="text-muted-foreground">Document the match performance and key observations</p>
        </div>
      </div>

      {/* Match selector */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Select Match</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label>Match <span className="text-destructive">*</span></Label>
            <Select value={selectedMatchId} onValueChange={setSelectedMatchId}>
              <SelectTrigger><SelectValue placeholder="Choose a completed match…" /></SelectTrigger>
              <SelectContent>
                {playedMatches.map((m) => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    vs {m.opponent} — {m.goalsFor}:{m.goalsAgainst} ({m.date})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary + Rating */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Summary &amp; Rating</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Overall Rating</Label>
            <RatingPicker value={rating} onChange={setRating} />
            {rating > 0 && <p className={`text-sm font-medium ${RATING_COLORS[rating]}`}>{RATING_LABELS[rating]}</p>}
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
        <CardHeader className="pb-3"><CardTitle className="text-base">Key Statistics</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {([
              { key: 'possession', label: 'Possession (%)', placeholder: '51' },
              { key: 'shotsOnTarget', label: 'Shots on Target', placeholder: '7' },
              { key: 'shotsTotal', label: 'Shots Total', placeholder: '14' },
              { key: 'passes', label: 'Total Passes', placeholder: '487' },
              { key: 'passAccuracy', label: 'Pass Accuracy (%)', placeholder: '83' },
              { key: 'corners', label: 'Corners', placeholder: '6' },
              { key: 'yellowCards', label: 'Yellow Cards', placeholder: '2' },
              { key: 'redCards', label: 'Red Cards', placeholder: '0' },
              { key: 'distanceCovered', label: 'Distance (km)', placeholder: '108' },
            ] as { key: keyof typeof stats; label: string; placeholder: string }[]).map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <Label className="text-xs">{label}</Label>
                <Input
                  type="number" min={0} placeholder={placeholder}
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
              Goal Events{goals.length > 0 && <Badge variant="secondary" className="ml-2 text-xs">{goals.length}</Badge>}
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
                    <Input type="number" min={1} max={120} placeholder="52" value={g.minute} onChange={(e) => updateGoal(g.id, 'minute', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Player</Label>
                    <Select value={g.player} onValueChange={(v) => updateGoal(g.id, 'player', v)}>
                      <SelectTrigger><SelectValue placeholder="Select player…" /></SelectTrigger>
                      <SelectContent>
                        {players.map((p) => <SelectItem key={p.id} value={p.name}>{p.name} — {p.position}</SelectItem>)}
                        <SelectItem value="opponent">Opponent player</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Team</Label>
                    <Select value={g.team} onValueChange={(v) => updateGoal(g.id, 'team', v as GoalTeam)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">Us</SelectItem>
                        <SelectItem value="opponent">Opponent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Type</Label>
                    <Select value={g.type} onValueChange={(v) => updateGoal(g.id, 'type', v as GoalType)}>
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
              Standout Players{standouts.length > 0 && <Badge variant="secondary" className="ml-2 text-xs">{standouts.length}</Badge>}
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
                        {players.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.name} — {p.position}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Note</Label>
                    <Input placeholder="e.g. Man of the match…" value={s.note} onChange={(e) => updateStandout(s.id, 'note', e.target.value)} />
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
        <CardHeader className="pb-3"><CardTitle className="text-base">Tactical Notes</CardTitle></CardHeader>
        <CardContent>
          <Textarea
            rows={4}
            placeholder="Formation, press triggers, defensive shape, transition observations…"
            value={tacticalNotes}
            onChange={(e) => setTacticalNotes(e.target.value)}
          />
        </CardContent>
      </Card>

      <Separator />
      <div className="flex items-center justify-between pb-8">
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button onClick={handleSave} disabled={!canSave} className="min-w-32">Save Report</Button>
      </div>
    </div>
  )
}
