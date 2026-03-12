import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Shirt } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { type Player, INITIAL_PLAYERS } from '@/pages/SquadPage'

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Fit: 'default',
  Injured: 'destructive',
  Suspended: 'secondary',
  Doubtful: 'outline',
}

// Mock season stats per player id
const SEASON_STATS: Record<number, { appearances: number; goals: number; assists: number; yellowCards: number; redCards: number; minutesPlayed: number }> = {
  1: { appearances: 18, goals: 0, assists: 0, yellowCards: 1, redCards: 0, minutesPlayed: 1620 },
  2: { appearances: 16, goals: 0, assists: 3, yellowCards: 3, redCards: 0, minutesPlayed: 1380 },
  3: { appearances: 17, goals: 1, assists: 0, yellowCards: 2, redCards: 0, minutesPlayed: 1530 },
  4: { appearances: 8,  goals: 0, assists: 1, yellowCards: 1, redCards: 0, minutesPlayed: 672 },
  5: { appearances: 18, goals: 1, assists: 4, yellowCards: 2, redCards: 0, minutesPlayed: 1594 },
  6: { appearances: 17, goals: 2, assists: 5, yellowCards: 4, redCards: 0, minutesPlayed: 1500 },
  7: { appearances: 18, goals: 6, assists: 7, yellowCards: 2, redCards: 0, minutesPlayed: 1558 },
  8: { appearances: 14, goals: 3, assists: 2, yellowCards: 1, redCards: 0, minutesPlayed: 1080 },
  9: { appearances: 12, goals: 2, assists: 1, yellowCards: 3, redCards: 1, minutesPlayed: 870 },
  10: { appearances: 18, goals: 9, assists: 4, yellowCards: 2, redCards: 0, minutesPlayed: 1571 },
  11: { appearances: 15, goals: 5, assists: 2, yellowCards: 1, redCards: 0, minutesPlayed: 1102 },
}

export default function PlayerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  const player: Player | undefined =
    (location.state as { player?: Player })?.player ??
    INITIAL_PLAYERS.find((p) => p.id === Number(id))

  if (!player) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate('/squad')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Squad
        </Button>
        <p className="text-muted-foreground">Player not found.</p>
      </div>
    )
  }

  const stats = SEASON_STATS[player.id] ?? { appearances: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutesPlayed: 0 }

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="-ml-2" onClick={() => navigate('/squad')}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Squad
      </Button>

      {/* Hero */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-primary shrink-0">
              <span className="text-primary-foreground text-3xl font-black">#{player.number}</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight">{player.name}</h1>
                <Badge variant={STATUS_VARIANT[player.status]}>{player.status}</Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shirt className="h-4 w-4" />
                <span className="text-sm">{player.position}</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm">{player.nationality}</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm">{player.age} years old</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Season Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Season Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {[
              { label: 'Appearances', value: stats.appearances },
              { label: 'Goals', value: stats.goals },
              { label: 'Assists', value: stats.assists },
              { label: 'Yellow Cards', value: stats.yellowCards },
              { label: 'Red Cards', value: stats.redCards },
              { label: 'Minutes', value: stats.minutesPlayed.toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} className="text-center space-y-1">
                <p className="text-2xl font-bold tabular-nums">{value}</p>
                <p className="text-xs text-muted-foreground leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Player Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Player Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Squad Number</p>
              <p className="font-semibold text-lg">#{player.number}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Position</p>
              <p className="font-medium">{player.position}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Nationality</p>
              <p className="font-medium">{player.nationality}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Age</p>
              <p className="font-medium">{player.age}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
