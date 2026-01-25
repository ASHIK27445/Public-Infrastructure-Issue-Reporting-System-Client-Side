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
import PrivateRouter from "../Pages/Authentication/PrivateRouter"
import MyIssuePage from "../Pages/components/MyIssuePage"
import MyProfile from "../Pages/components/MyProfile"
import TimelinePage from "../Pages/components/TimeLinePage"
import ManageStaff from "../Pages/Admin/ManageStaff"
import ManageUsers from "../Pages/Admin/ManageUser"
import ViewIssues from "../Pages/Admin/ViewIssues"
import RejectedIssues from "../Pages/Admin/RejectedIssues"
import AssignedIssues from "../Pages/Staff/AssignedIssues"
import MapView from "../Pages/Others/MapView"
import PremiumMock from "../Pages/Others/PremiumMock"
import TermsOfService from "../Pages/Others/TermsOfService"
import PrivacyPolicy from "../Pages/Home/PrivacyPolicy"
import CommunityGuidelines from "../Pages/Others/CommunityGuidelines"
import Blog from "../Pages/Others/Blog"
import HelpCenter from "../Pages/Others/HelpCenter"
import HowItWorks from "../Pages/Home/HowItWorks"
// import Features from "../Pages/Others/Features"
import Features from "../Pages/Home/Features"
import PaymentSuccess from "../Pages/components/PaymentSuccess"
import PaymentCancel from "../Pages/components/PaymentCancel"
// import HowItWorks from "../Pages/Others/HowItWorks"
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
                path:'/issues/:id', element: <IssueDetailsPage></IssueDetailsPage>
            },
            {
                path:'/cd', Component: CitizenDashboard
            },
            {
                path:'/map-view', Component: MapView
            },
            {
                path:'/premium', Component: PremiumMock
            },
            {
                path:'/Terms-of-services', Component: TermsOfService
            },
            {
                path:'/privacy-policy', Component: PrivacyPolicy
            },
            {
                path:'/community-guidelines', Component: CommunityGuidelines
            },
            {
                path:'/blog', Component: Blog
            },
            {
                path:'/help-center', Component: HelpCenter
            },
            {
                path:'/how-it-works', Component: HowItWorks
            },
            {
                path:'/features', Component: Features
            }
        ]
    },
    {
        path:'dashboard', element: <PrivateRouter><DashboardLayout></DashboardLayout></PrivateRouter>,
        children:[
            {
                index: true, Component: CitizenDashboard
            },
            {
                path:'dashboard/addissues', Component: AddIssues
            },
            {
                path:'dashboard/manageissues', Component: ManageIssues
            },
            {
                path:'dashboard/myissues', Component: MyIssuePage
            },
            {
                path: 'dashboard/myProfile', Component: MyProfile
            },
            {
                path:'timeline', Component: TimelinePage
            },
            {
                path:'manageStaff', Component: ManageStaff
            },
            {
                path: 'manageUser', Component: ManageUsers
            },
            {
                path: 'viewIssues', Component: ViewIssues
            },
            {
                path: 'rejectedIssues', Component: RejectedIssues
            },
            {
                path: 'assignedIssues', Component: AssignedIssues
            },
            {
                path: 'payment-success', Component: PaymentSuccess
            },
            {
                path: 'payment-cancel', Component: PaymentCancel
            }

        ]
    }
])