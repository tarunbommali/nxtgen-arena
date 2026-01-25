import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X, Calendar, Map, Code, FileText, Target } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ toggleSidebar, sidebarOpen }) {
    const { currentUser, logout, login } = useAuth();
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Determine if we're in a challenge page (needs sidebar toggle)
    const isChallengePage = location.pathname.includes('/challenge/');

    // Determine max width based on page
    const getNavbarWidth = () => {
        if (isChallengePage) return 'w-full'; // Full width for challenge pages
        return 'max-w-8xl lg:px-24 mx-auto w-full'; // Constrained width for other pages
    };

    const navLinks = [
                { path: '/challenges', label: '30-Day Challenges', icon: Target },
        { path: '/dsa-sheet', label: 'DSA', icon: Code },
        { path: '/events', label: 'Events', icon: Calendar },
        { path: '/roadmaps', label: 'Roadmaps', icon: Map },
    ];

    const isActivePath = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <nav className="h-16 border-b border-white/10 bg-background/95 backdrop-blur-md z-50 w-full shrink-0 sticky top-0">
            <div className={`${getNavbarWidth()} flex items-center justify-between px-4 lg:px-6 h-full`}>
                <div className="flex items-center gap-4 md:gap-6">
                    {/* Sidebar Toggle for Challenge Pages */}
                    {toggleSidebar && isChallengePage && (
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    )}

                    {/* Logo */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
                        {/* Logo Icon */}
                        <div className="relative">
                            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-primary via-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                <div className="w-7 h-7 md:w-8 md:h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                                    <span className="text-white font-black text-xs md:text-sm">N</span>
                                </div>
                            </div>
                            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                        </div>
                        
                        {/* Logo Text */}
                        <div className="flex flex-col">
                            <div className="flex items-center gap-0.5 md:gap-1">
                                <span className="text-lg md:text-xl font-black bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent tracking-tight">
                                    Nxtgen
                                </span>
                                <span className="text-lg md:text-xl font-black bg-gradient-to-r from-primary via-purple-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
                                    Arena
                                </span>
                            </div>
                            <div className="text-xs text-muted-foreground font-medium tracking-wider uppercase hidden sm:block">
                                Engineering Platform
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Side */}
                {currentUser ? (
                    <div className="flex items-center gap-3 md:gap-4">
                        {/* Desktop Navigation Links */}
                        {!isChallengePage && (
                            <div className="hidden md:flex items-center gap-1 mr-4">
                                {navLinks.map((link) => {
                                    const active = isActivePath(link.path);

                                    return (
                                        <button
                                            key={link.path}
                                            onClick={() => navigate(link.path)}
                                            className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors text-sm lg:text-base ${active
                                                ? 'text-white'
                                                : 'text-muted-foreground hover:text-white'
                                                }`}
                                        >
                                            {link.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        {/* User Avatar */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all hover:scale-105"
                            >
                                {currentUser.photoURL ? (
                                    <img src={currentUser.photoURL} alt="User" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <User size={20} />
                                )}
                            </button>

                            <AnimatePresence>
                                {profileOpen && (
                                    <>
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setProfileOpen(false)}
                                        />

                                        {/* Dropdown */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-64 glass-card rounded-xl shadow-2xl overflow-hidden z-50"
                                        >
                                            {/* User Info */}
                                            <div className="p-4 border-b border-white/5 bg-gradient-to-r from-primary/10 to-purple-500/10">
                                                <p className="font-semibold truncate">{currentUser.displayName || 'User'}</p>
                                                <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                                            </div>

                                            {/* Mobile Navigation Links */}
                                            {!isChallengePage && (
                                                <div className="md:hidden border-b border-white/5">
                                                    {navLinks.map((link) => {
                                                        const Icon = link.icon;
                                                        return (
                                                            <button
                                                                key={link.path}
                                                                onClick={() => {
                                                                    setProfileOpen(false);
                                                                    navigate(link.path);
                                                                }}
                                                                className="w-full p-3 text-left hover:bg-white/5 flex items-center gap-3 text-white/80 transition-colors"
                                                            >
                                                                <Icon size={16} />
                                                                {link.label}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* My Applications */}
                                            <button
                                                onClick={() => {
                                                    setProfileOpen(false);
                                                    navigate('/my-applications');
                                                }}
                                                className="w-full p-3 text-left hover:bg-white/5 flex items-center gap-3 text-white/80 transition-colors border-b border-white/5"
                                            >
                                                <FileText size={16} />
                                                My Applications
                                            </button>

                                            {/* Profile & Logout */}
                                            <button
                                                onClick={() => {
                                                    setProfileOpen(false);
                                                    navigate('/profile');
                                                }}
                                                className="w-full p-3 text-left hover:bg-white/5 flex items-center gap-3 text-white/80 transition-colors border-b border-white/5"
                                            >
                                                <User size={16} />
                                                My Profile
                                            </button>
                                            <button
                                                onClick={logout}
                                                className="w-full p-3 text-left hover:bg-white/5 flex items-center gap-3 text-red-400 transition-colors"
                                            >
                                                <LogOut size={16} />
                                                Sign Out
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={login}
                        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-all text-sm md:text-base"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                        <span className="hidden sm:inline">Sign In</span>
                    </button>
                )}
            </div>
        </nav>
    );
}
