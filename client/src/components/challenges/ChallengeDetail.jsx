import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  GitBranch,
  Code,
  Network,
  Container,
  Cloud,
  Code2
} from 'lucide-react';
import Navbar from '../Navbar';
import Breadcrumb from '../shared/Breadcrumb';
import TabNavigation from '../shared/TabNavigation';
import ChallengeCalendar from './ChallengeCalendar';
import challengesData from '../../data/challenges30Days.json';

// Imported Tab Components
import ChallengeAboutTab from './ChallengeAboutTab';
import ChallengeCircullamTab from './ChallengeCircullamTab';
import ChallengePlaygroundTab from './ChallengePlaygroundTab';
import ChallengeLeaderboard from './ChallengeLeaderboard';
import ChallengeCommunity from './ChallengeCommunity';
import ChallengeSidebar from './ChallengeSidebar';

const iconMap = {
  'git-branch': GitBranch,
  'code': Code,
  'network': Network,
  'container': Container,
  'cloud': Cloud,
  'code2': Code2
};

const difficultyColors = {
  'Beginner': 'text-green-400 bg-green-400/10 border-green-400/20',
  'Intermediate': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  'Advanced': 'text-red-400 bg-red-400/10 border-red-400/20'
};

export default function ChallengeDetail() {
  const { challengeId } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [completedDays, setCompletedDays] = useState(new Set());
  const [activeTab, setActiveTab] = useState('about');
  const [selectedDay, setSelectedDay] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'playground', label: 'Playground' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'community', label: 'Community' }
  ];

  useEffect(() => {
    const foundChallenge = challengesData.challenges.find(c => c.id === challengeId);
    setChallenge(foundChallenge);

    // Load completed days from localStorage
    const saved = localStorage.getItem(`challenge-${challengeId}-progress`);
    if (saved) {
      setCompletedDays(new Set(JSON.parse(saved)));
    }
  }, [challengeId]);

  // Scroll detection for sticky breadcrumbs
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!challenge) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading challenge...</p>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[challenge.icon] || Code;
  const progressPercentage = (completedDays.size / challenge.totalDays) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className={`bg-gradient-to-r ${challenge.color} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Challenge Info */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {challenge.title}
                    </h1>
                    <p className="text-white/80 text-lg">
                      {challenge.description}
                    </p>
                  </div>
                </div>

                {/* Challenge Stats */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className={`px-3 py-1 rounded-full border ${difficultyColors[challenge.difficulty]}`}>
                    <span className="font-medium">{challenge.difficulty}</span>
                  </div>
                  <div className="px-3 py-1 bg-white/20 rounded-full text-white">
                    {challenge.category}
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-white">
                    <Calendar className="w-4 h-4" />
                    {challenge.duration}
                  </div>
                </div>

              </div>


            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Breadcrumb Navbar */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: isScrolled ? 0 : -100, opacity: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-white/10 ${isScrolled ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Breadcrumb
              items={[
                { label: '30-Day Challenges', href: '/challenges' },
                { label: challenge.title }
              ]}
            />
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full border text-xs font-medium ${difficultyColors[challenge.difficulty]}`}>
                {challenge.difficulty}
              </div>
              <div className="text-sm text-muted-foreground">
                {completedDays.size}/{challenge.totalDays} days
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs - Static */}
        <Breadcrumb
          items={[
            { label: '30-Day Challenges', href: '/challenges' },
            { label: challenge.title }
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabbed Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <TabNavigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                className="mb-6"
              />

              {/* Overview Tab (This seems to be a legacy check as it's not in the tabs array above, but keeping just in case) */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Challenge Calendar */}
                  <div>
                    <ChallengeCalendar
                      challenge={challenge}
                      onRegister={(progress) => {
                        console.log('User registered:', progress);
                      }}
                    />
                  </div>
                </div>
              )}

              {/* About Tab */}
              {activeTab === 'about' && (
                <ChallengeAboutTab challenge={challenge} />
              )}

              {/* Curriculum Tab */}
              {activeTab === 'curriculum' && (
                <ChallengeCircullamTab challenge={challenge} completedDays={completedDays} />
              )}

              {/* Playground Tab */}
              {activeTab === 'playground' && (
                <ChallengePlaygroundTab
                  challenge={challenge}
                  completedDays={completedDays}
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                />
              )}

              {/* Leaderboard Tab */}
              {activeTab === 'leaderboard' && (
                <ChallengeLeaderboard completedDays={completedDays} />
              )}

              {/* Community Tab */}
              {activeTab === 'community' && (
                <ChallengeCommunity />
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ChallengeSidebar
              challenge={challenge}
              completedDays={completedDays}
              progressPercentage={progressPercentage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}