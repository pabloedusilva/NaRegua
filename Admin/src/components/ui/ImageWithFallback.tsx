import React, { useState } from 'react'
import Spinner from '../feedback/Spinner'
import { DEFAULT_IMAGE } from '@/utils/imageHelpers'

interface Props {
  src: string
  alt: string
  className?: string
  containerClassName?: string
  rounded?: boolean
}

export default function ImageWithFallback({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  rounded = false,
}: Props) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  const effectiveSrc = failed ? DEFAULT_IMAGE : src || DEFAULT_IMAGE

  // Reset state when source changes to allow new load attempt
  React.useEffect(() => {
    setFailed(false)
    setLoaded(false)
  }, [src])

  return (
    <div className={`relative overflow-hidden ${rounded ? 'rounded-full' : 'rounded-xl'} ${containerClassName}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-surface flex items-center justify-center">
          <Spinner />
        </div>
      )}
      <img
        src={effectiveSrc}
        alt={alt}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!failed) {
            setFailed(true)
            // keep spinner until default loads
            setLoaded(false)
          }
        }}
      />
    </div>
  )
}
