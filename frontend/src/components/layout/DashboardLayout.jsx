import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import DashboardSidebar from './DashboardSidebar'
import DashboardTopbar from './DashboardTopbar'

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const w = collapsed ? 70 : 254
  return (
    <div className="min-h-screen bg-white flex">
      <DashboardSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex flex-col flex-1 min-w-0 transition-all duration-250" style={{ marginLeft: w }}>
        <DashboardTopbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1160px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
