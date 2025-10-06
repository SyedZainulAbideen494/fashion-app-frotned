import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';

// Preloader Component
const Preloader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 500); // Small delay before hiding
                    return 100;
                }
                return prev + 2;
            });
        }, 50);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-center">
                <div className="mb-8">
                    <motion.div
                        className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                </div>
                <motion.h2
                    className="text-2xl font-bold text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Loading Your Style Experience
                </motion.h2>
                <div className="w-64 h-2 bg-slate-700 rounded-full overflow-hidden mx-auto">
                    <motion.div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <motion.p
                    className="text-slate-300 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {progress}% Complete
                </motion.p>
            </div>
        </motion.div>
    );
};

// Image Preloader Hook
const useImagePreloader = (imageUrls) => {
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadedCount, setLoadedCount] = useState(0);

    useEffect(() => {
        if (!imageUrls || imageUrls.length === 0) {
            setImagesLoaded(true);
            return;
        }

        let loadedImages = 0;
        const totalImages = imageUrls.length;

        const preloadImage = (url) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    loadedImages++;
                    setLoadedCount(loadedImages);
                    resolve(url);
                };
                img.onerror = () => {
                    loadedImages++;
                    setLoadedCount(loadedImages);
                    resolve(url); // Still resolve to continue loading other images
                };
                img.src = url;
            });
        };

        Promise.all(imageUrls.map(preloadImage)).then(() => {
            setImagesLoaded(true);
        });
    }, [imageUrls]);

    return { imagesLoaded, loadedCount, totalImages: imageUrls?.length || 0 };
};

// --- SVG Icon Components ---
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

const CheckCircleIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

const CheckCircle2 = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);


const MonkeyHandsIcon = () => (
    <svg width="35" height="35" viewBox="0 0 64 64">
        <path fill="#475569" d="M9.4,32.5L2.1,61.9H14c-1.6-7.7,4-21,4-21L9.4,32.5z"/><path fill="#E5E7EB" d="M15.8,24.8c0,0,4.9-4.5,9.5-3.9c2.3,0.3-7.1,7.6-7.1,7.6s9.7-8.2,11.7-5.6c1.8,2.3-8.9,9.8-8.9,9.8 s10-8.1,9.6-4.6c-0.3,3.8-7.9,12.8-12.5,13.8C11.5,43.2,6.3,39,9.8,24.4C11.6,17,13.3,25.2,15.8,24.8"/><path fill="#475569" d="M54.8,32.5l7.3,29.4H50.2c1.6-7.7-4-21,4-21L54.8,32.5z"/><path fill="#E5E7EB" d="M48.4,24.8c0,0-4.9-4.5-9.5-3.9c-2.3,0.3,7.1,7.6,7.1,7.6s-9.7-8.2-11.7-5.6c-1.8,2.3,8.9,9.8,8.9,9.8 s-10-8.1-9.7-4.6c0.4,3.8,8,12.8,12.6,13.8c6.6,1.3,11.8-2.9,8.3-17.5C52.6,17,50.9,25.2,48.4,24.8"/>
    </svg>
);

const MonkeyIcon = () => (
    <svg width="35" height="35" viewBox="0 0 64 64">
        <ellipse cx="53.7" cy="33" rx="8.3" ry="8.2" fill="#475569"/><ellipse cx="53.7" cy="33" rx="5.4" ry="5.4" fill="#EC4899"/><ellipse cx="10.2" cy="33" rx="8.2" ry="8.2" fill="#475569"/><ellipse cx="10.2" cy="33" rx="5.4" ry="5.4" fill="#EC4899"/><g fill="#475569"><path d="m43.4 10.8c1.1-.6 1.9-.9 1.9-.9-3.2-1.1-6-1.8-8.5-2.1 1.3-1 2.1-1.3 2.1-1.3-20.4-2.9-30.1 9-30.1 19.5h46.4c-.7-7.4-4.8-12.4-11.8-15.2"/><path d="m55.3 27.6c0-9.7-10.4-17.6-23.3-17.6s-23.3 7.9-23.3 17.6c0 2.3.6 4.4 1.6 6.4-1 2-1.6 4.2-1.6 6.4 0 9.7 10.4 17.6 23.3 17.6s23.3-7.9 23.3-17.6c0-2.3-.6-4.4-1.6-6.4 1-2 1.6-4.2 1.6-6.4"/></g><path d="m52 28.2c0-16.9-20-6.1-20-6.1s-20-10.8-20 6.1c0 4.7 2.9 9 7.5 11.7-1.3 1.7-2.1 3.6-2.1 5.7 0 6.1 6.6 11 14.7 11s14.7-4.9 14.7-11c0-2.1-.8-4-2.1-5.7 4.4-2.7 7.3-7 7.3-11.7" fill="#E5E7EB"/><g fill="#0B0F17"><path d="m35.1 38.7c0 1.1-.4 2.1-1 2.1-.6 0-1-.9-1-2.1 0-1.1.4-2.1 1-2.1.6.1 1 1 1 2.1"/><path d="m30.9 38.7c0 1.1-.4 2.1-1 2.1-.6 0-1-.9-1-2.1 0-1.1.4-2.1 1-2.1.5.1 1 1 1 2.1"/><ellipse cx="40.7" cy="31.7" rx="3.5" ry="4.5"/><ellipse cx="23.3" cy="31.7" rx="3.5" ry="4.5"/></g>
    </svg>
);

