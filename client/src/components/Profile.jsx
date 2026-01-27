import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Edit3, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  Github, 
  Linkedin, 
  ExternalLink,
  Trophy,
  Target,
  BookOpen,
  User,
  GraduationCap,
  Building,
  Hash,
  Globe
} from 'lucide-react';
import AppLayout from './shared/AppLayout';

export default function Profile() {
    const { currentUser, userData } = useAuth();
    const navigate = useNavigate();
    const [userEvents, setUserEvents] = useState([]);
    const [userChallenges, setUserChallenges] = useState([]);

    // Mock data - replace with actual API calls
    useEffect(() => {
        // Simulate API calls for user events and challenges
        setUserEvents([
            { id: 1, name: "Web Development Hackathon", status: "completed", date: "2024-01-15", rank: 3 },
            { id: 2, name: "AI/ML Challenge", status: "ongoing", date: "2024-01-20", rank: null },
            { id: 3, name: "DevOps Workshop", status: "registered", date: "2024-02-01", rank: null }
        ]);

        setUserChallenges([
            { id: "git-mastery", name: "Git Mastery Challenge", progress: 85, status: "ongoing", daysCompleted: 25 },
            { id: "dsa-fundamentals", name: "DSA Fundamentals", progress: 100, status: "completed", daysCompleted: 30 },
            { id: "web-development", name: "Web Development", progress: 45, status: "ongoing", daysCompleted: 13 }
        ]);
    }, []);

    const profileData = {
        firstName: userData?.firstName || currentUser?.displayName?.split(' ')[0] || 'John',
        lastName: userData?.lastName || currentUser?.displayName?.split(' ')[1] || 'Doe',
        email: userData?.email || currentUser?.email || 'john.doe@example.com',
        whatsapp: userData?.whatsapp || '+91 9876543210',
        linkedin: userData?.linkedin || 'https://linkedin.com/in/johndoe',
        github: userData?.github || 'https://github.com/johndoe',
        leetcode: userData?.leetcode || 'https://leetcode.com/johndoe',
        gender: userData?.gender || 'Male',
        registrationNumber: userData?.registrationNumber || 'CS2021001',
        collegeName: userData?.collegeName || 'Indian Institute of Technology',
        imageUrl: userData?.imageUrl || currentUser?.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        specialization: userData?.specialization || 'Computer Science Engineering',
        graduationYear: userData?.graduationYear || '2025'
    };

    const stats = [
        { label: 'Events Participated', value: userEvents.length, icon: Trophy },
        { label: 'Challenges Completed', value: userChallenges.filter(c => c.status === 'completed').length, icon: Target },
        { label: 'Total Progress', value: `${Math.round(userChallenges.reduce((acc, c) => acc + c.progress, 0) / userChallenges.length)}%`, icon: BookOpen }
    ];

    return (
        <AppLayout>
            <div className="space-y-8">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    {/* Cover Background */}
                    <div className="h-48 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 rounded-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={() => navigate('/profile/edit')}
                                className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all flex items-center gap-2"
                            >
                                <Edit3 className="w-4 h-4" />
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="relative -mt-20 px-6">
                        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                            {/* Profile Image */}
                            <div className="relative">
                                <img
                                    src={profileData.imageUrl}
                                    alt={`${profileData.firstName} ${profileData.lastName}`}
                                    className="w-32 h-32 rounded-2xl border-4 border-background shadow-2xl object-cover"
                                />
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-background"></div>
                            </div>

                            {/* Basic Info */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-white">
                                        {profileData.firstName} {profileData.lastName}
                                    </h1>
                                    <p className="text-lg text-muted-foreground">{profileData.specialization}</p>
                                </div>

                                {/* Quick Info */}
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Building className="w-4 h-4" />
                                        {profileData.collegeName}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <GraduationCap className="w-4 h-4" />
                                        Class of {profileData.graduationYear}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Hash className="w-4 h-4" />
                                        {profileData.registrationNumber}
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="flex gap-3">
                                    {profileData.github && (
                                        <a
                                            href={profileData.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                        >
                                            <Github className="w-5 h-5" />
                                        </a>
                                    )}
                                    {profileData.linkedin && (
                                        <a
                                            href={profileData.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                        >
                                            <Linkedin className="w-5 h-5" />
                                        </a>
                                    )}
                                    {profileData.leetcode && (
                                        <a
                                            href={profileData.leetcode}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                        >
                                            <Globe className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/20 rounded-xl">
                                    <stat.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Personal Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Personal Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">{profileData.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">{profileData.whatsapp}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">{profileData.gender}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-primary" />
                                Academic Info
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-muted-foreground">College</div>
                                    <div className="font-medium">{profileData.collegeName}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Specialization</div>
                                    <div className="font-medium">{profileData.specialization}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Graduation Year</div>
                                    <div className="font-medium">{profileData.graduationYear}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Registration Number</div>
                                    <div className="font-medium">{profileData.registrationNumber}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Events & Challenges */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Events Participated */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-primary" />
                                Events Participated
                            </h3>
                            <div className="space-y-3">
                                {userEvents.map((event) => (
                                    <div key={event.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                        <div>
                                            <div className="font-medium">{event.name}</div>
                                            <div className="text-sm text-muted-foreground">{event.date}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {event.rank && (
                                                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                                                    Rank #{event.rank}
                                                </span>
                                            )}
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                event.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                event.status === 'ongoing' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-gray-500/20 text-gray-400'
                                            }`}>
                                                {event.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 30-Day Challenges */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5 text-primary" />
                                30-Day Challenges
                            </h3>
                            <div className="space-y-4">
                                {userChallenges.map((challenge) => (
                                    <div key={challenge.id} className="p-4 bg-white/5 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="font-medium">{challenge.name}</div>
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                challenge.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>
                                                {challenge.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span>{challenge.daysCompleted}/30 days</span>
                                            <div className="flex-1 bg-white/10 rounded-full h-2">
                                                <div 
                                                    className="bg-primary h-2 rounded-full transition-all"
                                                    style={{ width: `${challenge.progress}%` }}
                                                ></div>
                                            </div>
                                            <span>{challenge.progress}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}
