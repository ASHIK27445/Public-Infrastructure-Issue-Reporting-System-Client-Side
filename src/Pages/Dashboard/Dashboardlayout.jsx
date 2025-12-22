import { Outlet } from "react-router"
import CitizenDashboard from "./CitizenDashboard"
import DashboardAside from "./DashboardAside"

const DashboardLayout = () => {
    return(
    <div className="flex min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">
      <DashboardAside />
      

      <main className="flex-1 overflow-y-auto">
        <Outlet></Outlet>
      </main>
    </div>
    )
}
export default DashboardLayout