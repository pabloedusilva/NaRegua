import fs from 'fs'
import path from 'path'

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return
  fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

const root = process.cwd()
const distRoot = path.join(root, 'dist')

// Mirror build output into Client/dist and Barber/dist for Render configs
copyDir(distRoot, path.join(root, 'Client', 'dist'))
copyDir(distRoot, path.join(root, 'Barber', 'dist'))

// Ensure Barber PWA assets are available under /admin/ in dist
const adminDir = path.join(distRoot, 'admin')
fs.mkdirSync(adminDir, { recursive: true })
try {
  fs.copyFileSync(path.join(root, 'Barber', 'manifest.json'), path.join(adminDir, 'manifest.json'))
  fs.copyFileSync(path.join(root, 'Barber', 'sw.js'), path.join(adminDir, 'sw.js'))
  console.log('Postbuild: copied Barber PWA assets to dist/admin')
} catch (e) {
  console.warn('Postbuild: could not copy Barber PWA assets:', e?.message)
}

console.log('Postbuild: mirrored dist -> Client/dist and Barber/dist')
