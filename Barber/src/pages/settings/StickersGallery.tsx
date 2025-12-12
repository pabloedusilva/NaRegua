import { useState, useEffect } from 'react'

// Helper function to generate file paths based on known file names
const getStickerFiles = (folderName: string): string[] => {
  const basePath = `/assets/images/stickers/${folderName}/`
  
  // Manually list files for each category
  const filesByCategory: Record<string, string[]> = {
    barbearia: Array.from({ length: 99 }, (_, i) => `${i + 1}.png`),
    bom_dia: Array.from({ length: 99 }, (_, i) => `${i + 1}.png`),
    boa_tarde: [
      '1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png',
      '11.png', '12.png', '13.png', '14.png', '15.png', '16.png', '17.png', '18.png', '19.png', '20.png',
      '21.png', '22.png', '23.png', '24.png', '25.png', '26.png', '27.png', '28.png', '29.png', '30.png',
      '31.png', '32.png', '33.png', '34.png', '35.png', '36.png', '37.png', '38.png', '39.png', '40.png',
      '41.png', '42.png', '43.png', '44.png', '45.png', '46.png', '47.png', '48.png', '49.png', '50.png',
      '51.png', '52.png', '53.png', '54.png'
    ],
    boa_noite: Array.from({ length: 99 }, (_, i) => `${i + 1}.png`),
    frases: [
      '1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png',
      '11.png', '12.png', '13.png', '14.png', '15.png', '16.png', '17.png', '18.png', '19.png', '20.png',
      '21.png', '22.png', '23.png', '24.png', '25.png', '26.png', '27.png', '28.png', '29.png', '30.png'
    ],
    favela: [
      '1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png',
      '11.png', '12.png', '13.png', '14.png', '15.png', '16.png', '17.png'
    ],
    animadas: [
      '1.GIF', '2.GIF', '3.GIF', '4.GIF', '5.GIF', '6.GIF', '7.GIF', '8.GIF', '9.GIF', '10.GIF',
      '11.GIF', '12.GIF', '13.GIF', '14.GIF', '15.GIF', '16.GIF', '17.GIF', '18.GIF'
    ]
  }
  
  const files = filesByCategory[folderName] || []
  return files.map(file => `${basePath}${file}`)
}

// Sticker categories organized by folder names
const STICKER_CATEGORIES = {
  favoritos: {
    name: 'Favoritos',
    files: [] // Will be populated from localStorage
  },
  barbearia: {
    name: 'Barbearia',
    files: getStickerFiles('barbearia')
  },
  bom_dia: {
    name: 'Bom Dia',
    files: getStickerFiles('bom_dia')
  },
  boa_tarde: {
    name: 'Boa Tarde',
    files: getStickerFiles('boa_tarde')
  },
  boa_noite: {
    name: 'Boa Noite',
    files: getStickerFiles('boa_noite')
  },
  frases: {
    name: 'Frases',
    files: getStickerFiles('frases')
  },
  favela: {
    name: 'Favela',
    files: getStickerFiles('favela')
  },
  animadas: {
    name: 'Animadas',
    files: getStickerFiles('animadas')
  }
}

type CategoryKey = keyof typeof STICKER_CATEGORIES

