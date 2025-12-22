  // Demo issue data
  const issue = {
    id: 1,
    title: "Pothole on Main Street",
    description: "Large pothole causing traffic issues and vehicle damage. Located near the intersection with Maple Avenue. Approximately 2 feet wide and 6 inches deep. Multiple vehicles have reported damage.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    priority: "High",
    status: "In Progress",
    isBoosted: true,
    upvotes: 42,
    views: 128,
    comments: 8,
    createdAt: "2024-01-15T10:30:00Z",
    location: "Downtown, Sector 5",
    category: "Road Maintenance",
    
    reporterName: "John Doe",
    reporterAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    reporterJoined: "2023-06-10",
    reporterIssues: 12,
    reporterSuccessRate: 85,
    
    assignedStaff: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2087&q=80",
      department: "Public Works Department",
      phone: "+1 (555) 123-4567",
      email: "s.johnson@cityworks.gov",
    },
    assignedAt: "2024-01-16T14:20:00Z",
    userUpvoted: false
  };

  // Demo timeline data
  const timeline = [
    {
      id: 1,
      type: 'created',
      title: 'Issue Reported',
      description: 'Issue was initially reported by citizen',
      role: 'Citizen',
      updatedBy: 'John Doe',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      type: 'assigned',
      title: 'Assigned to Department',
      description: 'Issue assigned to Public Works Department',
      role: 'Admin',
      updatedBy: 'System Admin',
      createdAt: '2024-01-15T14:15:00Z'
    },
    {
      id: 3,
      type: 'status_change',
      title: 'Status Updated',
      description: 'Issue marked as In Progress',
      role: 'Staff',
      updatedBy: 'Sarah Johnson',
      createdAt: '2024-01-16T09:45:00Z'
    },
    {
      id: 4,
      type: 'boost',
      title: 'Priority Boosted',
      description: 'Issue priority boosted to High through payment',
      role: 'Citizen',
      updatedBy: 'John Doe',
      createdAt: '2024-01-16T11:30:00Z'
    },
    {
      id: 5,
      type: 'comment',
      title: 'New Comment',
      description: 'Road crew dispatched for inspection',
      role: 'Staff',
      updatedBy: 'Sarah Johnson',
      createdAt: '2024-01-17T08:20:00Z'
    }
  ];