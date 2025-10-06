/*
 * ===================================================================
 * AI STYLIST DASHBOARD - MAIN APPLICATION FILE
 * ===================================================================
 * 
 * This is the main file that controls the entire AI Stylist app.
 * Think of this as the "brain" of the application that coordinates
 * all the different features and screens.
 * 
 * What this file does:
 * - Controls which screen the user sees (Home, Calendar, Chat, etc.)
 * - Manages user data like style credits and daily check-ins
 * - Handles the daily reward system
 * - Coordinates between different parts of the app
 */

// ===================================================================
// IMPORTING REQUIRED TOOLS AND COMPONENTS
// ===================================================================

// React is the main framework that makes our app interactive
// useState = lets us store and change data (like user's current screen)
// useEffect = lets us run code when the app starts or when things change
import React, { useState, useEffect } from 'react';

// These are all the icons we use throughout the app
// Each icon represents different features (Home, User profile, Calendar, etc.)
import { 
  Home,           // House icon for home screen
  User,           // Person icon for profile
  Calendar,       // Calendar icon for outfit planning
  Shirt,          // Clothing icon for wardrobe
  ShoppingBag,    // Shopping bag for marketplace
  Sparkles,       // Magic sparkles for AI features
  Cloud,          // Weather cloud icon
  TrendingUp,     // Arrow pointing up for analytics
  Star,           // Star for favorites and ratings
  Users,          // Multiple people icon for social features
  Award,          // Trophy/medal for achievements
  Plus,           // Plus sign for adding items
  Coins,          // Money coins for style credits
  Trophy,         // Trophy for milestones
  Crown,          // Crown for premium features
  Flame,          // Fire icon for streaks
  Diamond,        // Diamond for premium content
  Zap,            // Lightning bolt for quick actions
  Target,         // Bullseye for goals
  CheckCircle,    // Checkmark in circle for completed tasks
  MessageCircle,  // Chat bubble for messaging
  Bot             // Robot icon for AI chatbot
} from 'lucide-react';

// These are the different screens/components of our app
import CalendarComponent from './components/Calendar';     // Legacy calendar
import GoogleCalendar from './components/GoogleCalendar'; // Google Calendar integrated calendar
import DailyCheckin from './components/DailyCheckin';     // The daily reward popup
import ChatSystem from './components/ChatSystem';         // The AI chatbot screen
import { processDailyCheckin, getCheckinStatus, formatStyleCreds } from './utils/checkinLogic';  // Helper functions for daily rewards

// ===================================================================
// MAIN APP FUNCTION - THE HEART OF THE APPLICATION
// ===================================================================

