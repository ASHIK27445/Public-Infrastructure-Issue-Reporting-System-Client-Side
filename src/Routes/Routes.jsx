import { createBrowserRouter } from "react-router"
import Root from "../Root/Root"
import Home from "../Pages/Home/Home"
import Login from "../Pages/Authentication/Login"
import Register from "../Pages/Authentication/Register"
import AllIssuesPage from "../Pages/components/AllIssuesPage"
import IssueDetailsPage from "../Pages/components/IssueDetailsPage"
import CitizenDashboard from "../Pages/Dashboard/CitizenDashboard"
import DashboardLayout from "../Pages/Dashboard/Dashboardlayout"
import DashboardDesign from "../Pages/Dashboard/DashboardDesign"
import AddIssues from "../Pages/components/AddIssues"
import ManageIssues from "../Pages/components/ManageIssues"
export const router = createBrowserRouter([
    {
        path: '/' , element:<Root></Root>,
        children:[
            {
                index: true, Component: Home
            },
            {
                path:'/login', Component: Login
            },
            {
                path:'/register', Component: Register
            },
            {
                path:'/allissues', Component: AllIssuesPage
            },
            {
                path:'/issues/:id', Component: IssueDetailsPage
            },
            {
                path:'/cd', Component: CitizenDashboard
            }
        ]
    },
    {
        path:'dashboard', element: <DashboardLayout></DashboardLayout>,
        children:[
            {
                index: true, Component: CitizenDashboard
            },
            {
                path:'dashboard/addissues', Component: AddIssues
            },
            {
                path:'dashboard/manageissues', Component: ManageIssues
            }

        ]
    }
])