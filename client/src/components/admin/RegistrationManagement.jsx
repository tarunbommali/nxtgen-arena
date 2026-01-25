import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Check, X, User, Mail, Calendar, Filter, Download } from 'lucide-react';

export default function RegistrationManagement() {
    // Mock data - replace with API call
    const [registrations, setRegistrations] = useState([
        { id: 1, name: 'Raj Kumar', email: 'raj@example.com', event: 'Spring Hackathon 2026', appliedOn: '2026-01-15', status: 'pending' },
        { id: 2, name: 'Priya Sharma', email: 'priya@example.com', event: 'AI Challenge March', appliedOn: '2026-01-20', status: 'pending' },
        { id: 3, name: 'Arjun Patel', email: 'arjun@example.com', event: 'Web Dev Contest', appliedOn: '2026-01-10', status: 'approved' },
        { id: 4, name: 'Neha Singh', email: 'neha@example.com', event: 'Spring Hackathon 2026', appliedOn: '2026-01-18', status: 'rejected' },
        { id: 5, name: 'Vikram Reddy', email: 'vikram@example.com', event: 'DSA Sprint Challenge', appliedOn: '2026-01-22', status: 'pending' },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredRegistrations = registrations.filter(reg => {
        const matchesSearch =
            reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reg.event.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || reg.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleApprove = (id) => {
        setRegistrations(regs => regs.map(reg =>
            reg.id === id ? { ...reg, status: 'approved' } : reg
        ));
        // TODO: Call API
    };

    const handleReject = (id) => {
        setRegistrations(regs => regs.map(reg =>
            reg.id === id ? { ...reg, status: 'rejected' } : reg
        ));
        // TODO: Call API
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const statusCounts = {
        all: registrations.length,
        pending: registrations.filter(r => r.status === 'pending').length,
        approved: registrations.filter(r => r.status === 'approved').length,
        rejected: registrations.filter(r => r.status === 'rejected').length,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Event Registrations</h2>
                    <p className="text-sm text-muted-foreground">{filteredRegistrations.length} registrations found</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-colors">
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(statusCounts).map(([status, count]) => (
                    <div key={status} className={`glass-card rounded-xl p-4 ${filterStatus === status ? 'ring-2 ring-primary' : ''}`}>
                        <div className="text-2xl font-bold mb-1">{count}</div>
                        <div className="text-sm text-muted-foreground capitalize">{status}</div>
                    </div>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="glass-card rounded-xl p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or event..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'pending', 'approved', 'rejected'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors capitalize ${filterStatus === status
                                        ? 'bg-primary text-white'
                                        : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Registrations Table */}
            <div className="glass-card rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Applicant</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Event</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Applied On</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredRegistrations.map((reg, index) => (
                                <motion.tr
                                    key={reg.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-white/5 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold">
                                                {reg.name[0]}
                                            </div>
                                            <div>
                                                <div className="font-medium">{reg.name}</div>
                                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {reg.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium">{reg.event}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(reg.appliedOn).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(reg.status)}`}>
                                            {reg.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {reg.status === 'pending' ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleApprove(reg.id)}
                                                    className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors"
                                                    title="Approve"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(reg.id)}
                                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                                                    title="Reject"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center text-sm text-muted-foreground">
                                                {reg.status === 'approved' ? 'Approved' : 'Rejected'}
                                            </div>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredRegistrations.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No registrations found</p>
                </div>
            )}
        </motion.div>
    );
}
