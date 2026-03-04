import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Trophy, CalendarDays, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { type Match, INITIAL_MATCHES } from '@/pages/MatchesPage'
import { INITIAL_PLAYERS } from '@/pages/SquadPage'
import EvaluationSection from '@/components/evaluations/EvaluationSection'

const RESULT_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Win: 'default',
  Draw: 'secondary',
  Loss: 'destructive',
  Upcoming: 'outline',
}

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  const match: Match | undefined =
    (location.state as { match?: Match })?.match ??
    INITIAL_MATCHES.find((m) => m.id === Number(id))

  if (!match) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate('/matches')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Matches
        </Button>
        <p className="text-muted-foreground">Match not found.</p>
      </div>
    )
  }

  const isPlayed = match.result !== 'Upcoming'

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="-ml-2" onClick={() => navigate('/matches')}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Matches
      </Button>

      {/* Hero */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 text-center sm:text-left sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-muted shrink-0">
                <Trophy className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">vs {match.opponent}</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap justify-center sm:justify-start">
                  <Badge variant={RESULT_VARIANT[match.result]}>{match.result}</Badge>
                  <Badge variant="outline">{match.venue}</Badge>
                  <Badge variant="outline">{match.competition}</Badge>
                </div>
              </div>
            </div>
            {isPlayed && (
              <div className="text-center shrink-0">
                <p className="text-5xl font-black tabular-nums">
                  <span className={match.result === 'Win' ? 'text-green-600' : match.result === 'Loss' ? 'text-red-500' : 'text-yellow-600'}>
                    {match.goalsFor}
                  </span>
                  <span className="text-muted-foreground mx-2">–</span>
                  <span className={match.result === 'Loss' ? 'text-green-600' : match.result === 'Win' ? 'text-red-500' : 'text-yellow-600'}>
                    {match.goalsAgainst}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">Final score</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Match Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Match Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <CalendarDays className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Date</p>
                <p className="font-medium">{formatDate(match.date)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Kick-off</p>
                <p className="font-medium">{match.time}</p>
              </div>
            </div>
            {match.location && (
              <div className="flex items-start gap-3 sm:col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Stadium</p>
                  <p className="font-medium">{match.location}</p>
                </div>
              </div>
            )}
          </div>
          {isPlayed && (
            <>
              <Separator className="my-4" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-black text-green-600 tabular-nums">{match.goalsFor}</p>
                  <p className="text-xs text-muted-foreground">Goals For</p>
                </div>
                <div>
                  <p className="text-3xl font-black tabular-nums">–</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-red-500 tabular-nums">{match.goalsAgainst}</p>
                  <p className="text-xs text-muted-foreground">Goals Against</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Notes / Report */}
      {match.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Match Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{match.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Evaluations */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Evaluations</h2>
        <EvaluationSection players={INITIAL_PLAYERS} context="match" />
      </div>
    </div>
  )
}
