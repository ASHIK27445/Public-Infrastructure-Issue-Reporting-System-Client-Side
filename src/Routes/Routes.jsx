import { createBrowserRouter } from "react-router"
import Root from "../Root/Root"
import Home from "../Pages/Home/Home"
import Login from "../Pages/Authentication/Login"
import Register from "../Pages/Authentication/Register"
import AllIssuesPage from "../Pages/components/AllIssuesPage"
import IssueDetailsPage from "../Pages/components/IssueDetailsPage"
import CitizenDashboard from "../Pages/Dashboard/CitizenDashboard"
import DashboardLayout from "../Pages/Dashboard/Dashboardlayout"
import AddIssues from "../Pages/components/AddIssues"
import ManageIssues from "../Pages/components/ManageIssues"
import PrivateRouter from "../Pages/Authentication/PrivateRouter"
import MyIssuePage from "../Pages/components/MyIssuePage"
import MyProfile from "../Pages/components/MyProfile"
import ManageStaff from "../Pages/Admin/ManageStaff"
import ManageUsers from "../Pages/Admin/ManageUser"
import ViewIssues from "../Pages/Admin/ViewIssues"
import RejectedIssues from "../Pages/Admin/RejectedIssues"
import AssignedIssues from "../Pages/Staff/AssignedIssues"
import MapView from "../Pages/Others/MapView"
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
import PaymentBoostSuccess from "../Pages/Home/PaymentBoostSuccess"
import PaymentHistory from "../Pages/components/PaymentHistory"
import PaymentDetails from "../Pages/components/PaymentDetails"
import ReviewIssues from "../Pages/components/ReviewIssues"
import HelpSupport from "../Pages/components/HelpSupport"
import LifetimePremium from "../Pages/Others/LifetimePremium"
import AdminPaymentHistory from "../Pages/Admin/AdminPaymentHistory"
import ErrorPage from "../Pages/Error/ErrorPage"
import StaffPerformanceInsights from "../Pages/Admin/StaffPerformanceInsights"
// import HowItWorks from "../Pages/Others/HowItWorks"
import CreateEvent from "../Pages/Events/CreateEvent"
import EventCardDemo from "../Pages/Events/EventCard"
import VolunteerRegistrationPage from "../Pages/Events/VolenteerRegistrationpage"
import VolunteerRegistration from "../Pages/Events/VolunteerRegistration"
import WaitlistManagementPanel from "../Pages/Events/WaitListManagementPanel"
import WaitlistPanelDemo from "../Pages/Events/WaitListDemo"
import VideoScupping from "../Pages/Others/VideoScupping"
import EventDetailPage from "../Pages/Events/EventDetailsPage"
import EventsFeed from "../Pages/Events/Eventfeeds"
import EventPaymentVerify from "../Pages/Events/EventPaymentVerify"
import QRCheckinPage from "../Pages/Events/QRCheckingPage"
import AdminWaitlistFeed from "../Pages/Events/AdminWaitListFeed"
import FreeParticipateRegistration from "../Pages/Events/FreeParticipateRegistration"
import AdminEventsPage from "../Pages/Events/AdminEventPage"
import AdminEventManagePage from "../Pages/Events/AdminEventManagePAge"

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
                path:'/premium', Component: LifetimePremium
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
            },
            {
                path:'/payment-boost-success', Component: PaymentBoostSuccess
            },
            {
                path: '/create-events', Component: CreateEvent
            },
            {
                path: '/event-card', Component: EventCardDemo
            },
            {
                path: '/events/:id/register', Component: VolunteerRegistration
            },
            {
                path: '/waitlist', Component: WaitlistPanelDemo
            },
            {
                path: '/admin/events/:id/manage', element: <PrivateRouter><WaitlistManagementPanel /></PrivateRouter>
            },
            {
                path: '/waitlist-feed', element: <PrivateRouter><AdminWaitlistFeed /></PrivateRouter>
            },
            {
                path: '/events/:id/free-participate', Component: FreeParticipateRegistration
            },
            {
                path: '/event-payment-success', Component: EventPaymentVerify
            },
            {
                path: '/admin/events/edit/:id', element: <PrivateRouter><AdminEventManagePage /></PrivateRouter>
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
                path:'help-support', Component: HelpSupport
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
            },
            {
                path:'payment-history', Component: PaymentHistory
            },
            {
                path: 'payment-details/:paymentId', Component: PaymentDetails
            },
            {
                path: 'review-issues', Component: ReviewIssues
            },
            {
                path: 'payment-history-admin', Component: AdminPaymentHistory
            },
            {
                path: 'admin/staff-insights', Component: StaffPerformanceInsights
            }

        ]
    },
    {
        path: '*', Component: ErrorPage
    },
    {
        path: '/onlytest', Component: AdminEventsPage
    },
    {
        path: '/events', Component: EventsFeed
    },
    {
        path: '/events/:id', Component: EventDetailPage
    }
])