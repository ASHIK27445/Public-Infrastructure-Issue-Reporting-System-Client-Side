# CommunityFix

A modern web-based platform for community issue reporting and management. CommunityFix enables citizens to report local issues, track their resolution progress, and engage with community improvements through an intuitive interface.

## Project Description

CommunityFix is a comprehensive civic engagement platform that bridges the gap between citizens and local authorities. The platform allows users to report community issues such as infrastructure problems, public safety concerns, and environmental hazards. With role-based access control, the system supports three user types: Citizens, Staff, and Administrators, each with specific capabilities to ensure efficient issue resolution.

Key highlights of the platform include:

- Real-time issue tracking with geolocation
- Priority-based issue categorization
- Payment integration for premium features and issue boosting
- Interactive map visualization for spatial issue distribution
- Comprehensive dashboard analytics
- Mobile-responsive design for accessibility

## Technology Stack

### Frontend Framework & Build Tools

| Technology | Description |
|------------|-------------|
| ![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black) | JavaScript library for building user interfaces |
| ![React Router](https://img.shields.io/badge/React_Router-7.1.1-CA4245?style=for-the-badge&logo=react-router&logoColor=white) | Declarative routing for React applications |
| ![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF?style=for-the-badge&logo=vite&logoColor=white) | Next generation frontend build tool |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white) | Utility-first CSS framework |

### Authentication & Security

