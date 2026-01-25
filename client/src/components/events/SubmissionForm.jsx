import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Link as LinkIcon, Github, Code, Sparkles, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SubmissionForm({ eventId, event }) {
    const { currentUser } = useAuth();
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        projectDeckUrl: '',
        mvpLink: '',
        demoVideoUrl: '',
        githubRepoUrl: '',
        technologiesUsed: '',
        aiToolsIntegrated: '',
        solutionDescription: ''
    });

    const [pdfFile, setPdfFile] = useState(null);
    const [pdfUploading, setPdfUploading] = useState(false);

    useEffect(() => {
        fetchSubmission();
    }, [eventId]);

    const fetchSubmission = async () => {
        try {
            const res = await fetch(`/api/events/${eventId}/submission`, {
                headers: { 'Authorization': `Bearer ${currentUser.token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setSubmission(data);
                setFormData({
                    projectDeckUrl: data.projectDeckUrl || '',
                    mvpLink: data.mvpLink || '',
                    demoVideoUrl: data.demoVideoUrl || '',
                    githubRepoUrl: data.githubRepoUrl || '',
                    technologiesUsed: data.technologiesUsed || '',
                    aiToolsIntegrated: data.aiToolsIntegrated || '',
                    solutionDescription: data.solutionDescription || ''
                });
            }
        } catch (error) {
            console.error('Error fetching submission:', error);
        }
        setLoading(false);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Please upload a PDF file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB
                alert('File size must be less than 5MB');
                return;
            }
            setPdfFile(file);
        }
    };

    const handleUploadPdf = async () => {
        if (!pdfFile) return;

        setPdfUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', pdfFile);

            const res = await fetch(`/api/upload/project-deck`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${currentUser.token}` },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, projectDeckUrl: data.url }));
                alert('PDF uploaded successfully!');
            }
        } catch (error) {
            console.error('Error uploading PDF:', error);
            alert('Failed to upload PDF');
        }
        setPdfUploading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/events/${eventId}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Submission saved successfully!');
                fetchSubmission();
            }
        } catch (error) {
            console.error('Error submitting:', error);
            alert('Failed to submit');
        }
        setSaving(false);
    };

    const isSubmissionOpen = () => {
        const now = new Date();
        const start = new Date(event.submissionStart);
        const deadline = new Date(event.submissionDeadline);
        return now >= start && now <= deadline;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    if (!isSubmissionOpen()) {
        return (
            <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">Submission Not Open</h3>
                <p className="text-muted-foreground">
                    Submissions will be accepted from {formatDate(event.submissionStart)}
                </p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold mb-2">Project Submission</h2>
                {event.submissionTemplateUrl && (
                    <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">
                            Submission Instructions: Use the submission template for your PPT deck or presentation
                        </p>
                        <a
                            href={event.submissionTemplateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            Download Template
                        </a>
                    </div>
                )}
            </div>

            {/* Timeline */}
            <div className="glass-card rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Starting Date</p>
                        <p className="font-medium">{formatDate(event.submissionStart)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Ending Date</p>
                        <p className="font-medium text-red-500">{formatDate(event.submissionDeadline)}</p>
                    </div>
                </div>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 space-y-6">
                {/* PDF Upload */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Upload your project deck/presentation *
                    </label>
                    <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="pdf-upload"
                        />
                        <label htmlFor="pdf-upload" className="cursor-pointer">
                            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-sm text-muted-foreground mb-2">
                                {pdfFile ? pdfFile.name : 'Drop your PDF here or browse'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Supports: PDF file upto 5 MB.
                            </p>
                        </label>
                        {pdfFile && (
                            <button
                                type="button"
                                onClick={handleUploadPdf}
                                disabled={pdfUploading}
                                className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg disabled:opacity-50"
                            >
                                {pdfUploading ? 'Uploading...' : 'Upload PDF'}
                            </button>
                        )}
                        {formData.projectDeckUrl && (
                            <div className="mt-2 flex items-center justify-center gap-2 text-green-500">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm">PDF uploaded successfully</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* MVP Link */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Share your MVP Link *
                    </label>
                    <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="url"
                            name="mvpLink"
                            value={formData.mvpLink}
                            onChange={handleChange}
                            required
                            placeholder="Enter MVP Link"
                            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Demo Video */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Share a video of up to 3 minutes explaining your solution *
                    </label>
                    <input
                        type="url"
                        name="demoVideoUrl"
                        value={formData.demoVideoUrl}
                        onChange={handleChange}
                        required
                        placeholder="Enter Video URL (YouTube, Loom, etc.)"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        {formData.demoVideoUrl.length}/256
                    </p>
                </div>

                {/* GitHub Repo */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Share the GitHub Repository link *
                    </label>
                    <div className="relative">
                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="url"
                            name="githubRepoUrl"
                            value={formData.githubRepoUrl}
                            onChange={handleChange}
                            required
                            placeholder="Enter GitHub Repository URL"
                            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {formData.githubRepoUrl.length}/256
                    </p>
                </div>

                {/* Technologies Used */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        List the Google Technologies Used *
                    </label>
                    <div className="relative">
                        <Code className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            name="technologiesUsed"
                            value={formData.technologiesUsed}
                            onChange={handleChange}
                            required
                            placeholder="Enter technologies (e.g., Firebase, Google Cloud, TensorFlow)"
                            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {formData.technologiesUsed.length}/256
                    </p>
                </div>

                {/* AI Tools */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Mention the Google AI Tools Integrated *
                    </label>
                    <div className="relative">
                        <Sparkles className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            name="aiToolsIntegrated"
                            value={formData.aiToolsIntegrated}
                            onChange={handleChange}
                            required
                            placeholder="Enter AI tools (e.g., Gemini API, Vertex AI, DialogFlow)"
                            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {formData.aiToolsIntegrated.length}/256
                    </p>
                </div>

                {/* Solution Description */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Write a Brief Description of Your Solution *
                    </label>
                    <textarea
                        name="solutionDescription"
                        value={formData.solutionDescription}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder="Describe your solution, the problem it solves, and how you implemented it..."
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        {formData.solutionDescription.length}/1000
                    </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 bg-primary hover:bg-primary/90 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>Saving...</>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Submit Project
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Submission Status */}
            {submission && submission.status === 'submitted' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3"
                >
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                        <p className="font-medium text-green-500">Submission Successful!</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Your project has been submitted. You can update it until the deadline.
                        </p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
