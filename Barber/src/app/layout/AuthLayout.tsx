import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="scroll-container h-screen bg-gradient-to-b from-bg to-bg-soft">
      <Outlet />
    </div>
  )
}
