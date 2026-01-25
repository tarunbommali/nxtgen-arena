import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { skillsOptions } from '../data/challenges';

export default function ApplicationForm({ challengeId, onCancel, onSuccess }) {
    const { currentUser, userData } = useAuth();
    const [submitting, setSubmitting] = useState(false);

    // Check if profile is complete (basic check)
    const isProfileComplete = userData && userData.fullName && userData.whatsapp && userData.graduation;

    const [formData, setFormData] = useState({
        fullName: userData?.fullName || currentUser?.displayName || "",
        email: userData?.email || currentUser?.email || "",
        whatsapp: userData?.whatsapp || "",
        gender: userData?.gender || "",
        graduation: userData?.graduation || "",
        specialization: userData?.specialization || "",
        year: userData?.year || "",
        regNumber: userData?.regNumber || "",
        skills: userData?.skills || [],
        domain: userData?.domain || "",
        programmingLevel: userData?.programmingLevel || 1,
        confidenceLevel: userData?.confidenceLevel || 1,
        githubUrl: userData?.githubUrl || "",
        codingUrl: userData?.codingUrl || ""
    });

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
            // Update User Document with Application Data
            // State: 'pending'
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                // Save application specific data
                [`applications.${challengeId}`]: {
                    ...formData,
                    submittedAt: serverTimestamp(),
                    status: 'pending'
                },
                // ALSO Update root profile data (synchronize) so they don't have to re-enter next time
                fullName: formData.fullName,
                whatsapp: formData.whatsapp,
                gender: formData.gender,
                graduation: formData.graduation,
                specialization: formData.specialization,
                year: formData.year,
                regNumber: formData.regNumber,
                skills: formData.skills,
                domain: formData.domain,
                programmingLevel: formData.programmingLevel,
                confidenceLevel: formData.confidenceLevel,
                githubUrl: formData.githubUrl,
                codingUrl: formData.codingUrl,

                // Also set a top-level flag for easier checking if needed, or just rely on the path above
                challengeStatus: 'pending'
            });
            alert("Application Submitted Successfully! Your status is now Under Review.");
            window.location.reload(); // Force reload to update status state
            onSuccess();
        } catch (error) {
            console.error("Error submitting application:", error);
            alert("Failed to submit application. Please try again.");
        }
        setSubmitting(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-card border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500" />

            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">30 Days Engineering Challenge Access Form (2026)</h2>
                <p className="text-muted-foreground text-sm">
                    Apply to unlock the challenge. Your application will be reviewed by our team.
                    <br />
                    <span className="text-yellow-500 flex items-center gap-1 mt-1 text-xs">
                        <AlertCircle size={12} /> Access is not automatic. Serious applicants only.
                    </span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name <span className="text-red-500">*</span></label>
                        <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address <span className="text-red-500">*</span></label>
                        <input required disabled name="email" value={formData.email} className="w-full bg-black/40 border border-white/5 rounded-lg p-3 text-muted-foreground cursor-not-allowed" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">WhatsApp Number <span className="text-red-500">*</span></label>
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

                {/* Academic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Graduation Level <span className="text-red-500">*</span></label>
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
                        <label className="text-sm font-medium">Registration/Roll Number <span className="text-red-500">*</span></label>
                        <input required name="regNumber" value={formData.regNumber} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors" />
                    </div>
                </div>

                {/* Technical Skills */}
                <div className="space-y-3">
                    <label className="text-sm font-medium">Relevant Technical Skills <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                    <label className="text-sm font-medium">Interested Domain <span className="text-red-500">*</span></label>
                    <input required name="domain" value={formData.domain} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors" placeholder="e.g. Backyard AI, DevOps, Fullstack..." />
                </div>

                {/* Self Assessment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Programming Level (1-5)</label>
                        <input type="range" min="1" max="5" name="programmingLevel" value={formData.programmingLevel} onChange={handleChange} className="w-full accent-primary" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Beginner</span>
                            <span>Expert</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Confidence to Learn (1-5)</label>
                        <input type="range" min="1" max="5" name="confidenceLevel" value={formData.confidenceLevel} onChange={handleChange} className="w-full accent-primary" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Low</span>
                            <span>High</span>
                        </div>
                    </div>
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">GitHub Profile URL</label>
                        <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors" placeholder="https://github.com/..." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Coding Profile URL</label>
                        <input type="url" name="codingUrl" value={formData.codingUrl} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-primary outline-none transition-colors" placeholder="LeetCode / HackerRank..." />
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2"
                    >
                        {submitting ? <Loader2 className="animate-spin" /> : "Submit Application"}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
