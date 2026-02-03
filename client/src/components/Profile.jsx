import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Loader2, Save, User as UserIcon } from 'lucide-react';
import { skillsOptions } from '../data/challenges';
import AppLayout from './shared/AppLayout';

export default function Profile() {
    const { currentUser, userData, setUserData } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        whatsapp: "",
        gender: "",
        graduation: "",
        specialization: "",
        year: "",
        regNumber: "",
        skills: [],
        domain: "",
        programmingLevel: 1,
        confidenceLevel: 1,
        githubUrl: "",
        codingUrl: ""
    });

    useEffect(() => {
        if (userData) {
            setFormData(prev => ({
                ...prev,
                ...userData,
                // Ensure array exists or default to empty
                skills: userData.skills || [],
                // Ensure email/name exist from Auth if not in DB
                email: userData.email || currentUser?.email || "",
                fullName: userData.fullName || currentUser?.displayName || ""
            }));
        }
    }, [userData, currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillChange = (skill) => {
        setFormData(prev => {
            const skills = prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill];
            return { ...prev, skills };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data } = await userAPI.updateProfile(formData);
            if (data.success) {
                setUserData(prev => ({ ...prev, ...data.data.user }));
                alert("Profile Updated Successfully!");
            } else {
                alert(data.message || "Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
        setSubmitting(false);
    };

    return (
        <AppLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
                    <div className="p-4 bg-primary/10 rounded-full text-primary">
                        <UserIcon size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Your Profile</h1>
                        <p className="text-muted-foreground">Manage your information for all challenges</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Info */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary/80 uppercase tracking-wide text-sm">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <input required disabled name="email" value={formData.email} className="w-full bg-black/40 border border-white/5 rounded-lg p-3 text-muted-foreground cursor-not-allowed" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">WhatsApp Number</label>
                                <input required type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors" placeholder="+91" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors" >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Academic Info */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary/80 uppercase tracking-wide text-sm">Academic Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Graduation Level</label>
                                <select required name="graduation" value={formData.graduation} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors">
                                    <option value="">Select Level</option>
                                    <option value="Undergraduate">Undergraduate</option>
                                    <option value="Postgraduate">Postgraduate</option>
                                    <option value="Working Professional">Working Professional</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Specialization</label>
                                <select name="specialization" value={formData.specialization} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors">
                                    <option value="">Select</option>
                                    <option value="B.Tech">B.Tech</option>
                                    <option value="M.Tech">M.Tech</option>
                                    <option value="MCA">MCA</option>
                                    <option value="BCA">BCA</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Current Year</label>
                                <select name="year" value={formData.year} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors">
                                    <option value="">Select</option>
                                    <option value="1st">1st Year</option>
                                    <option value="2nd">2nd Year</option>
                                    <option value="3rd">3rd Year</option>
                                    <option value="4th">4th Year</option>
                                    <option value="Graduated">Graduated</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Registration/Roll Number</label>
                                <input required name="regNumber" value={formData.regNumber} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors" />
                            </div>
                        </div>
                    </section>

                    {/* Technical Skills */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary/80 uppercase tracking-wide text-sm">Skills & Interests</h3>
                        <div className="space-y-3">
                            <label className="text-sm font-medium">Technical Skills</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {skillsOptions.map(skill => (
                                    <button
                                        type="button"
                                        key={skill}
                                        onClick={() => handleSkillChange(skill)}
                                        className={`text-xs px-3 py-2 rounded-lg border text-left transition-all ${formData.skills.includes(skill)
                                            ? 'bg-primary/20 border-primary text-primary-foreground'
                                            : 'bg-black/20 border-white/10 hover:bg-white/5'
                                            }`}
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Interested Domain</label>
                            <input required name="domain" value={formData.domain} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors" placeholder="e.g. Backyard AI, DevOps, Fullstack..." />
                        </div>
                    </section>

                    {/* URLs */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary/80 uppercase tracking-wide text-sm">Portfolio</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">GitHub URL</label>
                                <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors" placeholder="https://github.com/..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Coding Profile URL</label>
                                <input type="url" name="codingUrl" value={formData.codingUrl} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors" placeholder="LeetCode / HackerRank..." />
                            </div>
                        </div>
                    </section>


                    <div className="flex justify-end pt-8 border-t border-white/10">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                        >
                            {submitting ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Profile</>}
                        </button>
                    </div>
                </form>
            </motion.div>
        </AppLayout>
    );
}