// --- Core Components ---
const BackgroundFx = ({ isTransitioning }) => {
    const stars = useMemo(() => {
        return Array.from({ length: 200 }).map((_, i) => ({
            id: i,
            angle: Math.random() * 2 * Math.PI,
            radius: Math.sqrt(Math.random()) * 50,
            size: Math.random() * 1.5 + 0.5,
            twinkleDuration: Math.random() * 3 + 2,
            delay: Math.random() * 5,
        }));
    }, []);

    const fxStyles = `
        .grid-bg-landing {
            background-size: 50px 50px;
            background-image:
                linear-gradient(to right, rgba(14, 165, 233, 0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(14, 165, 233, 0.08) 1px, transparent 1px);
        }
    `;

    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0B0F17]">
            <style>{fxStyles}</style>
            <motion.div
                className="absolute inset-0 grid-bg-landing"
                animate={{ backgroundPosition: ["0 0", "50px 50px"] }}
                transition={{ duration: 4, ease: "linear", repeat: Infinity }}
            />
            <div className="absolute inset-0">
                {stars.map(star => (
                    <motion.div
                        key={star.id}
                        className="absolute rounded-full bg-white"
                        style={{
                            top: `calc(50% + ${star.radius * Math.sin(star.angle)}vh)`,
                            left: `calc(50% + ${star.radius * Math.cos(star.angle)}vw)`,
                        }}
                        initial={{
                            width: star.size,
                            height: star.size,
                            opacity: 0,
                        }}
                        animate={{
                            scale: 1,
                            opacity: isTransitioning ? 0 : [0, 1, 0],
                        }}
                        transition={
                            isTransitioning
                                ? { opacity: { duration: 0.5, ease: "easeOut" } }
                                : { opacity: { duration: star.twinkleDuration, delay: star.delay, repeat: Infinity, ease: "easeInOut" } }
                        }
                    />
                ))}
            </div>
            <motion.div
                className="absolute inset-0"
                style={{
                    backgroundImage: `radial-gradient(circle at top left, rgba(14, 165, 233, 0.1), transparent 40%),
                                      radial-gradient(circle at bottom right, rgba(236, 72, 153, 0.1), transparent 40%)`,
                }}
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
            />
        </div>
    );
}

