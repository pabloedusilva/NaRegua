import { ImgHTMLAttributes, useState } from 'react'
import clsx from 'clsx'

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function Avatar({ src, name, size = 'md', className, ...props }: AvatarProps) {
  const [error, setError] = useState(false)

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  }

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  if (!src || error) {
    return (
      <div
        className={clsx(
          'flex items-center justify-center rounded-full bg-gold text-background font-semibold',
          sizes[size],
          className
        )}
      >
        {getInitials(name)}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setError(true)}
      className={clsx(
        'rounded-full object-cover',
        sizes[size],
        className
      )}
      {...props}
    />
  )
}

export { Avatar }
export default Avatar
