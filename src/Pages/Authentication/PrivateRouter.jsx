import { use } from "react"
import { RotatingTriangles } from "react-loader-spinner"
import { Navigate, useLocation } from "react-router"
import { AuthContext } from "../../Auth/AuthContext"

const PrivateRouter = ({children}) => {
const {user, loading} = use(AuthContext)
    const location = useLocation()
    if(loading){
        return <div className="my-40 flex justify-center items-center"><RotatingTriangles
                    visible={true}
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="rotating-triangles-loading"
                    wrapperStyle={{}}
                    wrapperClass=""/> 
                </div>
    }
    if(user){
        return children
    }
    return <Navigate to='/login' state={location.pathname}></Navigate>
}
export default PrivateRouter