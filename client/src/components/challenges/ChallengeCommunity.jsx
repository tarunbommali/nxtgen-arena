import { Users, BookOpen } from 'lucide-react';

const ChallengeCommunity = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/20 rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Community & Support</h2>
            </div>

            {/* Community Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-6 bg-white/5 border border-white/10 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary mb-2">2,847</div>
                    <div className="text-sm text-muted-foreground">Active Participants</div>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-lg text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">89%</div>
                    <div className="text-sm text-muted-foreground">Completion Rate</div>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-lg text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">4.8</div>
                    <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
            </div>

            {/* Discord Community */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Join Our Discord Community
                </h3>
                <p className="text-muted-foreground mb-4">
                    Connect with fellow learners, get help when you're stuck, and share your progress with the community.
                </p>
                <button className="px-6 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg font-medium transition-colors">
                    Join Discord Server
                </button>
            </div>

            {/* Community Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Resource Library
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        Access community-shared resources, tutorials, and best practices.
                    </p>
                    <button className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium hover:bg-primary/30 transition-colors">
                        Browse Resources
                    </button>
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Ask Questions
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        Get help from mentors and experienced community members.
                    </p>
                    <button className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium hover:bg-primary/30 transition-colors">
                        Ask Question
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChallengeCommunity;