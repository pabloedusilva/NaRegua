/**
 * Image Helpers
 * Utilities for image handling and fallbacks
 */

// Default fallback image from public/assets/images/ui/
export const DEFAULT_IMAGE = '/assets/images/ui/default.jpg'

/**
 * Handle image loading errors by setting a default fallback image
 * Usage: <img src={src} onError={handleImageError} />
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const target = e.target as HTMLImageElement
  if (target.src !== DEFAULT_IMAGE) {
    target.src = DEFAULT_IMAGE
  }
}

/**
 * Check if an image URL is valid and accessible
 */
export const isValidImageUrl = (url: string): boolean => {
  return url && url.trim().length > 0
}
