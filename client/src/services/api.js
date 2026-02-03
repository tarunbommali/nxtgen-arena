import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ================================
// AUTH APIs
// ================================

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    googleLogin: (data) => api.post('/auth/google', data),
    getProfile: () => api.get('/auth/profile'),
};

// ================================
// EVENT APIs
// ================================

export const eventAPI = {
    getAll: (params) => api.get('/events', { params }),
    getById: (id) => api.get(`/events/${id}`),
    getUpcoming: () => api.get('/events/upcoming'),
    getLive: () => api.get('/events/live'),
    getPast: () => api.get('/events/past'),
    getFeatured: () => api.get('/events/featured'),
    getTeams: (id) => api.get(`/events/${id}/teams`),
    register: (id, data) => api.post(`/events/${id}/register`, data),
    cancelRegistration: (id) => api.delete(`/events/${id}/register`),
};

// ================================
// TEAM APIs
// ================================

export const teamAPI = {
    create: (data) => api.post('/teams/create', data),
    getDetails: (id) => api.get(`/teams/${id}`),
    invite: (id, data) => api.post(`/teams/${id}/invite`, data),
    requestJoin: (id, data) => api.post(`/teams/${id}/request-join`, data),
    respondRequest: (id, data) => api.patch(`/teams/${id}/respond-request`, data),
    getRequests: (id) => api.get(`/teams/${id}/requests`),
    leave: (id) => api.post(`/teams/${id}/leave`),
    delete: (id) => api.delete(`/teams/${id}`),
};

// ================================
// USER APIs
// ================================

export const userAPI = {
    getProfile: () => api.get('/users/me'),
    updateProfile: (data) => api.put('/users/me', data),
    getRegistrations: (params) => api.get('/users/me/registrations', { params }),
    getTeams: () => api.get('/users/me/teams'),
    getSubmissions: () => api.get('/users/me/submissions'),
    getStats: () => api.get('/users/me/stats'),
};

// ================================
// SUBMISSION APIs
// ================================

export const submissionAPI = {
    submit: (eventId, formData) => {
        return api.post(`/events/${eventId}/submit`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    getMySubmission: (eventId) => api.get(`/events/${eventId}/submission`),
    deleteSubmission: (eventId) => api.delete(`/events/${eventId}/submission`),
    getTemplate: (eventId) => api.get(`/events/${eventId}/submission-template`),
};

// ================================
// PAYMENT APIs
// ================================

export const paymentAPI = {
    createOrder: (data) => api.post('/payments/create-order', data),
    verifyPayment: (data) => api.post('/payments/verify', data),
    getDetails: (paymentId) => api.get(`/payments/${paymentId}`),
};

// ================================
// ADMIN APIs
// ================================

export const adminAPI = {
    // Events
    createEvent: (data) => api.post('/admin/events', data),
    updateEvent: (id, data) => api.put(`/admin/events/${id}`, data),
    deleteEvent: (id) => api.delete(`/admin/events/${id}`),
    getAllEvents: (params) => api.get('/admin/events', { params }),
    getParticipants: (id, params) => api.get(`/admin/events/${id}/participants`, { params }),
    getEventTeams: (id) => api.get(`/admin/events/${id}/teams`),
    toggleStatus: (id, status) => api.patch(`/admin/events/${id}/status`, { status }),
    closeRegistrations: (id) => api.patch(`/admin/events/${id}/close-registrations`),

    // Submissions
    getSubmissions: (id, params) => api.get(`/admin/events/${id}/submissions`, { params }),
    getSubmissionDetails: (submissionId) => api.get(`/admin/submissions/${submissionId}`),
    evaluateSubmission: (submissionId, data) => api.patch(`/admin/submissions/${submissionId}/evaluate`, data),
    bulkEvaluate: (data) => api.post('/admin/submissions/bulk-evaluate', data),
    publishResults: (id, data) => api.post(`/admin/events/${id}/publish-results`, data),
    exportSubmissions: (id) => api.get(`/admin/events/${id}/submissions/export`),

    // Analytics
    getDashboard: () => api.get('/admin/analytics'),
    getEventAnalytics: (params) => api.get('/admin/analytics/events', { params }),
    getRevenueAnalytics: (params) => api.get('/admin/analytics/revenue', { params }),
    getUserAnalytics: () => api.get('/admin/analytics/users'),
    getCategoryStats: () => api.get('/admin/analytics/categories'),
    exportAnalytics: (params) => api.get('/admin/analytics/export', { params }),
};

export default api;