export default function StickersGallery() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('favoritos')
  const [copiedSticker, setCopiedSticker] = useState<string | null>(null)
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoadingImages, setIsLoadingImages] = useState(false)

  // Load favorites from localStorage
  useEffect(() => {
    document.title = 'Régua Máxima | Dashboard Barbeiro';
    const savedFavorites = localStorage.getItem('sticker_favorites')
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error)
      }
    }
  }, [])

  // Handle category change with loading state
  useEffect(() => {
    setIsLoadingImages(true)
    
    // Simulate loading time for category switch
    const timer = setTimeout(() => {
      setIsLoadingImages(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [selectedCategory])

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('sticker_favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (sticker: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites(prev => {
      if (prev.includes(sticker)) {
        return prev.filter(s => s !== sticker)
      } else {
        return [...prev, sticker]
      }
    })
  }

  const isFavorite = (sticker: string) => favorites.includes(sticker)

  const handleStickerClick = (sticker: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedSticker === sticker) {
      // Se já está selecionado, fecha
      setSelectedSticker(null)
    } else {
      // Seleciona o sticker
      setSelectedSticker(sticker)
    }
  }

  const handleCopySticker = async (stickerPath: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      // Fetch the image as blob
      const response = await fetch(stickerPath)
      if (!response.ok) {
        throw new Error('Falha ao carregar imagem')
      }
      
      const blob = await response.blob()
      
      // Verify clipboard API is available
      if (!navigator.clipboard || !navigator.clipboard.write) {
        throw new Error('Clipboard API não disponível')
      }
      
      // Copy to clipboard with proper MIME type
      const clipboardItem = new ClipboardItem({
        [blob.type]: blob
      })
      
      await navigator.clipboard.write([clipboardItem])
      
      setCopiedSticker(stickerPath)
      setTimeout(() => {
        setCopiedSticker(null)
        setSelectedSticker(null)
      }, 2000)
    } catch (error) {
      console.error('Erro ao copiar figurinha:', error)
      
      // Fallback: try to copy as canvas/image data
      try {
        const response = await fetch(stickerPath)
        const blob = await response.blob()
        
        // Create an image element
        const img = new Image()
        img.crossOrigin = 'anonymous'
        
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = URL.createObjectURL(blob)
        })
        
        // Create canvas and draw image
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          throw new Error('Não foi possível criar contexto canvas')
        }
        
        ctx.drawImage(img, 0, 0)
        
        // Convert canvas to blob
        const canvasBlob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob)
          }, 'image/png')
        })
        
        // Try to copy canvas blob
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': canvasBlob
          })
        ])
        
        setCopiedSticker(stickerPath)
        setTimeout(() => {
          setCopiedSticker(null)
          setSelectedSticker(null)
        }, 2000)
      } catch (fallbackError) {
        console.error('Erro no fallback:', fallbackError)
        alert('Não foi possível copiar a figurinha. Por favor, tente salvar a imagem manualmente.')
      }
    }
  }

  const currentCategory = STICKER_CATEGORIES[selectedCategory]
  const displayStickers = selectedCategory === 'favoritos' ? favorites : currentCategory.files
  const hasStickers = displayStickers.length > 0

  return (
    <div className="grid gap-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-display text-4xl md:text-5xl text-gold mb-2">Galeria de Figurinhas</h1>
        <p className="text-text-dim">Clique na estrela para favoritar, clique na figurinha para copiar</p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide animate-fade-in-delayed">
        {Object.entries(STICKER_CATEGORIES).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key as CategoryKey)}
            className={`px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              selectedCategory === key
                ? 'bg-gold text-[#0a0a0a] shadow-lg shadow-gold/20'
                : 'bg-surface text-text-dim hover:bg-surface-hover hover:text-text'
            }`}
          >
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Stickers Grid */}
      <div className="min-h-[400px] relative">
        {/* Loading Overlay */}
        {isLoadingImages && hasStickers && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 rounded-xl"></div>
        )}

        {!hasStickers ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {selectedCategory === 'favoritos' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                )}
              </svg>
            </div>
            <p className="text-text-dim">
              {selectedCategory === 'favoritos' 
                ? 'Nenhuma figurinha favoritada ainda'
                : 'Nenhuma figurinha nesta categoria'}
            </p>
          </div>
        ) : (
          <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 transition-opacity duration-300 ${
            isLoadingImages ? 'opacity-0' : 'opacity-100 animate-fade-in'
          }`}>
            {displayStickers.map((sticker, index) => (
              <div
                key={index}
                className="group relative aspect-square rounded-xl overflow-hidden bg-surface border border-border hover:border-gold/50 transition-all cursor-pointer"
                onClick={(e) => handleStickerClick(sticker, e)}
              >
                {/* Sticker Image */}
                <img
                  src={sticker}
                  alt={`Figurinha ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/assets/images/ui/default.jpg'
                  }}
                />

                {/* Favorite Button - Top Right */}
                <button
                  onClick={(e) => toggleFavorite(sticker, e)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-black/80 hover:scale-110 z-10"
                >
                  {isFavorite(sticker) ? (
                    <svg className="w-5 h-5 text-gold fill-gold" viewBox="0 0 24 24">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  )}
                </button>

                {/* Overlay - Mostra quando selecionado ou hover */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 flex items-center justify-center ${
                  selectedSticker === sticker ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <div className="text-center">
                    {copiedSticker === sticker ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-green-500">Copiado!</span>
                      </div>
                    ) : selectedSticker === sticker ? (
                      <button
                        onClick={(e) => handleCopySticker(sticker, e)}
                        className="flex flex-col items-center gap-2 hover:scale-110 transition-transform"
                      >
                        <div className="w-12 h-12 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center">
                          <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gold">Copiar</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