| Technology | Description |
|------------|-------------|
| ![Firebase](https://img.shields.io/badge/Firebase-11.1.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black) | Authentication and user management |
| ![JWT](https://img.shields.io/badge/JWT-Token-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white) | Secure token-based authentication |

### Payment Processing

| Technology | Description |
|------------|-------------|
| ![Stripe](https://img.shields.io/badge/Stripe-Payment-008CDD?style=for-the-badge&logo=stripe&logoColor=white) | Secure payment gateway integration |

### Maps & Geolocation

| Technology | Description |
|------------|-------------|
| ![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=for-the-badge&logo=leaflet&logoColor=white) | Interactive map library |
| ![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-Maps-7EBC6F?style=for-the-badge&logo=openstreetmap&logoColor=white) | Open-source map data |

### UI Components & Libraries

| Technology | Description |
|------------|-------------|
| ![Lucide](https://img.shields.io/badge/Lucide-Icons-F56565?style=for-the-badge&logo=lucide&logoColor=white) | Beautiful icon library |
| ![SweetAlert2](https://img.shields.io/badge/SweetAlert2-11.15.10-7066E0?style=for-the-badge) | Beautiful alert & modal library |
| ![React Toastify](https://img.shields.io/badge/React_Toastify-11.0.3-FF6B6B?style=for-the-badge) | Notification library |
| ![Swiper](https://img.shields.io/badge/Swiper-11.1.15-6332F6?style=for-the-badge&logo=swiper&logoColor=white) | Modern carousel/slider |
| ![Recharts](https://img.shields.io/badge/Recharts-2.15.0-22B5BF?style=for-the-badge) | Composable charting library |

### HTTP Client & Utilities

| Technology | Description |
|------------|-------------|
| ![Axios](https://img.shields.io/badge/Axios-HTTP-5A29E4?style=for-the-badge&logo=axios&logoColor=white) | Promise-based HTTP client |
| ![date-fns](https://img.shields.io/badge/date--fns-4.1.0-770C56?style=for-the-badge) | Modern date utility library |

## Features

### For Citizens

- Issue Reporting: Submit detailed reports with photos, location, and priority levels
- Issue Management: Track, edit, and delete personal issue submissions
- Payment Integration: Upgrade to premium membership or boost issue visibility
- Interactive Dashboard: View personal statistics and issue history
- Payment History: Access detailed transaction records
- Profile Management: Update personal information and preferences
- Map View: Visualize issues on an interactive map

### For Staff

- Assigned Issues: Access and manage assigned community issues
- Issue Review: Evaluate and process submitted reports
- Status Updates: Update issue resolution progress
- Performance Tracking: Monitor personal task completion metrics

### For Administrators

- User Management: Control user access and permissions
- Staff Management: Assign roles and manage staff members
- Issue Oversight: View all system issues with filtering capabilities
- Rejected Issues: Review and manage rejected submissions
- Payment Analytics: Monitor platform revenue and transactions
- System Settings: Configure platform parameters

### General Features

- Role-Based Access Control: Secure permission system for different user types
- Responsive Design: Optimized for desktop, tablet, and mobile devices
- Search and Filter: Advanced search capabilities across issues
- Category Management: Organized issue categorization system
- Upvoting System: Community-driven priority ranking
- Geolocation: Automatic location detection and manual selection
- Analytics Dashboard: Comprehensive data visualization
- Security: JWT authentication and authorization
- Payment Gateway: Secure Stripe integration
- Theme Support: Dark mode interface

## Project Structure

```
src/
├── Pages/
│   ├── Admin/
│   │   ├── AdminPaymentHistory.jsx
│   │   ├── ManageStaff.jsx
│   │   ├── ManageUser.jsx
│   │   ├── RejectedIssues.jsx
│   │   └── ViewIssues.jsx
│   ├── Authentication/
│   │   ├── AuthProvider.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── PrivateRouter.jsx
│   ├── Components/
│   │   ├── AddIssues.jsx
│   │   ├── AllIssuesPage.jsx
│   │   ├── IssueDetailsPage.jsx
│   │   ├── ManageIssues.jsx
│   │   ├── MyProfile.jsx
│   │   ├── PaymentDetails.jsx
│   │   ├── PaymentHistory.jsx
│   │   ├── PaymentSuccess.jsx
│   │   └── ReviewIssues.jsx
│   ├── Dashboard/
│   │   ├── CitizenDashboard.jsx
│   │   └── DashboardAside.jsx
│   ├── Staff/
│   │   └── AssignedIssues.jsx
│   └── Others/
│       ├── MapView.jsx
│       └── ErrorPage.jsx
├── Hooks/
│   ├── useAxios.jsx
│   └── useAxiosSecure.jsx
└── Routes/
    └── router.jsx
```

## Installation

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Firebase account for authentication
- Stripe account for payment processing
- MongoDB database (backend)

### Setup Instructions

1. Clone the repository

```bash
git clone https://github.com/yourusername/communityfix.git
cd communityfix
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_backend_api_url
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Start the development server

```bash
npm run dev
```

5. Build for production

```bash
npm run build
```

## API Endpoints

The application integrates with backend services through these key endpoints:

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/allissues` | Get all reviewed issues with pagination |
| GET | `/detailIssues/:id` | Get detailed information about a specific issue |
| GET | `/user/role/:email` | Get user role by email |

### User Management

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/user/citizen` | Get authenticated user profile | Yes | All |
| PATCH | `/user/update` | Update user profile | Yes | All |
| GET | `/allusers` | Get all users in system | Yes | Admin |
| POST | `/create/user` | Create new user account | Yes | Admin |
| PATCH | `/update/user/status` | Update user status (block/unblock) | Yes | Admin |

### Issue Management

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/create-issue` | Create a new issue report | Yes | Citizen |
| GET | `/myissues/:id` | Get all issues reported by user | Yes | All |
| PATCH | `/issue/:id` | Update issue details | Yes | Owner |
| DELETE | `/issue/:id` | Delete an issue | Yes | Owner |
| GET | `/admin/allissues` | Get all issues (admin view) | Yes | Admin |
| POST | `/assign-issue` | Assign issue to staff member | Yes | Admin |
| PATCH | `/reject-issue/:id` | Reject an issue with reason | Yes | Admin |
| GET | `/assigned-issues/:staffId` | Get issues assigned to staff | Yes | Staff |
| PATCH | `/assigned/:issueId` | Update assigned issue status | Yes | Staff |

### Payment System

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/create-payment-session` | Create Stripe payment session | Yes | All |
| GET | `/verify-payment/:sessionId` | Verify payment completion | Yes | All |
| GET | `/user-payment-history/:userId` | Get user payment history | Yes | Citizen |
| GET | `/admin/payment-history` | Get all payment transactions | Yes | Admin |
| GET | `/payment-details/:paymentId` | Get detailed payment information | Yes | All |

### Voting & Comments

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/upvotes/:issueId` | Get upvote status for issue | Yes | All |
| POST | `/upvote` | Upvote an issue | Yes | All |
| DELETE | `/upvote/:issueId` | Remove upvote from issue | Yes | All |
| GET | `/comments/:issueId` | Get all comments for an issue | Yes | All |
| POST | `/comments` | Add a comment to an issue | Yes | All |

### Analytics

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/admin/analytics` | Get comprehensive dashboard analytics | Yes | Admin |
| GET | `/staff/analytics/:staffId` | Get staff performance metrics | Yes | Staff/Admin |

## User Roles and Permissions

### Citizen
- Report new issues
- Manage personal issues
- View all community issues
- Upvote issues
- Purchase premium membership
- Boost issue visibility

### Staff
- View assigned issues
- Update issue status
- Review submitted issues
- Mark issues as resolved

### Admin
- Full system access
- User management
- Staff management
- Issue oversight
- Payment analytics
- System configuration

## Payment Plans

### Basic Subscription
- Issue reporting
- Basic support
- Standard visibility

### Premium Subscription
- Priority support
- Enhanced visibility
- Advanced analytics
- Unlimited issue reporting

### Issue Boosting
- Normal Boost: Increased visibility
- High Boost: Maximum visibility and priority

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

- Code splitting with React Router
- Lazy loading for routes
- Image optimization
- API response caching
- Minified production builds

## Security Features

- JWT authentication
- Secure HTTP-only cookies
- CSRF protection
- XSS prevention
- SQL injection protection
- Rate limiting
- Input validation and sanitization

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Commit your changes with clear messages
4. Push to your branch
5. Submit a pull request

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For support and inquiries:
- Email: support@communityfix.com
- Documentation: https://docs.communityfix.com
- Issue Tracker: https://github.com/yourusername/communityfix/issues

## Acknowledgments

- OpenStreetMap for map data
- Stripe for payment processing
- Firebase for authentication services
- Lucide for icon library
- Tailwind CSS for styling framework

## Version History

### Version 1.0.0
- Initial release
- Core issue reporting functionality
- User authentication and authorization
- Payment integration
- Admin and staff dashboards
- Map visualization
- Mobile responsive design

## Future Enhancements

- Push notifications
- Mobile application (React Native)
- Advanced analytics and reporting
- Multi-language support
- AI-powered issue categorization
- Integration with municipal databases
- Public API for third-party integrations
- Real-time chat support
- Community forums
- Gamification features