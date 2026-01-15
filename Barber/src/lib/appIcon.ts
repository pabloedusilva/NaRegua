type ManifestIcon = {
  src: string
  sizes?: string
  type?: string
  purpose?: string
}

type WebManifest = {
  name?: string
  short_name?: string
  description?: string
  start_url?: string
  scope?: string
  display?: string
  display_override?: string[]
  background_color?: string
  theme_color?: string
  orientation?: string
  icons?: ManifestIcon[]
  categories?: string[]
  prefer_related_applications?: boolean
}

const STORAGE_KEY = 'barbershop_app_icon'

let currentManifestObjectUrl: string | null = null

function getMimeTypeFromPath(path: string): string | undefined {
  const lower = path.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.svg')) return 'image/svg+xml'
  return undefined
}

function safeGetItem(key: string): string | null {
  try {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(key, value)
  } catch {
    // ignore
  }
}

export function getSelectedAppIcon(): string | null {
  return safeGetItem(STORAGE_KEY)
}

export function setSelectedAppIcon(iconPath: string): void {
  safeSetItem(STORAGE_KEY, iconPath)
}

function setLinkHref(selector: string, href: string): void {
  const link = document.querySelector<HTMLLinkElement>(selector)
  if (!link) return
  link.href = href
  const mime = getMimeTypeFromPath(href)
  if (mime && selector.includes('rel="icon"')) {
    link.type = mime
  }
}

export function applyAppIconToDocument(iconPath: string): void {
  if (typeof document === 'undefined') return

  // Favicons
  setLinkHref('link[rel="icon"][sizes="32x32"]', iconPath)
  setLinkHref('link[rel="icon"][sizes="16x16"]', iconPath)

  // Default icon link (keep it in sync too)
  setLinkHref('link[rel="icon"][type="image/png"]', iconPath)

  // iOS
  setLinkHref('link[rel="apple-touch-icon"]', iconPath)

  // Splash fallback (best-effort)
  setLinkHref('link[rel="apple-touch-startup-image"]', iconPath)
}

async function updateManifestLink(iconPath: string): Promise<void> {
  const manifestLink = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')
  if (!manifestLink) return

  try {
    const response = await fetch('/manifest.json', { cache: 'no-store' })
    const baseManifest = (await response.json()) as WebManifest

    const mime = getMimeTypeFromPath(iconPath)

    const nextIcons: ManifestIcon[] = (baseManifest.icons ?? []).map((icon) => ({
      ...icon,
      src: iconPath,
      type: mime ?? icon.type
    }))

    const nextManifest: WebManifest = {
      ...baseManifest,
      icons: nextIcons
    }

    const blob = new Blob([JSON.stringify(nextManifest)], { type: 'application/manifest+json' })
    const objectUrl = URL.createObjectURL(blob)

    if (currentManifestObjectUrl) URL.revokeObjectURL(currentManifestObjectUrl)
    currentManifestObjectUrl = objectUrl

    manifestLink.href = objectUrl
  } catch {
    // If anything fails (offline, blocked, etc), we simply keep the default manifest.
  }
}

export async function applyAndPersistAppIcon(iconPath: string): Promise<void> {
  setSelectedAppIcon(iconPath)
  applyAppIconToDocument(iconPath)
  await updateManifestLink(iconPath)
}

export async function initAppIcon(defaultIconPath: string): Promise<void> {
  const stored = getSelectedAppIcon()
  const selected = stored || defaultIconPath
  applyAppIconToDocument(selected)
  await updateManifestLink(selected)
}
