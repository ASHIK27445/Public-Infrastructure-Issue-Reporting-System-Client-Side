import { Outlet } from "react-router"
import { ToastContainer } from "react-toastify"
import Navbar from "../Pages/Home/Navbar"

const Root = () => {
    return(
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <ToastContainer></ToastContainer>
        </div>
    )
}
export default Root