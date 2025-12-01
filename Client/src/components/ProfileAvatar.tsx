import React, { useState } from 'react'
import { useProfile } from '@/context/ProfileContext'

type Props = {
  size?: number // px
  className?: string
}

export default function ProfileAvatar({ size = 112, className = '' }: Props) {
  const { selected } = useProfile()
  const [src, setSrc] = useState<string | undefined>(selected?.url)

  const fallback = (
    <div
      className={`grid place-items-center rounded-full bg-surface border-2 border-white text-muted ${className}`}
      style={{ width: size, height: size }}
    >
      Foto
    </div>
  )

  if (!src) return fallback

  return (
    <img
      src={src}
      alt={selected?.label ?? 'Imagem de perfil da barbearia'}
      className={`rounded-full object-cover border-2 border-white ${className}`}
      style={{ width: size, height: size }}
      onError={() => setSrc(undefined)}
    />
  )
}
