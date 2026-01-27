import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  Github, 
  Linkedin, 
  Globe,
  Building,
  GraduationCap,
  Hash,
  Image as ImageIcon
} from 'lucide-react';
import AppLayout from './shared/AppLayout';

export default function EditProfile() {
    const { currentUser, userData, setUserData } = useAuth();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        whatsapp: '',
        linkedin: '',
        github: '',
        leetcode: '',
        gender: '',
        registrationNumber: '',
        collegeName: '',
        imageUrl: '',
        specialization: '',
        graduationYear: ''
    });

    useEffect(() => {
        if (userData || currentUser) {
            setFormData({
                firstName: userData?.firstName || currentUser?.displayName?.split(' ')[0] || '',
                lastName: userData?.lastName || currentUser?.displayName?.split(' ')[1] || '',
                email: userData?.email || currentUser?.email || '',
                whatsapp: userData?.whatsapp || '',
                linkedin: userData?.linkedin || '',
                github: userData?.github || '',
                leetcode: userData?.leetcode || '',
                gender: userData?.gender || '',
                registrationNumber: userData?.registrationNumber || '',
                collegeName: userData?.collegeName || '',
                imageUrl: userData?.imageUrl || currentUser?.photoURL || '',
                specialization: userData?.specialization || '',
                graduationYear: userData?.graduationYear || ''
            });
        }
    }, [userData, currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const userRef = doc(db, "users", currentUser.uid);
            const updatedData = {
                ...formData,
                lastProfileUpdate: serverTimestamp()
            };

            await updateDoc(userRef, updatedData);
            setUserData(prev => ({ ...prev, ...updatedData }));
            
            // Show success message and navigate back
            alert("Profile updated successfully!");
            navigate('/profile');
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
        
        setSubmitting(false);
    };

    return (
        <AppLayout>
            <div className="space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4"
                >
                    <button
                        onClick={() => navigate('/profile')}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Profile</h1>
                        <p className="text-muted-foreground">Update your personal information</p>
                    </div>
                </motion.div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="space-y-8"
                >
                    {/* Personal Information */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Personal Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors"
                                    placeholder="Enter your first name"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors"
                                    placeholder="Enter your last name"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full bg-black/40 border border-white/5 rounded-lg p-3 text-muted-foreground cursor-not-allowed"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    WhatsApp Number
                                </label>
                                <input
                                    type="tel"
                                    name="whatsapp"
                                    value={formData.whatsapp}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors"
                                    placeholder="+91 9876543210"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" />
                                    Profile Image URL
                                </label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-primary" />
                            Academic Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Building className="w-4 h-4" />
                                    College Name
                                </label>
                                <input
                                    type="text"
                                    name="collegeName"
                                    value={formData.collegeName}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors"
                                    placeholder="Enter your college name"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Specialization</label>
                                <select
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors"
                                >
                                    <option value="">Select Specialization</option>
                                    <option value="Computer Science Engineering">Computer Science Engineering</option>
                                    <option value="Information Technology">Information Technology</option>
                                    <option value="Electronics and Communication">Electronics and Communication</option>
                                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                                    <option value="Civil Engineering">Civil Engineering</option>
                                    <option value="Electrical Engineering">Electrical Engineering</option>
                                    <option value="Master of Computer Applications">Master of Computer Applications</option>
                                    <option value="Bachelor of Computer Applications">Bachelor of Computer Applications</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Graduation Year</label>
                                <select
                                    name="graduationYear"
                                    value={formData.graduationYear}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors"
                                >
                                    <option value="">Select Year</option>
                                    {Array.from({ length: 10 }, (_, i) => {
                                        const year = new Date().getFullYear() + i;
                                        return (
                                            <option key={year} value={year}>{year}</option>
                                        );
                                    })}
                                </select>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Hash className="w-4 h-4" />
                                    Registration Number
                                </label>
                                <input
                                    type="text"
                                    name="registrationNumber"
                                    value={formData.registrationNumber}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors"
                                    placeholder="Enter your registration number"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-primary" />
                            Social Links
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Github className="w-4 h-4" />
                                    GitHub Profile
                                </label>
                                <input
                                    type="url"
                                    name="github"
                                    value={formData.github}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors"
                                    placeholder="https://github.com/username"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Linkedin className="w-4 h-4" />
                                    LinkedIn Profile
                                </label>
                                <input
                                    type="url"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors"
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    LeetCode Profile
                                </label>
                                <input
                                    type="url"
                                    name="leetcode"
                                    value={formData.leetcode}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors"
                                    placeholder="https://leetcode.com/username"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-8 border-t border-white/10">
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </motion.form>
            </div>
        </AppLayout>
    );
}