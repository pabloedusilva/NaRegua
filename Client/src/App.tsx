import { Route, Routes } from 'react-router-dom'
import { BookingProvider } from './context/BookingContext'
import { MyBookingsProvider } from './context/MyBookingsContext'
import Layout from './components/Layout'
import BookingPage from './pages/BookingPage'
import HomePage from './pages/HomePage'
import BookingModal from './pages/BookingModal'
import MyBookingsModal from './pages/MyBookingsModal'
import Terms from './pages/Legal/Terms'
import Privacy from './pages/Legal/Privacy'
import About from './pages/Legal/About'
import { ProfileProvider } from './context/ProfileContext'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <ProfileProvider>
      <BookingProvider>
        <MyBookingsProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/agendar" element={<BookingModal><BookingPage /></BookingModal>} />
              <Route path="/agendamentos" element={<MyBookingsModal />} />
              <Route path="/termos" element={<Terms />} />
              <Route path="/privacidade" element={<Privacy />} />
              <Route path="/sobre" element={<About />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </MyBookingsProvider>
      </BookingProvider>
    </ProfileProvider>
  )
}
