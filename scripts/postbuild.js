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

console.log('Postbuild: mirrored dist -> Client/dist and Barber/dist')
