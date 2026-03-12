'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Search,
  BookOpen,
  Clock,
  Users,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Youtube,
  Image as ImageIcon,
} from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import {
  DRILL_CATEGORIES,
  DRILL_LEVELS,
  DRILL_OBJECTIVES,
  DRILL_EQUIPMENT,
  DRILL_SPACES,
  drillSchema,
  type DrillFormValues,
} from '@/schemas/drill'
import { useDrills, useCreateDrill, useUpdateDrill, useDeleteDrill } from '@/lib/queries'
import type { Drill } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

// ─── Level colour map ──────────────────────────────────────────────────────────
const LEVEL_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Beginner:     'outline',
  Intermediate: 'secondary',
  Advanced:     'default',
  Elite:        'destructive',
}

const CATEGORY_COLOUR: Record<string, string> = {
  Tactical:    'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  Technical:   'bg-green-500/10 text-green-700 dark:text-green-300',
  Physical:    'bg-orange-500/10 text-orange-700 dark:text-orange-300',
  'Warm-up':   'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
  Goalkeeping: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function defaultValues(drill?: Drill): DrillFormValues {
  if (!drill) {
    return {
      title: '', description: '', category: 'Technical', level: 'Beginner',
      durationMins: 15, playersMin: 4, playersMax: 12,
      objectives: [], equipment: [], space: 'Half pitch',
      coachingPoints: [''], imageUrl: '', youtubeId: '', tags: [],
    }
  }
  return {
    title: drill.title,
    description: drill.description,
    category: drill.category,
    level: drill.level,
    durationMins: drill.durationMins,
    playersMin: drill.playersMin,
    playersMax: drill.playersMax,
    objectives: drill.objectives,
    equipment: drill.equipment,
    space: drill.space,
    coachingPoints: drill.coachingPoints,
    imageUrl: drill.imageUrl ?? '',
    youtubeId: drill.youtubeId ?? '',
    tags: drill.tags,
  }
}

// ─── Drill Card ───────────────────────────────────────────────────────────────
function DrillCard({
  drill,
  onView,
  onEdit,
  onDelete,
}: {
  drill: Drill
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
      {/* Thumbnail */}
      <div
        className="relative h-36 bg-muted flex items-center justify-center overflow-hidden"
        onClick={onView}
      >
        {drill.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={drill.imageUrl}
            alt={drill.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
        ) : drill.youtubeId ? (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <Youtube className="h-8 w-8 text-red-500" />
            <span className="text-xs">Video available</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <ImageIcon className="h-8 w-8" aria-hidden />
            <span className="text-xs">No visual</span>
          </div>
        )}
        <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLOUR[drill.category] ?? ''}`}>
          {drill.category}
        </span>
      </div>

      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="font-semibold text-sm leading-snug line-clamp-2 flex-1 cursor-pointer hover:underline"
            onClick={onView}
          >
            {drill.title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>
                <Eye className="h-4 w-4 mr-2" /> View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <Badge variant={LEVEL_VARIANT[drill.level]} className="text-xs">{drill.level}</Badge>
          <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />{drill.durationMins} min
          </span>
          <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />{drill.playersMin}–{drill.playersMax}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── CRUD Dialog ──────────────────────────────────────────────────────────────
function DrillDialog({
  open,
  drill,
  onClose,
}: {
  open: boolean
  drill?: Drill
  onClose: () => void
}) {
  const create = useCreateDrill()
  const update = useUpdateDrill()
  const isEdit = !!drill

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DrillFormValues>({
    resolver: zodResolver(drillSchema),
    defaultValues: defaultValues(drill),
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'coachingPoints' as never })

  const objectivesVal = watch('objectives')
  const equipmentVal  = watch('equipment')

  function toggleMulti(field: 'objectives' | 'equipment', value: string) {
    const current = (field === 'objectives' ? objectivesVal : equipmentVal) as string[]
    if (current.includes(value)) {
      setValue(field, current.filter((v) => v !== value) as never, { shouldValidate: true })
    } else {
      setValue(field, [...current, value] as never, { shouldValidate: true })
    }
  }

  async function onSubmit(data: DrillFormValues) {
    const payload = {
      ...data,
      imageUrl:  data.imageUrl  || undefined,
      youtubeId: data.youtubeId || undefined,
    }
    if (isEdit) {
      await update.mutateAsync({ id: drill.id, data: payload })
    } else {
      await create.mutateAsync(payload)
    }
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Drill' : 'New Drill'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title */}
          <div className="space-y-1">
            <Label>Title</Label>
            <Input {...register('title')} placeholder="e.g. Rondo 4v2" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea {...register('description')} rows={3} placeholder="Describe the drill…" />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          {/* Category + Level */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Category</Label>
              <Select defaultValue={drill?.category ?? 'Technical'} onValueChange={(v) => setValue('category', v as DrillFormValues['category'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DRILL_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Level</Label>
              <Select defaultValue={drill?.level ?? 'Beginner'} onValueChange={(v) => setValue('level', v as DrillFormValues['level'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DRILL_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration + Players */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label>Duration (min)</Label>
              <Input type="number" {...register('durationMins', { valueAsNumber: true })} min={1} max={120} />
              {errors.durationMins && <p className="text-xs text-destructive">{errors.durationMins.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Players min</Label>
              <Input type="number" {...register('playersMin', { valueAsNumber: true })} min={1} />
              {errors.playersMin && <p className="text-xs text-destructive">{errors.playersMin.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Players max</Label>
              <Input type="number" {...register('playersMax', { valueAsNumber: true })} min={1} />
              {errors.playersMax && <p className="text-xs text-destructive">{errors.playersMax.message}</p>}
            </div>
          </div>

          {/* Space */}
          <div className="space-y-1">
            <Label>Space</Label>
            <Select defaultValue={drill?.space ?? 'Half pitch'} onValueChange={(v) => setValue('space', v as DrillFormValues['space'])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DRILL_SPACES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Objectives */}
          <div className="space-y-1">
            <Label>Objectives</Label>
            <div className="flex flex-wrap gap-2 p-3 rounded-md border">
              {DRILL_OBJECTIVES.map((o) => (
                <button
                  key={o} type="button"
                  onClick={() => toggleMulti('objectives', o)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${objectivesVal.includes(o) ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
                >
                  {o}
                </button>
              ))}
            </div>
            {errors.objectives && <p className="text-xs text-destructive">{errors.objectives.message}</p>}
          </div>

          {/* Equipment */}
          <div className="space-y-1">
            <Label>Equipment</Label>
            <div className="flex flex-wrap gap-2 p-3 rounded-md border">
              {DRILL_EQUIPMENT.map((e) => (
                <button
                  key={e} type="button"
                  onClick={() => toggleMulti('equipment', e)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${equipmentVal.includes(e) ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Coaching Points */}
          <div className="space-y-2">
            <Label>Coaching Points</Label>
            {fields.map((field, idx) => (
              <div key={field.id} className="flex gap-2">
                <Input {...register(`coachingPoints.${idx}` as const)} placeholder={`Point ${idx + 1}`} />
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(idx)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {fields.length < 5 && (
              <Button type="button" variant="outline" size="sm" onClick={() => append('' as never)}>
                + Add point
              </Button>
            )}
            {errors.coachingPoints && <p className="text-xs text-destructive">Add at least one coaching point</p>}
          </div>

          {/* Visuals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5" aria-hidden /> Image URL</Label>
              <Input {...register('imageUrl')} placeholder="https://…" />
              {errors.imageUrl && <p className="text-xs text-destructive">{errors.imageUrl.message}</p>}
            </div>
            <div className="space-y-1">
              <Label className="flex items-center gap-1.5"><Youtube className="h-3.5 w-3.5 text-red-500" /> YouTube ID</Label>
              <Input {...register('youtubeId')} placeholder="dQw4w9WgXcQ" />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { reset(); onClose() }}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function DrillsPage() {
  const router = useRouter()
  const { data: drills = [], isLoading } = useDrills()
  const deleteDrill = useDeleteDrill()

  const [search, setSearch]           = useState('')
  const [filterCat, setFilterCat]     = useState<string>('all')
  const [filterLevel, setFilterLevel] = useState<string>('all')
  const [filterObj, setFilterObj]     = useState<string>('all')

  const [dialogOpen, setDialogOpen]   = useState(false)
  const [editing, setEditing]         = useState<Drill | undefined>()

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return drills.filter((d) => {
      const matchSearch = !q || d.title.toLowerCase().includes(q) || d.tags.some((t) => t.includes(q))
      const matchCat    = filterCat   === 'all' || d.category  === filterCat
      const matchLevel  = filterLevel === 'all' || d.level     === filterLevel
      const matchObj    = filterObj   === 'all' || d.objectives.includes(filterObj as DrillFormValues['objectives'][number])
      return matchSearch && matchCat && matchLevel && matchObj
    })
  }, [drills, search, filterCat, filterLevel, filterObj])

  function openCreate() { setEditing(undefined); setDialogOpen(true) }
  function openEdit(d: Drill) { setEditing(d); setDialogOpen(true) }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Drill Library</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{drills.length} drills available</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            className="rounded-full sm:hidden"
            onClick={openCreate}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button className="hidden sm:flex gap-1.5" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add Drill
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drills…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {DRILL_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterLevel} onValueChange={setFilterLevel}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              {DRILL_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterObj} onValueChange={setFilterObj}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Objective" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All objectives</SelectItem>
              {DRILL_OBJECTIVES.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border overflow-hidden">
              <Skeleton className="h-36 w-full rounded-none" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-4 w-10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-muted">
            <BookOpen className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">No drills found. Try adjusting your filters.</p>
          <Button variant="outline" onClick={openCreate}><Plus className="h-4 w-4 mr-1.5" /> Add your first drill</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((drill) => (
            <DrillCard
              key={drill.id}
              drill={drill}
              onView={() => router.push(`/drills/${drill.id}`)}
              onEdit={() => openEdit(drill)}
              onDelete={() => deleteDrill.mutate(drill.id)}
            />
          ))}
        </div>
      )}

      {/* Dialog */}
      <DrillDialog
        open={dialogOpen}
        drill={editing}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  )
}