function CalApp() {
  
  // ===================================================================
  // APP STATE MANAGEMENT (STORING IMPORTANT INFORMATION)
  // ===================================================================
  
  // This keeps track of which screen the user is currently viewing
  // Can be: 'home', 'calendar', 'explore' (chat), etc.
  const [activeTab, setActiveTab] = useState('home');
  
  // This stores the current weather information
  // Used to suggest appropriate outfits based on weather
  const [weather, setWeather] = useState({ 
    temp: 22,              // Temperature in Celsius
    condition: 'Rainy',    // Weather condition (Sunny, Rainy, etc.)
    location: 'Karnataka'  // User's location
  });
  
  // ===================================================================
  // USER DATA SETUP (PROFILE AND PROGRESS INFORMATION)
  // ===================================================================
  
  // This function creates the default user profile when someone first uses the app
  const getDefaultUserData = () => ({
    styleCreds: 200,              // Virtual currency earned through daily check-ins
    lastCheckinDate: null,        // When the user last claimed their daily reward
    currentStreak: 500,            // How many days in a row they've checked in
    totalCheckins: 0,             // Total number of times they've checked in
    totalStyleCredsEarned: 0,     // Total style credits earned over time
    hasLoyaltyBadge: false        // Special badge for loyal users (40+ day streak)
  });

  // This creates and manages the user's profile data
  // It starts with default values and can be updated as the user uses the app
  const [userData, setUserData] = useState(() => {
    // Clear any old saved data to ensure we start fresh with new default values
    localStorage.removeItem('userStyleData');
    return getDefaultUserData();
  });

  // Force update userData when code changes during HMR
  useEffect(() => {
    if (import.meta.hot) {
      const newUserData = getDefaultUserData();
      setUserData(newUserData);
      // Also force update streakData immediately during HMR
      setStreakData(prev => ({
        ...prev,
        currentStreak: newUserData.currentStreak,
        totalDays: newUserData.currentStreak,
        isLoyalUser: newUserData.currentStreak >= 40,
        loyalUserSince: newUserData.currentStreak >= 40 ? new Date(Date.now() - newUserData.currentStreak * 24 * 60 * 60 * 1000).toDateString() : null
      }));
    }
  }, [import.meta.hot]); // Add dependency array to prevent infinite re-renders

  // Daily check-in modal state
  const [checkinModal, setCheckinModal] = useState({
    isOpen: false,
    rewardInfo: null
  });
  
  // Simple streak tracking - no localStorage, just a variable you can change
  const [streakData, setStreakData] = useState(() => {
    // Initialize with userData.currentStreak so changing it updates the entire app
    const currentStreakValue = userData.currentStreak;
    return {
      currentStreak: currentStreakValue,     // Current number of consecutive days
      lastActiveDate: new Date().toDateString(),  // Last day they were active
      totalDays: currentStreakValue,         // Total days they've been active
      isLoyalUser: currentStreakValue >= 40, // Special status for users with 40+ day streaks
      loyalUserSince: currentStreakValue >= 40 ? new Date(Date.now() - currentStreakValue * 24 * 60 * 60 * 1000).toDateString() : null,  // When they became a loyal user
      streakHistory: []                      // History of their streak performance
    };
  });
  
  // ===================================================================
  // SOCIAL ACTIVITY SIMULATION (FAKE USER ACTIVITY FOR ENGAGEMENT)
  // ===================================================================
  
  // These are fake social activities that make the app feel more lively and engaging
  // They rotate to show different messages like "Priya just styled an outfit like this"
  // This creates a sense of community even when the user is alone
  const socialActivityMessages = [
    [
      { name: 'Priya', action: 'styled an outfit like this', time: '2m ago' },
      { name: '12 people', action: 'are viewing this item now', time: 'live' },
    ],
    [
      { name: 'Arjun', action: 'just bought this trending piece', time: '1m ago' },
      { name: '8 people', action: 'added this to wishlist', time: 'now' },
    ],
    [
      { name: 'Kavya', action: 'created a similar look', time: '3m ago' },
      { name: '15 people', action: 'are styling this item', time: 'live' },
    ],
    [
      { name: 'Rohan', action: 'shared this outfit inspiration', time: '4m ago' },
      { name: '6 people', action: 'are browsing this category', time: 'now' },
    ],
    [
      { name: 'Ananya', action: 'rated this outfit 5 stars', time: '2m ago' },
      { name: '20 people', action: 'viewed this in the last hour', time: 'recent' },
    ],
    [
      { name: 'Vikram', action: 'found the perfect match', time: '1m ago' },
      { name: '11 people', action: 'are exploring similar styles', time: 'live' },
    ],
    [
      { name: 'Ishita', action: 'loved this color combination', time: '3m ago' },
      { name: '9 people', action: 'are checking out similar items', time: 'now' },
    ],
    [
      { name: 'Aditya', action: 'saved this to favorites', time: '5m ago' },
      { name: '14 people', action: 'are browsing this brand', time: 'live' },
    ],
    [
      { name: 'Meera', action: 'recommended this to friends', time: '1m ago' },
      { name: '7 people', action: 'just added to cart', time: 'now' },
    ],
    [
      { name: 'Karan', action: 'tried on virtually', time: '2m ago' },
      { name: '18 people', action: 'are viewing outfit details', time: 'live' },
    ],
    [
      { name: 'Shreya', action: 'created a mood board with this', time: '4m ago' },
      { name: '5 people', action: 'are styling similar pieces', time: 'now' },
    ],
    [
      { name: 'Rahul', action: 'got styling tips for this', time: '3m ago' },
      { name: '13 people', action: 'are exploring this trend', time: 'live' },
    ],
    [
      { name: 'Diya', action: 'matched this with accessories', time: '2m ago' },
      { name: '16 people', action: 'are browsing matching items', time: 'now' },
    ],
    [
      { name: 'Aryan', action: 'shared on social media', time: '1m ago' },
      { name: '10 people', action: 'are checking size availability', time: 'live' },
    ],
    [
      { name: 'Nisha', action: 'asked for styling advice', time: '4m ago' },
      { name: '22 people', action: 'viewed this designer collection', time: 'recent' },
    ],
    [
      { name: 'Siddharth', action: 'compared prices for this', time: '3m ago' },
      { name: '8 people', action: 'are reading reviews', time: 'now' },
    ],
    [
      { name: 'Tanvi', action: 'created a capsule wardrobe', time: '5m ago' },
      { name: '12 people', action: 'are exploring seasonal trends', time: 'live' },
    ],
    [
      { name: 'Aarav', action: 'got color matching suggestions', time: '2m ago' },
      { name: '19 people', action: 'are viewing fabric details', time: 'now' },
    ],
    [
      { name: 'Riya', action: 'booked a styling session', time: '1m ago' },
      { name: '6 people', action: 'are exploring premium collections', time: 'live' },
    ],
    [
      { name: 'Harsh', action: 'found his style personality', time: '3m ago' },
      { name: '14 people', action: 'are taking the style quiz', time: 'now' },
    ],
    [
      { name: 'Sarah', action: 'discovered her signature style', time: '2m ago' },
      { name: '11 people', action: 'are browsing formal wear', time: 'live' },
    ],
    [
      { name: 'Fatima', action: 'curated modest fashion looks', time: '4m ago' },
      { name: '17 people', action: 'are exploring modest wear', time: 'now' },
    ],
    [
      { name: 'David', action: 'upgraded his work wardrobe', time: '1m ago' },
      { name: '9 people', action: 'are checking suit collections', time: 'live' },
    ],
    [
      { name: 'Zara', action: 'mixed traditional with modern', time: '3m ago' },
      { name: '13 people', action: 'are viewing fusion wear', time: 'now' },
    ],
    [
      { name: 'Michael', action: 'found sustainable fashion', time: '5m ago' },
      { name: '21 people', action: 'are exploring eco-friendly brands', time: 'recent' },
    ],
    [
      { name: 'Aisha', action: 'styled for special occasions', time: '2m ago' },
      { name: '15 people', action: 'are browsing festive collections', time: 'live' },
    ],
    [
      { name: 'Daniel', action: 'personalized his casual look', time: '1m ago' },
      { name: '7 people', action: 'are exploring streetwear', time: 'now' },
    ],
    [
      { name: 'Simran', action: 'coordinated ethnic outfits', time: '4m ago' },
      { name: '18 people', action: 'are viewing traditional wear', time: 'live' },
    ]
  ];

  const [socialActivity, setSocialActivity] = useState(socialActivityMessages[0]);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  
  // Calendar state management
  const [calendarData, setCalendarData] = useState({
    plannedOutfits: {},
    weatherForecast: {},
    events: {}
  });

  // Update calendar data
  const updateCalendarData = (newData) => {
    setCalendarData(prev => ({
      ...prev,
      ...newData
    }));
  };

  // Rotate social activity messages every 7 seconds for smoother experience
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivityIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % socialActivityMessages.length;
        setSocialActivity(socialActivityMessages[nextIndex]);
        return nextIndex;
      });
    }, 7000); // Changed from 2000ms to 7000ms (7 seconds)
    return () => clearInterval(interval);
  }, [socialActivityMessages]);

  // Simulate real-time updates for social proof with varied names and realistic patterns
  useEffect(() => {
    const names = [
      'Emma Chen', 'Marcus Johnson', 'Priya Sharma', 'Kai Nakamura', 
      'Sofia Rodriguez', 'Aiden O\'Connor', 'Zara Al-Rashid', 'Liam Thompson',
      'Aria Patel', 'Noah Williams', 'Chloe Kim', 'Diego Martinez',
      'Amara Jackson', 'Ethan Davis', 'Ava Singh', 'Oliver Brown',
      'Mia Gonzalez', 'Lucas Anderson', 'Isabella Lee', 'Mason Taylor',
      'Jasmine Wu', 'Ryan Mitchell', 'Leila Hassan', 'Carlos Vega'
    ];
    
    const actions = [
      'just purchased this trending piece',
      'added this to their style board', 
      'is trying this look virtually',
      'shared this outfit with friends',
      'saved this for weekend shopping',
      'rated this 5 stars',
      'found their perfect match here',
      'is styling this for a date night',
      'recommended this to their stylist',
      'just got compliments wearing this',
      'created a similar look',
      'is browsing more from this brand',
      'added this to their wishlist',
      'is checking size availability',
      'loved this color combination',
      'bookmarked this for later',
      'is comparing similar styles',
      'just ordered in two colors',
      'tagged a friend in this look',
      'is planning an outfit around this'
    ];

    // More realistic time patterns based on actual user behavior
    const getRealisticTime = () => {
      const timeOptions = [
        { text: 'just now', weight: 15 },
        { text: '1m ago', weight: 12 },
        { text: '2m ago', weight: 10 },
        { text: '3m ago', weight: 8 },
        { text: '5m ago', weight: 7 },
        { text: '8m ago', weight: 5 },
        { text: '12m ago', weight: 4 },
        { text: '15m ago', weight: 3 },
        { text: 'moments ago', weight: 6 },
        { text: 'recently', weight: 4 }
      ];
      
      const totalWeight = timeOptions.reduce((sum, option) => sum + option.weight, 0);
      let random = Math.random() * totalWeight;
      
      for (const option of timeOptions) {
        random -= option.weight;
        if (random <= 0) return option.text;
      }
      return 'just now';
    };
    
    // Simulate realistic user engagement patterns
    const simulateActivity = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const realisticTime = getRealisticTime();
      
      setSocialActivity(prev => [
        { name: randomName, action: randomAction, time: realisticTime },
        ...prev.slice(0, 2) // Keep 3 items total for better UX
      ]);
    };

    // Initial activity
    simulateActivity();
    
    // Set up realistic intervals - much slower updates for better user experience
      const createInterval = () => {
        const baseInterval = 20000; // 20 seconds base
        const randomVariation = Math.random() * 10000; // 0-10 seconds variation
        const peakHourMultiplier = Math.random() > 0.7 ? 0.8 : 1; // 30% chance of slightly faster activity
        
        return (baseInterval + randomVariation) * peakHourMultiplier;
      };

    const scheduleNext = () => {
      const nextInterval = createInterval();
      setTimeout(() => {
        simulateActivity();
        scheduleNext(); // Schedule the next update
      }, nextInterval);
    };

    scheduleNext();
    
    // Cleanup function
    return () => {
      // The timeout will be cleared when component unmounts
    };
  }, [import.meta.hot]);

  // Sync streakData when userData.currentStreak changes
  useEffect(() => {
    setStreakData(prev => ({
      ...prev,
      currentStreak: userData.currentStreak,
      totalDays: userData.currentStreak,
      isLoyalUser: userData.currentStreak >= 40,
      loyalUserSince: userData.currentStreak >= 40 ? new Date(Date.now() - userData.currentStreak * 24 * 60 * 60 * 1000).toDateString() : null
    }));
  }, [userData.currentStreak]);

  // No localStorage operations needed - streakData is just a simple variable

  // No need to sync userData with streakData anymore - progress bar uses streakData directly

  // Daily check-in logic - triggers on app open
  useEffect(() => {
    // Save user data to localStorage
    localStorage.setItem('userStyleData', JSON.stringify(userData));
    
    // DISABLED FOR TESTING - Check if user can check in today
    // const checkinStatus = getCheckinStatus(userData.lastCheckinDate);
    
    // if (checkinStatus.canCheckIn) {
    //   // Process the daily check-in
    //   const checkinResult = processDailyCheckin(userData);
      
    //   if (!checkinResult.alreadyCheckedIn && checkinResult.rewardInfo) {
    //     // Update user data
    //     setUserData(checkinResult.userData);
        
    //     // Update loyalty status if 40-day milestone reached
    //     if (checkinResult.userData.hasLoyaltyBadge && !userData.hasLoyaltyBadge) {
    //       setStreakData(prev => ({
    //         ...prev,
    //         isLoyalUser: true,
    //         loyalUserSince: new Date().toDateString()
    //       }));
    //     }
        
    //     // Show the check-in modal with reward info
    //     setCheckinModal({
    //       isOpen: true,
    //       rewardInfo: checkinResult.rewardInfo
    //     });
    //   }
    // }
  }, []); // Only run on component mount

  // Save user data whenever it changes
  useEffect(() => {
    localStorage.setItem('userStyleData', JSON.stringify(userData));
  }, [userData]);

  // Function to update streak (called when user completes daily styling)
  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastActive = new Date(streakData.lastActiveDate);
    const todayDate = new Date(today);
    const daysDiff = Math.floor((todayDate - lastActive) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      // Consecutive day - increment streak
      const newTotalDays = streakData.totalDays + 1;
      const newCurrentStreak = streakData.currentStreak + 1;
      
      setStreakData(prev => ({
        ...prev,
        currentStreak: newCurrentStreak,
        totalDays: newTotalDays,
        lastActiveDate: today,
        // Check if user reaches 40-day milestone for loyalty badge
        isLoyalUser: newTotalDays >= 40 ? true : prev.isLoyalUser,
        loyalUserSince: newTotalDays >= 40 && !prev.loyalUserSince ? today : prev.loyalUserSince,
        streakHistory: [...prev.streakHistory, { date: today, streak: newCurrentStreak }]
      }));
    } else if (daysDiff === 0) {
      // Same day - no change needed
      return;
    } else {
      // Streak broken - reset to 1
      const newTotalDays = streakData.totalDays + 1;
      
      setStreakData(prev => ({
        ...prev,
        currentStreak: 1,
        totalDays: newTotalDays,
        lastActiveDate: today,
        // Check if user reaches 40-day milestone for loyalty badge
        isLoyalUser: newTotalDays >= 40 ? true : prev.isLoyalUser,
        loyalUserSince: newTotalDays >= 40 && !prev.loyalUserSince ? today : prev.loyalUserSince,
        streakHistory: [...prev.streakHistory, { date: today, streak: 1, broken: true }]
      }));
    }
  };

  const handleTabClick = (tab) => {
    // Trigger animation for the clicked button BEFORE changing active tab
    const buttons = document.querySelectorAll('nav div button');
    const buttonIndex = ['home', 'closet', 'explore', 'shop', 'calendar'].indexOf(tab);
    const button = buttons[buttonIndex];
    
    if (button) {
      // Remove any existing animation classes from ALL buttons
      buttons.forEach(btn => {
        btn.classList.remove('animate-home', 'animate-closet', 'animate-calendar', 'animate-shop', 'animate-explore');
      });
      
      // Force multiple reflows to ensure complete state reset
      buttons.forEach(btn => btn.offsetHeight);
      
      // Add a small delay to ensure clean state before adding animation
      setTimeout(() => {
        // Add the appropriate animation class to the clicked button
        const animationClass = `animate-${tab}`;
        button.classList.add(animationClass);
        
        // Remove the animation class after animation completes to allow re-triggering
        const animationDuration = tab === 'calendar' ? 600 : tab === 'explore' ? 700 : tab === 'shop' ? 400 : 500;
        setTimeout(() => {
          button.classList.remove(animationClass);
        }, animationDuration + 50); // Add small buffer
      }, 10); // Small delay to ensure clean state
    }
    
    // Set active tab AFTER triggering animation
    setActiveTab(tab);
    
    // Haptic feedback simulation for mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleFeatureClick = (feature) => {
    // Dopamine trigger - satisfying click animation
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
    
    // Update streak when user interacts with styling features
    if (['Closet Recommendations', 'Shopping Recommendations', 'Plan My Outfit'].includes(feature)) {
      updateStreak();
    }
    
    // Navigate to specific tabs based on feature clicked
    if (feature === 'Closet Recommendations') {
      setActiveTab('closet');
      return;
    }
    
    if (feature === 'Shopping Recommendations') {
      setActiveTab('shop');
      return;
    }
    
    // Navigate to closet when Add Item is clicked
    if (feature === 'Add Item') {
      setActiveTab('closet');
      return;
    }
    
    // Navigate to calendar when Plan Tomorrow is clicked
    if (feature === 'Plan Tomorrow') {
      setActiveTab('calendar');
      return;
    }
    
    // Navigate to chatbot when AI Chatbot is clicked
    if (feature === 'AI Chatbot') {
      setActiveTab('explore');
      return;
    }
    
    // Feature ready for integration
  };

  return (
    <div className="h-screen bg-dark-navy text-light-gray font-sans flex flex-col">
      {/* Top Navigation */}
      <nav className="safe-area-top bg-dark-navy/95 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div>
          <h1 className="text-lg font-semibold text-white">Hello, hasanjabrot</h1>
          <p className="text-sm text-slate-300">Your AI Stylist</p>
        </div>
        <button 
          onClick={() => handleFeatureClick('Profile')}
          className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center active:scale-95 transition-transform shadow-lg"
        >
          <User className="w-6 h-6 text-electric-cyan" />
        </button>
      </nav>

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto ${activeTab === 'explore' ? '' : 'px-4'}`}>
        {activeTab === 'home' && (
          <div className="space-y-6 pt-6 pb-32 fade-in">
            {/* Weather & Location Card - Serial Position Effect: First item */}
            <div className="card bg-gradient-to-r from-slate-800/60 to-slate-700/40">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Cloud className="w-5 h-5 text-electric-cyan" />
                    <span className="text-sm font-medium text-slate-300">{weather.location}</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{weather.temp}°C</p>
                  <p className="text-sm text-slate-400">{weather.condition} • Perfect for layering</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Today</p>
                  <p className="text-sm font-medium">9/23/2025</p>
                </div>
              </div>
            </div>

            {/* Premium Streak & Check-in Card - Ultra-Compact Mobile Design */}
            <div className="card bg-gradient-to-br from-slate-900/95 via-indigo-900/20 to-slate-900/95 border border-amber-400/30 backdrop-blur-sm shadow-2xl shadow-amber-500/5 relative overflow-hidden transition-all duration-300">
              {/* Subtle Premium Background Effects - Reduced for small screens */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/3 via-transparent to-gold-500/3"></div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-400/8 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-indigo-500/5 to-transparent rounded-full translate-y-6 -translate-x-6"></div>
              
              <div className="relative z-10 p-2 xs:p-3 sm:p-5">
                {/* Header Section - Ultra-Compact */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-500/25 to-yellow-600/25 flex items-center justify-center shadow-lg shadow-amber-500/15 border border-amber-400/20 animate-pulse">
                    <Diamond className="w-4 h-4 xs:w-5 xs:h-5 sm:w-7 sm:h-7 text-amber-400 drop-shadow-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-shrink">
                        <p className="text-xs font-semibold text-white truncate">Loyal Member</p>
                        <p className="text-xs text-slate-400 truncate">Since {streakData.loyalUserSince ? new Date(streakData.loyalUserSince).toLocaleDateString('en-GB') : ''}</p>
                      </div>
                      {/* Streak Display - Ultra-Compact */}
                      <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 rounded-lg px-2 py-1 xs:px-3 xs:py-2 border border-slate-600/40 shadow-inner flex-shrink-0">
                        <div className="flex items-center space-x-1 justify-center">
                          <Flame className="w-2 h-2 xs:w-3 xs:h-3 text-orange-400 animate-bounce" />
                          <p className="text-sm xs:text-lg font-bold text-amber-400">{streakData.currentStreak}</p>
                        </div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider text-center">Streak</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Milestone Progress Section - Ultra-Compact */}
                <div className="space-y-2 xs:space-y-3 mb-3 xs:mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 xs:space-x-2">
                      <Target className="w-3 h-3 xs:w-4 xs:h-4 text-amber-400" />
                      <p className="text-xs xs:text-sm font-medium text-slate-300">Progress</p>
                    </div>
                    <p className="text-xs xs:text-sm font-semibold text-amber-400">
                      {streakData.currentStreak >= 40 ? 'MAX ✨' : `${streakData.currentStreak}/40`}
                    </p>
                  </div>
                  
                  {/* Compact Progress Bar */}
                  <div className="relative pb-6 xs:pb-7">
                    {/* Progress Bar Track - Smaller */}
                    <div className="relative w-full h-3 xs:h-4 bg-gradient-to-r from-slate-900/80 via-slate-800/70 to-slate-900/80 rounded-full overflow-visible border border-slate-600/30 shadow-lg backdrop-blur-sm">
                      {/* Inner Track Shadow */}
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-700/20 to-transparent rounded-full"></div>
                      
                      {/* Progress Fill - Compact Design */}
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500/90 via-yellow-400/90 to-amber-400/90 rounded-full shadow-lg relative transition-all duration-1000 ease-out overflow-hidden"
                        style={{ width: `${Math.min((streakData.currentStreak / 40) * 100, 100)}%` }}
                      >
                        {/* Subtle Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-full"></div>
                        {/* Inner Highlight */}
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-yellow-200/40 to-transparent rounded-full"></div>
                      </div>
                      
                      {/* Milestone Markers - Ultra Subtle */}
                        {[7, 14, 28, 40].map((milestone, index) => {
                          const position = (milestone / 40) * 100;
                          const isReached = streakData.currentStreak >= milestone;
                          const isLoyaltyBadge = milestone === 40;
                          
                          return (
                            <div
                              key={milestone}
                              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-200 z-20 group"
                              style={{ left: `${position}%` }}
                            >
                              {/* Milestone Marker - Even More Subtle */}
                              <div className={`relative w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3 sm:h-3 rounded-full flex items-center justify-center transition-all duration-200 ${
                                isReached 
                                  ? isLoyaltyBadge 
                                    ? 'bg-amber-50/60 border border-amber-100/30' 
                                    : 'bg-emerald-50/60 border border-emerald-100/30'
                                  : 'bg-slate-50/50 border border-slate-100/20'
                              }`}>
                                
                                {/* Even Smaller Icons */}
                                {isReached ? (
                                  isLoyaltyBadge ? (
                                    <Crown className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-1.5 sm:h-1.5 text-amber-400/50 z-10 transition-colors duration-200" />
                                  ) : (
                                    <CheckCircle className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-1.5 sm:h-1.5 text-emerald-400/50 z-10 transition-colors duration-200" />
                                  )
                                ) : (
                                  <div className="w-0.5 h-0.5 xs:w-1 xs:h-1 sm:w-1 sm:h-1 bg-slate-300/30 rounded-full z-10 transition-colors duration-200"></div>
                                )}
                              </div>
                              
                              {/* Static Gray Labels */}
                              <div className="absolute top-4 xs:top-4.5 sm:top-4.5 left-1/2 -translate-x-1/2 text-center opacity-50">
                                <div className="px-0.5 py-0.5 rounded">
                                  <p className="text-xs font-light whitespace-nowrap text-gray-400">
                                    {milestone}d
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Daily Check-in Button - Ultra-Compact */}
                <div className="mt-6 xs:mt-8">
                  <button
                    onClick={() => setCheckinModal({ isOpen: true })}
                    className="w-full py-2 xs:py-3 px-3 xs:px-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-semibold rounded-lg xs:rounded-xl shadow-lg shadow-amber-500/25 border border-amber-400/50 transition-all duration-200 active:scale-95 flex items-center justify-center space-x-2 touch-manipulation"
                  >
                    <Zap className="w-3 h-3 xs:w-4 xs:h-4" />
                    <span className="text-xs xs:text-sm sm:text-base">Check-in</span>
                    {!getCheckinStatus(userData.lastCheckinDate).alreadyCheckedIn && (
                      <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </button>
                </div>

                {/* Status Indicator - Ultra-Compact */}
                <div className="flex items-center justify-center mt-2 xs:mt-3 space-x-1 xs:space-x-2">
                  {getCheckinStatus(userData.lastCheckinDate).alreadyCheckedIn ? (
                    <>
                      <CheckCircle className="w-3 h-3 xs:w-4 xs:h-4 text-emerald-400" />
                      <span className="text-xs text-emerald-400 font-medium">Checked in ✓</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-amber-400 font-medium">Ready to check in</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Primary Features - Cognitive Fluency: Clear, familiar actions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">AI Styling</h2>
                {streakData.isLoyalUser && (
                  <span className="bg-gradient-to-r from-yellow-400 to-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>PREMIUM</span>
                  </span>
                )}
              </div>
              
              {/* Exclusive Loyal User Features */}
              {streakData.isLoyalUser && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wide">Exclusive Features</h3>
                  
                  {/* Priority Style Consultation */}
                  <button 
                    onClick={() => handleFeatureClick('Priority Style Consultation')}
                    className="w-full card bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-purple-400/40 active:scale-95"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-purple-500/30 rounded-2xl flex items-center justify-center">
                        <User className="w-8 h-8 text-purple-400" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-white text-lg">Priority Style Consultation</h3>
                        <p className="text-slate-300 text-sm">Skip the queue - instant expert advice</p>
                      <div className="flex items-start space-x-2 mt-2">
                         <TrendingUp className="w-6 h-6 text-purple-400 mt-1" />
                         <span className="text-xs text-purple-300">24/7 priority support</span>
                       </div>
                      </div>
                    </div>
                  </button>


                </div>
              )}
              
              {/* Regular Features */}
              <div className="space-y-3">
                {!streakData.isLoyalUser && <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Standard Features</h3>}
                
                {/* Closet Recommendations - Serial Position: Primary position */}
                <button 
                  onClick={() => handleFeatureClick('Closet Recommendations')}
                  className="w-full card bg-gradient-to-r from-electric-cyan/10 to-electric-cyan/5 border-electric-cyan/30 active:scale-95"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-electric-cyan/20 rounded-2xl flex items-center justify-center">
                      <Shirt className="w-8 h-8 text-electric-cyan" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-white text-lg">Style My Closet</h3>
                      <p className="text-slate-300 text-sm">Get outfit recommendations from your wardrobe</p>
                      <div className="flex items-start space-x-2 mt-2">
                         <Sparkles className="w-6 h-6 text-electric-cyan mt-1" />
                         <span className="text-xs text-slate-400">AI-powered & personalized for you</span>
                       </div>
                    </div>
                  </div>
                </button>

                {/* Shopping Recommendations */}
                <button 
                  onClick={() => handleFeatureClick('Shopping Recommendations')}
                  className="w-full card bg-gradient-to-r from-hot-pink/10 to-hot-pink/5 border-hot-pink/30 active:scale-95"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-hot-pink/20 rounded-2xl flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-hot-pink" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-white text-lg">Shop Smart</h3>
                      <p className="text-slate-300 text-sm">AI-curated pieces to complete your style</p>
                      <div className="flex items-start space-x-2 mt-2">
                         <TrendingUp className="w-6 h-6 text-hot-pink mt-1" />
                         <span className="text-xs text-slate-400">Trending in your city: +47% this week</span>
                       </div>
                    </div>
                  </div>
                </button>

                {/* AI Chatbot - Talk with different AI stylists */}
                <button 
                  onClick={() => handleFeatureClick('AI Chatbot')}
                  className="w-full card bg-gradient-to-r from-purple-500/10 to-indigo-500/5 border-purple-400/30 active:scale-95"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-purple-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-white text-lg">AI Style Chat</h3>
                      <p className="text-slate-300 text-sm">Chat with different AI stylists for personalized advice</p>
                      <div className="flex items-start space-x-2 mt-2">
                         <Bot className="w-5 h-5 text-purple-400 mt-1" />
                         <span className="text-xs text-slate-400">Multiple AI personalities available</span>
                       </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Social Proof - Real-time activity */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-electric-cyan" />
                <span>Style Community</span>
              </h3>
              {socialActivity.map((activity, index) => (
                <div key={index} className="card bg-slate-800/30 border-slate-600/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-sm text-slate-300">
                        <span className="font-medium text-white">{activity.name}</span> {activity.action}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 flex-shrink-0 ml-3">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recently Added Items - Endowment Effect */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Your Wardrobe</h3>
                <button 
                  onClick={() => handleFeatureClick('Add Item')}
                  className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center active:scale-95"
                >
                  <Plus className="w-4 h-4 text-electric-cyan" />
                </button>
              </div>
              <div className="flex space-x-4 overflow-x-auto pb-2">
                <div className="flex-shrink-0 w-20 h-20 bg-slate-700/50 rounded-xl border-2 border-dashed border-slate-600 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-slate-500" />
                </div>
                <div className="flex-shrink-0 w-20 h-20 bg-slate-700 rounded-xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                    <Shirt className="w-8 h-8 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Check-in Milestones */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Flame className="w-5 h-5 text-pink-400" />
                <span>Daily Check-in Milestones</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {/* 7-Day Milestone */}
                <div className={`card text-center transition-all duration-300 ${
                  streakData.currentStreak >= 7 
                    ? 'bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-pink-400/30' 
                    : 'bg-slate-800/50 border-slate-600/30'
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    streakData.currentStreak >= 7 
                      ? 'bg-pink-500/30' 
                      : 'bg-slate-600/30'
                  }`}>
                    <Trophy className={`w-6 h-6 ${
                      streakData.currentStreak >= 7 
                        ? 'text-pink-400' 
                        : 'text-slate-400'
                    }`} />
                  </div>
                  <h4 className="font-semibold text-white text-sm">7 Days</h4>
                  <p className={`text-xs ${
                    streakData.currentStreak >= 7 
                      ? 'text-pink-300' 
                      : 'text-slate-400'
                  }`}>
                    {streakData.currentStreak >= 7 ? '✓ 200 Style Creds' : '200 Style Creds'}
                  </p>
                </div>

                {/* 14-Day Milestone */}
                <div className={`card text-center transition-all duration-300 ${
                  streakData.currentStreak >= 14 
                    ? 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-400/30' 
                    : 'bg-slate-800/50 border-slate-600/30'
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    streakData.currentStreak >= 14 
                      ? 'bg-purple-500/30' 
                      : 'bg-slate-600/30'
                  }`}>
                    <Star className={`w-6 h-6 ${
                      streakData.currentStreak >= 14 
                        ? 'text-purple-400' 
                        : 'text-slate-400'
                    }`} />
                  </div>
                  <h4 className="font-semibold text-white text-sm">14 Days</h4>
                  <p className={`text-xs ${
                    streakData.currentStreak >= 14 
                      ? 'text-purple-300' 
                      : 'text-slate-400'
                  }`}>
                    {streakData.currentStreak >= 14 ? '✓ 250 Style Creds' : '250 Style Creds'}
                  </p>
                </div>

                {/* 28-Day Milestone */}
                <div className={`card text-center transition-all duration-300 ${
                  streakData.currentStreak >= 28 
                    ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-400/30' 
                    : 'bg-slate-800/50 border-slate-600/30'
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    streakData.currentStreak >= 28 
                      ? 'bg-amber-500/30' 
                      : 'bg-slate-600/30'
                  }`}>
                    <Star className={`w-6 h-6 ${
                      streakData.currentStreak >= 28 
                        ? 'text-amber-400' 
                        : 'text-slate-400'
                    }`} />
                  </div>
                  <h4 className="font-semibold text-white text-sm">28 Days</h4>
                  <p className={`text-xs ${
                    streakData.currentStreak >= 28 
                      ? 'text-amber-300' 
                      : 'text-slate-400'
                  }`}>
                    {streakData.currentStreak >= 28 ? '✓ 300 Style Creds' : '300 Style Creds'}
                  </p>
                </div>

                {/* 40-Day Loyalty Badge */}
                <div className={`card text-center transition-all duration-300 ${
                  streakData.currentStreak >= 40 
                    ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-400/30' 
                    : 'bg-slate-800/50 border-slate-600/30'
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    streakData.currentStreak >= 40 
                      ? 'bg-yellow-500/30' 
                      : 'bg-slate-600/30'
                  }`}>
                    <Crown className={`w-6 h-6 ${
                      streakData.currentStreak >= 40 
                        ? 'text-yellow-400' 
                        : 'text-slate-400'
                    }`} />
                  </div>
                  <h4 className="font-semibold text-white text-sm">40 Days</h4>
                  <p className={`text-xs ${
                    streakData.currentStreak >= 40 
                      ? 'text-yellow-300' 
                      : 'text-slate-400'
                  }`}>
                    {streakData.currentStreak >= 40 ? '✓ Loyalty Badge' : 'Loyalty Badge'}
                  </p>
                </div>
              </div>

              {/* Current Progress */}
              <div className="card bg-gradient-to-r from-slate-800/60 to-slate-700/40">
                <h4 className="font-semibold text-white mb-3">Current Progress</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Current Streak</span>
                    <span className="text-pink-400 font-bold">{userData.currentStreak} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Style Creds</span>
                    <span className="text-cyan-400 font-bold">{formatStyleCreds(userData.styleCreds)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Total Check-ins</span>
                    <span className="text-emerald-400 font-bold">{userData.totalCheckins}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Loyalty Rewards & Achievements */}
            {streakData.isLoyalUser && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span>Your Achievements</span>
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Loyal User Badge */}
                  <div className="card bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-400/30 text-center">
                    <div className="w-12 h-12 bg-yellow-500/30 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Award className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h4 className="font-semibold text-white text-sm">Loyal User</h4>
                    <p className="text-xs text-yellow-300">Premium member</p>
                  </div>

                  {/* Style Master Badge */}
                  <div className="card bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-400/30 text-center">
                    <div className="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                    </div>
                    <h4 className="font-semibold text-white text-sm">Style Master</h4>
                    <p className="text-xs text-purple-300">Premium unlocked</p>
                  </div>

                  {/* Trendsetter Badge */}
                  <div className="card bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-400/30 text-center">
                    <div className="w-12 h-12 bg-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h4 className="font-semibold text-white text-sm">Trendsetter</h4>
                    <p className="text-xs text-emerald-300">Style influencer</p>
                  </div>

                  {/* Community Leader Badge */}
                  <div className="card bg-gradient-to-br from-rose-500/20 to-pink-500/20 border-rose-400/30 text-center">
                    <div className="w-12 h-12 bg-rose-500/30 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-rose-400" />
                    </div>
                    <h4 className="font-semibold text-white text-sm">Community Leader</h4>
                    <p className="text-xs text-rose-300">Inspiring others</p>
                  </div>
                </div>

                {/* Loyalty Stats */}
                <div className="card bg-gradient-to-r from-slate-800/60 to-slate-700/40">
                  <h4 className="font-semibold text-white mb-3">Loyalty Stats</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-yellow-400">{streakData.totalDays}</p>
                      <p className="text-xs text-slate-400">Total Days</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-400">{streakData.currentStreak}</p>
                      <p className="text-xs text-slate-400">Current Streak</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-400">
                        {streakData.loyalUserSince ? Math.floor((new Date() - new Date(streakData.loyalUserSince)) / (1000 * 60 * 60 * 24)) : 0}
                      </p>
                      <p className="text-xs text-slate-400">Days as Loyal</p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Suggestion for Tomorrow - Loss Aversion: Don't miss out */}
            <div className="card bg-gradient-to-br from-purple-900/30 via-indigo-900/20 to-blue-900/30 border-purple-400/40 shadow-xl shadow-purple-900/20 backdrop-blur-sm transition-all duration-300 group">
              <div className="flex flex-col items-center justify-between text-center min-h-[160px] sm:min-h-[180px] md:min-h-[200px] p-6 sm:p-8">
                <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300">
                    <Cloud className="w-6 h-6 sm:w-8 sm:h-8 text-purple-300 transition-colors duration-300" />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-tight transition-colors duration-300">Tomorrow's Weather Alert</h3>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xs mx-auto px-2 sm:px-0 transition-colors duration-300">
                      Rain expected • Don't miss the perfect outfit combo
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleFeatureClick('Plan Tomorrow')}
                  className="btn-primary w-full max-w-xs transition-all duration-200 mt-4 sm:mt-0 shadow-lg"
                >
                  Plan My Outfit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Other tab contents would go here */}
        {activeTab === 'calendar' && (
          <div className="pt-6 pb-32">
            <GoogleCalendar />
          </div>
        )}
        
        {activeTab === 'explore' && (
          <ChatSystem />
        )}
        
        {activeTab !== 'home' && activeTab !== 'calendar' && activeTab !== 'explore' && (
          <div className="pt-6 pb-32 text-center">
            <h2 className="text-xl font-bold text-white mb-4">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Feature
            </h2>
            <p className="text-slate-300">This feature is ready for integration!</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation - Improved spacing and organization */}
      <nav className="fixed bottom-0 left-0 right-0 safe-area-bottom bg-dark-navy/95 backdrop-blur-sm border-t border-slate-700/50 px-4 py-2">
        {/* Style Creds Display - Hidden when in chat mode */}
        {activeTab !== 'explore' && (
          <div className="flex justify-center items-center mb-2">
            <div className="bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border border-cyan-500/30 rounded-full px-4 py-1 flex items-center space-x-2">
              <Coins className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 font-semibold text-sm">
                {formatStyleCreds(userData.styleCreds)} Style Creds
              </span>
            </div>
          </div>
        )}
        
        <div className="flex justify-center items-center max-w-md mx-auto">
          <button 
            onClick={() => handleTabClick('home')}
            className={`nav-item nav-item-edge-left nav-item-blue ${activeTab === 'home' ? 'text-electric-cyan' : 'text-slate-400'}`}
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button 
            onClick={() => handleTabClick('closet')}
            className={`nav-item nav-item-center nav-item-pink ${activeTab === 'closet' ? 'text-hot-pink' : 'text-slate-400'}`}
          >
            <Shirt className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Closet</span>
          </button>
          
          <button 
            onClick={() => handleTabClick('explore')}
            className={`nav-item nav-item-center nav-item-blue ${activeTab === 'explore' ? 'text-electric-cyan' : 'text-slate-400'}`}
          >
            <MessageCircle className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Chat</span>
          </button>
          
          <button 
            onClick={() => handleTabClick('shop')}
            className={`nav-item nav-item-center nav-item-pink ${activeTab === 'shop' ? 'text-hot-pink' : 'text-slate-400'}`}
          >
            <ShoppingBag className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Shop</span>
          </button>
          
          <button 
            onClick={() => handleTabClick('calendar')}
            className={`nav-item nav-item-edge-right nav-item-blue ${activeTab === 'calendar' ? 'text-electric-cyan' : 'text-slate-400'}`}
          >
            <Calendar className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Calendar</span>
          </button>
        </div>
      </nav>

      {/* Daily Check-in Modal */}
      <DailyCheckin
        isOpen={checkinModal.isOpen}
        onClose={() => setCheckinModal({ isOpen: false, rewardInfo: null })}
        onRewardClaimed={() => {
          // Additional logic can be added here if needed
        }}
        currentStreak={checkinModal.rewardInfo?.currentStreak || userData.currentStreak}
        milestoneReward={checkinModal.rewardInfo?.milestoneReward || 0}
        isMilestone={checkinModal.rewardInfo?.isMilestone || false}
        milestoneType={checkinModal.rewardInfo?.milestoneType || 'none'}
        nextMilestone={checkinModal.rewardInfo?.nextMilestone || null}
      />
    </div>
  );
}

export default CalApp;