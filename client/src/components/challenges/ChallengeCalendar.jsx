import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Lock,
  CheckCircle,
  Play,
  Clock,
  Trophy,
  Target,
  ChevronLeft,
  ChevronRight,
  Circle
} from 'lucide-react';
import ChallengeProgressService from '../../services/challengeProgressService';

export default function ChallengeCalendar({ challenge, onRegister }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(0);

  // Real API integration
  useEffect(() => {
    if (currentUser && challenge) {
      loadUserProgress();
    } else {
      setLoading(false);
    }
  }, [currentUser, challenge]);

  const loadUserProgress = async () => {
    try {
      setLoading(true);
      
      // Check if user is registered
      const registration = await ChallengeProgressService.getChallengeRegistration(
        currentUser.uid, 
        challenge.id
      );

      if (registration) {
        // Get detailed progress for all days
        const dayProgress = await ChallengeProgressService.getChallengeProgress(
          currentUser.uid,
          challenge.id
        );

        const progressData = {
          isRegistered: true,
          registeredAt: registration.registeredAt,
          currentDay: registration.currentDay,
          status: registration.status,
          completedDays: registration.completedDays || [],
          dayProgress
        };

        setUserProgress(progressData);
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
      setIsRegistered(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!currentUser) {
      // Redirect to login or show login modal
      alert('Please sign in to register for challenges');
      return;
    }

    try {
      setLoading(true);
      
      // Register for challenge
      await ChallengeProgressService.registerForChallenge(
        currentUser.uid,
        challenge.id
      );
      
      // Reload progress after registration
      await loadUserProgress();
      
      if (onRegister) {
        onRegister(userProgress);
      }
      
      alert('Successfully registered for the challenge! Day 1 is now unlocked.');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to register for challenge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDayClick = (dayNumber) => {
    if (!userProgress?.dayProgress[dayNumber]?.canAccess) {
      return; // Day is locked
    }

    navigate(`/challenges/${challenge.id}/day/${dayNumber}`);
  };

  const getDayStatus = (dayNumber) => {
    if (!userProgress) return 'locked';
    return userProgress.dayProgress[dayNumber]?.status || 'locked';
  };

  const getDayIcon = (dayNumber) => {
    const status = getDayStatus(dayNumber);
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'unlocked':
        return userProgress?.currentDay === dayNumber ? 
          <Play className="w-4 h-4 text-primary" /> : 
          <Circle className="w-4 h-4 text-blue-400" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <Lock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDayStyles = (dayNumber) => {
    const status = getDayStatus(dayNumber);
    const canAccess = userProgress?.dayProgress[dayNumber]?.canAccess;
    
    const baseStyles = "relative w-12 h-12 rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all duration-200";
    
    switch (status) {
      case 'completed':
        return `${baseStyles} bg-green-500/20 border-2 border-green-500/50 text-green-400 cursor-pointer hover:bg-green-500/30 hover:scale-105`;
      case 'unlocked':
        return userProgress?.currentDay === dayNumber ?
          `${baseStyles} bg-primary/20 border-2 border-primary text-primary cursor-pointer hover:bg-primary/30 hover:scale-105 ring-2 ring-primary/30` :
          `${baseStyles} bg-blue-500/20 border-2 border-blue-500/50 text-blue-400 cursor-pointer hover:bg-blue-500/30 hover:scale-105`;
      case 'in_progress':
        return `${baseStyles} bg-yellow-500/20 border-2 border-yellow-500/50 text-yellow-400 cursor-pointer hover:bg-yellow-500/30 hover:scale-105`;
      default:
        return `${baseStyles} bg-gray-500/10 border-2 border-gray-500/20 text-gray-500 cursor-not-allowed`;
    }
  };

  // Calculate weeks for calendar view
  const weeksCount = Math.ceil(challenge?.totalDays / 7) || 5;
  const daysInCurrentWeek = Array.from({ length: 7 }, (_, i) => {
    const dayNumber = currentWeek * 7 + i + 1;
    return dayNumber <= challenge?.totalDays ? dayNumber : null;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="mb-6">
          <Calendar className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Ready to Start Your Journey?</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Register for this 30-day challenge to unlock Day 1 and begin your learning adventure.
          </p>
        </div>
        
        <button
          onClick={handleRegister}
          className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2 mx-auto"
        >
          <Target className="w-5 h-5" />
          Register for Challenge
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Your Progress
          </h3>
          <p className="text-muted-foreground">
            {userProgress?.completedDays?.length || 0} of {challenge?.totalDays} days completed
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {userProgress?.currentDay || 1}
            </div>
            <div className="text-xs text-muted-foreground">Current Day</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {userProgress?.completedDays?.length || 0}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-primary to-purple-500 h-3 rounded-full transition-all duration-500"
          style={{ 
            width: `${((userProgress?.completedDays?.length || 0) / challenge?.totalDays) * 100}%` 
          }}
        ></div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">
          Week {currentWeek + 1} of {weeksCount}
        </h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
            disabled={currentWeek === 0}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentWeek(Math.min(weeksCount - 1, currentWeek + 1))}
            disabled={currentWeek === weeksCount - 1}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="grid grid-cols-7 gap-4 mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-4">
          {daysInCurrentWeek.map((dayNumber, index) => (
            <div key={index} className="flex justify-center">
              {dayNumber ? (
                <motion.button
                  whileHover={{ scale: userProgress?.dayProgress[dayNumber]?.canAccess ? 1.05 : 1 }}
                  whileTap={{ scale: userProgress?.dayProgress[dayNumber]?.canAccess ? 0.95 : 1 }}
                  onClick={() => handleDayClick(dayNumber)}
                  className={getDayStyles(dayNumber)}
                  title={
                    getDayStatus(dayNumber) === 'locked' 
                      ? `Day ${dayNumber} - Complete previous day to unlock`
                      : `Day ${dayNumber} - ${getDayStatus(dayNumber)}`
                  }
                >
                  <div className="absolute -top-1 -right-1">
                    {getDayIcon(dayNumber)}
                  </div>
                  <span>{dayNumber}</span>
                </motion.button>
              ) : (
                <div className="w-12 h-12"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-muted-foreground">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Current Day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-blue-400"></div>
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-gray-500" />
          <span className="text-muted-foreground">Locked</span>
        </div>
      </div>
    </motion.div>
  );
}