import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Calendar, MapPin, Users, AlertCircle, ExternalLink,
    ChevronRight, CheckCircle, Loader2, Trophy, Clock, HelpCircle,
    Linkedin, Globe, Award, Briefcase, Zap
} from 'lucide-react';
import AppLayout from '../shared/AppLayout';
import TabNavigation from '../shared/TabNavigation';
import RegistrationModal from './RegistrationModal';
import { eventAPI, userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function EventDetail() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { currentUser, login } = useAuth();

    // State
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('about');
    const [registrationStatus, setRegistrationStatus] = useState(null); // null, 'registered', 'pending'
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    // Mock Data for new fields (until DB is synced)
    const mockData = {
        jury: [
            { name: "Sarah Johnson", role: "CTO", company: "TechCorp", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", linkedin: "#" },
            { name: "Michael Chen", role: "Senior Architect", company: "Google", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael", linkedin: "#" },
            { name: "Priya Patel", role: "Product Lead", company: "Amazon", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", linkedin: "#" }
        ],
        mentors: [
            { name: "David Kim", expertise: "Cloud Computing", company: "AWS", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David", linkedin: "#" },
            { name: "Emily Davis", expertise: "AI/ML", company: "OpenAI", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily", linkedin: "#" },
            { name: "Rahul Gupta", expertise: "Blockchain", company: "Polygon", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul", linkedin: "#" }
        ],
        partners: [
            { name: "H2S", type: "Platinum", logo: "https://placehold.co/200x80/2a2a2a/white?text=H2S", website: "#" },
            { name: "TechStart", type: "Gold", logo: "https://placehold.co/200x80/2a2a2a/white?text=TechStart", website: "#" },
            { name: "DevComm", type: "Community", logo: "https://placehold.co/200x80/2a2a2a/white?text=DevComm", website: "#" }
        ],
        faqs: [
            { question: "Who can participate?", answer: "Anyone with a passion for coding can participate. We welcome students and professionals alike." },
            { question: "Is there a registration fee?", answer: "No, participation is completely free." },
            { question: "Can I participate individually?", answer: "Yes, you can participate individually or in a team of up to 4 members." },
            { question: "What if I don't have a team?", answer: "We will have a team formation session before the event starts." }
        ],
        schedule: [
            { time: "Dec 30, 2025", title: "Registration Opens", description: "Start forming your teams", type: "registration" },
            { time: "Jan 15, 2026", title: "Team Formation", description: "Finalize your team members", type: "milestone" },
            { time: "Jan 24, 2026", title: "Event Kickoff", description: "Opening ceremony and problem statements", type: "event" },
            { time: "Jan 25, 2026", title: "Submission Deadline", description: "Submit your final projects", type: "submission" },
            { time: "Jan 26, 2026", title: "Winners Announced", description: "Closing ceremony", type: "award" }
        ],
        challenges: [
            { title: "Open Innovation", description: "Build a solution for a real-world problem using any tech stack.", icon: "bulb" },
            { title: "FinTech Revolution", description: "Create the next generation of financial tools.", icon: "finance" },
            { title: "HealthTech", description: "Innovate for better healthcare accessibility.", icon: "health" }
        ]
    };

    useEffect(() => {
        fetchEventDetails();
    }, [eventId, currentUser]);

    const fetchEventDetails = async () => {
        // Only set loading on initial fetch, not on auth updates
        if (!event) setLoading(true);

        try {
            // Fetch Event if not already loaded
            if (!event) {
                const { data } = await eventAPI.getById(eventId);
                if (data.success) {
                    // Merge real data with mock data for fields that might be missing in DB yet
                    const eventData = { ...data.data };
                    if (!eventData.jury) eventData.jury = mockData.jury;
                    if (!eventData.mentors) eventData.mentors = mockData.mentors;
                    if (!eventData.partners) eventData.partners = mockData.partners;
                    if (!eventData.faqs) eventData.faqs = mockData.faqs;
                    if (!eventData.schedule) eventData.schedule = mockData.schedule;
                    // If challenges not populated, use mocks for UI
                    if (!eventData.challenges || eventData.challenges.length === 0) eventData.challengesList = mockData.challenges;

                    setEvent(eventData);
                }
            }

            // Check Registration Status if logged in
            if (currentUser) {
                try {
                    const { data: regData } = await userAPI.getRegistrations();
                    const isRegistered = regData.data.registrations.some(r => r.eventId === eventId);
                    if (isRegistered) setRegistrationStatus('registered');
                } catch (e) {
                    // console.log('Failed to check registration status', e);
                }
            } else {
                setRegistrationStatus(null);
            }

        } catch (err) {
            console.error(err);
            setError('Failed to load event details');
        } finally {
            setLoading(false);
        }
    };

    const handleRegistrationSuccess = () => {
        setRegistrationStatus('registered');
        fetchEventDetails();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Event not found</h2>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <button onClick={() => navigate('/events')} className="text-primary hover:underline">
                        ← Back to Events
                    </button>
                </div>
            </div>
        );
    }

    // Dynamic Tabs for the new design
    // Structure: About, Challenges, Jury, Mentor, Steps, Prize, Partner, FAQs, Timeline
    // We can group them or have them as scrollable sections. 
    // The requested design seems to be a single page scroll with a sticky nav or just sections.
    // However, sticking to the TabNavigation component for now but populating with these sections
    // Dynamic Tabs with Order
    const defaultTabs = [
        { id: 'about', label: 'About' },
        { id: 'challenges', label: 'Challenges' },
        { id: 'timeline', label: 'Timeline' },
        { id: 'jury', label: 'Jury' },
        { id: 'mentors', label: 'Mentors' },
        { id: 'prizes', label: 'Prizes' },
        { id: 'partners', label: 'Partners' },
        { id: 'faqs', label: 'FAQs' },
    ];

    // Sort tabs based on event configuration or default
    const sectionOrder = event.sectionOrder || ['about', 'challenges', 'timeline', 'jury', 'mentors', 'prizes', 'partners', 'faqs'];
    const tabs = sectionOrder
        .map(id => defaultTabs.find(t => t.id === id))
        .filter(Boolean);

    if (registrationStatus === 'registered') {
        // Dashboard always comes first or last? Let's keep it first for utility
        tabs.unshift({ id: 'dashboard', label: 'Dashboard' });
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <AppLayout>
            {/* Hero Section */}
            <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden mb-8 group">
                {event.bannerImage ? (
                    <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white opacity-20 tracking-widest">BUILDATHON</h1>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                <div className="absolute bottom-0 left-0 p-8 w-full">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-yellow-500 text-black font-bold rounded text-xs uppercase tracking-wider">
                                    {event.eventType}
                                </span>
                                {event.isTeamEvent && (
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white font-medium rounded text-xs uppercase tracking-wider">
                                        Team Event
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 leading-tight">
                                {event.title}
                            </h1>
                            <p className="text-white/80 text-lg max-w-2xl line-clamp-2">
                                {event.description}
                            </p>
                        </div>

                        {/* Register Button Card */}
                        <div className="glass p-4 rounded-xl backdrop-blur-xl border border-white/10 min-w-[240px]">
                            {registrationStatus === 'registered' ? (
                                <div className="text-center">
                                    <div className="bg-green-500/20 text-green-400 p-2 rounded-lg mb-2 flex items-center justify-center gap-2">
                                        <CheckCircle className="w-5 h-5" /> Registered
                                    </div>
                                    <p className="text-xs text-muted-foreground">Go to dashboard to submit</p>
                                </div>
                            ) : event.status === 'active' || event.status === 'upcoming' ? (
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={async () => {
                                            if (!currentUser) {
                                                try {
                                                    await login();
                                                } catch (e) {
                                                    console.error("Login Error:", e);
                                                }
                                                return;
                                            }
                                            setShowRegisterModal(true);
                                        }}
                                        className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Register Now <ExternalLink className="w-4 h-4" />
                                    </button>
                                    <p className="text-xs text-center text-white/50">
                                        Closes: {formatDate(event.registrationDeadline)}
                                    </p>
                                </div>
                            ) : (
                                <button disabled className="w-full py-3 bg-white/10 text-white/50 font-bold rounded-lg cursor-not-allowed">
                                    Registration Closed
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="sticky top-20 z-40 bg-background/80 backdrop-blur-md py-4 border-b border-white/5 mb-8">
                <TabNavigation
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    className="justify-start md:justify-center overflow-x-auto pb-2 scrollbar-none"
                />
            </div>

            {/* Content Sections */}
            <div className="min-h-[500px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'about' && (
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-8">
                                    <section>
                                        <h3 className="text-2xl font-bold mb-4">About the Event</h3>
                                        <div className="prose prose-invert max-w-none text-muted-foreground">
                                            <p className="whitespace-pre-line">{event.description}</p>
                                            <p className="mt-4">
                                                Join us to redisocver the true potential of your innovative mind.
                                                Interact with mentors, showcase your skills, and win exciting prizes!
                                            </p>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-2xl font-bold mb-4">Rules & Eligibility</h3>
                                        <div className="glass-card p-6 rounded-xl border border-white/5 space-y-4">
                                            {event.rules ? (
                                                <div dangerouslySetInnerHTML={{ __html: event.rules }} />
                                            ) : (
                                                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                                    <li>All team members must be enrolled students.</li>
                                                    <li>Original work only plagiarism will lead to disqualification.</li>
                                                    <li>Decisions of the jury are final.</li>
                                                </ul>
                                            )}
                                        </div>
                                    </section>
                                </div>

                                <div className="space-y-6">
                                    <div className="glass-card p-6 rounded-xl border border-white/5">
                                        <h4 className="font-bold mb-4 flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-primary" /> Schedule
                                        </h4>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Registration Start</p>
                                                <p className="font-medium">{formatDate(event.registrationStart)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Event Date</p>
                                                <p className="font-medium">{formatDate(event.eventStart)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Duration</p>
                                                <p className="font-medium">24 Hours</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="glass-card p-6 rounded-xl border border-white/5">
                                        <h4 className="font-bold mb-4 flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-primary" /> Venue
                                        </h4>
                                        <p className="text-muted-foreground">
                                            {event.venue || "Online / Hybrid Mode"}
                                        </p>
                                        {event.mode === 'online' && (
                                            <div className="mt-4 p-3 bg-blue-500/10 rounded-lg text-sm text-blue-400">
                                                Event link will be shared with registered participants.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'challenges' && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {event.challengesList?.map((challenge, idx) => (
                                    <div key={idx} className="glass-card p-6 rounded-xl border border-white/5 hover:border-primary/50 transition-colors group">
                                        <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Zap className="w-6 h-6 text-yellow-500" />
                                        </div>
                                        <h4 className="text-xl font-bold mb-2">{challenge.title}</h4>
                                        <p className="text-muted-foreground text-sm mb-4">{challenge.description}</p>
                                        <button className="text-primary text-sm font-medium hover:underline">Read More →</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'jury' && (
                            <div>
                                <h3 className="text-center text-sm uppercase tracking-widest text-muted-foreground mb-8">To Be Announced</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {event.jury?.map((juror, idx) => (
                                        <div key={idx} className="text-center group">
                                            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-primary transition-all">
                                                <img src={juror.image} alt={juror.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                            </div>
                                            <h4 className="font-bold text-lg">{juror.name}</h4>
                                            <p className="text-primary text-sm">{juror.role}</p>
                                            <p className="text-muted-foreground text-xs">{juror.company}</p>
                                            {juror.linkedin && (
                                                <a href={juror.linkedin} className="inline-block mt-2 text-white/20 hover:text-blue-500 transition-colors">
                                                    <Linkedin className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'mentors' && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {event.mentors?.map((mentor, idx) => (
                                    <div key={idx} className="glass-card p-4 rounded-xl text-center border border-white/5 hover:border-white/10 transition-all">
                                        <div className="w-24 h-24 mx-auto rounded-full bg-white/5 mb-4 overflow-hidden">
                                            <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover" />
                                        </div>
                                        <h4 className="font-bold">{mentor.name}</h4>
                                        <p className="text-xs text-primary uppercase tracking-wider mb-1">{mentor.expertise}</p>
                                        <p className="text-sm text-muted-foreground">{mentor.company}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'timeline' && (
                            <div className="max-w-3xl mx-auto">
                                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                                    {event.schedule?.map((item, idx) => (
                                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors group-hover:border-primary">
                                                <Clock className="w-5 h-5 text-custom-primary" />
                                            </div>
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-6 rounded-xl border border-white/5 hover:border-white/20 transition-all">
                                                <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
                                                    <time className="font-mono text-xs text-primary">{item.time}</time>
                                                    {item.track && (
                                                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-white/10 text-white/70 tracking-wider">
                                                            {item.track}
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="text-lg font-bold text-foreground mb-1">{item.title}</h4>
                                                <p className="text-muted-foreground text-sm">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'prizes' && (
                            <div className="grid md:grid-cols-3 gap-6 text-center">
                                <div className="order-2 md:order-1 glass-card p-8 rounded-xl border border-white/5 mt-8">
                                    <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold mb-2">₹10,000</h3>
                                    <p className="text-lg font-medium text-gray-400">Runner Up</p>
                                    <ul className="mt-4 text-sm text-muted-foreground space-y-2">
                                        <li>Certificates</li>
                                        <li>Goodies</li>
                                    </ul>
                                </div>
                                <div className="order-1 md:order-2 glass-card p-8 rounded-xl border border-yellow-500/20 bg-yellow-500/5 transform scale-110 z-10">
                                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
                                    <h3 className="text-4xl font-extrabold mb-2 text-yellow-500">₹25,000</h3>
                                    <p className="text-xl font-bold text-white">Winner</p>
                                    <ul className="mt-6 text-sm text-foreground space-y-2">
                                        <li>Trophy</li>
                                        <li>Internship Opportunity</li>
                                        <li>Premium Swag Kit</li>
                                    </ul>
                                </div>
                                <div className="order-3 md:order-3 glass-card p-8 rounded-xl border border-white/5 mt-8">
                                    <Award className="w-12 h-12 text-amber-700 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold mb-2">₹5,000</h3>
                                    <p className="text-lg font-medium text-amber-700">2nd Runner Up</p>
                                    <ul className="mt-4 text-sm text-muted-foreground space-y-2">
                                        <li>Certificates</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeTab === 'partners' && (
                            <div className="space-y-8">
                                <h3 className="text-center font-bold text-xl mb-8">Our Partners</h3>
                                <div className="flex flex-wrap justify-center gap-8 items-center">
                                    {event.partners?.map((partner, idx) => (
                                        <div key={idx} className="w-48 h-24 bg-white/5 rounded-xl flex items-center justify-center p-4 hover:bg-white/10 transition-colors cursor-pointer">
                                            <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full opacity-70 hover:opacity-100 transition-opacity" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'faqs' && (
                            <div className="max-w-2xl mx-auto space-y-4">
                                {event.faqs?.map((faq, idx) => (
                                    <div key={idx} className="glass-card p-6 rounded-xl border border-white/5">
                                        <h4 className="font-bold flex items-start gap-3 mb-2">
                                            <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                            {faq.question}
                                        </h4>
                                        <p className="text-muted-foreground pl-8 text-sm leading-relaxed">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'dashboard' && (
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="glass-card p-6 rounded-xl">
                                    <h3 className="text-xl font-bold mb-4">My Status</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                            <span>Registration</span>
                                            <span className="text-green-500 font-bold">Confirmed</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                            <span>Team</span>
                                            <span className="text-muted-foreground">Not Formed</span>
                                        </div>
                                        <button className="w-full py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors">
                                            View Team Details
                                        </button>
                                    </div>
                                </div>
                                <div className="glass-card p-6 rounded-xl">
                                    <h3 className="text-xl font-bold mb-4">Submit Project</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Submissions will open on {formatDate(event.submissionStart || event.eventStart)}.
                                    </p>
                                    <button disabled className="w-full py-2 bg-white/5 text-muted-foreground rounded-lg cursor-not-allowed">
                                        Submission Locked
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Registration Modal */}
            <RegistrationModal
                event={event}
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onSuccess={handleRegistrationSuccess}
            />
        </AppLayout>
    );
}

