// Daily Check-in and Milestone-Based Streak Management Logic
// This utility file contains the core business logic for the app's gamification system
// It handles:
// - Daily check-in validation and streak tracking
// - Milestone-based reward calculations
// - User engagement metrics and progression
// - Loyalty badge system for long-term users

/**
 * Date Validation - Check if it's a new day since the last check-in
 * This function prevents multiple check-ins on the same day and ensures
 * users can only earn rewards once per 24-hour period
 * 
 * @param {string} lastCheckinDate - ISO date string of last check-in
 * @returns {boolean} - True if it's a new day, false if already checked in today
 */
export const isNewDay = (lastCheckinDate) => {
  // First-time users (no previous check-in) can always check in
  if (!lastCheckinDate) return true;
  
  const today = new Date();
  const lastDate = new Date(lastCheckinDate);
  
  // Reset time components to compare only dates (avoid timezone issues)
  // This ensures check-ins are based on calendar days, not 24-hour periods
  today.setHours(0, 0, 0, 0);
  lastDate.setHours(0, 0, 0, 0);
  
  // Compare timestamps - different dates mean it's a new day
  return today.getTime() !== lastDate.getTime();
};

/**
 * Streak Continuity Logic - Determines if the user's streak should continue
 * A streak continues only if the user checked in yesterday
 * Missing a day breaks the streak and resets it to 1
 * 
 * @param {string} lastCheckinDate - ISO date string of last check-in
 * @returns {boolean} - True if streak continues, false if it should reset
 */
export const shouldContinueStreak = (lastCheckinDate) => {
  // New users start with streak of 1
  if (!lastCheckinDate) return false;
  
  const today = new Date();
  const lastDate = new Date(lastCheckinDate);
  
  // Reset time components to avoid timezone complications
  today.setHours(0, 0, 0, 0);
  lastDate.setHours(0, 0, 0, 0);
  
  // Calculate the difference in days
  const timeDiff = today.getTime() - lastDate.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  
  // Streak continues only if last check-in was exactly yesterday
  // 0 days = same day (already checked in), 2+ days = streak broken
  return daysDiff === 1;
};

/**
 * Streak Calculation - Determines the new streak count after check-in
 * Handles both streak continuation and reset scenarios
 * 
 * @param {number} currentStreak - Current streak count
 * @param {string} lastCheckinDate - ISO date string of last check-in
 * @returns {number} - New streak count (incremented or reset to 1)
 */
export const calculateNewStreak = (currentStreak, lastCheckinDate) => {
  // First-time check-in starts at streak 1
  if (!lastCheckinDate) return 1;
  
  // Continue streak if user checked in yesterday
  if (shouldContinueStreak(lastCheckinDate)) {
    return currentStreak + 1;
  } else {
    // Reset streak if user missed a day or more
    return 1;
  }
};

/**
 * Milestone Configuration - Defines reward tiers and achievement types
 * This system encourages long-term engagement through escalating rewards
 * Two types of milestones:
 * - Style Creds: Virtual currency for in-app purchases/features
 * - Loyalty Badge: Exclusive achievement for dedicated users
 */
const MILESTONES = {
  7: { styleCreds: 200, type: 'milestone', title: '7-Day Streak!' },     // Week milestone
  14: { styleCreds: 250, type: 'milestone', title: '14-Day Streak!' },   // Two weeks
  28: { styleCreds: 300, type: 'milestone', title: '28-Day Streak!' },   // Month milestone
  40: { styleCreds: 0, type: 'loyalty_badge', title: 'Loyalty Badge Unlocked!' } // Special badge
};

/**
 * Milestone Detection - Checks if current streak qualifies for a reward
 * Only specific streak numbers trigger rewards (not every day)
 * This creates anticipation and makes achievements feel special
 * 
 * @param {number} newStreak - The new streak count after today's check-in
 * @returns {object|null} - Milestone info with reward details, or null if no milestone
 */
export const getMilestoneReward = (newStreak) => {
  // Check if current streak matches any milestone
  if (MILESTONES[newStreak]) {
    return {
      ...MILESTONES[newStreak],
      streak: newStreak,
      isMilestone: true
    };
  }
  // No milestone reached today
  return null;
};

/**
 * Reward Calculation - Determines total rewards earned for today's check-in
 * This app uses milestone-only rewards (no daily rewards) to create
 * more meaningful and anticipated reward moments
 * 
 * @param {number} newStreak - The new streak count after today's check-in
 * @returns {object} - Complete reward details including milestone status
 */
