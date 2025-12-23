import { Outlet } from "react-router"
import { ToastContainer } from "react-toastify"
import Navbar from "../Pages/Home/Navbar"
import Footer from "../Pages/Home/Footer"

const Root = () => {
    return(
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
            <ToastContainer></ToastContainer>
        </div>
    )
}
export default Root