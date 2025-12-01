import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ProfileImage } from '@/types/profile'
import { profileImages as defaultImages } from '@/data/profile'

const STORAGE_KEY = 'profile.selectedId'

type ProfileContextValue = {
  images: ProfileImage[]
  selected?: ProfileImage
  select: (id: string) => void
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [images] = useState<ProfileImage[]>(defaultImages)
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setSelectedId(stored)
  }, [])

  const selected = useMemo(() => images.find(i => i.id === selectedId) ?? images[0], [images, selectedId])

  const select = (id: string) => {
    setSelectedId(id)
    localStorage.setItem(STORAGE_KEY, id)
  }

  const value = useMemo(() => ({ images, selected, select }), [images, selected])
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile deve ser usado dentro de ProfileProvider')
  return ctx
}
