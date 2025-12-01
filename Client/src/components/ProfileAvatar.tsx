import React, { useEffect, useState } from 'react'
import { useProfile } from '@/context/ProfileContext'

type Props = {
  size?: number // px
  className?: string
  src?: string // caminho fixo opcional para exibição estática
}

export default function ProfileAvatar({ size = 112, className = '', src }: Props) {
  const { selected } = useProfile()
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src ?? selected?.url)

  useEffect(() => {
    setCurrentSrc(src ?? selected?.url)
  }, [src, selected?.url])

  const fallback = (
    <div
      className={`grid place-items-center rounded-full bg-surface border-2 border-white text-muted ${className}`}
      style={{ width: size, height: size }}
    >
      Foto
    </div>
  )

  if (!currentSrc) return fallback

  return (
    <img
      src={currentSrc}
      alt={selected?.label ?? 'Imagem de perfil da barbearia'}
      className={`rounded-full object-cover border-2 border-white ${className}`}
      style={{ width: size, height: size }}
      onError={() => setCurrentSrc(undefined)}
    />
  )
}
