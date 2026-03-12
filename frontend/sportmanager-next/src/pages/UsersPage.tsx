import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreVertical, Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface StaffMember {
  id: number
  name: string
  email: string
  role: string
  status: string
  phone?: string
  joined?: string
}

export const USERS: StaffMember[] = [
  { id: 1, name: 'James Hartley', email: 'j.hartley@club.com', role: 'Head Coach', status: 'Active', phone: '+351 912 000 001', joined: '2023-07-01' },
  { id: 2, name: 'Sofia Andrade', email: 's.andrade@club.com', role: 'Team Doctor', status: 'Active', phone: '+351 912 000 002', joined: '2023-07-01' },
  { id: 3, name: 'Marco Silva', email: 'm.silva@club.com', role: 'Fitness Coach', status: 'Active', phone: '+351 912 000 003', joined: '2024-01-15' },
  { id: 4, name: 'Carlos Mendes', email: 'c.mendes@club.com', role: 'Scout', status: 'Active', phone: '+351 912 000 004', joined: '2024-06-01' },
  { id: 5, name: 'Ana Ferreira', email: 'a.ferreira@club.com', role: 'Analyst', status: 'Active', phone: '+351 912 000 005', joined: '2024-02-10' },
  { id: 6, name: 'Rui Costa', email: 'r.costa@club.com', role: 'Asst. Coach', status: 'Inactive', phone: '+351 912 000 006', joined: '2022-08-01' },
  { id: 7, name: 'Pedro Nunes', email: 'p.nunes@club.com', role: 'Physio', status: 'Pending', phone: '+351 912 000 007', joined: '2026-03-01' },
]

function getInitials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  Active: 'default',
  Inactive: 'secondary',
  Pending: 'outline',
}

export default function UsersPage() {
  const navigate = useNavigate()
  const [preview, setPreview] = useState<StaffMember | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff</h1>
          <p className="text-muted-foreground">Manage coaching staff, medical team and analysts</p>
        </div>
        <Button>Add Staff Member</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Staff Members{' '}
            <Badge className="ml-2">{USERS.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {USERS.map((u) => (
              <div key={u.email} className="flex items-center justify-between gap-4 rounded-lg border p-3 hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => setPreview(u)}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                    {getInitials(u.name)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Badge variant="outline">{u.role}</Badge>
                  <Badge variant={STATUS_VARIANT[u.status]}>{u.status}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="User actions">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Change Role</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview modal */}
      <Dialog open={!!preview} onOpenChange={(v) => !v && setPreview(null)}>
        {preview && (
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                  {getInitials(preview.name)}
                </div>
                {preview.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-1">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Role</p>
                  <p className="font-medium">{preview.role}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                  <Badge variant={STATUS_VARIANT[preview.status]}>{preview.status}</Badge>
                </div>
                <div className="space-y-0.5 col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                  <p className="font-medium">{preview.email}</p>
                </div>
                {preview.phone && (
                  <div className="space-y-0.5 col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Phone</p>
                    <p className="font-medium">{preview.phone}</p>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="flex-1">Close</Button>
              </DialogClose>
              <Button className="flex-1" onClick={() => navigate(`/staff/${preview.id}`, { state: { staff: preview } })}>
                <Eye className="h-3.5 w-3.5 mr-1" /> View Profile
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
