import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'

// Import direto do Client App
import ClientApp from '../Client/src/App'

// Import do Barber Wrapper (com estilos incluídos)
import BarberWrapper from '../Barber/src/app/BarberWrapper'

// Loading component
const Loading = () => (
  <div className="min-h-dvh flex items-center justify-center bg-background">
    <div className="animate-spin h-8 w-8 border-4 border-gold border-t-transparent rounded-full" />
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Admin/Barber routes - todas sob /admin/* */}
          <Route path="/admin/*" element={<BarberWrapper />} />
          
          {/* Client routes - todas as outras rotas */}
          <Route path="/*" element={<ClientApp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
