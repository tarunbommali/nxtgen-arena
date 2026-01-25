import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  CheckCircle, 
  Circle, 
  Target, 
  BookOpen,
  ExternalLink,
  Upload,
  Send,
  Calendar,
  Lock,
  AlertCircle
} from 'lucide-react';
import Navbar from '../Navbar';
import Breadcrumb from '../shared/Breadcrumb';
import ChallengeProgressService from '../../services/challengeProgressService';
import challengesData from '../../data/challenges30Days.json';

export default function ChallengeDayDetail() {
  const { challengeId, dayNumber } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [dayData, setDayData] = useState(null);
  const [canAccess, setCanAccess] = useState(false);
  const [dayStatus, setDayStatus] = useState('locked');
  const [isCompleted, setIsCompleted] = useState(false);
  const [submission, setSubmission] = useState('');
  const [submissionType, setSubmissionType] = useState('text');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const foundChallenge = challengesData.challenges.find(c => c.id === challengeId);
    setChallenge(foundChallenge);
    
    if (foundChallenge && foundChallenge.days) {
      const foundDay = foundChallenge.days.find(d => d.day === parseInt(dayNumber));
      setDayData(foundDay);
      
      if (foundDay && foundDay.submission) {
        setSubmissionType(foundDay.submission.type);
      }
    }
    
    // Check access and load progress
    if (currentUser && foundChallenge) {
      checkDayAccess();
    } else {
      setLoading(false);
    }
  }, [challengeId, dayNumber, currentUser]);

  const checkDayAccess = async () => {
    try {
      setLoading(true);
      
      // Check if user can access this day
      const hasAccess = await ChallengeProgressService.canAccessDay(
        currentUser.uid,
        challengeId,
        parseInt(dayNumber)
      );
      
      setCanAccess(hasAccess);
      
      if (hasAccess) {
        // Get day progress
        const dayProgress = await ChallengeProgressService.getChallengeProgress(
          currentUser.uid,
          challengeId
        );
        
        const currentDayProgress = dayProgress[parseInt(dayNumber)];
        if (currentDayProgress) {
          setDayStatus(currentDayProgress.status);
          setIsCompleted(currentDayProgress.status === 'completed');
          
          // Load saved submission if exists
          if (currentDayProgress.submissionData) {
            setSubmission(currentDayProgress.submissionData.content || '');
          }
          
          // Mark as in progress if not already
          if (currentDayProgress.status === 'unlocked') {
            await ChallengeProgressService.startDay(
              currentUser.uid,
              challengeId,
              parseInt(dayNumber)
            );
            setDayStatus('in_progress');
          }
        }
      }
    } catch (error) {
      console.error('Error checking day access:', error);
      setCanAccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmission = async () => {
    if (!submission.trim()) {
      alert('Please provide your submission before completing the day.');
      return;
    }

    try {
      setSubmitting(true);
      
      const submissionData = {
        type: submissionType,
        content: submission
      };

      await ChallengeProgressService.completeDay(
        currentUser.uid,
        challengeId,
        parseInt(dayNumber),
        submissionData
      );

      setIsCompleted(true);
      setDayStatus('completed');
      
      alert('Day completed successfully! Next day has been unlocked.');
      
      // Navigate to next day if available
      const nextDay = parseInt(dayNumber) + 1;
      if (nextDay <= challenge.totalDays) {
        navigate(`/challenges/${challengeId}/day/${nextDay}`);
      } else {
        // Challenge completed, go back to challenge overview
        navigate(`/challenges/${challengeId}`);
      }
    } catch (error) {
      console.error('Error submitting day:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const goToNextDay = () => {
    const nextDay = parseInt(dayNumber) + 1;
    if (nextDay <= challenge.totalDays) {
      navigate(`/challenges/${challengeId}/day/${nextDay}`);
    }
  };

  const goToPrevDay = () => {
    const prevDay = parseInt(dayNumber) - 1;
    if (prevDay >= 1) {
      navigate(`/challenges/${challengeId}/day/${prevDay}`);
    }
  };

  // Access denied component
  if (!loading && !canAccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb 
            items={[
              { label: '30-Day Challenges', href: '/challenges' },
              { label: challenge?.title || 'Challenge', href: `/challenges/${challengeId}` },
              { label: `Day ${dayNumber}` }
            ]} 
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Day {dayNumber} is Locked</h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              You need to complete the previous day before accessing Day {dayNumber}.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

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

  // If no specific day data, show generic day template
  if (!dayData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Breadcrumbs */}
            <Breadcrumb 
              items={[
                { label: '30-Day Challenges', href: '/challenges' },
                { label: challenge.title, href: `/challenges/${challengeId}` },
                { label: `Day ${dayNumber}` }
              ]} 
            />

            {/* Header */}
            <div className="flex items-center justify-end mb-8">
              <div className="flex items-center gap-4">
                {parseInt(dayNumber) > 1 && (
                  <button
                    onClick={goToPrevDay}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Previous Day
                  </button>
                )}
                {parseInt(dayNumber) < challenge.totalDays && (
                  <button
                    onClick={goToNextDay}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    Next Day
                  </button>
                )}
              </div>
            </div>

            {/* Day Header */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Day {dayNumber} - {challenge.title}
                  </h1>
                  <p className="text-muted-foreground">
                    Continue your learning journey
                  </p>
                </div>
                <button
                  onClick={toggleCompletion}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isCompleted 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  {isCompleted ? 'Completed' : 'Mark Complete'}
                </button>
              </div>
            </div>

            {/* Generic Content */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h2 className="text-xl font-semibold mb-4">Day {dayNumber} Tasks</h2>
              <p className="text-muted-foreground mb-6">
                This day's detailed content is being prepared. In the meantime, continue with your learning journey using the resources below.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="font-medium mb-2">Suggested Activities</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Review previous day's concepts</li>
                    <li>• Practice with hands-on exercises</li>
                    <li>• Research advanced topics</li>
                    <li>• Document your learning progress</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="font-medium mb-2">Reflection</h3>
                  <textarea
                    value={submission}
                    onChange={(e) => setSubmission(e.target.value)}
                    placeholder="Write about what you learned today..."
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    onClick={saveSubmission}
                    className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    Save Reflection
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Breadcrumbs */}
          <Breadcrumb 
            items={[
              { label: '30-Day Challenges', href: '/challenges' },
              { label: challenge.title, href: `/challenges/${challengeId}` },
              { label: `Day ${dayNumber} - ${dayData.title}` }
            ]} 
          />

          {/* Header */}
          <div className="flex items-center justify-end mb-8">
            <div className="flex items-center gap-4">
              {parseInt(dayNumber) > 1 && (
                <button
                  onClick={goToPrevDay}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Previous Day
                </button>
              )}
              {parseInt(dayNumber) < challenge.totalDays && (
                <button
                  onClick={goToNextDay}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors flex items-center gap-2"
                >
                  Next Day
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Day Header */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Day {dayData.day}</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-2">{dayData.title}</h1>
                <p className="text-muted-foreground">{dayData.description}</p>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isCompleted 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : dayStatus === 'in_progress'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-white/5 border border-white/10'
              }`}>
                {isCompleted ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </>
                ) : dayStatus === 'in_progress' ? (
                  <>
                    <Circle className="w-4 h-4" />
                    In Progress
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    Available
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-8">
              {/* Tasks */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Today's Tasks</h2>
                </div>
                <div className="space-y-3">
                  {dayData.tasks.map((task, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-muted-foreground">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Learning Resources</h2>
                </div>
                <div className="space-y-3">
                  {dayData.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium group-hover:text-primary transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {resource.type}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Submission */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Send className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Submission</h2>
                </div>
                
                <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-400 text-sm">
                    <strong>Required:</strong> {dayData.submission.description}
                  </p>
                </div>

                {submissionType === 'text' && (
                  <div>
                    <textarea
                      value={submission}
                      onChange={(e) => setSubmission(e.target.value)}
                      placeholder="Enter your submission here..."
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 mb-3"
                    />
                  </div>
                )}

                {submissionType === 'code' && (
                  <div>
                    <textarea
                      value={submission}
                      onChange={(e) => setSubmission(e.target.value)}
                      placeholder="Paste your code here..."
                      className="w-full h-48 bg-black/20 border border-white/10 rounded-lg p-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 mb-3"
                    />
                  </div>
                )}

                {submissionType === 'screenshot' && (
                  <div>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center mb-3">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        Upload your screenshot or drag and drop
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="screenshot-upload"
                      />
                      <label
                        htmlFor="screenshot-upload"
                        className="inline-block mt-2 px-4 py-2 bg-primary/20 text-primary rounded-lg cursor-pointer hover:bg-primary/30 transition-colors"
                      >
                        Choose File
                      </label>
                    </div>
                    <textarea
                      value={submission}
                      onChange={(e) => setSubmission(e.target.value)}
                      placeholder="Add description or notes about your screenshot..."
                      className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 mb-3"
                    />
                  </div>
                )}

                <button
                  onClick={handleSubmission}
                  disabled={submitting || isCompleted}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    isCompleted 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary/80'
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : isCompleted ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Complete Day
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="font-semibold mb-4">Day Progress</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tasks</span>
                    <span>0/{dayData.tasks.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Resources</span>
                    <span>0/{dayData.resources.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Submission</span>
                    <span>{submission ? 'Done' : 'Pending'}</span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="font-semibold mb-4">💡 Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Take breaks every 25 minutes</li>
                  <li>• Document your learning process</li>
                  <li>• Ask questions in the community</li>
                  <li>• Practice consistently</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}