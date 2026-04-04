import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'

export function Layout() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen p-6">
        <Outlet />
      </div>
    </div>
  )
}