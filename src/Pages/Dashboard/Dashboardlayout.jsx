import { Outlet } from "react-router"
import CitizenDashboard from "./CitizenDashboard"
import DashboardAside from "./DashboardAside"
import { use, useEffect, useState } from "react"
import useAxiosSecure from "../../Hooks/useAxiosSecure"
import { AuthContext } from "../AuthProvider/AuthContext"
import {ToastContainer } from 'react-toastify';
const DashboardLayout = () => {
    const axiosSecure = useAxiosSecure()
    const {user} = use(AuthContext)
    const [citizen, setCitizen] = useState(null)

    useEffect(()=>{
      axiosSecure.get('/user/citizen')
        .then(res=> setCitizen(res.data) )
        .catch(err=> console.log(err))
    },[axiosSecure])

    // console.log(citizen)
    return(
    <div className="flex min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">
      <DashboardAside />
      

      <main className="flex-1 overflow-y-auto">
        <Outlet context={{ citizen }}></Outlet>
        <ToastContainer></ToastContainer>
      </main>
    </div>
    )
}
export default DashboardLayout