const AnimatedStyledInput = ({ type, placeholder, value, onChange, icon, autoFocus, shake }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputRef = useRef(null);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    let containerClasses = `input-container ${shake ? 'shake' : ''}`;
    if (isPassword) {
        containerClasses += ' password';
        if (showPassword) containerClasses += ' show';
    }

    const textLayerClasses = `password-text-layer ${isFocused && (!isPassword || (isPassword && showPassword)) ? 'cursor' : ''}`;
    const dotsLayerClasses = `password-dots-layer ${isFocused && isPassword && !showPassword ? 'cursor' : ''}`;

    return (
        <div className="w-full">
            <div className={containerClasses}>
                <div className="input-icon">{icon}</div>
                {isPassword && <div className="monkey-hands"><MonkeyHandsIcon /></div>}
                {isPassword && <div className="monkey" onClick={() => setShowPassword(!showPassword)}><MonkeyIcon /></div>}
                <div className="password-wrapper">
                    <input
                        ref={inputRef}
                        type={isPassword ? 'text' : type}
                        placeholder={placeholder}
                        className="animated-input-field"
                        value={value}
                        onChange={onChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        spellCheck="false"
                        maxLength={isPassword ? 20 : 50}
                    />
                    <span className={textLayerClasses} key={`text-${showPassword}`}>
                        {value.split('').map((char, index) => (
                            <span key={index} style={{ animationDelay: `${index * 0.04}s` }}>{char}</span>
                        ))}
                    </span>
                    {isPassword && (
                         <span className={dotsLayerClasses} key={`dots-${showPassword}`}>
                            {value.split('').map((char, index) => (
                                <span key={index} style={{ animationDelay: `${index * 0.04}s` }}>{char}</span>
                            ))}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

const MemoizedTile = React.memo(function Tile({ option, isSelected }) {
    const label = option.label || option;
    const img = option.img;
    const isColor = img.startsWith('#') || img.startsWith('radial-gradient') || img.startsWith('linear-gradient');

    return (
        <motion.div className="h-40 bg-black relative rounded-2xl overflow-hidden" animate={{ scale: isSelected ? 1.05 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            {isColor ? (
                <div className="absolute inset-0" style={{ background: img }} />
            ) : (
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80" />
            <div className="absolute bottom-0 p-3 w-full flex items-center justify-between">
                <span className="text-black font-medium drop-shadow-lg">{label}</span>
            </div>
            <AnimatePresence>
                {isSelected && (
                    <motion.div className="absolute inset-0 border-4 border-cyan-400 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.5)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                            <CheckCircle2 className="w-12 h-12 text-black" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
});

const ChoiceGrid = ({ options, onSelect, selectedKey }) => (
    <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => (
            <div key={opt.key} onClick={() => onSelect(opt.key)} role="button" tabIndex="0" className="relative group rounded-2xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer">
                <MemoizedTile option={opt} isSelected={selectedKey === opt.key} />
            </div>
        ))}
    </div>
);



const LoginScreen = ({ onSwitchScreen }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [shakeFields, setShakeFields] = useState({ email: false, password: false });
    const [loading, setLoading] = useState(false);
    const nav = useNavigate()
    const isFormValid = email.trim() !== '' && password.trim() !== '';

    const handleLogin = async () => {
        if (!isFormValid) {
            const newShakeState = {
                email: email.trim() === '',
                password: password.trim() === '',
            };
            setShakeFields(newShakeState);
            setTimeout(() => setShakeFields({ email: false, password: false }), 500);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${API_ROUTES.baseURL}/login`, {
                email,
                password
            });

            const { auth, token, user } = response.data;

            if (auth) {
                // Save token to localStorage
                localStorage.setItem("token", token);

                // Optionally save user info
                localStorage.setItem("user", JSON.stringify(user));

                console.log("✅ Login successful:", user);

                // Switch to dashboard
                nav("/")
            } else {
                alert(response.data.message || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert(err.response?.data?.message || "Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center h-full animate-fade-in">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-light neon-text-cyan">AIR CLOSET</h1>
                <p className="text-slate-300 mt-2">Your Personal AI Stylist</p>
            </div>
            
            <div className="space-y-6">
                <AnimatedStyledInput 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<UserIcon />}
                    autoFocus={true}
                    shake={shakeFields.email}
                />
                <AnimatedStyledInput 
                    type="password" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<LockIcon />}
                    shake={shakeFields.password}
                />

                <div className="flex items-center justify-center gap-2 mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <p className="text-center text-xs text-slate-500">Your data stays private and secure.</p>
                </div>

                <button 
                    onClick={handleLogin}
                    disabled={loading}
                    className={`w-full py-4 font-bold rounded-lg neon-button-cyan !mt-6 transition-opacity duration-300 ${!isFormValid ? 'opacity-50' : ''}`}
                >
                    {loading ? "Logging in..." : "LOGIN"}
                </button>
            </div>
            
            <p className="text-center text-slate-300 mt-8">
                Don't have an account? 
                <a href="#" onClick={(e) => { e.preventDefault(); onSwitchScreen('register'); }} className="font-semibold text-pink-500 hover:text-pink-400 transition">Register Now</a>
            </p>
        </div>
    );
};

const RegistrationProgressBar = ({ currentStep, steps }) => (
    <div className="w-full mb-4">
        <ul className="grid grid-cols-3 gap-x-4 gap-y-6">
            {steps.map((title, index) => {
                const step = index + 1;
                const isActive = step <= currentStep;
                const isCurrent = step === currentStep;

                return (
                    <li key={step} className="text-center relative">
                        <div className="progress-step-container">
                            <motion.div
                                className="progress-step"
                                animate={{
                                    backgroundColor: isActive ? 'var(--pink-glow)' : 'rgba(229, 231, 235, 0.1)',
                                    borderColor: isActive ? 'var(--pink-glow)' : '#475569',
                                    color: isActive ? 'var(--bg-color)' : '#475569'
                                }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                               <motion.span animate={{ scale: isCurrent ? 1.2 : 1}}>{step}</motion.span>
                            </motion.div>
                            <span className={`mt-2 block text-xs transition-colors ${isCurrent ? 'text-pink-400' : 'text-slate-500'}`}>{title}</span>
                        </div>
                        
                        {step < steps.length && step % 3 !== 0 && (
                            <div className="progress-line-container">
                                 <motion.div 
                                    className="progress-line"
                                    initial={{ width: '0%' }}
                                    animate={{ width: isActive ? '100%' : '0%' }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                />
                            </div>
                        )}
                    </li>
                )
            })}
        </ul>
    </div>
);


const PasswordRequirement = ({ isValid, text }) => (
    <motion.li
        className={`flex items-center text-xs ${isValid ? 'text-cyan-400' : 'text-slate-500'}`}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1, color: isValid ? '#22d3ee' : '#64748b' }}
        transition={{ duration: 0.3 }}
    >
        <motion.div
            className="w-4 h-4 mr-2"
            animate={{ rotate: isValid ? 360 : 0, scale: isValid ? 1 : 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
            <CheckCircleIcon className={`transition-colors duration-300 ${isValid ? 'text-cyan-400' : 'text-slate-600'}`} />
        </motion.div>
        {text}
    </motion.li>
);

const PasswordStrengthMeter = ({ score }) => {
    const strengthLevels = useMemo(() => ({
        0: { label: '', color: 'transparent', width: '0%' },
        1: { label: 'Weak', color: '#ef4444', width: '25%' },
        2: { label: 'Medium', color: '#f97316', width: '50%' },
        3: { label: 'Good', color: '#eab308', width: '75%' },
        4: { label: 'Strong', color: '#22d3ee', width: '100%' },
    }), []);

    const currentStrength = strengthLevels[score];

    return (
        <div className="mt-3">
             <div className="w-full bg-slate-700/50 rounded-full h-2">
                 <motion.div
                    className="h-2 rounded-full transition-colors duration-300"
                    style={{ backgroundColor: currentStrength.color }}
                    initial={{ width: '0%' }}
                    animate={{ width: currentStrength.width }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                 />
             </div>
             <AnimatePresence>
                 {score > 0 && (
                     <motion.p 
                        className="text-right text-xs font-medium mt-1" 
                        style={{ color: currentStrength.color }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                     >
                         {currentStrength.label}
                     </motion.p>
                 )}
             </AnimatePresence>
        </div>
    );
};


const RegisterScreen = ({ onSwitchScreen }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        gender: null,
        skinTone: null,
        eyeColor: null,
        hairColor: null,
        height: 170,
        weight: 65,
        bodyType: null,
    });
    const [passwordRules, setPasswordRules] = useState({
        minLength: false,
        hasNumber: false,
        hasUpper: false,
        hasSpecial: false,
    });
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [shakeFields, setShakeFields] = useState({ email: false, password: false });
    const nav = useNavigate()

    
    useEffect(() => {
        const password = formData.password;
        const newRules = {
            minLength: password.length >= 8,
            hasNumber: /\d/.test(password),
            hasUpper: /[A-Z]/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
        setPasswordRules(newRules);
        
        const score = Object.values(newRules).filter(val => val).length;
        setPasswordStrength(score);

    }, [formData.password]);
    
    const isStep1Valid = useMemo(() => {
        return formData.email.trim() !== '' && Object.values(passwordRules).every(Boolean);
    }, [formData.email, passwordRules]);

    const isStep2Valid = useMemo(() => !!formData.gender, [formData.gender]);
    const isStep3Valid = useMemo(() => !!formData.skinTone, [formData.skinTone]);
    const isStep4Valid = useMemo(() => !!formData.eyeColor, [formData.eyeColor]);
    const isStep5Valid = useMemo(() => !!formData.hairColor, [formData.hairColor]);
    const isStep6Valid = useMemo(() => !!formData.bodyType, [formData.bodyType]);

const handleRegister = async () => {
  if (!isStep6Valid) return;

  try {
    const response = await axios.post(`${API_ROUTES.baseURL}/signup`, formData);
    if (response.data.auth) {
      // Save token to localStorage/sessionStorage
      localStorage.setItem('token', response.data.token);
      console.log("✅ Registered:", response.data);
      // Redirect or switch screen
      nav("/welcome")
    } else {
      alert(response.data.error || "Registration failed");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Try again.");
  }
};

    const handleNext = () => {
        if (step === 1 && isStep1Valid) setStep(2);
        else if (step === 2 && isStep2Valid) setStep(3);
        else if (step === 3 && isStep3Valid) setStep(4);
        else if (step === 4 && isStep4Valid) setStep(5);
        else if (step === 5 && isStep5Valid) setStep(6);
        else {
             const newShakeState = {
                email: step === 1 && formData.email.trim() === '',
                password: step === 1 && !Object.values(passwordRules).every(Boolean),
            };
            setShakeFields(newShakeState);
            setTimeout(() => setShakeFields({ email: false, password: false }), 500);
        }
    };

    const passwordRuleList = [
        { key: 'minLength', text: 'At least 8 characters' },
        { key: 'hasUpper', text: 'One uppercase letter' },
        { key: 'hasNumber', text: 'One number' },
        { key: 'hasSpecial', text: 'One special character' },
    ];

    const genderOptions = [
        { key: 'men', label: 'Men', img: 'https://i.ibb.co/TBN3nMsc/men.webp' },
        { key: 'women', label: 'Women', img: 'https://i.ibb.co/p6t0jmfj/Gemini-Generated-Image-x707ovx707ovx707-1.webp' }
    ];

     const womenSkinToneOptions = [
        { key: 'fair', label: 'Fair', img: 'https://i.ibb.co/twZQLS0S/Gemini-Generated-Image-io8bstio8bstio8b.webp' },
        { key: 'light', label: 'Light', img: 'https://i.ibb.co/nMKsrqs7/unnamed-8.webp' },
        { key: 'medium', label: 'Medium', img: 'https://i.ibb.co/pvCysPdw/unnamed-5.webp' },
        { key: 'tan', label: 'Tan', img: 'https://i.ibb.co/pj9PKYsd/unnamed-4.webp' },
        { key: 'dark', label: 'Dark', img: 'https://i.ibb.co/C38DxrBw/unnamed-7.webp' },
        { key: 'deep', label: 'Deep', img: 'https://i.ibb.co/rKy6V171/unnamed-6.webp' },
    ];

    const menSkinToneOptions = [
        { key: 'fair', label: 'Fair', img: 'https://i.ibb.co/VYXSBj4w/unnamed-9.webp' },
        { key: 'light', label: 'Light', img: 'https://i.ibb.co/qMK6Mbc1/unnamed-10.webp' },
        { key: 'medium', label: 'Medium', img: 'https://i.ibb.co/7M2sXks/unnamed-13.webp' },
        { key: 'tan', label: 'Tan', img: 'https://i.ibb.co/jvLKxLDb/unnamed-12.webp' },
        { key: 'dark', label: 'Dark', img: 'https://i.ibb.co/7dcP2G44/generated-image.webp' },
        { key: 'deep', label: 'Deep', img: 'https://i.ibb.co/TMsT51Qy/unnamed-11.webp' },
    ];

    const skinToneOptions = useMemo(() => {
        return formData.gender === 'men' ? menSkinToneOptions : womenSkinToneOptions;
    }, [formData.gender]);

    const eyeColorOptions = [
        { key: 'brown', label: 'Brown', img: 'https://i.ibb.co/DDgWLvvb/Gemini-Generated-Image-1ijl9s1ijl9s1ijl.webp'},
        { key: 'blue', label: 'Blue', img: 'https://i.ibb.co/Kx4S4SJY/Gemini-Generated-Image-rbud3wrbud3wrbud.webp'},
        { key: 'green', label: 'Green', img: 'https://i.ibb.co/FqVKXSDG/unnamed-1.webp'},
        { key: 'hazel', label: 'Hazel', img: 'https://i.ibb.co/W4MNcjjK/unnamed.webp'},
        { key: 'gray', label: 'Gray', img: 'https://i.ibb.co/ycj8wBXX/unnamed-2.webp'},
        { key: 'amber', label: 'Amber', img: 'https://i.ibb.co/B2QYBZsy/unnamed-3.webp'},
    ];
    
    const hairColorOptions = [
        { key: 'black', label: 'Black', img: 'https://i.ibb.co/Lhgq7jMf/b64449ef-2f9f-40be-ac02-507c834df764.webp'},
        { key: 'brown', label: 'Brown', img: 'https://i.ibb.co/kVF9GrTM/a5c2bc78-71c7-48de-8b87-ae12c10983c9.webp'},
        { key: 'blonde', label: 'Blonde', img: 'https://i.ibb.co/qFBhQw23/bea22cd1-6b30-4805-96c5-9bb6c7cbe29e.webp'},
        { key: 'red', label: 'Red', img: 'https://i.ibb.co/4nrNNR8L/d7693ce7-19b6-411d-86bd-1017c118de11.webp'},
        { key: 'gray', label: 'Gray', img: 'https://i.ibb.co/HDbp8nDc/45aca54d-5f47-4537-9dbb-a609e73f5746.webp'},
        { key: 'other', label: 'Other', img: 'https://i.ibb.co/0VKGJz48/d99e8582-3a49-4c8e-9040-b656580a1ef9.webp'},
    ];

    const menBodyTypeOptions = [
        { key: 'triangle', label: 'Triangle', img: 'https://i.ibb.co/39f2Cj35/generated-image-4-1.webp' },
        { key: 'inverted-triangle', label: 'Inverted Triangle', img: 'https://i.ibb.co/NccSCc8/generated-image-5-1.webp' },
        { key: 'round', label: 'Round', img: 'https://i.ibb.co/CsNLzqZH/generated-image-3-1.webp' },
        { key: 'rectangle', label: 'Rectangle', img: 'https://i.ibb.co/tTgHqsx8/generated-image-2-1.webp' },
        { key: 'trapezium', label: 'Trapezium', img: 'https://i.ibb.co/rfxmbHSz/generated-image-1-2.webp' },
        { key: 'not-sure', label: 'I am not sure', img: 'https://placehold.co/168x160/0B0F17/E5E7EB?text=?' },
    ];

    const womenBodyTypeOptions = [
        { key: 'hourglass', label: 'Hourglass', img: 'https://i.ibb.co/BHfTXgQn/Screenshot-2025-09-21-030852.webp' },
        { key: 'triangle', label: 'Triangle', img: 'https://i.ibb.co/JWPWTJL2/Screenshot-2025-09-21-030209.webp' },
        { key: 'inverted-triangle', label: 'Inverted Triangle', img: 'https://i.ibb.co/kgf1dGmB/Screenshot-2025-09-21-030551.webp' },
        { key: 'round', label: 'Round', img: 'https://i.ibb.co/53Vf41T/Screenshot-2025-09-21-025859.webp' },
        { key: 'rectangle', label: 'Rectangle', img: 'https://i.ibb.co/1GRbzp6v/Screenshot-2025-09-21-025524.webp' },
        { key: 'not-sure', label: 'I am not sure', img: 'https://placehold.co/168x160/0B0F17/EC4899?text=?' },
    ];

    const bodyTypeOptions = useMemo(() => {
        return formData.gender === 'men' ? menBodyTypeOptions : womenBodyTypeOptions;
    }, [formData.gender]);

    const stepTitles = ["Account Setup", "Gender", "Skin Tone", "Eye Colour", "Hair Colour", "Body Metrics"];

    return (
        <div className="flex flex-col h-full py-6 animate-fade-in">
            <div className="text-center mb-4">
                 <h1 className="text-3xl font-light neon-text-pink">CREATE PROFILE</h1>
                <p className="text-slate-300 mt-1">Invite-only beta access</p>
            </div>

            <RegistrationProgressBar currentStep={step} steps={stepTitles} />
            
            <div className="flex-grow overflow-y-auto overflow-x-hidden custom-scrollbar pr-2 -mr-2">
                <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{duration: 0.3}}
                        className="space-y-4"
                    >
                        
                         <AnimatedStyledInput placeholder="Enter your email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} icon={<UserIcon />} autoFocus={true} shake={shakeFields.email}/>
                         <div>
                            <AnimatedStyledInput placeholder="Create a strong password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} icon={<LockIcon />} shake={shakeFields.password}/>
                            <motion.div 
                                className="mt-2 p-3 glass-card border border-slate-700/50 rounded-lg"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                            >
                                <ul className="space-y-2">
                                    {passwordRuleList.map(rule => (
                                        <PasswordRequirement 
                                            key={rule.key}
                                            isValid={passwordRules[rule.key]}
                                            text={rule.text}
                                        />
                                    ))}
                                </ul>
                                <PasswordStrengthMeter score={passwordStrength} />
                            </motion.div>
                         </div>
                    </motion.div>
                )}
                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{duration: 0.3}}
                    >
                       <ChoiceGrid 
                            options={genderOptions}
                            selectedKey={formData.gender}
                            onSelect={(gender) => setFormData(prev => ({...prev, gender}))}
                       />
                    </motion.div>
                )}
                 {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{duration: 0.3}}
                    >
                       <ChoiceGrid 
                            options={skinToneOptions}
                            selectedKey={formData.skinTone}
                            onSelect={(skinTone) => setFormData(prev => ({...prev, skinTone}))}
                       />
                    </motion.div>
                )}
                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{duration: 0.3}}
                    >
                       <ChoiceGrid 
                            options={eyeColorOptions}
                            selectedKey={formData.eyeColor}
                            onSelect={(eyeColor) => setFormData(prev => ({...prev, eyeColor}))}
                       />
                    </motion.div>
                )}
                 {step === 5 && (
                    <motion.div
                        key="step5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{duration: 0.3}}
                    >
                       <ChoiceGrid 
                            options={hairColorOptions}
                            selectedKey={formData.hairColor}
                            onSelect={(hairColor) => setFormData(prev => ({...prev, hairColor}))}
                       />
                    </motion.div>
                )}
                {step === 6 && (
                            <motion.div 
                                key="step6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{duration: 0.3}}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Height: <span className="text-black">{formData.height} cm</span></label>
                                    <input type="range" min="120" max="220" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Weight: <span className="text-black">{formData.weight} kg</span></label>
                                    <input type="range" min="30" max="150" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="pink-slider" />
                                </div>
                                <div className="pt-2">
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Body Type:</label>
                                    <ChoiceGrid
                                        options={bodyTypeOptions}
                                        selectedKey={formData.bodyType}
                                        onSelect={(bodyType) => setFormData(prev => ({...prev, bodyType}))}
                                    />
                                </div>
                            </motion.div>
                )}
                </AnimatePresence>
            </div>
            
            <div className="mt-auto pt-2 flex-shrink-0">
                <div className="flex gap-4">
                    {step > 1 && <button onClick={() => setStep(s => s - 1)} className="w-full py-4 font-bold rounded-lg neutral-button">Back</button>}
                    {step < 6 && <button onClick={handleNext} className={`w-full py-4 font-bold rounded-lg neon-button-pink transition-opacity duration-300 ${ (step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid) || (step === 4 && !isStep4Valid) || (step === 5 && !isStep5Valid) ? 'opacity-50' : ''}`}>Next</button>}
{step === 6 && (
  <button
    onClick={handleRegister}
    className={`w-full py-4 font-bold rounded-lg neon-button-pink transition-opacity duration-300 ${!isStep6Valid ? 'opacity-50' : ''}`}
  >
    REGISTER
  </button>
)}
                </div>
                 <p className="text-center text-slate-300 mt-4">
                    Already have an account? 
                    <a href="#" onClick={(e) => { e.preventDefault(); onSwitchScreen('login'); }} className="font-semibold text-sky-500 hover:text-sky-400 transition">Login</a>
                </p>
            </div>
        </div>
    );
};

const GlobalStyles = () => (
    <style>{`
        :root {
            --bg-color: #0B0F17;
            --cyan-glow: #0EA5E9;
            --pink-glow: #EC4899;
            --text-color: #E5E7EB;
        }
        body {
            font-family: 'Inter', sans-serif;
            color: var(--text-color);
            overflow: hidden;
            height: 100vh;
        }
        
        .neon-text-cyan {
            background: linear-gradient(90deg, var(--cyan-glow), #E5E7EB);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: 0.1em;
        }
        .neon-text-pink {
            background: linear-gradient(90deg, var(--pink-glow), #E5E7EB);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: 0.1em;
        }
        
        .neon-button-cyan, .neon-button-pink, .neutral-button {
            position: relative;
            transition: all 0.3s ease;
            overflow: hidden;
            border-radius: 0.5rem;
            padding: 1rem;
            font-weight: bold;
            outline: none;
        }
        .neon-button-cyan, .neon-button-pink {
            background: transparent;
            border: 1px solid;
        }
        .neon-button-cyan {
            border-color: var(--cyan-glow);
            color: var(--cyan-glow);
            box-shadow: 0 0 5px -2px var(--cyan-glow);
        }
        .neon-button-pink {
            border-color: var(--pink-glow);
            color: var(--pink-glow);
            box-shadow: 0 0 5px -2px var(--pink-glow);
        }
        .neon-button-pink:focus {
            box-shadow: 0 0 15px var(--pink-glow);
        }
        .neutral-button {
            background-color: rgba(229, 231, 235, 0.1);
            border: 1px solid rgba(229, 231, 235, 0.2);
            color: #E5E7EB;
        }
        .neutral-button:focus {
            box-shadow: 0 0 10px rgba(229, 231, 235, 0.4);
            border-color: rgba(229, 231, 235, 0.3);
        }

        .neon-button-cyan:active, .neon-button-pink:active, .neutral-button:active {
            transform: scale(0.98);
        }
        
        .neon-button-cyan:not(.opacity-50):active {
            background-color: rgba(14, 165, 233, 0.2);
            box-shadow: 0 0 15px var(--cyan-glow);
        }
        .neon-button-pink:not(.opacity-50):active {
             background-color: rgba(236, 72, 153, 0.2);
             box-shadow: 0 0 15px var(--pink-glow);
        }
        .neutral-button:active {
            background-color: rgba(229, 231, 235, 0.2);
        }

        .input-container {
            --height: 55px; width: 100%; height: var(--height); position: relative;
            background: rgba(229, 231, 235, 0.05);
            border: 1px solid rgba(229, 231, 235, 0.1); border-radius: 10px;
            display: flex; align-items: center; transition: all 0.3s ease;
        }
        .input-container.shake { animation: shake 0.5s ease-in-out; }
        .input-container:focus-within {
            border-color: var(--cyan-glow);
            box-shadow: 0 0 15px rgba(14, 165, 233, 0.3);
        }
        .input-icon {
            padding: 0 1rem;
            color: #94A3B8;
            transition: color 0.3s ease;
        }
        .input-container:focus-within .input-icon {
            color: var(--cyan-glow);
            filter: drop-shadow(0 0 5px var(--cyan-glow));
        }

        .password-wrapper {
            flex-grow: 1; height: 100%;
            overflow: hidden; position: relative;
        }
        .animated-input-field { 
            width: 100%; height: 100%; border: 0; outline: none; padding: 0; background: none; 
            color: transparent; letter-spacing: 2px; caret-color: transparent;
        }
        .animated-input-field::placeholder { color: #475569; }

        .password-text-layer, .password-dots-layer {
            position: absolute; top: 0; left: 0; height: 100%; pointer-events: none;
            display: inline-flex; align-items: center; color: var(--text-color);
            transition: opacity 0.3s ease;
        }
        
        .password-text-layer > span, .password-dots-layer > span {
            display: inline-block;
            animation: bounce 0.8s cubic-bezier(0, 1.26, .42, 1.26) forwards;
        }
        
        .password-dots-layer { letter-spacing: 4px; -webkit-text-security: disc; font-family: "text-security-disc"; }

        .password-text-layer.cursor::after, .password-dots-layer.cursor::after {
            content: "";
            width: 2px;
            height: 24px;
            background: var(--cyan-glow);
            display: inline-block;
            animation: blink .75s linear infinite alternate;
            border-radius: 2px;
            -webkit-text-security: none;
        }
        .password-dots-layer.cursor::after {
            height: 18px;
            transform: translateY(0px);
        }

        .password { padding-right: var(--height); }
        .password .monkey, .password .monkey-hands {
            position: absolute; width: var(--height); height: 100%; right: 0; top: 0; margin: 0;
            z-index: 1; display: flex; justify-content: center; align-items: center;
        }
        .password .monkey svg, .password .monkey-hands svg { height: calc(var(--height) - 20px); width: calc(var(--height) - 20px); }
        .password .monkey { cursor: pointer; }
        .password .monkey-hands { z-index: 2; perspective: 80px; pointer-events: none; transition: transform 0.3s ease; }
        .password .monkey-hands svg { transition: transform .2s ease-in, opacity .1s; transform-origin: 50% 100%; }

        .password.show .monkey-hands { transform: translateY(5px); }
        .password.show .monkey-hands svg { transform: perspective(100px) rotateX(-90deg); opacity: 0; transition: transform .2s ease, opacity .1s .1s; }
        
        .password .password-text-layer { opacity: 0; }
        .password.show .password-text-layer { opacity: 1; }
        .password.show .password-dots-layer { opacity: 0; }
        
        .progress-step-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }
        .progress-step {
            width: 30px; height: 30px; border-radius: 50%;
            border: 2px solid;
            display: flex; justify-content: center; align-items: center;
            font-weight: bold;
        }
        .progress-line-container {
            position: absolute;
            top: 14px;
            left: calc(50% + 15px);
            width: calc(100% - 30px);
            height: 2px;
            background-color: #475569;
        }
        .progress-line {
            height: 100%;
            background-color: var(--pink-glow);
            box-shadow: 0 0 10px var(--pink-glow);
        }

        .reg-card { 
            position: relative; aspect-ratio: 1 / 1; overflow: hidden; cursor: pointer; border-width: 2px; border-color: rgba(14, 165, 233, 0.3);
            display: flex; align-items: center; justify-content: center;
        }
        .reg-card.selected { border-color: var(--pink-glow); box-shadow: 0 0 25px rgba(236, 72, 153, 0.5); }
        .glass-card {
            background: rgba(229, 231, 235, 0.05); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(14, 165, 233, 0.2); transition: all 0.3s ease;
        }
        
        input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 6px;
            background: rgba(229, 231, 235, 0.1);
            border-radius: 5px;
            outline: none;
            transition: background 0.3s;
        }

        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            cursor: pointer;
            border: 3px solid var(--bg-color);
            background: var(--cyan-glow);
            box-shadow: 0 0 10px var(--cyan-glow);
            transition: background 0.3s, box-shadow 0.3s;
        }
        
        input[type="range"].pink-slider::-webkit-slider-thumb {
            background: var(--pink-glow);
            box-shadow: 0 0 10px var(--pink-glow);
        }

        input[type="range"]::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            cursor: pointer;
            border: 3px solid var(--bg-color);
            background: var(--cyan-glow);
            box-shadow: 0 0 10px var(--cyan-glow);
            transition: background 0.3s, box-shadow 0.3s;
        }

        input[type="range"].pink-slider::-moz-range-thumb {
            background: var(--pink-glow);
            box-shadow: 0 0 10px var(--pink-glow);
        }

        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: var(--pink-glow);
            border-radius: 6px;
            box-shadow: 0 0 10px var(--pink-glow);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #ff74c8;
        }

        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0) rotate(-1deg); }
            20%, 80% { transform: translate3d(2px, 0, 0) rotate(1deg); }
            30%, 50%, 70% { transform: translate3d(-3px, 0, 0) rotate(-2deg); }
            40%, 60% { transform: translate3d(3px, 0, 0) rotate(2deg); }
        }
        @keyframes bounce {
            0% { opacity: 0; transform: translateY(12px); }
            30% { transform: translateY(0px); }
            100% { opacity: 1; transform: translateY(0px); }
        }
        @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes fade-in { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0px); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
    `}</style>
);


export default function Registration() {
    const [screen, setScreen] = useState('login'); // 'login' or 'register'
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showPreloader, setShowPreloader] = useState(true);
    
    // Collect all image URLs for preloading
    const allImageUrls = useMemo(() => {
        const genderImages = [
            'https://i.ibb.co/TBN3nMsc/men.webp',
            'https://i.ibb.co/p6t0jmfj/Gemini-Generated-Image-x707ovx707ovx707-1.webp'
        ];
        
        const womenSkinToneImages = [
            'https://i.ibb.co/twZQLS0S/Gemini-Generated-Image-io8bstio8bstio8b.webp',
            'https://i.ibb.co/nMKsrqs7/unnamed-8.webp',
            'https://i.ibb.co/pvCysPdw/unnamed-5.webp',
            'https://i.ibb.co/pj9PKYsd/unnamed-4.webp',
            'https://i.ibb.co/C38DxrBw/unnamed-7.webp',
            'https://i.ibb.co/rKy6V171/unnamed-6.webp'
        ];
        
        const menSkinToneImages = [
            'https://i.ibb.co/VYXSBj4w/unnamed-9.webp',
            'https://i.ibb.co/qMK6Mbc1/unnamed-10.webp',
            'https://i.ibb.co/7M2sXks/unnamed-13.webp',
            'https://i.ibb.co/jvLKxLDb/unnamed-12.webp',
            'https://i.ibb.co/7dcP2G44/generated-image.webp',
            'https://i.ibb.co/TMsT51Qy/unnamed-11.webp'
        ];
        
        const eyeColorImages = [
            'https://i.ibb.co/DDgWLvvb/Gemini-Generated-Image-1ijl9s1ijl9s1ijl.webp',
            'https://i.ibb.co/Kx4S4SJY/Gemini-Generated-Image-rbud3wrbud3wrbud.webp',
            'https://i.ibb.co/FqVKXSDG/unnamed-1.webp',
            'https://i.ibb.co/W4MNcjjK/unnamed.webp',
            'https://i.ibb.co/ycj8wBXX/unnamed-2.webp',
            'https://i.ibb.co/B2QYBZsy/unnamed-3.webp'
        ];
        
        const hairColorImages = [
            'https://i.ibb.co/Lhgq7jMf/b64449ef-2f9f-40be-ac02-507c834df764.webp',
            'https://i.ibb.co/kVF9GrTM/a5c2bc78-71c7-48de-8b87-ae12c10983c9.webp',
            'https://i.ibb.co/qFBhQw23/bea22cd1-6b30-4805-96c5-9bb6c7cbe29e.webp',
            'https://i.ibb.co/4nrNNR8L/d7693ce7-19b6-411d-86bd-1017c118de11.webp',
            'https://i.ibb.co/HDbp8nDc/45aca54d-5f47-4537-9dbb-a609e73f5746.webp',
            'https://i.ibb.co/0VKGJz48/d99e8582-3a49-4c8e-9040-b656580a1ef9.webp'
        ];
        
        const menBodyTypeImages = [
            'https://i.ibb.co/39f2Cj35/generated-image-4-1.webp',
            'https://i.ibb.co/NccSCc8/generated-image-5-1.webp',
            'https://i.ibb.co/CsNLzqZH/generated-image-3-1.webp',
            'https://i.ibb.co/tTgHqsx8/generated-image-2-1.webp',
            'https://i.ibb.co/rfxmbHSz/generated-image-1-2.webp'
        ];
        
        const womenBodyTypeImages = [
            'https://i.ibb.co/BHfTXgQn/Screenshot-2025-09-21-030852.webp',
            'https://i.ibb.co/JWPWTJL2/Screenshot-2025-09-21-030209.webp',
            'https://i.ibb.co/kgf1dGmB/Screenshot-2025-09-21-030551.webp',
            'https://i.ibb.co/53Vf41T/Screenshot-2025-09-21-025859.webp',
            'https://i.ibb.co/1GRbzp6v/Screenshot-2025-09-21-025524.webp'
        ];
        
        return [
            ...genderImages,
            ...womenSkinToneImages,
            ...menSkinToneImages,
            ...eyeColorImages,
            ...hairColorImages,
            ...menBodyTypeImages,
            ...womenBodyTypeImages
        ];
    }, []);
    
    // Use the image preloader hook
    const { imagesLoaded } = useImagePreloader(allImageUrls);
    
    // Hide preloader when images are loaded
    useEffect(() => {
        if (imagesLoaded) {
            setShowPreloader(false);
        }
    }, [imagesLoaded]);
    
    const handleSwitchScreen = (newScreen) => {
        if (screen === newScreen) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setScreen(newScreen);
            // A short delay for the new screen to mount before star animation starts
            setTimeout(() => setIsTransitioning(false), 50); 
        }, 500); // Corresponds to star fade-out duration
    };

    return (
        <>
            <GlobalStyles />
            <AnimatePresence>
                {showPreloader && (
                    <Preloader onComplete={() => setShowPreloader(false)} />
                )}
            </AnimatePresence>
            <div className="w-full h-screen flex items-center justify-center p-4">
                <BackgroundFx isTransitioning={isTransitioning} />
                <main className="w-full max-w-sm mx-auto h-full z-10">
                    {screen === 'login' ? (
                        <LoginScreen onSwitchScreen={handleSwitchScreen} />
                    ) : (
                        <RegisterScreen onSwitchScreen={handleSwitchScreen} />
                    )}
                </main>
            </div>
        </>
    );
}