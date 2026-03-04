import { useState } from 'react'
import { ChevronDown, ChevronUp, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export interface PlayerMatchStats {
  goals: number
  assists: number
  faults: number
  yellowCards: number
  redCard: boolean
  timePlayed: number // minutes
}

export interface PlayerEvaluation {
  rating: number // 1–5
  comment: string
  matchStats?: PlayerMatchStats
}

export interface GlobalEvaluation {
  overallRating: number // 1–5
  positives: string
  improvements: string
  notes: string
}

export type EvaluationContext = 'practice' | 'match'

interface Player {
  id: number
  number: number
  name: string
  position: string
}

interface EvaluationSectionProps {
  players: Player[]
  context: EvaluationContext
}

const EMPTY_STATS: PlayerMatchStats = {
  goals: 0, assists: 0, faults: 0, yellowCards: 0, redCard: false, timePlayed: 0,
}

// ─── Star rating picker (1–5) ─────────────────────────────────────────────
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
          aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              n <= (hovered || value)
                ? 'fill-amber-400 stroke-amber-400'
                : 'fill-muted stroke-muted-foreground/40'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

// ─── Rating label ─────────────────────────────────────────────────────────
function ratingLabel(r: number): { label: string; color: string } | null {
  const labels = ['', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent']
  const colors = ['', 'text-red-500', 'text-orange-500', 'text-yellow-600', 'text-blue-600', 'text-green-600']
  return r > 0 ? { label: labels[r], color: colors[r] } : null
}

// ─── Stat counter ─────────────────────────────────────────────────────────
function StatCounter({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-xs text-muted-foreground text-center leading-tight">{label}</p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="h-6 w-6 rounded border bg-muted text-xs font-bold hover:bg-muted/70 transition-colors disabled:opacity-40"
          disabled={value <= min}
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-semibold tabular-nums">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="h-6 w-6 rounded border bg-muted text-xs font-bold hover:bg-muted/70 transition-colors disabled:opacity-40"
          disabled={value >= max}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default function EvaluationSection({ players, context }: EvaluationSectionProps) {
  const [global, setGlobal] = useState<GlobalEvaluation>({
    overallRating: 0,
    positives: '',
    improvements: '',
    notes: '',
  })

  const [playerEvals, setPlayerEvals] = useState<Record<number, PlayerEvaluation>>({})
  const [expandedPlayer, setExpandedPlayer] = useState<number | null>(null)
  const [saved, setSaved] = useState(false)

  function setPlayerField<K extends keyof PlayerEvaluation>(
    id: number,
    key: K,
    value: PlayerEvaluation[K],
  ) {
    setPlayerEvals((prev) => {
      const current: PlayerEvaluation = prev[id] ?? { rating: 0, comment: '' }
      return { ...prev, [id]: { ...current, [key]: value } }
    })
    setSaved(false)
  }

  function setMatchStat<K extends keyof PlayerMatchStats>(id: number, key: K, value: PlayerMatchStats[K]) {
    setPlayerEvals((prev) => {
      const current = prev[id] ?? { rating: 0, comment: '' }
      return {
        ...prev,
        [id]: { ...current, matchStats: { ...EMPTY_STATS, ...current.matchStats, [key]: value } },
      }
    })
    setSaved(false)
  }

  function setGlobalField<K extends keyof GlobalEvaluation>(key: K, value: GlobalEvaluation[K]) {
    setGlobal((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const evaluatedCount = Object.values(playerEvals).filter((e) => e.rating > 0).length

  const globalLabel =
    context === 'match' ? 'Match Evaluation' : 'Session Evaluation'
  const positivesLabel =
    context === 'match' ? 'Key Positives' : 'Session Highlights'
  const improvementsLabel =
    context === 'match' ? 'Areas to Improve' : 'Focus for Next Session'

  return (
    <div className="space-y-4">
      {/* ── Global evaluation ─────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            {globalLabel}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Overall Rating</Label>
            <RatingPicker
              value={global.overallRating}
              onChange={(v) => setGlobalField('overallRating', v)}
            />
            {(() => {
              const info = ratingLabel(global.overallRating)
              return info ? <p className={`text-sm font-medium ${info.color}`}>{info.label}</p> : null
            })()}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{positivesLabel}</Label>
              <Textarea
                placeholder={
                  context === 'match'
                    ? 'Goals, pressing quality, set pieces…'
                    : 'Good energy, strong tactical work…'
                }
                value={global.positives}
                onChange={(e) => setGlobalField('positives', e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{improvementsLabel}</Label>
              <Textarea
                placeholder={
                  context === 'match'
                    ? 'Defensive shape, transition speed…'
                    : 'Concentration levels, finishing…'
                }
                value={global.improvements}
                onChange={(e) => setGlobalField('improvements', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Additional Notes</Label>
            <Textarea
              placeholder="Free-form observations, tactical notes, staff comments…"
              value={global.notes}
              onChange={(e) => setGlobalField('notes', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Per-player evaluations ────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Player Evaluations
              {evaluatedCount > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {evaluatedCount}/{players.length} rated
                </Badge>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {players.map((p) => {
              const ev = playerEvals[p.id]
              const stats = ev?.matchStats
              const isOpen = expandedPlayer === p.id
              const rl = ratingLabel(ev?.rating ?? 0)

              // Summary badges for the collapsed row
              const hasStats = context === 'match' && stats && (
                stats.goals > 0 || stats.assists > 0 || stats.yellowCards > 0 || stats.redCard || stats.timePlayed > 0
              )

              return (
                <div key={p.id}>
                  {/* Player row (collapsed) */}
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-6 py-3 hover:bg-muted/40 transition-colors text-left"
                    onClick={() => setExpandedPlayer(isOpen ? null : p.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-6 text-right">
                        #{p.number}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {hasStats && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          {stats.goals > 0 && <span className="text-green-600 font-semibold">{stats.goals}G</span>}
                          {stats.assists > 0 && <span className="text-blue-600 font-semibold">{stats.assists}A</span>}
                          {stats.yellowCards > 0 && <span className="inline-block w-3 h-4 bg-yellow-400 rounded-sm" title="Yellow card" />}
                          {stats.redCard && <span className="inline-block w-3 h-4 bg-red-500 rounded-sm" title="Red card" />}
                          {stats.timePlayed > 0 && <span>{stats.timePlayed}'</span>}
                        </div>
                      )}
                      {ev?.rating > 0 ? (
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star key={n} className={`h-3.5 w-3.5 ${n <= ev.rating ? 'fill-amber-400 stroke-amber-400' : 'fill-muted stroke-muted-foreground/30'}`} />
                          ))}
                          {rl && <span className={`text-xs font-medium ${rl.color}`}>{rl.label}</span>}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not rated</span>
                      )}
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Expanded form */}
                  {isOpen && (
                    <div className="px-6 pb-5 space-y-4 bg-muted/20">
                      <Separator />

                      {/* Match stats — only for match context */}
                      {context === 'match' && (
                        <div className="space-y-3 pt-1">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Match Stats</p>
                          <div className="flex flex-wrap gap-5">
                            <StatCounter label="Goals" value={stats?.goals ?? 0} onChange={(v) => setMatchStat(p.id, 'goals', v)} max={20} />
                            <StatCounter label="Assists" value={stats?.assists ?? 0} onChange={(v) => setMatchStat(p.id, 'assists', v)} max={20} />
                            <StatCounter label="Faults" value={stats?.faults ?? 0} onChange={(v) => setMatchStat(p.id, 'faults', v)} max={20} />
                            <StatCounter label="Yellow Cards" value={stats?.yellowCards ?? 0} onChange={(v) => setMatchStat(p.id, 'yellowCards', v)} max={2} />
                            <div className="flex flex-col items-center gap-1">
                              <p className="text-xs text-muted-foreground text-center leading-tight">Red Card</p>
                              <button
                                type="button"
                                onClick={() => setMatchStat(p.id, 'redCard', !(stats?.redCard ?? false))}
                                className={`h-6 w-10 rounded transition-colors font-bold text-xs ${
                                  stats?.redCard
                                    ? 'bg-red-500 text-white'
                                    : 'bg-muted text-muted-foreground hover:bg-red-100'
                                }`}
                              >
                                {stats?.redCard ? 'Yes' : 'No'}
                              </button>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <p className="text-xs text-muted-foreground text-center leading-tight">Minutes<br/>Played</p>
                              <Input
                                type="number"
                                min={0}
                                max={120}
                                value={stats?.timePlayed ?? ''}
                                onChange={(e) => setMatchStat(p.id, 'timePlayed', Number(e.target.value))}
                                className="h-7 w-16 text-center text-sm px-1"
                                placeholder="90"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Rating */}
                      <div className="space-y-1.5 pt-1">
                        <Label className="text-xs">
                          {context === 'match' ? 'Match Performance' : 'Session Performance'} Rating
                        </Label>
                        <RatingPicker
                          value={ev?.rating ?? 0}
                          onChange={(v) => setPlayerField(p.id, 'rating', v)}
                        />
                        {(() => {
                          const info = ratingLabel(ev?.rating ?? 0)
                          return info ? <p className={`text-xs font-medium ${info.color}`}>{info.label}</p> : null
                        })()}
                      </div>

                      {/* Comment */}
                      <div className="space-y-1.5">
                        <Label className="text-xs">Comments</Label>
                        <Textarea
                          placeholder={
                            context === 'match'
                              ? 'Positioning, contributions, key moments…'
                              : 'Effort, execution, attitude during session…'
                          }
                          value={ev?.comment ?? ''}
                          onChange={(e) => setPlayerField(p.id, 'comment', e.target.value)}
                          rows={2}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Save ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3">
        {saved && (
          <p className="text-sm text-green-600 font-medium">Evaluation saved!</p>
        )}
        <Button onClick={handleSave}>Save Evaluation</Button>
      </div>
    </div>
  )
}