export const calculateDailyRewards = (newStreak) => {
  const milestone = getMilestoneReward(newStreak);
  
  // Milestone day - user gets special rewards
  if (milestone) {
    return {
      dailyReward: 0,                           // No daily rewards in this system
      milestoneReward: milestone.styleCreds,    // Bonus Style Creds for milestone
      totalReward: milestone.styleCreds,        // Total earned today
      isMilestone: true,                        // Triggers special UI/animations
      milestoneType: milestone.type,            // 'milestone' or 'loyalty_badge'
      milestoneTitle: milestone.title,          // Display title for achievement
      streak: newStreak                         // Current streak count
    };
  }
  
  // Regular day - no rewards, just streak continuation
  return {
    dailyReward: 0,
    milestoneReward: 0,
    totalReward: 0,
    isMilestone: false,
    milestoneType: null,
    milestoneTitle: null,
    streak: newStreak
  };
};

/**
 * Progress Tracking - Finds the next milestone for user motivation
 * Shows users what they're working toward and how close they are
 * This creates a sense of progression and encourages continued engagement
 * 
 * @param {number} currentStreak - Current streak count
 * @returns {object|null} - Next milestone info with days remaining, or null if no more milestones
 */
export const getNextMilestone = (currentStreak) => {
  // Get all milestone days in ascending order
  const milestoneKeys = Object.keys(MILESTONES).map(Number).sort((a, b) => a - b);
  
  // Find the first milestone greater than current streak
  const nextMilestone = milestoneKeys.find(milestone => milestone > currentStreak);
  
  if (nextMilestone) {
    return {
      days: nextMilestone,                                    // Streak day for next milestone
      reward: MILESTONES[nextMilestone],                     // Reward details
      daysRemaining: nextMilestone - currentStreak           // Days until milestone
    };
  }
  
  // User has reached all available milestones
  return null;
};

/**
 * Main Check-in Processor - Orchestrates the entire daily check-in flow
 * This is the primary function called when a user attempts to check in
 * It validates, calculates, and updates all relevant user data
 * 
 * @param {object} userData - Current user data from storage/database
 * @returns {object} - Complete result with updated data and reward info
 */
export const processDailyCheckin = (userData) => {
  const { lastCheckinDate, currentStreak, styleCreds } = userData;
  
  // Prevent multiple check-ins on the same day
  if (!isNewDay(lastCheckinDate)) {
    return {
      userData,                    // No changes to user data
      rewardInfo: null,           // No rewards earned
      alreadyCheckedIn: true      // Flag for UI to show "already checked in" message
    };
  }
  
  // Calculate new streak based on check-in history
  const newStreak = calculateNewStreak(currentStreak, lastCheckinDate);
  
  // Determine rewards for today's check-in
  const rewardInfo = calculateDailyRewards(newStreak);
  
  // Update user data with new values
  const updatedUserData = {
    ...userData,
    lastCheckinDate: new Date().toISOString(),                                    // Record today's check-in
    currentStreak: newStreak,                                                     // Update streak count
    styleCreds: styleCreds + rewardInfo.totalReward,                             // Add earned Style Creds
    totalCheckins: (userData.totalCheckins || 0) + 1,                           // Increment lifetime check-ins
    totalStyleCredsEarned: (userData.totalStyleCredsEarned || 0) + rewardInfo.totalReward, // Track total earnings
    // Award loyalty badge at 40-day milestone (permanent achievement)
    hasLoyaltyBadge: newStreak >= 40 ? true : (userData.hasLoyaltyBadge || false)
  };
  
  return {
    userData: updatedUserData,
    rewardInfo: {
      ...rewardInfo,
      currentStreak: newStreak,
      nextMilestone: getNextMilestone(newStreak)  // Show progress toward next goal
    },
    alreadyCheckedIn: false
  };
};

/**
 * Check-in Status Checker - Determines if user can check in today
 * Used by UI components to show appropriate buttons and messages
 * 
 * @param {string} lastCheckinDate - ISO date string of last check-in
 * @returns {object} - Status info for UI rendering
 */
export const getCheckinStatus = (lastCheckinDate) => {
  const hasCheckedInToday = !isNewDay(lastCheckinDate);
  
  return {
    hasCheckedInToday,                                              // Boolean for UI state
    canCheckIn: !hasCheckedInToday,                                // Can user check in now?
    nextCheckinAvailable: hasCheckedInToday ? getNextCheckinTime() : null  // When can they check in next?
  };
};

/**
 * Next Check-in Timer - Calculates when user can check in again
 * Returns tomorrow at midnight (start of new day)
 * Used for countdown timers and user communication
 * 
 * @returns {Date} - Next check-in time (tomorrow at 00:00:00)
 */
export const getNextCheckinTime = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);  // Move to next day
  tomorrow.setHours(0, 0, 0, 0);             // Set to midnight
  return tomorrow;
};

/**
 * Display Formatter - Formats Style Creds for user-friendly display
 * Converts large numbers to readable format (1.2K, 2.5M, etc.)
 * Improves UI readability and saves screen space
 * 
 * @param {number} amount - Style Creds amount to format
 * @returns {string} - Formatted string for display
 */
export const formatStyleCreds = (amount) => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;  // Millions
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;     // Thousands
  }
  return amount.toString();                       // Under 1000, show full number
};