// This file creates the ChatSystem component - an AI-powered chat interface for fashion advice
// It allows users to talk to different AI fashion assistants, each with unique personalities
// Think of it as having multiple fashion experts available 24/7 to help with style questions

// Import React - the main library for building user interfaces
import React, { useState, useEffect, useRef } from 'react';

// Import icons from Lucide React - these are small pictures/symbols used in the interface
import { Send, ArrowLeft, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

// Import custom bot icon component from another file
import { LoomIcon } from './BotIcons';
import { API_ROUTES } from '../app_modules/apiRoutes';

// Main ChatSystem component - this creates the entire chat interface
const ChatSystem = () => {
  
  // State variables - these store information that can change over time
  // Think of them as the chat system's memory for different things
  
  const [selectedBot, setSelectedBot] = useState(null);        // Which AI assistant is currently selected
  const [messages, setMessages] = useState([]);               // All chat messages in the conversation
  const [inputMessage, setInputMessage] = useState('');       // What the user is currently typing
  const [isTyping, setIsTyping] = useState(false);           // Whether the AI is currently "typing" a response
  const [currentSlide, setCurrentSlide] = useState(0);       // Which bot is currently shown in the carousel
  
  // Refs - these are like bookmarks to specific parts of the interface
  const messagesEndRef = useRef(null);  // Points to the bottom of the chat messages
  const carouselRef = useRef(null);     // Points to the bot selection carousel

  // Array of AI fashion assistants - each has a unique personality and visual style
  // This is like having different fashion experts with different specialties
  const bots = [
    {
      // Elara - The elegant and sophisticated fashion advisor
      id: 0,
      name: 'Elara',                                          // The AI assistant's name
      personality: ['Timeless', 'Poetic', 'Discerning'],     // Her key personality traits
      description: 'Elegant wisdom meets modern style.',      // Brief description of her expertise
      
      // Custom visual design (avatar) - this creates a unique icon for Elara
      avatar: (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* Background circle with ivory parchment color */}
          <circle cx="32" cy="32" r="30" fill="#FDF6E3" stroke="#C0B283" strokeWidth="2"/>
          
          {/* Abstract geometric pattern representing wisdom and elegance */}
          <g transform="translate(32,32)">
            {/* Central diamond - representing discernment and focus */}
            <path d="M0,-12 L8,0 L0,12 L-8,0 Z" fill="#800020" opacity="0.8"/>
            
            {/* Surrounding arcs - representing timeless flow and grace */}
            <path d="M-15,-8 Q-10,-15 -5,-8" stroke="#C0B283" strokeWidth="2" fill="none"/>
            <path d="M5,-8 Q10,-15 15,-8" stroke="#C0B283" strokeWidth="2" fill="none"/>
            <path d="M-15,8 Q-10,15 -5,8" stroke="#C0B283" strokeWidth="2" fill="none"/>
            <path d="M5,8 Q10,15 15,8" stroke="#C0B283" strokeWidth="2" fill="none"/>
            
            {/* Delicate dots - representing poetry and refinement */}
            <circle cx="-12" cy="0" r="1.5" fill="#800020"/>
            <circle cx="12" cy="0" r="1.5" fill="#800020"/>
            <circle cx="0" cy="-18" r="1" fill="#C0B283"/>
            <circle cx="0" cy="18" r="1" fill="#C0B283"/>
          </g>
        </svg>
      ),
      
      // Color scheme for Elara's chat interface - warm, elegant tones
      accentColor: 'bg-gradient-to-br from-amber-100/90 to-amber-50',  // Background gradient
       textColor: 'text-slate-700',                                  // Text color
      bgColor: 'bg-gradient-to-br from-amber-50/90 to-stone-50/90', // Chat bubble background
      borderColor: 'border-amber-200/60',                           // Border color
      shadowColor: 'shadow-amber-100/50'                            // Shadow effect
    },
    {
      // Loom - The creative and collaborative fashion advisor
      id: 1,
      name: 'Loom',                                               // The AI assistant's name
      personality: ['Imaginative', 'Collaborative', 'Resourceful'], // Her key personality traits
      description: 'Creative brainstorming meets practical style.',  // Brief description of her expertise
      avatar: <LoomIcon className="w-full h-full" />,             // Uses a custom icon component
      
      // Color scheme for Loom's chat interface - creative, warm tones
      accentColor: 'bg-gradient-to-br from-orange-400 to-red-400',
       textColor: 'text-slate-700',
      bgColor: 'bg-gradient-to-br from-gray-50/95 to-orange-50/90',
      borderColor: 'border-teal-300/60',
      shadowColor: 'shadow-orange-200/50'
    },
    {
      // Jax - The urban and street-style fashion advisor
      id: 2,
      name: 'Jax',                                                // The AI assistant's name
      personality: ['Cultural', 'Current', 'Authentic'],         // His key personality traits
      description: 'Urban style meets street authenticity.',      // Brief description of his expertise
      
      // Custom visual design (avatar) - this creates a unique icon for Jax with urban elements
      avatar: (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* Background circle with street black color */}
          <circle cx="32" cy="32" r="30" fill="#121212" stroke="#FF5F00" strokeWidth="2"/>
          
          {/* Abstract urban pattern representing street culture and authenticity */}
          <g transform="translate(32,32)">
            {/* Central hexagon - representing authenticity and structure */}
            <path d="M-8,-14 L8,-14 L16,0 L8,14 L-8,14 L-16,0 Z" 
                  stroke="#FF5F00" strokeWidth="2" fill="none" opacity="0.9"/>
            
            {/* Intersecting lines - representing cultural connections and community */}
            <line x1="-20" y1="-10" x2="20" y2="10" stroke="#737373" strokeWidth="2" opacity="0.7"/>
            <line x1="-20" y1="10" x2="20" y2="-10" stroke="#737373" strokeWidth="2" opacity="0.7"/>
            
            {/* Corner accents - representing current trends and street energy */}
            <rect x="-22" y="-22" width="4" height="4" fill="#FF5F00" transform="rotate(45)"/>
            <rect x="18" y="-22" width="4" height="4" fill="#FF5F00" transform="rotate(45)"/>
            <rect x="-22" y="18" width="4" height="4" fill="#FF5F00" transform="rotate(45)"/>
            <rect x="18" y="18" width="4" height="4" fill="#FF5F00" transform="rotate(45)"/>
            
            {/* Central dot cluster - representing urban energy and community */}
            <circle cx="0" cy="0" r="2" fill="#FFFFFF"/>
            <circle cx="-6" cy="0" r="1" fill="#737373"/>
            <circle cx="6" cy="0" r="1" fill="#737373"/>
            <circle cx="0" cy="-6" r="1" fill="#737373"/>
            <circle cx="0" cy="6" r="1" fill="#737373"/>
          </g>
        </svg>
      ),
      
      // Color scheme for Jax's chat interface - bold, urban colors
      accentColor: 'bg-gradient-to-br from-orange-500 to-red-600',
       textColor: 'text-white',
      bgColor: 'bg-gradient-to-br from-gray-900/95 to-black/90',
      borderColor: 'border-orange-500/60',
      shadowColor: 'shadow-orange-600/30'
    },
    {
      // Sage - The sustainable and mindful fashion advisor
      id: 3,
      name: 'Sage',                                               // The AI assistant's name
      personality: ['Mindful', 'Ethical', 'Intentional'],        // Her key personality traits
      description: 'Sustainable style with conscious choices.',   // Brief description of her expertise
      
      // Custom visual design (avatar) - this creates a unique icon for Sage with nature elements
      avatar: (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* Background circle with oat milk color - representing natural, sustainable materials */}
          <circle cx="32" cy="32" r="30" fill="#F3EBE1" stroke="#9DC183" strokeWidth="2"/>
          
          {/* Abstract nature pattern representing mindful sustainability and ethical choices */}
          <g transform="translate(32,32)">
            {/* Central leaf pattern - representing ethical choices and natural materials */}
            <path d="M0,-15 Q-8,-10 -6,-2 Q-4,6 0,8 Q4,6 6,-2 Q8,-10 0,-15" 
                  fill="#9DC183" opacity="0.9"/>
            <path d="M0,-15 Q8,-10 6,-2 Q4,6 0,8 Q-4,6 -6,-2 Q-8,-10 0,-15" 
                  fill="#E2725B" opacity="0.7"/>
            
            {/* Surrounding growth rings - representing intentional living and mindful choices */}
            <circle cx="0" cy="0" r="18" stroke="#9DC183" strokeWidth="1.5" fill="none" opacity="0.6"/>
            <circle cx="0" cy="0" r="12" stroke="#E2725B" strokeWidth="1" fill="none" opacity="0.5"/>
            
            {/* Mindful dots - representing conscious awareness and thoughtful decisions */}
            <circle cx="-12" cy="-8" r="1.5" fill="#5C4033"/>
            <circle cx="12" cy="-8" r="1.5" fill="#5C4033"/>
            <circle cx="-8" cy="12" r="1.5" fill="#5C4033"/>
            <circle cx="8" cy="12" r="1.5" fill="#5C4033"/>
            
            {/* Central grounding element */}
            <circle cx="0" cy="0" r="3" fill="#5C4033" opacity="0.8"/>
            <circle cx="0" cy="0" r="1.5" fill="#F3EBE1"/>
          </g>
        </svg>
      ),
      // Color scheme for Sage - earthy and natural tones
      accentColor: 'bg-gradient-to-br from-green-400 to-orange-400',
       textColor: 'text-amber-900',
      bgColor: 'bg-gradient-to-br from-stone-100/95 to-orange-50/90',
      borderColor: 'border-green-300/60',
      shadowColor: 'shadow-green-200/50'
    },
    {
      // Fourth AI assistant - Flare (Glamorous and Dramatic)
      id: 4,
      name: 'Flare',
      personality: ['Exuberant', 'Dramatic', 'Celebratory'],
      description: 'Red carpet glamour meets bold expression.',
      // Custom SVG avatar for Flare - theatrical and glamorous design
      avatar: (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* Background circle with velvet black */}
          <circle cx="32" cy="32" r="30" fill="#191919" stroke="#C71585" strokeWidth="2"/>
          
          {/* Abstract theatrical pattern representing glamour and celebration */}
          <g transform="translate(32,32)">
            {/* Central starburst - representing exuberant energy */}
            <g>
              <path d="M0,-18 L3,-6 L0,0 L-3,-6 Z" fill="#FFD700" opacity="0.9"/>
              <path d="M18,0 L6,3 L0,0 L6,-3 Z" fill="#FFD700" opacity="0.9"/>
              <path d="M0,18 L-3,6 L0,0 L3,6 Z" fill="#FFD700" opacity="0.9"/>
              <path d="M-18,0 L-6,-3 L0,0 L-6,3 Z" fill="#FFD700" opacity="0.9"/>
              
              {/* Diagonal rays */}
              <path d="M12,-12 L6,-6 L0,0 L-6,-6 Z" fill="#C71585" opacity="0.8"/>
              <path d="M12,12 L6,6 L0,0 L6,-6 Z" fill="#C71585" opacity="0.8"/>
              <path d="M-12,12 L-6,6 L0,0 L-6,-6 Z" fill="#C71585" opacity="0.8"/>
              <path d="M-12,-12 L-6,-6 L0,0 L6,-6 Z" fill="#C71585" opacity="0.8"/>
            </g>
            
            {/* Dramatic arcs - representing theatrical flair */}
            <path d="M-20,-10 Q-15,-20 -10,-10" stroke="#3B1E57" strokeWidth="2.5" fill="none" opacity="0.7"/>
            <path d="M10,-10 Q15,-20 20,-10" stroke="#3B1E57" strokeWidth="2.5" fill="none" opacity="0.7"/>
            <path d="M-20,10 Q-15,20 -10,10" stroke="#3B1E57" strokeWidth="2.5" fill="none" opacity="0.7"/>
            <path d="M10,10 Q15,20 20,10" stroke="#3B1E57" strokeWidth="2.5" fill="none" opacity="0.7"/>
            
            {/* Celebratory sparkles */}
            <circle cx="-15" cy="-15" r="2" fill="#FFD700"/>
            <circle cx="15" cy="-15" r="2" fill="#FFD700"/>
            <circle cx="-15" cy="15" r="2" fill="#FFD700"/>
            <circle cx="15" cy="15" r="2" fill="#FFD700"/>
            
            {/* Central dramatic core */}
            <circle cx="0" cy="0" r="4" fill="#C71585" opacity="0.9"/>
            <circle cx="0" cy="0" r="2" fill="#FFD700"/>
          </g>
        </svg>
      ),
      // Color scheme for Flare - dramatic and glamorous colors
      accentColor: 'bg-gradient-to-br from-pink-600 to-purple-800',
       textColor: 'text-yellow-300',
      bgColor: 'bg-gradient-to-br from-gray-900/95 to-purple-900/90',
      borderColor: 'border-pink-500/60',
      shadowColor: 'shadow-pink-600/50'
    },
    {
      // Fifth AI assistant - Coda (Technical and Systematic)
      id: 5,
      name: 'Coda',
      personality: ['Logical', 'Efficient', 'Systematic'],
      description: 'Technical precision meets style.',
      // Custom SVG avatar for Coda - technical and systematic design
      avatar: (
        <svg viewBox="-20 -20 40 40" className="w-full h-full">
          <defs>
            <linearGradient id="codaBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F0F2F5"/>
              <stop offset="100%" stopColor="#E8EAED"/>
            </linearGradient>
            <linearGradient id="codaAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#007BFF"/>
              <stop offset="100%" stopColor="#0056CC"/>
            </linearGradient>
          </defs>
          
          {/* Background circle */}
          <circle cx="0" cy="0" r="18" fill="url(#codaBg)" stroke="#A9A9A9" strokeWidth="1"/>
          
          {/* Technical grid pattern - representing systematic approach */}
          <g stroke="#A9A9A9" strokeWidth="0.5" opacity="0.4">
            {/* Horizontal grid lines - representing organized structure */}
            <line x1="-12" y1="-12" x2="12" y2="-12"/>
            <line x1="-12" y1="0" x2="12" y2="0"/>
            <line x1="-12" y1="12" x2="12" y2="12"/>
            {/* Vertical grid lines - representing systematic organization */}
            <line x1="-12" y1="-12" x2="-12" y2="12"/>
            <line x1="0" y1="-12" x2="0" y2="12"/>
            <line x1="12" y1="-12" x2="12" y2="12"/>
          </g>
          
          {/* Central systematic symbol - representing logical and efficient approach */}
          <g fill="url(#codaAccent)">
            {/* Main hexagon for systematic structure - representing organized methodology */}
            <polygon points="0,-8 7,-4 7,4 0,8 -7,4 -7,-4" fill="url(#codaAccent)" opacity="0.8"/>
            
            {/* Inner efficiency arrows - representing streamlined processes */}
            <polygon points="0,-4 3,-1 0,2 -3,-1" fill="#F0F2F5"/>
            
            {/* Logic nodes - representing systematic thinking and connections */}
            <circle cx="-10" cy="-6" r="2" fill="url(#codaAccent)" opacity="0.9"/>
            <circle cx="10" cy="-6" r="2" fill="url(#codaAccent)" opacity="0.9"/>
            <circle cx="-10" cy="6" r="2" fill="url(#codaAccent)" opacity="0.9"/>
            <circle cx="10" cy="6" r="2" fill="url(#codaAccent)" opacity="0.9"/>
            
            {/* Connection lines for systematic approach - linking logical elements */}
            <line x1="-8" y1="-6" x2="-7" y2="-4" stroke="url(#codaAccent)" strokeWidth="1.5" opacity="0.6"/>
            <line x1="8" y1="-6" x2="7" y2="-4" stroke="url(#codaAccent)" strokeWidth="1.5" opacity="0.6"/>
            <line x1="-8" y1="6" x2="-7" y2="4" stroke="url(#codaAccent)" strokeWidth="1.5" opacity="0.6"/>
            <line x1="8" y1="6" x2="7" y2="4" stroke="url(#codaAccent)" strokeWidth="1.5" opacity="0.6"/>
          </g>
        </svg>
      ),
      // Color scheme for Coda - professional and technical colors
      accentColor: 'bg-gradient-to-br from-blue-600 to-blue-700',
       textColor: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-gray-50/95 to-blue-50/90',
      borderColor: 'border-blue-400/60',
      shadowColor: 'shadow-blue-500/30'
    }
  ];

  // Function to automatically scroll the chat to the bottom when new messages arrive
  // This ensures users always see the latest message without manual scrolling
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Automatically scroll to bottom whenever new messages are added
  // This creates a smooth user experience in the chat interface
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to move to the next AI assistant in the carousel
  // Cycles through all available bots in a continuous loop
  const nextSlide = () => {
    const newIndex = (currentSlide + 1) % bots.length;
    goToSlide(newIndex);
  };

  // Function to move to the previous AI assistant in the carousel
  // Allows users to navigate backwards through the bot selection
  const prevSlide = () => {
    const newIndex = (currentSlide - 1 + bots.length) % bots.length;
    goToSlide(newIndex);
  };

  // Function to jump directly to a specific AI assistant
  // Also handles smooth scrolling animation to center the selected bot
  const goToSlide = (index) => {
    setCurrentSlide(index);
    
    // Scroll to the selected item with smooth animation
    // This centers the chosen bot in the carousel view
    const carousel = carouselRef.current;
    if (carousel) {
      const targetItem = carousel.children[index];
      if (targetItem) {
        // Calculate the scroll position to center the selected bot
        const scrollLeft = targetItem.offsetLeft - (carousel.clientWidth - targetItem.clientWidth) / 2;
        carousel.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  };

  // Enhanced carousel functionality with scroll-based detection
  // This automatically updates which bot is "active" based on scroll position
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // PERFORMANCE OPTIMIZATION FUNCTION
    // Debounce function for performance optimization
    // This prevents too many scroll calculations from slowing down the interface
    // It waits for a pause in activity before executing the function
    // Like waiting for someone to stop typing before checking spelling
    const debounce = (func, delay) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    };

    // CAROUSEL POSITION TRACKING
    // Update active item based on scroll position
    // This determines which bot is currently centered in the carousel view
    // Like highlighting the current slide in a presentation
    const updateActiveItem = () => {
      const scrollCenter = carousel.scrollLeft + carousel.clientWidth / 2;
      let closestIndex = 0;
      let minDistance = Infinity;

      const items = carousel.children;
      Array.from(items).forEach((item, index) => {

        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const distance = Math.abs(scrollCenter - itemCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      if (closestIndex !== currentSlide) {
        setCurrentSlide(closestIndex);
      }
    };

    // TOUCH INTERACTION SUPPORT (for mobile devices)
    // Enhanced touch/swipe functionality
    // These variables track finger movements on touchscreens
    let startX = 0;        // Where the finger first touched
    let isDragging = false; // Whether the user is currently swiping
    let startTime = 0;     // When the swipe started (for speed calculation)

    // When user starts touching the screen
    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;  // Record starting position
      startTime = Date.now();         // Record starting time
      isDragging = true;              // Mark that swiping has begun
    };

    // While user is moving finger across screen
    const handleTouchMove = (e) => {
      if (!isDragging) return;
      e.preventDefault(); // Prevent page scrolling while swiping
    };

    // When user lifts finger from screen
    const handleTouchEnd = (e) => {
      if (!isDragging) return;
      isDragging = false;
      
      const endX = e.changedTouches[0].clientX; // Where finger lifted
      const endTime = Date.now();               // When finger lifted
      const diff = startX - endX;               // Distance swiped
      const timeDiff = endTime - startTime;     // How long the swipe took
      
      // Enhanced swipe detection with velocity consideration
      // Only count as swipe if moved far enough and fast enough
      if (Math.abs(diff) > 30 && timeDiff < 300) {
        if (diff > 0) {
          nextSlide(); // Swiped left, go to next bot
        } else {
          prevSlide(); // Swiped right, go to previous bot
        }
      }
    };

    // MOUSE INTERACTION SUPPORT (for desktop computers)
    // Mouse drag support for desktop
    // These variables track mouse movements for click-and-drag functionality
    let mouseStartX = 0;      // Where mouse button was first pressed
    let isMouseDragging = false; // Whether user is currently dragging

    // When user presses mouse button down
    const handleMouseDown = (e) => {
      mouseStartX = e.clientX;           // Record starting position
      isMouseDragging = true;            // Mark that dragging has begun
      carousel.style.cursor = 'grabbing'; // Change cursor to show dragging
    };

    // While user is moving mouse with button held down
    const handleMouseMove = (e) => {
      if (!isMouseDragging) return;
      e.preventDefault(); // Prevent text selection while dragging
    };

    // When user releases mouse button
    const handleMouseUp = (e) => {
      // Complete the mouse drag operation
      if (!isMouseDragging) return;
      isMouseDragging = false;
      carousel.style.cursor = 'grab';    // Change cursor back to normal
      
      const endX = e.clientX;            // Where mouse was released
      const diff = mouseStartX - endX;   // Distance dragged
      
      // Only count as drag if moved far enough (at least 50 pixels)
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide(); // Dragged left, go to next bot
        } else {
          prevSlide(); // Dragged right, go to previous bot
        }
      }
    };

    // Set up all the event listeners for carousel interaction
    // These allow users to scroll, touch, and drag the bot carousel
    const debouncedUpdateActive = debounce(updateActiveItem, 100);
    carousel.addEventListener('scroll', debouncedUpdateActive);
    carousel.addEventListener('touchstart', handleTouchStart);
    carousel.addEventListener('touchmove', handleTouchMove);
    carousel.addEventListener('touchend', handleTouchEnd);
    carousel.addEventListener('mousedown', handleMouseDown);
    carousel.addEventListener('mousemove', handleMouseMove);
    carousel.addEventListener('mouseup', handleMouseUp);
    carousel.addEventListener('mouseleave', handleMouseUp);

    // Set initial cursor style to indicate the carousel is draggable
    carousel.style.cursor = 'grab';

    // Cleanup function - removes all event listeners when component unmounts
    // This prevents memory leaks and ensures smooth performance
    return () => {
      carousel.removeEventListener('scroll', debouncedUpdateActive);
      carousel.removeEventListener('touchstart', handleTouchStart);
      carousel.removeEventListener('touchmove', handleTouchMove);
      carousel.removeEventListener('touchend', handleTouchEnd);
      carousel.removeEventListener('mousedown', handleMouseDown);
      carousel.removeEventListener('mousemove', handleMouseMove);
      carousel.removeEventListener('mouseup', handleMouseUp);
      carousel.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [currentSlide]);

  
const handleSendMessage = async () => {
  if (!inputMessage.trim() || !selectedBot) return;

  const userMessage = {
    id: Date.now(),
    text: inputMessage,
    sender: 'user',
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMessage]);
  setInputMessage('');
  setIsTyping(true);

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const serializableMessages = messages.map(msg => ({
      id: msg.id,
      text: msg.text,
      sender: msg.sender,
      timestamp: msg.timestamp,
      bot: msg.bot ? { name: msg.bot.name } : null
    }));

    const res = await fetch(`${API_ROUTES.baseURL}/chat/stylist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        botName: selectedBot.name,
        message: userMessage.text,
        chatHistory: serializableMessages
      })
    });

    const data = await res.json();

    if (data.success) {
      const botMessage = {
        id: Date.now() + 1,
        text: data.reply,
        sender: 'bot',
        timestamp: new Date(),
        bot: { name: selectedBot.name }
      };
      setMessages(prev => [...prev, botMessage]);
    } else {
      console.error('Bot reply failed:', data.error);
    }
  } catch (err) {
    console.error('Error sending message:', err);
  } finally {
    setIsTyping(false);
  }
};


// Function to select a bot and start conversation
const handleBotSelect = (bot) => {
  setSelectedBot(bot);
  const welcomeMessage = {
    id: Date.now(),
    text: `Hello! I'm ${bot.name}. ${bot.welcomeText || 'I’m here to help with your style.'}`,
    sender: 'bot',
    timestamp: new Date(),
    bot
  };
  setMessages([welcomeMessage]); // Reset chat for new bot
};


  // Bot selection screen - shown when no bot is selected yet
  // This displays the carousel of available AI stylists
  if (!selectedBot) {
    return (
      <div className="h-full flex flex-col bg-slate-950 overflow-hidden pb-20">
        {/* Header section with title and icon */}
        <div className="text-center pt-4 pb-2">
          <div className="inline-flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-slate-400" />
            </div>
            <h1 className="text-xl font-medium text-slate-200">
              My Stylist
            </h1>
          </div>
          <p className="text-slate-500 text-sm">
            Choose your fashion companion
          </p>
        </div>

        {/* Carousel */}
        <div className="flex-1 flex items-start justify-center px-6 overflow-hidden pt-4">
          <div className="w-full max-w-4xl relative">
            {/* Left Arrow */}
            <button
              onClick={() => goToSlide(currentSlide === 0 ? bots.length - 1 : currentSlide - 1)}
              className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-slate-900/90 transition-all duration-300 backdrop-blur-md border border-slate-600/60 shadow-lg flex items-center justify-center group hover:bg-slate-800/95"
            >
              <ChevronLeft className="w-6 h-6 text-slate-300 transition-colors duration-200 group-hover:text-white" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => goToSlide(currentSlide === bots.length - 1 ? 0 : currentSlide + 1)}
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-slate-900/90 transition-all duration-300 backdrop-blur-md border border-slate-600/60 shadow-lg flex items-center justify-center group hover:bg-slate-800/95"
            >
              <ChevronRight className="w-6 h-6 text-slate-300 transition-colors duration-200 group-hover:text-white" />
            </button>

            <div 
              ref={carouselRef}
              className="flex gap-4 overflow-hidden px-4 scroll-smooth"
              style={{
                scrollSnapType: 'x mandatory',    // Makes scrolling snap to each bot card
                scrollbarWidth: 'none',           // Hides scrollbar on Firefox
                msOverflowStyle: 'none',          // Hides scrollbar on Internet Explorer
                cursor: 'grab'                    // Shows grab cursor for dragging
              }}
            >
              {/* Loop through each bot and create a card for it */}
              {bots.map((bot, index) => (
                <div
                  key={bot.id}
                  className={`flex-shrink-0 w-72 transition-all duration-700 cursor-pointer select-none transform ${
                    index === currentSlide 
                      ? 'opacity-100 scale-105'   // Active bot is fully visible and slightly larger
                      : 'opacity-50 scale-90'     // Inactive bots are faded and smaller
                  }`}
                  style={{ 
                    scrollSnapAlign: 'center',    // Centers each card when scrolling
                    // Visual effects: active bot is clear, others are grayed and blurred
                    filter: index === currentSlide ? 'none' : 'grayscale(40%) blur(1px)',
                    // Active bot is at normal position, others are slightly lower
                    transform: `translateY(${index === currentSlide ? '0' : '10px'})`
                  }}
                  onClick={() => {
                    // When user clicks a bot card:
                    goToSlide(index);                           // First, scroll to center that bot
                    setTimeout(() => handleBotSelect(bot), 300); // Then select it after animation
                  }}
                >
                  {/* Individual bot card with dynamic styling based on bot's theme */}
                  <div className={`${bot.bgColor || 'bg-slate-800/50'} rounded-2xl p-6 border ${bot.borderColor || 'border-slate-700/50'} transition-all duration-300 ${
                    index === currentSlide 
                      ? bot.borderColor ? `${bot.borderColor}` : 'border-slate-600'     // Active border
                      : bot.borderColor ? `${bot.borderColor}/50` : 'border-slate-600/70' // Inactive border
                  } relative`}>
                    

                    {/* Bot avatar section - displays the bot's visual representation */}
                    <div className="text-center mb-4">
                      {/* Avatar container with bot-specific styling */}
                      <div className={`w-16 h-16 mx-auto rounded-xl ${bot.name === 'Elara' ? 'bg-transparent p-1' : 'bg-slate-700/50'} flex items-center justify-center text-2xl ${bot.textColor || 'text-slate-300'} mb-3`}>
                        {bot.avatar} {/* This contains the bot's SVG icon or emoji */}
                      </div>
                      {/* Bot name with special styling for Elara */}
                      <h3 className={`text-lg font-medium ${bot.textColor || 'text-slate-200'} mb-2 ${bot.name === 'Elara' ? 'font-serif tracking-wide' : ''}`}>{bot.name}</h3>
                      {/* Personality traits displayed as small badges */}
                      <div className="flex gap-2 justify-center mb-3 flex-wrap">
                        {bot.personality.map((trait, i) => (
                          <span 
                            key={i}
                            className={`px-2 py-1 text-xs ${
                              // Different styling for each bot's personality badges
                              bot.name === 'Elara' 
                                ? 'text-amber-800 bg-amber-100/60 border border-amber-200/40 rounded-full font-medium' 
                                : bot.name === 'Loom'
                                ? 'text-teal-700 bg-orange-100/70 border border-orange-200/50 rounded-full font-medium'
                                : bot.name === 'Jax'
                                ? 'text-white bg-orange-600/80 border border-orange-500/60 rounded-md font-medium'
                                : bot.name === 'Sage'
                                ? 'text-amber-900 bg-green-100/70 border border-green-200/50 rounded-full font-medium'
                                : bot.name === 'Flare'
                                ? 'text-yellow-300 bg-purple-900/80 border border-pink-500/60 rounded-md font-medium'
                                : bot.name === 'Coda'
                                ? 'text-blue-700 bg-blue-50/80 border border-blue-200/60 rounded-sm font-medium'
                                : 'text-slate-400 bg-slate-700/30 rounded-md'
                            }`}
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <p className={`text-sm text-center mb-4 ${bot.name === 'Elara' ? 'text-slate-600 font-light italic' : 'text-slate-400'}`}>
                      {bot.description}
                    </p>

                    {/* Select Button */}
                    {index === currentSlide && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBotSelect(bot);
                        }}
                        className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          bot.name === 'Elara' 
                            ? 'bg-gradient-to-r from-amber-200 to-amber-100 text-slate-700 border border-amber-300/50 shadow-sm' 
                             : `text-slate-200 ${bot.accentColor}`
                        }`}
                      >
                        Start Chat
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full bg-slate-950 overflow-hidden pb-20">
      {/* Chat Interface Header - Shows when chatting with a selected bot */}
      <div className={`border-b p-3 ${
        // Dynamic header styling based on selected bot's theme
        selectedBot.name === 'Elara' 
          ? 'bg-gradient-to-r from-amber-50/10 to-stone-50/10 border-amber-200/20' 
          : selectedBot.name === 'Loom'
          ? 'bg-gradient-to-r from-orange-50/10 to-gray-50/10 border-teal-300/20'
          : selectedBot.name === 'Jax'
          ? 'bg-gradient-to-r from-gray-900/30 to-black/20 border-orange-500/20'
          : selectedBot.name === 'Sage'
          ? 'bg-gradient-to-r from-stone-100/10 to-orange-50/10 border-green-300/20'
          : selectedBot.name === 'Flare'
          ? 'bg-gradient-to-r from-gray-900/30 to-purple-900/20 border-pink-500/20'
          : selectedBot.name === 'Coda'
          ? 'bg-gradient-to-r from-gray-50/10 to-blue-50/10 border-blue-400/20'
          : 'bg-slate-900/50 border-slate-800'
      }`}>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              // Clear selected bot to return to selection screen
              setSelectedBot(null);
              // Reset carousel to first slide when returning from chat
              setTimeout(() => {
                setCurrentSlide(0);
                goToSlide(0);
              }, 100);
            }}
            className={`p-1 rounded-full flex items-center justify-center transition-all duration-200 ${
              // Bot-specific styling for back button
              selectedBot.name === 'Elara' 
                ? 'bg-amber-100/20 border border-amber-200/30' 
                : selectedBot.name === 'Loom'
                ? 'bg-orange-100/20 border border-teal-300/30'
                : selectedBot.name === 'Jax'
                ? 'bg-gray-800/50 border border-orange-500/30'
                : selectedBot.name === 'Sage'
                ? 'bg-green-100/20 border border-green-300/30'
                : selectedBot.name === 'Flare'
                ? 'bg-purple-900/30 border border-pink-500/30'
                : selectedBot.name === 'Coda'
                ? 'bg-blue-100/20 border border-blue-400/30'
                : 'bg-slate-800'
            }`}
          >
            <ArrowLeft className={`w-4 h-4 ${
              selectedBot.name === 'Elara' ? 'text-amber-700' 
              : selectedBot.name === 'Loom' ? 'text-teal-600'
              : selectedBot.name === 'Jax' ? 'text-orange-400'
              : selectedBot.name === 'Sage' ? 'text-green-600'
              : selectedBot.name === 'Flare' ? 'text-pink-400'
              : selectedBot.name === 'Coda' ? 'text-blue-600'
              : 'text-slate-400'
            }`} />
          </button>
          
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            selectedBot.name === 'Elara' ? 'bg-gradient-to-br from-amber-100/30 to-stone-100/30 border border-amber-200/40' 
            : selectedBot.name === 'Loom' ? 'bg-gradient-to-br from-orange-100/30 to-gray-100/30 border border-teal-300/40'
            : selectedBot.name === 'Jax' ? 'bg-gradient-to-br from-gray-800/50 to-black/30 border border-orange-500/30'
            : selectedBot.name === 'Sage' ? 'bg-gradient-to-br from-green-100/30 to-orange-100/30 border border-green-300/40'
            : selectedBot.name === 'Flare' ? 'bg-gradient-to-br from-purple-900/40 to-gray-900/30 border border-pink-500/40'
            : selectedBot.name === 'Coda' ? 'bg-gradient-to-br from-blue-100/30 to-gray-100/30 border border-blue-400/40'
            : 'bg-slate-700/50'
          }`}>
            <div className="w-6 h-6">
              {selectedBot.avatar}
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className={`font-semibold text-base ${
              selectedBot.name === 'Elara' ? 'text-amber-100 font-serif tracking-wide' 
              : selectedBot.name === 'Loom' ? 'text-orange-100'
              : selectedBot.name === 'Jax' ? 'text-orange-200'
              : selectedBot.name === 'Sage' ? 'text-green-100'
              : selectedBot.name === 'Flare' ? 'text-pink-200'
              : selectedBot.name === 'Coda' ? 'text-blue-200'
              : 'text-slate-200'
            }`}>{selectedBot.name}</h3>
            <div className="flex items-center gap-2">
              <p className={`text-sm ${
                selectedBot.name === 'Elara' ? 'text-amber-200/80' 
                : selectedBot.name === 'Loom' ? 'text-orange-200/80'
                : selectedBot.name === 'Jax' ? 'text-orange-300/80'
                : selectedBot.name === 'Sage' ? 'text-green-200/80'
                : selectedBot.name === 'Flare' ? 'text-pink-300/80'
                : selectedBot.name === 'Coda' ? 'text-blue-300/80'
                : 'text-slate-500'
              }`}>{selectedBot.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              selectedBot.name === 'Elara' ? 'bg-amber-400' 
              : selectedBot.name === 'Loom' ? 'bg-orange-400'
              : selectedBot.name === 'Jax' ? 'bg-orange-500'
              : selectedBot.name === 'Sage' ? 'bg-green-400'
              : selectedBot.name === 'Flare' ? 'bg-pink-500'
              : selectedBot.name === 'Coda' ? 'bg-blue-500'
              : 'bg-green-500'
            }`}></div>
            {/* "Online" text with dynamic coloring */}
            <span className={`text-xs font-medium ${
              selectedBot.name === 'Elara' ? 'text-amber-200' 
              : selectedBot.name === 'Loom' ? 'text-orange-200'
              : selectedBot.name === 'Jax' ? 'text-orange-300'
              : selectedBot.name === 'Sage' ? 'text-green-200'
              : selectedBot.name === 'Flare' ? 'text-pink-300'
              : selectedBot.name === 'Coda' ? 'text-blue-300'
              : 'text-slate-400'
            }`}>Online</span>
          </div>
        </div>
      </div>

      {/* Chat Messages Display Area */}
      {/* This is the main scrollable area where all chat messages are displayed */}
      <div 
        className="flex-1 overflow-y-scroll p-4 space-y-3 chat-scrollbar" 
        style={{ 
          // Custom scrollbar styling for better visual integration
          scrollbarWidth: 'auto',
          scrollbarColor: '#06b6d4 #1e293b'
        }}
      >
        {/* Loop through all messages and display them */}
        {messages.map((message) => (
          <div
            key={message.id}
            // Align user messages to the right, bot messages to the left
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* Bot avatar (only shown for bot messages) */}
            {message.sender === 'bot' && (
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 mt-1 flex-shrink-0 ${
                selectedBot.name === 'Elara' ? 'bg-gradient-to-br from-amber-100/20 to-stone-100/20 border border-amber-200/30' 
                : selectedBot.name === 'Loom' ? 'bg-gradient-to-br from-orange-100/20 to-gray-100/20 border border-teal-300/30'
                : selectedBot.name === 'Jax' ? 'bg-gradient-to-br from-gray-800/40 to-black/20 border border-orange-500/30'
                : selectedBot.name === 'Sage' ? 'bg-gradient-to-br from-green-100/20 to-orange-100/20 border border-green-300/30'
                : selectedBot.name === 'Flare' ? 'bg-gradient-to-br from-purple-900/30 to-gray-900/20 border border-pink-500/30'
                : selectedBot.name === 'Coda' ? 'bg-gradient-to-br from-blue-100/20 to-gray-100/20 border border-blue-400/30'
                : 'bg-slate-700/50'
              }`}>
                <div className="w-5 h-5">
                  {selectedBot.avatar}
                </div>
              </div>
            )}
            <div className={`max-w-[75%] ${
              message.sender === 'user'
                ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-slate-100 rounded-2xl rounded-br-md shadow-lg border border-slate-500/30'
                : selectedBot.name === 'Elara'
                ? 'bg-gradient-to-br from-amber-50/10 to-stone-50/10 text-amber-100 rounded-2xl rounded-bl-md border border-amber-200/30 shadow-lg'
                : selectedBot.name === 'Loom'
                ? 'bg-gradient-to-br from-orange-50/10 to-gray-50/10 text-orange-100 rounded-2xl rounded-bl-md border border-teal-300/30 shadow-lg'
                : selectedBot.name === 'Jax'
                ? 'bg-gradient-to-br from-gray-800/50 to-black/30 text-orange-200 rounded-2xl rounded-bl-md border border-orange-500/30 shadow-lg'
                : selectedBot.name === 'Sage'
                ? 'bg-gradient-to-br from-green-50/10 to-orange-50/10 text-green-100 rounded-2xl rounded-bl-md border border-green-300/30 shadow-lg'
                : selectedBot.name === 'Flare'
                ? 'bg-gradient-to-br from-purple-900/30 to-gray-900/20 text-pink-200 rounded-2xl rounded-bl-md border border-pink-500/30 shadow-lg'
                : selectedBot.name === 'Coda'
                ? 'bg-gradient-to-br from-blue-50/10 to-gray-50/10 text-blue-100 rounded-2xl rounded-bl-md border border-blue-400/30 shadow-lg'
                : 'bg-slate-800/50 text-slate-300 rounded-2xl rounded-bl-md border border-slate-700/50'
            } px-4 py-3`}>
              <p className="text-sm leading-relaxed">{message.text}</p>
              <div className={`text-xs mt-2 ${
                message.sender === 'user' 
                  ? 'text-slate-300/70' 
                  : selectedBot.name === 'Elara' ? 'text-amber-200/60'
                  : selectedBot.name === 'Loom' ? 'text-orange-200/60'
                  : selectedBot.name === 'Jax' ? 'text-orange-300/60'
                  : selectedBot.name === 'Sage' ? 'text-green-200/60'
                  : selectedBot.name === 'Flare' ? 'text-pink-300/60'
                  : selectedBot.name === 'Coda' ? 'text-blue-200/60'
                  : 'text-slate-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 mt-1 flex-shrink-0 ${
              selectedBot.name === 'Elara' ? 'bg-gradient-to-br from-amber-100/20 to-stone-100/20 border border-amber-200/30' 
              : selectedBot.name === 'Loom' ? 'bg-gradient-to-br from-orange-100/20 to-gray-100/20 border border-teal-300/30'
              : selectedBot.name === 'Jax' ? 'bg-gradient-to-br from-gray-800/40 to-black/20 border border-orange-500/30'
              : selectedBot.name === 'Sage' ? 'bg-gradient-to-br from-green-100/20 to-orange-100/20 border border-green-300/30'
              : selectedBot.name === 'Flare' ? 'bg-gradient-to-br from-purple-900/30 to-gray-900/20 border border-pink-500/30'
              : selectedBot.name === 'Coda' ? 'bg-gradient-to-br from-blue-100/20 to-gray-100/20 border border-blue-400/30'
              : 'bg-slate-700/50'
            }`}>
              <div className="w-5 h-5">
                {selectedBot.avatar}
              </div>
            </div>
            <div className={`rounded-2xl rounded-bl-md px-4 py-3 shadow-lg ${
              selectedBot.name === 'Elara'
              ? 'bg-gradient-to-br from-amber-50/10 to-stone-50/10 border border-amber-200/30'
              : selectedBot.name === 'Loom'
              ? 'bg-gradient-to-br from-orange-50/10 to-gray-50/10 border border-teal-300/30'
              : selectedBot.name === 'Jax'
              ? 'bg-gradient-to-br from-gray-800/50 to-black/30 border border-orange-500/30'
              : selectedBot.name === 'Sage'
              ? 'bg-gradient-to-br from-green-50/10 to-orange-50/10 border border-green-300/30'
              : selectedBot.name === 'Flare'
              ? 'bg-gradient-to-br from-purple-900/30 to-gray-900/20 border border-pink-500/30'
              : selectedBot.name === 'Coda'
              ? 'bg-gradient-to-br from-blue-50/10 to-gray-50/10 border border-blue-400/30'
              : 'bg-slate-800/50 border border-slate-700/50'
            }`}>
              <div className="flex space-x-1">
                <div className={`w-2 h-2 rounded-full animate-bounce ${
                  selectedBot.name === 'Elara' ? 'bg-amber-300' 
                  : selectedBot.name === 'Loom' ? 'bg-teal-300'
                  : selectedBot.name === 'Jax' ? 'bg-orange-400'
                  : selectedBot.name === 'Sage' ? 'bg-green-300'
                  : selectedBot.name === 'Flare' ? 'bg-pink-400'
                  : selectedBot.name === 'Coda' ? 'bg-blue-400'
                  : 'bg-slate-400'
                }`}></div>
                <div className={`w-2 h-2 rounded-full animate-bounce ${
                  selectedBot.name === 'Elara' ? 'bg-amber-300' 
                  : selectedBot.name === 'Loom' ? 'bg-teal-300'
                  : selectedBot.name === 'Jax' ? 'bg-orange-400'
                  : selectedBot.name === 'Sage' ? 'bg-green-300'
                  : selectedBot.name === 'Flare' ? 'bg-pink-400'
                  : selectedBot.name === 'Coda' ? 'bg-blue-400'
                  : 'bg-slate-400'
                }`} style={{ animationDelay: '0.1s' }}></div>
                <div className={`w-2 h-2 rounded-full animate-bounce ${
                  selectedBot.name === 'Elara' ? 'bg-amber-300' 
                  : selectedBot.name === 'Loom' ? 'bg-teal-300'
                  : selectedBot.name === 'Jax' ? 'bg-orange-400'
                  : selectedBot.name === 'Sage' ? 'bg-green-300'
                  : selectedBot.name === 'Flare' ? 'bg-pink-400'
                  : selectedBot.name === 'Coda' ? 'bg-blue-400'
                  : 'bg-slate-400'
                }`} style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t bg-slate-950/80 backdrop-blur-sm ${
        selectedBot.name === 'Elara' ? 'border-amber-200/20' 
        : selectedBot.name === 'Loom' ? 'border-teal-300/20'
        : selectedBot.name === 'Jax' ? 'border-orange-500/20'
        : selectedBot.name === 'Sage' ? 'border-green-300/20'
        : selectedBot.name === 'Flare' ? 'border-pink-500/20'
        : selectedBot.name === 'Coda' ? 'border-blue-400/20'
        : 'border-slate-800'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Ask ${selectedBot.name}...`}
              className={`w-full bg-slate-800/60 border rounded-xl px-4 py-3 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                selectedBot.name === 'Elara' 
                ? 'border-amber-200/30 focus:border-amber-300/50 focus:ring-amber-300/20' 
                : selectedBot.name === 'Loom' 
                ? 'border-teal-300/30 focus:border-teal-300/50 focus:ring-teal-300/20'
                : selectedBot.name === 'Jax' 
                ? 'border-orange-500/30 focus:border-orange-400/50 focus:ring-orange-400/20'
                : selectedBot.name === 'Sage' 
                ? 'border-green-300/30 focus:border-green-300/50 focus:ring-green-300/20'
                : selectedBot.name === 'Flare' 
                ? 'border-pink-500/30 focus:border-pink-400/50 focus:ring-pink-400/20'
                : selectedBot.name === 'Coda' 
                ? 'border-blue-400/30 focus:border-blue-400/50 focus:ring-blue-400/20'
                : 'border-slate-700 focus:border-slate-600 focus:ring-slate-600/50'
              }`}
            />
            {/* Visual indicator when user is typing (pulsing dot) */}
            {inputMessage.trim() && (
              <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full animate-pulse ${
                selectedBot.name === 'Elara' ? 'bg-amber-300' 
                : selectedBot.name === 'Loom' ? 'bg-teal-300'
                : selectedBot.name === 'Jax' ? 'bg-orange-400'
                : selectedBot.name === 'Sage' ? 'bg-green-300'
                : selectedBot.name === 'Flare' ? 'bg-pink-400'
                : selectedBot.name === 'Coda' ? 'bg-blue-400'
                : 'bg-slate-400'
              }`}></div>
            )}
          </div>
          {/* Send button with bot-specific gradient styling */}
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-200 shadow-lg disabled:opacity-50 ${
              selectedBot.name === 'Elara'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 disabled:from-amber-500 disabled:to-amber-600'
              : selectedBot.name === 'Loom'
              ? 'bg-gradient-to-r from-teal-500 to-teal-600 disabled:from-teal-500 disabled:to-teal-600'
              : selectedBot.name === 'Jax'
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 disabled:from-orange-500 disabled:to-orange-600'
              : selectedBot.name === 'Sage'
              ? 'bg-gradient-to-r from-green-500 to-green-600 disabled:from-green-500 disabled:to-green-600'
              : selectedBot.name === 'Flare'
              ? 'bg-gradient-to-r from-pink-500 to-pink-600 disabled:from-pink-500 disabled:to-pink-600'
              : selectedBot.name === 'Coda'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 disabled:from-blue-500 disabled:to-blue-600'
              : 'bg-gradient-to-r from-slate-700 to-slate-600 disabled:from-slate-700 disabled:to-slate-600'
            }`}
          >
            {/* Send icon from Lucide React */}
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>


    </>
  );
};

// Export the ChatSystem component for use in other parts of the application
export default ChatSystem;