'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { FacePerson } from '@/lib/dashboard-types'
import { Upload, X, Plus, UserRound, Loader2, Heart, Sparkles } from 'lucide-react'

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

function FaceCard({ person, index, onDelete }: { person: FacePerson; index: number, onDelete: (id: string) => void }) {
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
          onClick={() => onDelete(person.id)}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive hover:border-destructive hover:text-destructive-foreground z-10"
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

export function FaceGalleryTab({ people: initialPeople }: FaceGalleryTabProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [people, setPeople] = useState<FacePerson[]>(initialPeople)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Upload modal state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState('')

  useEffect(() => {
    // Optionally fetch faces from the real database on mount if available
    fetch('/api/faces')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPeople(data)
        }
      })
      .catch(console.error)
  }, [])

  const handleFileSelect = (file: File) => {
    if (!file) return
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !name.trim() || !relationship.trim()) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('image', selectedFile)
    formData.append('name', name)
    formData.append('relationship', relationship)

    try {
      const res = await fetch('/api/faces', {
        method: 'POST',
        body: formData,
      })
      
      if (res.ok) {
        const newFace = await res.json()
        setPeople([newFace, ...people])
        // Reset modal
        setSelectedFile(null)
        setPreviewUrl(null)
        setName('')
        setRelationship('')
      } else {
        alert('Upload failed: ' + await res.text())
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      alert('Error uploading picture: ' + message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    // If it's a seed mock data face without a real DB id, or DB fails, optimistically remove it
    setPeople(people.filter(p => p.id !== id))
    
    try {
      await fetch(`/api/faces/${id}`, { method: 'DELETE' })
    } catch (err) {
      console.error('Failed to delete from backend:', err)
    }
  }

  return (
    <div className="max-w-4xl relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-fade-up" style={{ animationDelay: '0ms' }}>
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-muted-foreground mb-1.5">
            Familiar Faces
          </p>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Recognition Library
          </h1>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {people.length > 0
              ? `${people.length} familiar face${people.length === 1 ? '' : 's'} ready to support recognition.`
              : 'No familiar faces added yet — upload loved ones and trusted people the patient may see.'}
          </p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.15)] shrink-0"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          Add Familiar Face
        </button>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-card px-5 py-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] animate-fade-up" style={{ animationDelay: '30ms' }}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Heart className="w-4 h-4 text-primary" strokeWidth={1.9} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Keep this list warm and recognizable</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Add recent, clear photos of relatives, close friends, and regular caregivers so recognition feels natural when the glasses offer help.
            </p>
          </div>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} 
        className="hidden" 
        accept="image/jpeg,image/png,image/heic" 
      />

      {/* Upload Zone / Active Upload Modal */}
      {selectedFile ? (
        <div className="mb-8 rounded-2xl border border-border bg-card shadow-sm p-6 flex flex-col sm:flex-row gap-6 animate-fade-up">
           <div className="shrink-0 aspect-square w-40 rounded-xl overflow-hidden bg-muted">
             {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />}
           </div>
           
           <div className="flex-1 flex flex-col justify-center space-y-4">
             <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Person&apos;s Name</label>
              <input 
                 value={name} 
                 onChange={e => setName(e.target.value)} 
                 className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" 
                 placeholder="e.g. Maya Johnson" 
               />
             </div>
             
             <div>
               <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Relationship</label>
               <input 
                 value={relationship} 
                 onChange={e => setRelationship(e.target.value)} 
                 className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" 
                 placeholder="e.g. Daughter, Brother, Caregiver" 
               />
             </div>

             <div className="flex items-center gap-3 pt-2">
                <button 
                  onClick={handleUpload}
                  disabled={isUploading || !name.trim() || !relationship.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Familiar Face'}
                </button>
                <button 
                  onClick={() => setSelectedFile(null)}
                  disabled={isUploading}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-muted text-foreground text-sm font-medium transition"
                >
                  Cancel
                </button>
             </div>
           </div>
        </div>
      ) : (
        <div
          className={cn(
            'mb-8 rounded-2xl border-2 border-dashed px-6 py-8 flex flex-col items-center gap-3 transition-all duration-200 cursor-pointer animate-fade-up',
            isDragOver
              ? 'border-primary bg-accent/50'
              : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/60'
          )}
          style={{ animationDelay: '60ms' }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200',
            isDragOver ? 'bg-primary text-primary-foreground' : 'bg-border text-muted-foreground'
          )}>
            <Upload className="w-4.5 h-4.5" strokeWidth={1.75} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Drop photos here to add familiar faces
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              JPG, PNG, HEIC up to 10 MB each — one clear photo per relative or trusted person
            </p>
          </div>
        </div>
      )}

      {/* Face grid */}
      {people.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center text-muted-foreground animate-fade-up">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <UserRound className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-medium text-foreground">No familiar faces added yet</p>
          <p className="mt-1 text-xs leading-relaxed">
            Start with close relatives and everyday caregivers the patient is most likely to see.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-[11px] text-muted-foreground">
            <Sparkles className="w-3 h-3 text-primary" strokeWidth={1.9} />
            Small, familiar lists are often easier to keep accurate.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {people.map((person, index) => (
            <FaceCard key={person.id} person={person} index={index} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
