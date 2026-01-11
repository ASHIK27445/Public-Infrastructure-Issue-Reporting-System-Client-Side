import { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const MyIssuePage = () => {
    const axiosSecure = useAxiosSecure(); // FIX 1: Use secure axios instance
    const {citizen} = useOutletContext()
    const navigate = useNavigate();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    // Filters
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    
    // Edit Modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingIssue, setEditingIssue] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    
    // Get unique categories from issues
    const categories = ['all', ...new Set(issues.map(issue => issue.category))];
    // FIX 2: Match backend status values (capitalized)
    const statusOptions = ['all', 'Pending', 'In-Progress', 'Resolved', 'Closed'];

    // Fetch user's issues
    useEffect(() => {
        const fetchMyIssues = async () => {
            if (!citizen?._id) return; // FIX 3: Guard clause
            
            try {
                setLoading(true);
                // FIX 4: Use axiosSecure instead of axios
                const response = await axiosSecure.get(`/myissues/${citizen._id}`);
                setIssues(response.data);
            } catch (error) {
                toast.error('Failed to load issues');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyIssues();
    }, [citizen?._id, axiosSecure]); // FIX 5: Correct dependency

    console.log(citizen)
    
    // Filter issues
    const filteredIssues = issues.filter(issue => {
        const statusMatch = statusFilter === 'all' || issue.status === statusFilter;
        const categoryMatch = categoryFilter === 'all' || issue.category === categoryFilter;
        return statusMatch && categoryMatch;
    });

    // Handle Delete
    const handleDelete = async (issueId) => {
        if (!window.confirm('Are you sure you want to delete this issue?')) return;
        
        try {
            // FIX 6: Use correct endpoint and axiosSecure
            await axiosSecure.delete(`/issue/${issueId}`);
            
            // Remove from UI instantly
            setIssues(issues.filter(issue => issue._id !== issueId));
            
            toast.success('Issue deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete issue');
            console.error(error);
        }
    };

    // Handle Edit Modal Open
    const handleEditClick = (issue) => {
        // FIX 7: Match backend status value (capitalized)
        if (issue.status !== 'Pending') {
            toast.error('You can only edit pending issues');
            return;
        }
        setEditingIssue(issue);
        setShowEditModal(true);
    };

    // Handle Edit Submit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editingIssue) return;
        
        setEditLoading(true);
        
        try {
            const formData = new FormData(e.target);
            const updatedData = {
                title: formData.get('title'),
                description: formData.get('description'),
                category: formData.get('category'),
                location: formData.get('location'),
            };
            
            // FIX 8: Use correct endpoint and axiosSecure
            const response = await axiosSecure.patch(
                `/issue/${editingIssue._id}`,
                updatedData
            );
            
            // Update in UI instantly
            setIssues(issues.map(issue =>
                issue._id === editingIssue._id
                    ? { ...issue, ...updatedData }
                    : issue
            ));
            
            toast.success('Issue updated successfully!');
            setShowEditModal(false);
            setEditingIssue(null);
            
        } catch (error) {
            toast.error('Failed to update issue');
            console.error(error);
        } finally {
            setEditLoading(false);
        }
    };

    // Handle View Details
    const handleViewDetails = (issueId) => {
        navigate(`/issues/${issueId}`);
    };

    // Status badge color - FIX 9: Updated for capitalized status
    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'badge-warning',
            'In-Progress': 'badge-info',
            'Resolved': 'badge-success',
            'Closed': 'badge-neutral'
        };
        return colors[status] || 'badge-ghost';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <title>My Issues - Public Infrastructure</title>
            
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My Reported Issues</h1>
                <div className="flex flex-wrap gap-4 items-center">
                    <p className="text-gray-600">
                        Total Issues: <span className="font-bold">{issues.length}</span>
                    </p>
                    <Link to="/report-issue" className="btn btn-primary btn-sm">
                        + Report New Issue
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-base-200 p-4 rounded-lg mb-6">
                <div className="flex flex-wrap gap-4">
                    {/* Status Filter */}
                    <div>
                        <label className="label">
                            <span className="label-text font-semibold">Filter by Status</span>
                        </label>
                        <select 
                            className="select select-bordered"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            {statusOptions.map(status => (
                                <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Category Filter */}
                    <div>
                        <label className="label">
                            <span className="label-text font-semibold">Filter by Category</span>
                        </label>
                        <select 
                            className="select select-bordered"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Issues List */}
            {filteredIssues.length === 0 ? (
                <div className="text-center py-12 bg-base-200 rounded-lg">
                    <p className="text-xl text-gray-500 mb-4">No issues found</p>
                    <Link to="/report-issue" className="btn btn-primary">
                        Report Your First Issue
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Issue</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Upvotes</th>
                                <th>Reported Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredIssues.map((issue) => (
                                <tr key={issue._id}>
                                    <td>
                                        <div>
                                            <div className="font-semibold">{issue.title}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                {issue.description}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-outline">
                                            {issue.category}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${getStatusColor(issue.status)}`}>
                                            {issue.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${issue.priority === 'High' ? 'badge-error' : 'badge-success'}`}>
                                            {issue.priority}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-1">
                                            <span>👍</span>
                                            <span>{issue.upvoteCount || 0}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {new Date(issue.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            {/* View Details Button */}
                                            <button 
                                                className="btn btn-primary btn-xs"
                                                onClick={() => handleViewDetails(issue._id)}
                                            >
                                                View Details
                                            </button>
                                            
                                            {/* Edit Button - Only for pending issues */}
                                            <button 
                                                className="btn btn-warning btn-xs"
                                                onClick={() => handleEditClick(issue)}
                                                disabled={issue.status !== 'Pending'}
                                                title={issue.status !== 'Pending' ? 'Can only edit pending issues' : 'Edit issue'}
                                            >
                                                Edit
                                            </button>
                                            
                                            {/* Delete Button */}
                                            <button 
                                                className="btn btn-error btn-xs"
                                                onClick={() => handleDelete(issue._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Issue Modal */}
            {showEditModal && editingIssue && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Edit Issue</h3>
                        
                        <form onSubmit={handleEditSubmit}>
                            <div className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="label">
                                        <span className="label-text">Title</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="title"
                                        defaultValue={editingIssue.title}
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>
                                
                                {/* Description */}
                                <div>
                                    <label className="label">
                                        <span className="label-text">Description</span>
                                    </label>
                                    <textarea 
                                        name="description"
                                        defaultValue={editingIssue.description}
                                        className="textarea textarea-bordered w-full"
                                        rows="3"
                                        required
                                    />
                                </div>
                                
                                {/* Category */}
                                <div>
                                    <label className="label">
                                        <span className="label-text">Category</span>
                                    </label>
                                    <select 
                                        name="category"
                                        defaultValue={editingIssue.category}
                                        className="select select-bordered w-full"
                                        required
                                    >
                                        <option value="Streetlight">Streetlight</option>
                                        <option value="Pothole">Pothole</option>
                                        <option value="Water Leak">Water Leak</option>
                                        <option value="Garbage">Garbage</option>
                                        <option value="Footpath">Footpath</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                
                                {/* Location */}
                                <div>
                                    <label className="label">
                                        <span className="label-text">Location</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="location"
                                        defaultValue={editingIssue.location}
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="modal-action">
                                <button 
                                    type="button" 
                                    className="btn btn-ghost"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingIssue(null);
                                    }}
                                    disabled={editLoading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={editLoading}
                                >
                                    {editLoading ? 'Updating...' : 'Update Issue'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyIssuePage;