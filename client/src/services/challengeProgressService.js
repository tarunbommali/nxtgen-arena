import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';

export class ChallengeProgressService {
  
  /**
   * Register user for a challenge
   */
  static async registerForChallenge(userId, challengeId) {
    try {
      const registrationRef = doc(db, 'userChallengeRegistrations', `${userId}_${challengeId}`);
      
      const registrationData = {
        userId,
        challengeId,
        registeredAt: serverTimestamp(),
        status: 'active',
        currentDay: 1,
        completedDays: [],
        lastActivityAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(registrationRef, registrationData);

      // Initialize Day 1 as unlocked
      const day1ProgressRef = doc(db, 'userDayProgress', `${userId}_${challengeId}_1`);
      await setDoc(day1ProgressRef, {
        userId,
        challengeId,
        dayNumber: 1,
        status: 'unlocked',
        unlockedAt: serverTimestamp(),
        startedAt: null,
        completedAt: null,
        submissionData: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Initialize remaining days as locked
      const batch = [];
      for (let day = 2; day <= 30; day++) {
        const dayProgressRef = doc(db, 'userDayProgress', `${userId}_${challengeId}_${day}`);
        batch.push(setDoc(dayProgressRef, {
          userId,
          challengeId,
          dayNumber: day,
          status: 'locked',
          unlockedAt: null,
          startedAt: null,
          completedAt: null,
          submissionData: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }));
      }

      // Execute batch writes
      await Promise.all(batch);

      return registrationData;
    } catch (error) {
      console.error('Error registering for challenge:', error);
      throw error;
    }
  }

  /**
   * Get user's challenge registration status
   */
  static async getChallengeRegistration(userId, challengeId) {
    try {
      const registrationRef = doc(db, 'userChallengeRegistrations', `${userId}_${challengeId}`);
      const registrationDoc = await getDoc(registrationRef);
      
      if (registrationDoc.exists()) {
        return { id: registrationDoc.id, ...registrationDoc.data() };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting challenge registration:', error);
      throw error;
    }
  }

  /**
   * Get user's progress for all days in a challenge
   */
  static async getChallengeProgress(userId, challengeId) {
    try {
      const progressQuery = query(
        collection(db, 'userDayProgress'),
        where('userId', '==', userId),
        where('challengeId', '==', challengeId)
      );

      const progressSnapshot = await getDocs(progressQuery);
      const dayProgress = {};

      progressSnapshot.forEach(doc => {
        const data = doc.data();
        dayProgress[data.dayNumber] = {
          id: doc.id,
          ...data,
          canAccess: data.status !== 'locked'
        };
      });

      return dayProgress;
    } catch (error) {
      console.error('Error getting challenge progress:', error);
      throw error;
    }
  }

  /**
   * Complete a day and unlock the next day
   */
  static async completeDay(userId, challengeId, dayNumber, submissionData) {
    try {
      // Update current day as completed
      const currentDayRef = doc(db, 'userDayProgress', `${userId}_${challengeId}_${dayNumber}`);
      await updateDoc(currentDayRef, {
        status: 'completed',
        completedAt: serverTimestamp(),
        submissionData: {
          ...submissionData,
          submittedAt: serverTimestamp()
        },
        updatedAt: serverTimestamp()
      });

      // Update registration with completed day
      const registrationRef = doc(db, 'userChallengeRegistrations', `${userId}_${challengeId}`);
      await updateDoc(registrationRef, {
        completedDays: arrayUnion(dayNumber),
        currentDay: Math.min(dayNumber + 1, 30),
        lastActivityAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Unlock next day if not the last day
      if (dayNumber < 30) {
        const nextDayRef = doc(db, 'userDayProgress', `${userId}_${challengeId}_${dayNumber + 1}`);
        await updateDoc(nextDayRef, {
          status: 'unlocked',
          unlockedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        // Mark challenge as completed
        await updateDoc(registrationRef, {
          status: 'completed',
          updatedAt: serverTimestamp()
        });
      }

      return true;
    } catch (error) {
      console.error('Error completing day:', error);
      throw error;
    }
  }

  /**
   * Start a day (mark as in progress)
   */
  static async startDay(userId, challengeId, dayNumber) {
    try {
      const dayProgressRef = doc(db, 'userDayProgress', `${userId}_${challengeId}_${dayNumber}`);
      await updateDoc(dayProgressRef, {
        status: 'in_progress',
        startedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return true;
    } catch (error) {
      console.error('Error starting day:', error);
      throw error;
    }
  }

  /**
   * Check if user can access a specific day
   */
  static async canAccessDay(userId, challengeId, dayNumber) {
    try {
      const dayProgressRef = doc(db, 'userDayProgress', `${userId}_${challengeId}_${dayNumber}`);
      const dayProgressDoc = await getDoc(dayProgressRef);
      
      if (dayProgressDoc.exists()) {
        const data = dayProgressDoc.data();
        return data.status !== 'locked';
      }
      
      return false;
    } catch (error) {
      console.error('Error checking day access:', error);
      throw error;
    }
  }

  /**
   * Get user's challenge statistics
   */
  static async getChallengeStats(userId, challengeId) {
    try {
      const [registration, dayProgress] = await Promise.all([
        this.getChallengeRegistration(userId, challengeId),
        this.getChallengeProgress(userId, challengeId)
      ]);

      if (!registration) {
        return null;
      }

      const completedDays = Object.values(dayProgress).filter(day => day.status === 'completed').length;
      const totalDays = 30;
      const completionPercentage = (completedDays / totalDays) * 100;

      // Calculate current streak
      let currentStreak = 0;
      for (let day = 1; day <= totalDays; day++) {
        if (dayProgress[day]?.status === 'completed') {
          currentStreak++;
        } else {
          break;
        }
      }

      return {
        totalDays,
        completedDays,
        currentDay: registration.currentDay,
        currentStreak,
        completionPercentage,
        status: registration.status,
        registeredAt: registration.registeredAt,
        lastActivityAt: registration.lastActivityAt
      };
    } catch (error) {
      console.error('Error getting challenge stats:', error);
      throw error;
    }
  }
}

export default ChallengeProgressService;