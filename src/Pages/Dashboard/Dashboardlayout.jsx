import { Outlet } from "react-router"
import DashboardAside from "./DashboardAside"
import { use, useEffect, useState } from "react"
import useAxiosSecure from "../../Hooks/useAxiosSecure"
import { AuthContext } from "../AuthProvider/AuthContext"
import {ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const DashboardLayout = () => {
    const axiosSecure = useAxiosSecure()
    const {user} = use(AuthContext)
    const [citizen, setCitizen] = useState(null)

    const refreshCitizen = async() => {
      return await axiosSecure.get('/user/citizen')
        .then(res=> setCitizen(res.data) )
        .catch(err=> console.log(err))
    }

    useEffect(()=>{
      if(user?.email){
        refreshCitizen()
      }
    },[user, axiosSecure])

    const queryClient = new QueryClient()

    // console.log(citizen)
    return(
    <div className="flex min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">
      <DashboardAside />
      

      <main className="flex-1 overflow-y-auto">
        <QueryClientProvider client={queryClient}>
          <Outlet context={{ citizen, refreshCitizen }}></Outlet>
        </QueryClientProvider>
        <ToastContainer></ToastContainer>
      </main>
    </div>
    )
}
export default DashboardLayout