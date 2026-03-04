import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, ChevronLeft, UserCheck, Users, CheckCircle2, Circle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { INITIAL_PLAYERS } from '@/pages/SquadPage'
import { USERS } from '@/pages/UsersPage'

// Next upcoming match info (mirrors MatchesPage data)
const NEXT_MATCH = {
  opponent: 'FC Porto',
  date: 'Sunday, 8 March 2026',
  venue: 'Estádio do Dragão',
  location: 'Away',
  competition: 'Primeira Liga',
  kickoff: '18:00',
}

export default function CallupPage() {
  const navigate = useNavigate()

  const [selectedPlayers, setSelectedPlayers] = useState<Set<number>>(new Set())
  const [selectedStaff, setSelectedStaff] = useState<Set<number>>(new Set())
  const [saved, setSaved] = useState(false)

  function togglePlayer(id: number) {
    setSelectedPlayers((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
    setSaved(false)
  }

  function selectAllPlayers() {
    setSelectedPlayers(new Set(INITIAL_PLAYERS.map((p) => p.id)))
    setSaved(false)
  }

  function clearPlayers() {
    setSelectedPlayers(new Set())
    setSaved(false)
  }

  function toggleStaff(id: number) {
    setSelectedStaff((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
    setSaved(false)
  }

  function selectAllStaff() {
    setSelectedStaff(new Set(USERS.map((u) => u.id)))
    setSaved(false)
  }

  function clearStaff() {
    setSelectedStaff(new Set())
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const playerCount = selectedPlayers.size
  const staffCount = selectedStaff.size

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Callup</h1>
          <p className="text-muted-foreground">Select players and staff for the next match</p>
        </div>
      </div>

      {/* Next match banner */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{NEXT_MATCH.competition}</Badge>
                <Badge variant="secondary" className="text-xs">{NEXT_MATCH.location}</Badge>
              </div>
              <h2 className="text-xl font-bold">vs {NEXT_MATCH.opponent}</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {NEXT_MATCH.date} · {NEXT_MATCH.kickoff}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {NEXT_MATCH.venue}
                </span>
              </div>
            </div>
            <div className="flex gap-3 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{playerCount}</p>
                <p className="text-xs text-muted-foreground">Players</p>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div>
                <p className="text-2xl font-bold text-primary">{staffCount}</p>
                <p className="text-xs text-muted-foreground">Staff</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player selection */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                Players
                {playerCount > 0 && (
                  <Badge variant="secondary" className="text-xs ml-1">{playerCount} selected</Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-0.5">Select players to call up for this match</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAllPlayers}>Select All</Button>
              <Button variant="ghost" size="sm" onClick={clearPlayers} disabled={playerCount === 0}>Clear</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {INITIAL_PLAYERS.map((player) => {
              const selected = selectedPlayers.has(player.id)
              return (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => togglePlayer(player.id)}
                  className={`w-full flex items-center justify-between px-6 py-3 transition-colors text-left ${
                    selected ? 'bg-primary/8 hover:bg-primary/12' : 'hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {selected ? (
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                    )}
                    <span className="text-xs font-bold text-muted-foreground w-6 text-right">#{player.number}</span>
                    <div>
                      <p className="text-sm font-medium">{player.name}</p>
                      <p className="text-xs text-muted-foreground">{player.position}</p>
                    </div>
                  </div>
                  {selected && <Badge className="text-xs">Called Up</Badge>}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Staff selection */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <UserCheck className="h-4 w-4" />
                Staff
                {staffCount > 0 && (
                  <Badge variant="secondary" className="text-xs ml-1">{staffCount} selected</Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-0.5">Select staff members travelling with the team</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAllStaff}>Select All</Button>
              <Button variant="ghost" size="sm" onClick={clearStaff} disabled={staffCount === 0}>Clear</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {USERS.map((member) => {
              const selected = selectedStaff.has(member.id)
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => toggleStaff(member.id)}
                  className={`w-full flex items-center justify-between px-6 py-3 transition-colors text-left ${
                    selected ? 'bg-primary/8 hover:bg-primary/12' : 'hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {selected ? (
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                    )}
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0">
                      {member.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  {selected && <Badge className="text-xs">Travelling</Badge>}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex items-center justify-end gap-3 pb-6">
        {saved && (
          <p className="text-sm text-green-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" /> Callup saved!
          </p>
        )}
        <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        <Button onClick={handleSave} disabled={playerCount === 0}>
          Confirm Callup ({playerCount} players, {staffCount} staff)
        </Button>
      </div>
    </div>
  )
}
