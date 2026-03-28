'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { FacePerson } from '@/lib/mock-data'
import { Upload, X, Plus, UserRound } from 'lucide-react'

type FaceGalleryTabProps = {
  people: FacePerson[]
}

const relationshipColors: Record<string, string> = {
  Son: 'bg-blue-50 text-blue-700',
  Daughter: 'bg-pink-50 text-pink-700',
  'Home Nurse': 'bg-teal-50 text-teal-700',
  Doctor: 'bg-violet-50 text-violet-700',
  Caregiver: 'bg-teal-50 text-teal-700',
  Therapist: 'bg-indigo-50 text-indigo-700',
  Neighbor: 'bg-stone-100 text-stone-600',
  Friend: 'bg-amber-50 text-amber-700',
  Brother: 'bg-blue-50 text-blue-700',
  Sister: 'bg-pink-50 text-pink-700',
  Grandson: 'bg-sky-50 text-sky-700',
  Granddaughter: 'bg-rose-50 text-rose-700',
  'Son-in-law': 'bg-blue-50 text-blue-700',
}

function FaceCard({ person, index }: { person: FacePerson; index: number }) {
  const [imgError, setImgError] = useState(false)
  const tagColor = relationshipColors[person.relationship] ?? 'bg-stone-100 text-stone-600'

  return (
    <div
      className="group flex flex-col gap-2.5 animate-fade-up"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Photo */}
      <div className="relative aspect-square rounded-2xl overflow-hidden border border-border bg-muted shadow-[0_2px_8px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)] group-hover:-translate-y-0.5">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <UserRound className="w-10 h-10 text-muted-foreground/40" strokeWidth={1} />
          </div>
        ) : (
          <img
            src={person.imageUrl}
            alt={person.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}

        {/* Remove button */}
        <button
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive hover:border-destructive hover:text-destructive-foreground"
          aria-label={`Remove ${person.name}`}
        >
          <X className="w-3 h-3" strokeWidth={2} />
        </button>
      </div>

      {/* Name + tag */}
      <div className="px-0.5">
        <p className="text-sm font-medium text-foreground leading-tight truncate">
          {person.name}
        </p>
        <span
          className={cn(
            'inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full',
            tagColor
          )}
        >
          {person.relationship}
        </span>
      </div>
    </div>
  )
}

export function FaceGalleryTab({ people }: FaceGalleryTabProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-fade-up" style={{ animationDelay: '0ms' }}>
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-muted-foreground mb-1.5">
            Face Gallery
          </p>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            People Gallery
          </h1>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {people.length} people loaded — device will recognize these faces.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.15)] shrink-0">
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          Add Person
        </button>
      </div>

      {/* Upload zone */}
      <div
        className={cn(
          'mb-8 rounded-2xl border-2 border-dashed px-6 py-8 flex flex-col items-center gap-3 transition-all duration-200 cursor-pointer animate-fade-up',
          isDragOver
            ? 'border-primary bg-accent/50'
            : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/60'
        )}
        style={{ animationDelay: '60ms' }}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragOver(false) }}
      >
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200',
          isDragOver ? 'bg-primary text-primary-foreground' : 'bg-border text-muted-foreground'
        )}>
          <Upload className="w-4.5 h-4.5" strokeWidth={1.75} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            Drop photos here to add new people
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            JPG, PNG, HEIC up to 10 MB each — one photo per person
          </p>
        </div>
      </div>

      {/* Face grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {people.map((person, index) => (
          <FaceCard key={person.id} person={person} index={index} />
        ))}
      </div>
    </div>
  )
}
