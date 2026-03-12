'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Trophy, MapPin, FileText, Calendar, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useMatch, usePlayers } from '@/lib/queries'
import EvaluationSection from '@/components/evaluations/EvaluationSection'
import type { MatchResult } from '@/lib/types'
import type { BadgeProps } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const RESULT_VARIANT: Record<MatchResult, BadgeProps['variant']> = {
  Win: 'default', Draw: 'secondary', Loss: 'destructive', Upcoming: 'outline',
}

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default function MatchDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { data: match, isLoading } = useMatch(Number(params.id))
  const { data: players = [] } = usePlayers()

  if (isLoading) return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-36" />
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-16 w-40" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-28" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
  if (!match) return (
    <div className="space-y-4 text-center py-16">
      <p className="text-lg font-semibold">Match not found</p>
      <Button variant="ghost" onClick={() => router.push('/matches')}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Matches
      </Button>
    </div>
  )

  const isPlayed = match.result !== 'Upcoming'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/matches')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">vs {match.opponent}</h1>
          <p className="text-muted-foreground">{match.competition}</p>
        </div>
      </div>

      {/* Hero score card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">{match.venue}</Badge>
              <Badge variant={RESULT_VARIANT[match.result]} className="text-sm px-3 py-1">{match.result}</Badge>
            </div>
            {isPlayed ? (
              <p className={`text-6xl font-black tabular-nums tracking-tighter ${match.result === 'Win' ? 'text-green-600' : match.result === 'Loss' ? 'text-red-500' : 'text-yellow-600'}`}>
                {match.goalsFor} – {match.goalsAgainst}
              </p>
            ) : (
              <p className="text-4xl font-bold text-muted-foreground">TBD</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Match info */}
      <Card>
        <CardHeader><CardTitle className="text-base">Match Details</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Date</p>
              <p className="font-medium flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-muted-foreground" />{formatDate(match.date)}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Kick-off</p>
              <p className="font-medium flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-muted-foreground" />{match.time}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Competition</p>
              <p className="font-medium flex items-center gap-1.5"><Trophy className="h-3.5 w-3.5 text-muted-foreground" />{match.competition}</p>
            </div>
            {match.location && (
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                <p className="font-medium flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />{match.location}</p>
              </div>
            )}
          </div>
          {match.notes && (
            <>
              <Separator className="my-4" />
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Notes</p>
                <p className="text-sm">{match.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Create report */}
      {isPlayed && (
        <div className="flex justify-end">
          <Button onClick={() => router.push('/reports/new/match')}>
            <FileText className="h-4 w-4 mr-2" /> Create Match Report
          </Button>
        </div>
      )}

      {/* Evaluations */}
      {isPlayed && (
        <Card>
          <CardHeader><CardTitle className="text-base">Player Evaluations</CardTitle></CardHeader>
          <CardContent>
            <EvaluationSection players={players} context="match" />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
