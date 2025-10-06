// Daily Check-in Component - Gamification System for User Engagement
// This component creates a reward-based system that encourages daily app usage through:
// - Streak tracking (consecutive days of app usage)
// - Milestone rewards (bonus credits at specific streak intervals)
// - Loyalty badges (special achievements for dedicated users)
// - Visual celebrations (animations and confetti for achievements)

import React, { useState, useEffect } from 'react';
import { Gift, Flame, Star, Sparkles, X, Trophy, Crown } from 'lucide-react';

// Main DailyCheckin Component
// Props explanation:
// - isOpen: Controls modal visibility
// - onClose: Function to close the modal
// - onRewardClaimed: Callback when user claims their reward
// - currentStreak: Number of consecutive days user has checked in
// - milestoneReward: Amount of Style Creds earned for milestone
// - isMilestone: Boolean indicating if current streak is a milestone
// - milestoneType: Type of milestone ('loyalty_badge' or 'streak_bonus')
// - nextMilestone: Information about the next milestone to achieve
const DailyCheckin = ({ 
  isOpen, 
  onClose, 
  onRewardClaimed, 
  currentStreak, 
  milestoneReward,
  isMilestone,
  milestoneType,
  nextMilestone
}) => {
  // State for controlling entrance animation timing
  const [showAnimation, setShowAnimation] = useState(false);
  
  // State for controlling celebratory confetti effect
  const [showConfetti, setShowConfetti] = useState(false);

  // Effect to trigger animations when modal opens
  // Handles both entrance animation and milestone celebration effects
  useEffect(() => {
    if (isOpen) {
      // Trigger smooth entrance animation
      setShowAnimation(true);
      
      // Show confetti celebration for milestone achievements
      if (isMilestone) {
        setShowConfetti(true);
        // Auto-hide confetti after 3 seconds to avoid visual clutter
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  }, [isOpen, isMilestone]);

  // Handle reward claiming process
  // Executes reward logic and closes modal
  const handleClaim = () => {
    onRewardClaimed(); // Execute reward claiming logic (update credits, save streak, etc.)
    onClose(); // Close the modal
  };

  // Dynamic icon selection based on milestone type
  // Returns appropriate icon with styling for different achievement types
  const getMilestoneIcon = () => {
    switch (milestoneType) {
      case 'loyalty_badge':
        // Crown icon for loyalty achievements (premium feel)
        return <Crown className="w-8 h-8 text-yellow-400 animate-pulse" />;
      case 'streak_bonus':
        // Trophy icon for streak milestones (achievement feel)
        return <Trophy className="w-8 h-8 text-pink-400 animate-pulse" />;
      default:
        // Gift icon for regular check-ins (reward feel)
        return <Gift className="w-8 h-8 text-cyan-400" />;
    }
  };

  // Dynamic color scheme based on milestone type
  // Creates consistent theming across different achievement types
  // Returns object with coordinated colors for backgrounds, text, borders, gradients, and shadows
  const getMilestoneColors = () => {
    switch (milestoneType) {
      case 'loyalty_badge':
        // Golden theme for loyalty badges (premium/exclusive feel)
        return {
          bg: 'bg-yellow-500/20',        // Semi-transparent background
          text: 'text-yellow-400',       // Bright text color
          border: 'border-yellow-500/30', // Subtle border
          gradient: 'from-yellow-500 to-yellow-600', // Button gradient
          shadow: 'shadow-yellow-500/25'  // Glowing shadow effect
        };
      case 'streak_bonus':
        // Pink theme for streak bonuses (energetic/achievement feel)
        return {
          bg: 'bg-pink-500/20',
          text: 'text-pink-400',
          border: 'border-pink-500/30',
          gradient: 'from-pink-500 to-pink-600',
          shadow: 'shadow-pink-500/25'
        };
      default:
        // Cyan theme for regular rewards (fresh/modern feel)
        return {
          bg: 'bg-cyan-500/20',
          text: 'text-cyan-400',
          border: 'border-cyan-500/30',
          gradient: 'from-cyan-500 to-cyan-600',
          shadow: 'shadow-cyan-500/25'
        };
    }
  };

  // Get the current color scheme for consistent theming
  const colors = getMilestoneColors();

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  return (
    // Modal Overlay - Dark semi-transparent background that covers entire screen
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      
      {/* Confetti Animation for Milestone Celebrations */}
      {/* Creates floating star particles across the screen for special achievements */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Generate 20 animated star particles with random positions and timing */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,    // Random horizontal position
                top: `${Math.random() * 100}%`,     // Random vertical position
                animationDelay: `${Math.random() * 2}s`,      // Staggered animation start
                animationDuration: `${2 + Math.random() * 2}s` // Varied animation speed
              }}
            >
              {/* Star icon with dynamic coloring based on milestone type */}
              <Star className={`${colors.text} w-4 h-4`} />
            </div>
          ))}
        </div>
      )}

      {/* Main Modal Container */}
      {/* Dark themed card with smooth entrance animation */}
      <div 
        className={`bg-[#0B0F17] border border-gray-700 rounded-2xl p-6 max-w-sm w-full mx-4 transform transition-all duration-500 ${
          showAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Close Button */}
        {/* Positioned in top-right corner for easy access */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Section */}
        {/* Contains main icon, title, and description */}
        <div className="text-center mb-6">
          {/* Icon Container with Dynamic Background */}
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${colors.bg}`}>
            {getMilestoneIcon()}
          </div>
          
          {/* Dynamic Title Based on Achievement Type */}
          <h2 className="text-2xl font-bold text-white mb-2">
            {isMilestone ? (
              // Special titles for milestone achievements
              milestoneType === 'loyalty_badge' ? '👑 Loyalty Badge Earned!' : '🏆 Milestone Reached!'
            ) : (
              // Standard title for regular check-ins
              '✨ Daily Check-in'
            )}
          </h2>
          
          {/* Dynamic Description Based on Achievement Type */}
          <p className="text-gray-300 text-sm">
            {isMilestone 
              ? milestoneType === 'loyalty_badge' 
                ? 'Congratulations! You\'ve earned the exclusive loyalty badge!'
                : `Amazing! You\'ve reached a ${currentStreak}-day streak milestone!`
              : 'Welcome back! Keep building your streak.'
            }
          </p>
        </div>

        {/* Reward Display Section */}
        {/* Shows earned rewards and current progress */}
        <div className="text-center mb-6">
          
          {/* Milestone Reward Display (Style Creds) */}
          {/* Only shown when user reaches a milestone with credit rewards */}
          {isMilestone && milestoneReward > 0 && (
            <div className={`inline-flex items-center justify-center px-6 py-3 rounded-xl mb-4 ${colors.bg} border ${colors.border}`}>
              <Sparkles className={`w-5 h-5 mr-2 ${colors.text}`} />
              <span className={`text-2xl font-bold ${colors.text}`}>
                +{milestoneReward} Style Creds
              </span>
            </div>
          )}

          {/* Loyalty Badge Display */}
          {/* Special display for loyalty badge achievements */}
          {isMilestone && milestoneType === 'loyalty_badge' && (
            <div className={`inline-flex items-center justify-center px-6 py-3 rounded-xl mb-4 ${colors.bg} border ${colors.border}`}>
              <Crown className={`w-5 h-5 mr-2 ${colors.text}`} />
              <span className={`text-2xl font-bold ${colors.text}`}>
                Loyalty Badge Unlocked!
              </span>
            </div>
          )}

          {/* Streak Progress Section */}
          {/* Shows current streak and progress toward next milestone */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            
            {/* Current Streak Display */}
            <div className="flex items-center justify-center mb-2">
              <Flame className="w-4 h-4 text-pink-400 mr-2" />
              <span className="text-white font-semibold">
                Day {currentStreak} Streak
              </span>
            </div>
            
            {/* Progress Bar and Next Milestone Info */}
            {/* Only shown if there's a next milestone to work toward */}
            {nextMilestone && (
              <>
                {/* Visual Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-pink-400 h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      // Calculate progress percentage, capped at 100%
                      width: `${Math.min((currentStreak / nextMilestone.days) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                
                {/* Progress Text */}
                <p className="text-gray-400 text-xs">
                  {isMilestone 
                    ? 'Milestone achieved! Keep going for the next one!' 
                    : `${nextMilestone.days - currentStreak} days until next milestone (${nextMilestone.reward > 0 ? `+${nextMilestone.reward} Style Creds` : 'Loyalty Badge'})`
                  }
                </p>
              </>
            )}
          </div>
        </div>

        {/* Claim Button */}
        {/* Main action button with dynamic styling and text */}
        <button
          onClick={handleClaim}
          className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 bg-gradient-to-r ${colors.gradient} shadow-lg ${colors.shadow}`}
        >
          {/* Dynamic button text based on achievement type */}
          {isMilestone 
            ? milestoneType === 'loyalty_badge' 
              ? '👑 Claim Badge!' 
              : '🏆 Claim Milestone Reward!'
            : '✨ Continue Streak'
          }
        </button>

        {/* Footer Message */}
        {/* Encourages user to return tomorrow for continued engagement */}
        <p className="text-center text-gray-500 text-xs mt-4">
          Come back tomorrow to continue your streak!
        </p>
      </div>
    </div>
  );
};

export default DailyCheckin;