import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>; // Or your PageLoader
    }

    if (!user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
        return <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>
            <h2>Access Denied</h2>
            <p>You do not have permission to view this page.</p>
            <button onClick={() => window.location.href = '/'} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>Go Home</button>
        </div>;
    }

    return children;
};

export default ProtectedRoute;
