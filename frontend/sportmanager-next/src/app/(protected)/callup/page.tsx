'use client'

import { useState } from 'react'
import { UserCheck, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { usePlayers, useStaff } from '@/lib/queries'
import type { PlayerStatus } from '@/lib/types'
import type { BadgeProps } from '@/components/ui/badge'

const STATUS_VARIANT: Record<PlayerStatus, BadgeProps['variant']> = {
  Fit: 'default', Injured: 'destructive', Suspended: 'secondary', Doubtful: 'outline',
}

const NEXT_MATCH = { date: 'Jun 15, 2025', time: '20:45', competition: 'Primeira Liga', opponent: 'FC Porto', venue: 'Home' }

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function CallupPage() {
  const { data: players = [] } = usePlayers()
  const { data: staff = [] } = useStaff()

  const [selectedPlayers, setSelectedPlayers] = useState<Set<number>>(new Set())
  const [selectedStaff, setSelectedStaff] = useState<Set<number>>(new Set())
  const [confirmed, setConfirmed] = useState(false)

  function togglePlayer(id: number) {
    setSelectedPlayers((s) => {
      const next = new Set(s)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleStaff(id: number) {
    setSelectedStaff((s) => {
      const next = new Set(s)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function selectAllPlayers() { setSelectedPlayers(new Set(players.filter((p) => p.status === 'Fit').map((p) => p.id))) }
  function clearPlayers() { setSelectedPlayers(new Set()) }
  function selectAllStaff() { setSelectedStaff(new Set(staff.map((s) => s.id))) }
  function clearStaff() { setSelectedStaff(new Set()) }

  const total = selectedPlayers.size + selectedStaff.size

  if (confirmed) return (
    <div className="flex flex-col items-center justify-center gap-5 py-20">
      <UserCheck className="h-16 w-16 text-green-500" />
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Callup Confirmed</h2>
        <p className="text-muted-foreground mt-1">
          {selectedPlayers.size} player{selectedPlayers.size !== 1 ? 's' : ''} and {selectedStaff.size} staff member{selectedStaff.size !== 1 ? 's' : ''} called up for {NEXT_MATCH.opponent}.
        </p>
      </div>
      <Button variant="outline" onClick={() => { setConfirmed(false); setSelectedPlayers(new Set()); setSelectedStaff(new Set()) }}>
        Reset
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Callup</h1>
        <p className="text-muted-foreground">Select squad members for the next match</p>
      </div>

      {/* Next match banner */}
      <Card className="bg-muted/40">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-1.5 font-semibold">
              <span>Next Match:</span>
              <span>vs {NEXT_MATCH.opponent}</span>
              <Badge variant="outline">{NEXT_MATCH.venue}</Badge>
            </div>
            <div className="text-muted-foreground">{NEXT_MATCH.date} · {NEXT_MATCH.time} · {NEXT_MATCH.competition}</div>
          </div>
        </CardContent>
      </Card>

      {/* Players */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Players
              <Badge variant={selectedPlayers.size > 0 ? 'default' : 'outline'}>{selectedPlayers.size}/{players.length}</Badge>
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAllPlayers}>Select Fit</Button>
              <Button variant="ghost" size="sm" onClick={clearPlayers}>Clear</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {players.map((p) => {
              const selected = selectedPlayers.has(p.id)
              const disabled = p.status === 'Injured' || p.status === 'Suspended'
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && togglePlayer(p.id)}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors
                    ${selected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs">{initials(p.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.position} · #{p.number}</p>
                  </div>
                  <Badge variant={STATUS_VARIANT[p.status]} className="shrink-0">{p.status}</Badge>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Staff */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Staff
              <Badge variant={selectedStaff.size > 0 ? 'default' : 'outline'}>{selectedStaff.size}/{staff.length}</Badge>
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAllStaff}>Select All</Button>
              <Button variant="ghost" size="sm" onClick={clearStaff}>Clear</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {staff.map((s) => {
              const selected = selectedStaff.has(s.id)
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleStaff(s.id)}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors cursor-pointer
                    ${selected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}
                  `}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs">{initials(s.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.role}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Separator />
      <div className="flex items-center justify-between pb-8">
        <p className="text-sm text-muted-foreground">{total} member{total !== 1 ? 's' : ''} selected</p>
        <Button onClick={() => setConfirmed(true)} disabled={total === 0} className="min-w-40">
          Confirm Callup ({total})
        </Button>
      </div>
    </div>
  )
}
