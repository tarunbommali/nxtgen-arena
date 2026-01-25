import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Target,
  CheckCircle,
  BookOpen,
  Users,
  Trophy,
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
import ProgressBar from '../shared/ProgressBar';
import ChallengeCalendar from './ChallengeCalendar';
import challengesData from '../../data/challenges30Days.json';

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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
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

              {/* Overview Tab */}
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
                <div className="space-y-8">
                  {/* Challenge Overview */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-primary/20 rounded-lg">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold">About This Challenge</h2>
                    </div>

                    <div className="prose prose-invert max-w-none">
                      <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                        {challenge.overview}
                      </p>

                      {/* Learning Outcomes */}
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" />
                          What You'll Master
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          {challenge.learningOutcomes.map((outcome, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                            >
                              <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              </div>
                              <span className="text-muted-foreground leading-relaxed">{outcome}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Prerequisites */}
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-primary" />
                          Prerequisites
                        </h3>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {challenge.prerequisites.map((prereq, index) => (
                            <div key={index} className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 font-medium">
                              {prereq}
                            </div>
                          ))}
                        </div>
                        <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                          <p className="text-sm text-blue-300">
                            💡 <strong>Don't worry!</strong> If you're not familiar with all prerequisites, we'll guide you through everything step by step. Each day builds upon the previous one, ensuring you learn progressively.
                          </p>
                        </div>
                      </div>

                      {/* Challenge Structure */}
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          Challenge Structure
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                <span className="text-primary font-bold text-sm">30</span>
                              </div>
                              <span className="font-semibold">Daily Lessons</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Each day unlocks after completing the previous day's tasks
                            </p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <Target className="w-4 h-4 text-green-400" />
                              </div>
                              <span className="font-semibold">Hands-on Tasks</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Practical exercises and real-world projects
                            </p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-purple-400" />
                              </div>
                              <span className="font-semibold">Curated Resources</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Carefully selected tutorials, articles, and documentation
                            </p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                <Trophy className="w-4 h-4 text-yellow-400" />
                              </div>
                              <span className="font-semibold">Submissions</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Submit your work to track progress and unlock next day
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Success Tips */}
                      <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-primary" />
                          Tips for Success
                        </h3>
                        <div className="space-y-3">
                          {[
                            "Set aside 1-2 hours daily for consistent progress",
                            "Don't skip days - each lesson builds on the previous one",
                            "Join our community Discord for support and discussions",
                            "Document your learning journey for better retention",
                            "Practice beyond the daily tasks when possible"
                          ].map((tip, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                              <div className="w-5 h-5 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-yellow-400 text-xs font-bold">{index + 1}</span>
                              </div>
                              <span className="text-muted-foreground text-sm">{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Curriculum Tab */}
              {activeTab === 'curriculum' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">30-Day Curriculum</h2>
                  </div>

                  {/* Module Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {challenge.modules?.map((module, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                            <span className="text-primary font-bold text-sm">{index + 1}</span>
                          </div>
                          <h3 className="font-semibold">{module.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                        <div className="text-xs text-primary">Days {module.days}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Daily Breakdown */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Daily Breakdown</h3>
                    <div className="space-y-3">
                      {Array.from({ length: challenge.totalDays }, (_, i) => i + 1).map((day) => {
                        const isCompleted = completedDays.has(day);
                        const isLocked = day > 1 && !completedDays.has(day - 1);

                        return (
                          <motion.div
                            key={day}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: day * 0.02 }}
                            className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${isCompleted
                              ? 'bg-green-500/10 border-green-500/20'
                              : isLocked
                                ? 'bg-white/5 border-white/10 opacity-50'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                              }`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isCompleted
                              ? 'bg-green-500/20 text-green-400'
                              : isLocked
                                ? 'bg-gray-500/20 text-gray-400'
                                : 'bg-primary/20 text-primary'
                              }`}>
                              {isCompleted ? <CheckCircle className="w-5 h-5" /> : day}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">Day {day}: {challenge.curriculum?.[day - 1]?.title || `Lesson ${day}`}</h4>
                              <p className="text-sm text-muted-foreground">
                                {challenge.curriculum?.[day - 1]?.description || `Complete the tasks for day ${day}`}
                              </p>
                            </div>
                            {isLocked && (
                              <div className="text-xs text-muted-foreground">
                                Complete Day {day - 1} to unlock
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Playground Tab */}
              {activeTab === 'playground' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/20 rounded-lg">
                        <Code className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold">Practice Playground</h2>
                    </div>

                    {/* Day Selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Select Day:</span>
                      <select
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(Number(e.target.value))}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                      >
                        {Array.from({ length: challenge.totalDays }, (_, i) => i + 1).map((day) => (
                          <option key={day} value={day} className="bg-background">
                            Day {day}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Day Quick Navigation */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {Array.from({ length: Math.min(challenge.totalDays, 10) }, (_, i) => i + 1).map((day) => {
                      const isCompleted = completedDays.has(day);
                      const isSelected = day === selectedDay;
                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDay(day)}
                          className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all ${isSelected
                            ? 'bg-primary text-white'
                            : isCompleted
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                            }`}
                        >
                          Day {day}
                        </button>
                      );
                    })}
                    {challenge.totalDays > 10 && (
                      <span className="text-sm text-muted-foreground px-2">...</span>
                    )}
                  </div>

                  {/* Current Day Info */}
                  <motion.div
                    key={selectedDay}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold">Day {selectedDay}</h3>
                          {completedDays.has(selectedDay) && (
                            <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-green-400 font-medium">Completed</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xl font-semibold mb-1">
                          {challenge.curriculum?.[selectedDay - 1]?.title || `Lesson ${selectedDay}`}
                        </p>
                        <p className="text-muted-foreground">
                          {challenge.curriculum?.[selectedDay - 1]?.description || `Complete the tasks for day ${selectedDay}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">Difficulty</div>
                        <div className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm font-medium">
                          {challenge.curriculum?.[selectedDay - 1]?.difficulty || 'Medium'}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Tasks Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Tasks List */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Tasks for Day {selectedDay}
                      </h4>
                      <div className="space-y-3">
                        {[
                          { id: 1, title: `Complete the ${challenge.title} basics`, points: 50 },
                          { id: 2, title: `Build a simple project`, points: 100 },
                          { id: 3, title: `Submit your solution`, points: 150 },
                        ].map((task, index) => (
                          <div
                            key={task.id}
                            className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                          >
                            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-primary text-sm font-bold">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium mb-1">{task.title}</div>
                              <div className="flex items-center gap-2">
                                <Trophy className="w-3 h-3 text-yellow-400" />
                                <span className="text-sm text-yellow-400 font-medium">{task.points} pts</span>
                              </div>
                            </div>
                            <button className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm font-medium hover:bg-primary/30 transition-colors">
                              Start
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resources & Code Editor Preview */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Resources & Tools
                      </h4>

                      {/* Code Editor Placeholder */}
                      <div className="bg-black/40 rounded-lg p-4 mb-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                          <span className="text-sm text-muted-foreground ml-2">playground.js</span>
                        </div>
                        <pre className="text-sm text-green-400 font-mono">
                          <code>{`// Day ${selectedDay} - Start coding here\nfunction solve() {\n  // Your code here\n  return "Hello World";\n}\n\nsolve();`}</code>
                        </pre>
                      </div>

                      {/* Resources */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-400" />
                            <span className="text-sm">Documentation</span>
                          </div>
                          <span className="text-xs text-muted-foreground">→</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Code className="w-4 h-4 text-purple-400" />
                            <span className="text-sm">Code Examples</span>
                          </div>
                          <span className="text-xs text-muted-foreground">→</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm">Solution Guide</span>
                          </div>
                          <span className="text-xs text-muted-foreground">→</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Complete all tasks to mark this day as done
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-medium transition-colors">
                        Save Progress
                      </button>
                      <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Mark as Complete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Leaderboard Tab */}
              {activeTab === 'leaderboard' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Trophy className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Challenge Leaderboard</h2>
                  </div>

                  {/* Top 3 Podium */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {/* Second Place */}
                    <div className="flex flex-col items-center pt-8">
                      <div className="w-16 h-16 bg-gray-400/20 rounded-full flex items-center justify-center mb-3 border-2 border-gray-400/30">
                        <span className="text-2xl font-bold text-gray-400">2</span>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold mb-1">Sarah Johnson</div>
                        <div className="text-sm text-muted-foreground mb-2">28/30 days</div>
                        <div className="flex items-center justify-center gap-1 text-orange-400">
                          <span>🔥</span>
                          <span className="text-sm font-medium">12 day streak</span>
                        </div>
                      </div>
                    </div>

                    {/* First Place */}
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mb-3 border-2 border-yellow-500/30 relative">
                        <span className="text-3xl font-bold text-yellow-400">1</span>
                        <div className="absolute -top-2 -right-2 text-2xl">👑</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg mb-1">Alex Chen</div>
                        <div className="text-sm text-muted-foreground mb-2">30/30 days</div>
                        <div className="flex items-center justify-center gap-1 text-orange-400">
                          <span>🔥</span>
                          <span className="text-sm font-medium">15 day streak</span>
                        </div>
                      </div>
                    </div>

                    {/* Third Place */}
                    <div className="flex flex-col items-center pt-12">
                      <div className="w-14 h-14 bg-orange-500/20 rounded-full flex items-center justify-center mb-3 border-2 border-orange-500/30">
                        <span className="text-xl font-bold text-orange-400">3</span>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold mb-1">Mike Rodriguez</div>
                        <div className="text-sm text-muted-foreground mb-2">25/30 days</div>
                        <div className="flex items-center justify-center gap-1 text-orange-400">
                          <span>🔥</span>
                          <span className="text-sm font-medium">10 day streak</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rest of Leaderboard */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">All Participants</h3>
                    <div className="space-y-3">
                      {[
                        { rank: 1, name: 'Alex Chen', progress: 30, streak: 15, badge: '👑' },
                        { rank: 2, name: 'Sarah Johnson', progress: 28, streak: 12, badge: '🥈' },
                        { rank: 3, name: 'Mike Rodriguez', progress: 25, streak: 10, badge: '🥉' },
                        { rank: 4, name: 'Emily Davis', progress: 23, streak: 8, badge: '' },
                        { rank: 5, name: 'You', progress: completedDays.size, streak: 5, badge: '' },
                        { rank: 6, name: 'David Kim', progress: 20, streak: 7, badge: '' },
                        { rank: 7, name: 'Lisa Wang', progress: 18, streak: 6, badge: '' },
                        { rank: 8, name: 'James Brown', progress: 15, streak: 4, badge: '' },
                        { rank: 9, name: 'Maria Garcia', progress: 12, streak: 3, badge: '' },
                        { rank: 10, name: 'Tom Wilson', progress: 10, streak: 2, badge: '' },
                      ].map((user, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center justify-between p-4 rounded-lg transition-all ${user.name === 'You'
                            ? 'bg-primary/10 border border-primary/20'
                            : 'bg-white/5 hover:bg-white/10'
                            }`}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${user.rank === 1
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : user.rank === 2
                                  ? 'bg-gray-400/20 text-gray-400'
                                  : user.rank === 3
                                    ? 'bg-orange-500/20 text-orange-400'
                                    : 'bg-white/10 text-muted-foreground'
                                }`}
                            >
                              {user.rank}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-semibold ${user.name === 'You' ? 'text-primary' : ''
                                    }`}
                                >
                                  {user.name}
                                </span>
                                {user.badge && <span className="text-lg">{user.badge}</span>}
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-sm text-muted-foreground">
                                  {user.progress}/30 days
                                </span>
                                <span className="text-sm text-orange-400">🔥 {user.streak}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">
                              {Math.round((user.progress / 30) * 100)}%
                            </div>
                            <div className="text-xs text-muted-foreground">Complete</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Leaderboard Info */}
                  <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-blue-300">
                      💡 <strong>Leaderboard Updates:</strong> Rankings are updated in real-time based on completed days and current streaks. Keep learning daily to climb higher!
                    </p>
                  </div>
                </div>
              )}



              {/* Community Tab */}
              {activeTab === 'community' && (
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
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">



            {/* Weekly Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  Weekly Goal
                  <div className="w-4 h-4 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">?</span>
                  </div>
                </h3>
                <div className="p-1.5 bg-orange-500/20 rounded-lg">
                  <Calendar className="w-4 h-4 text-orange-400" />
                </div>
              </div>



              {/* Circular Progress */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-white/10"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 56}
                      strokeDashoffset={2 * Math.PI * 56 * (1 - (completedDays.size % 7) / 5)}
                      className="text-primary transition-all duration-500"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-1">
                        <Target className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-xl font-bold">{(completedDays.size % 7)}/5</div>
                    </div>
                  </div>
                </div>
              </div>




              {/* Days of Week */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>This Week</span>
                  <span className="text-primary font-medium">{(completedDays.size % 7)}/5 Days</span>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
                    const isCompleted = index < (completedDays.size % 7);
                    return (
                      <div
                        key={index}
                        className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all ${isCompleted
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'bg-white/5 text-muted-foreground border border-white/10'
                          }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weekly Goal Reward */}
              <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg mb-4">
                <span className="text-sm text-muted-foreground">Weekly Goal Reward</span>
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-3 h-3 text-yellow-400" />
                  </div>
                  <span className="text-sm font-bold text-yellow-400">300</span>
                </div>
              </div>

              {/* Achievement Stats */}
              <div className="text-center text-sm text-muted-foreground">
                No. of Weekly Goals Achieved - <span className="text-primary font-semibold">{Math.floor(completedDays.size / 5)} Weeks</span>
              </div>
            </motion.div>




            {/* Challenge Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Challenge Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Days</span>
                  <span className="font-medium">{challenge.totalDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium text-green-400">{completedDays.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-medium">{challenge.totalDays - completedDays.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
                </div>
              </div>
            </motion.div>


            {/* Community */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>1,234 participants</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Trophy className="w-4 h-4" />
                  <span>89% completion rate</span>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}