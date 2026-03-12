import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { type StaffMember, USERS } from '@/pages/UsersPage'

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  Active: 'default',
  Inactive: 'secondary',
  Pending: 'outline',
}

const RESPONSIBILITIES: Record<string, string[]> = {
  'Head Coach': ['Tactical preparation and match strategy', 'Squad selection and lineups', 'Player development oversight', 'Press conferences and media'],
  'Team Doctor': ['Player medical assessments', 'Injury diagnosis and treatment', 'Match-day medical cover', 'Medical records management'],
  'Fitness Coach': ['Physical conditioning programmes', 'Pre/post-match warm-up & cool-down', 'Load monitoring and recovery', 'GPS data analysis'],
  'Scout': ['Opposition analysis reports', 'Player recruitment scouting', 'Video analysis preparation', 'Youth talent identification'],
  'Analyst': ['Match data and statistics', 'Video tagging and editing', 'Performance reports', 'Opponent dossiers'],
  'Asst. Coach': ['Training session delivery', 'Set-piece design', 'Individual player coaching', 'Head Coach support'],
  'Physio': ['Injury rehabilitation', 'Soft tissue therapy', 'Return-to-play protocols', 'Injury prevention exercises'],
}

function getInitials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function StaffDetailPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  const staff: StaffMember | undefined =
    (location.state as { staff?: StaffMember })?.staff ??
    USERS.find((u) => u.id === Number(id))

  if (!staff) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate('/users')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Staff
        </Button>
        <p className="text-muted-foreground">Staff member not found.</p>
      </div>
    )
  }

  const responsibilities = RESPONSIBILITIES[staff.role] ?? []

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="-ml-2" onClick={() => navigate('/users')}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Staff
      </Button>

      {/* Hero */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary shrink-0">
              <span className="text-primary-foreground text-2xl font-bold">{getInitials(staff.name)}</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight">{staff.name}</h1>
                <Badge variant={STATUS_VARIANT[staff.status]}>{staff.status}</Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground flex-wrap">
                <Badge variant="outline">{staff.role}</Badge>
                {staff.joined && (
                  <>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="text-sm flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Since {formatDate(staff.joined)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>{staff.email}</span>
          </div>
          {staff.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>{staff.phone}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Responsibilities */}
      {responsibilities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Key Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {responsibilities.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
