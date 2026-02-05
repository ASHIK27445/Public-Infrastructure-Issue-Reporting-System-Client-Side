# CommunityFix

A modern web-based platform for community issue reporting and management. CommunityFix enables citizens to report local issues, track their resolution progress, and engage with community improvements through an intuitive interface.

## Overview

CommunityFix is a comprehensive civic engagement platform that bridges the gap between citizens and local authorities. The platform allows users to report community issues such as infrastructure problems, public safety concerns, and environmental hazards. With role-based access control, the system supports three user types: Citizens, Staff, and Administrators, each with specific capabilities to ensure efficient issue resolution.

## Technology Stack

<table>
<tr>
  <td align="center" width="96">
    <img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
    <br>React
  </td>
  <td align="center" width="96">
    <img src="https://skillicons.dev/icons?i=vite" width="48" height="48" alt="Vite" />
    <br>Vite
  </td>
  <td align="center" width="96">
    <img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
    <br>Tailwind
  </td>
  <td align="center" width="96">
    <img src="https://skillicons.dev/icons?i=firebase" width="48" height="48" alt="Firebase" />
    <br>Firebase
  </td>
  <td align="center" width="96">
    <img src="https://skillicons.dev/icons?i=mongodb" width="48" height="48" alt="MongoDB" />
    <br>MongoDB
  </td>
  <td align="center" width="96">
    <img src="https://skillicons.dev/icons?i=nodejs" width="48" height="48" alt="Node.js" />
    <br>Node.js
  </td>
  <td align="center" width="96">
    <img src="https://skillicons.dev/icons?i=express" width="48" height="48" alt="Express" />
    <br>Express
  </td>
</tr>
</table>

## Key Features

### For Citizens
- **Issue Reporting** - Submit detailed reports with photos, location, and priority levels
- **Issue Tracking** - Monitor resolution progress in real-time
- **Payment Integration** - Upgrade to premium or boost issue visibility
- **Interactive Dashboard** - Personal statistics and issue history
- **Map Visualization** - View issues on interactive maps
- **Community Engagement** - Upvote and comment on issues

### For Staff
- **Task Management** - Access and manage assigned issues
- **Status Updates** - Update issue resolution progress
- **Performance Tracking** - Monitor personal metrics
- **Review System** - Evaluate and process submissions

### For Administrators
- **User Management** - Control access and permissions
- **Staff Oversight** - Assign roles and manage team
- **System Analytics** - Comprehensive revenue and metrics
- **Issue Control** - Approve, reject, or assign reports
- **Payment Monitoring** - Track platform transactions

## Installation

### Prerequisites
```bash
Node.js 18+
npm or yarn
MongoDB
Firebase Account
Stripe Account
```

### Setup

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/communityfix.git
cd communityfix
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Configuration**

Create `.env` file:
```env
VITE_API_URL=your_backend_api_url
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. **Run Development Server**
```bash
npm run dev
```

5. **Build Production**
```bash
npm run build
```

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/allissues` | Get all reviewed issues with pagination |
| `GET` | `/detailIssues/:id` | Get detailed issue information |
| `GET` | `/user/role/:email` | Get user role by email |

### User Management

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/user/citizen` | ✓ | All | Get authenticated user profile |
| `PATCH` | `/user/update` | ✓ | All | Update user profile |
| `GET` | `/allusers` | ✓ | Admin | Get all system users |
| `POST` | `/create/user` | ✓ | Admin | Create new user account |
| `PATCH` | `/update/user/status` | ✓ | Admin | Block/unblock user |

### Issue Management

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/create-issue` | ✓ | Citizen | Create new issue report |
| `GET` | `/myissues/:id` | ✓ | All | Get user's issues |
| `PATCH` | `/issue/:id` | ✓ | Owner | Update issue details |
| `DELETE` | `/issue/:id` | ✓ | Owner | Delete issue |
| `GET` | `/admin/allissues` | ✓ | Admin | Get all issues |
| `POST` | `/assign-issue` | ✓ | Admin | Assign to staff |
| `PATCH` | `/reject-issue/:id` | ✓ | Admin | Reject with reason |
| `GET` | `/assigned-issues/:staffId` | ✓ | Staff | Get assigned issues |
| `PATCH` | `/assigned/:issueId` | ✓ | Staff | Update status |

### Payment System

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/create-payment-session` | ✓ | All | Create Stripe session |
| `GET` | `/verify-payment/:sessionId` | ✓ | All | Verify payment |
| `GET` | `/user-payment-history/:userId` | ✓ | Citizen | Get payment history |
| `GET` | `/admin/payment-history` | ✓ | Admin | Get all transactions |
| `GET` | `/payment-details/:paymentId` | ✓ | All | Get payment details |

### Engagement

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/upvote` | ✓ | All | Upvote issue |
| `DELETE` | `/upvote/:issueId` | ✓ | All | Remove upvote |
| `GET` | `/comments/:issueId` | ✓ | All | Get comments |
| `POST` | `/comments` | ✓ | All | Add comment |

### Analytics

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/admin/analytics` | ✓ | Admin | Dashboard analytics |
| `GET` | `/staff/analytics/:staffId` | ✓ | Staff/Admin | Staff metrics |

## User Roles

| Role | Permissions |
|------|-------------|
| **Citizen** | Report issues, manage own reports, upvote, comment, purchase premium |
| **Staff** | View assigned issues, update status, mark as resolved |
| **Admin** | Full system access, user/staff management, analytics, payment oversight |

## Payment Plans

| Plan | Features |
|------|----------|
| **Basic** | Issue reporting, standard visibility, basic support |
| **Premium** | Priority support, enhanced visibility, unlimited reporting |
| **Boost** | Increased visibility for specific issues |

## Security

- JWT authentication with secure token management
- Firebase authentication integration
- Role-based access control (RBAC)
- Input validation and sanitization
- XSS and CSRF protection
- Secure payment processing via Stripe
- Rate limiting on API endpoints

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.

## Contact

- **Email**: mdashikulislam27889@gmail.com
## Acknowledgments

- OpenStreetMap for map data
- Stripe for payment processing
- Firebase for authentication
- Tailwind CSS for styling framework