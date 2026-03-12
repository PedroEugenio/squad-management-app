import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Clock, MapPin, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type Practice, INITIAL_PRACTICES } from '@/pages/PracticesPage'
import { INITIAL_PLAYERS } from '@/pages/SquadPage'
import EvaluationSection from '@/components/evaluations/EvaluationSection'

const TYPE_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  Tactical: 'default',
  Physical: 'secondary',
  Technical: 'outline',
  Recovery: 'outline',
  'Set Pieces': 'secondary',
}

const TYPE_DESCRIPTION: Record<string, string> = {
  Tactical: 'Focus on team shape, pressing triggers, positional play and set-piece organisation.',
  Physical: 'High-intensity conditioning work targeting cardiovascular fitness, speed and explosive power.',
  Technical: 'Individual and small-group work on ball control, passing, finishing and positional skills.',
  Recovery: 'Low-intensity session designed to aid muscle recovery, reduce soreness and restore mobility.',
  'Set Pieces': 'Dedicated session for corner kicks, free-kicks, throw-ins and defensive set-piece organisation.',
}

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default function PracticeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  const practice: Practice | undefined =
    (location.state as { practice?: Practice })?.practice ??
    INITIAL_PRACTICES.find((p) => p.id === Number(id))

  if (!practice) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate('/practices')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Practices
        </Button>
        <p className="text-muted-foreground">Training session not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="-ml-2" onClick={() => navigate('/practices')}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Practices
      </Button>

      {/* Hero */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-5">
            <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-muted shrink-0">
              <CalendarDays className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-bold tracking-tight">{formatDate(practice.date)}</h1>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge variant={TYPE_VARIANT[practice.type]}>{practice.type}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {practice.time} · {practice.duration}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Session Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Time & Duration</p>
                <p className="font-medium">{practice.time} · {practice.duration}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Location</p>
                <p className="font-medium">{practice.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Attendance</p>
                <p className="font-medium">{practice.attendance} players</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDays className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Session Type</p>
                <Badge variant={TYPE_VARIANT[practice.type]}>{practice.type}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Focus */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Session Focus — {practice.type}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {TYPE_DESCRIPTION[practice.type]}
          </p>
        </CardContent>
      </Card>

      {/* Coaching Notes */}
      {practice.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Coaching Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{practice.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Evaluations */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Evaluations</h2>
        <EvaluationSection players={INITIAL_PLAYERS} context="practice" />
      </div>
    </div>
  )
}
