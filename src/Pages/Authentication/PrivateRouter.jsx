import { use } from "react"
import { Navigate, useLocation } from "react-router"
import { AuthContext } from "../AuthProvider/AuthContext"

const PrivateRouter = ({children}) => {
const {user, loading} = use(AuthContext)
    const location = useLocation()
    if(loading){
    return <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900 flex items-center justify-center">
                <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                <p className="mt-4 text-lg text-gray-300">Loading...</p>
                </div>
           </div>
    }
    // console.log(user, user?.isBlocked)
    if(!user || user?.isBlocked ){
        return <Navigate to='/login' state={location.pathname}></Navigate>
    }
    return children
}
export default PrivateRouter