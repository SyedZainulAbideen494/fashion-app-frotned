import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { motion, AnimatePresence } from 'framer-motion';
import './OutfitGenerator.css';

const OutfitGenerator = () => {
  const [step, setStep] = useState(1);
  const [hashtagClothes, setHashtagClothes] = useState({});
  const [selectedClothes, setSelectedClothes] = useState([]);
  const [activity, setActivity] = useState('');
  const [comfort, setComfort] = useState({ fit: 5, movement: 5 });
  const [psychology, setPsychology] = useState({ mood: 5, selfExpression: 5, nostalgia: 5 });
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchClothes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(`${API_ROUTES.baseURL}/clothes`, { token });
        setHashtagClothes(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchClothes();
  }, []);

  const toggleSelect = (cloth) => {
    setSelectedClothes(prev =>
      prev.find(c => c.cloth_id === cloth.cloth_id)
        ? prev.filter(c => c.cloth_id !== cloth.cloth_id)
        : [...prev, cloth]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg('');
    const formData = new FormData();

    for (const cloth of selectedClothes) {
      const response = await fetch(`${API_ROUTES.displayImg}/${cloth.image}`);
      const blob = await response.blob();
      formData.append('images', new File([blob], cloth.image, { type: blob.type }));
    }

    formData.append('activity', activity);
    formData.append('comfort', JSON.stringify(comfort));
    formData.append('psychology', JSON.stringify(psychology));
    formData.append('clothes', JSON.stringify(
      selectedClothes.map(c => ({
        cloth_id: c.cloth_id,
        hashtag: c.hashtag,
        type: c.type || 'unknown',
        image_name: c.image
      }))
    ));
    formData.append('token', localStorage.getItem('token'));

    try {
      const res = await axios.post(`${API_ROUTES.baseURL}/generate-outfit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success === false && res.data.error) {
        setErrorMsg(res.data.error);
        setLoading(false);
        return;
      }

      setOutfits(res.data.outfits.outfits);
      setStep(5);
    } catch (err) {
      if (err.response && err.response.data?.error) {
        setErrorMsg(err.response.data.error);
      } else {
        setErrorMsg('Something went wrong while generating your outfit.');
      }
    }

    setLoading(false);
  };

  const fade = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };

  // Filter clothes based on search query
  const filteredHashtagClothes = Object.fromEntries(
    Object.entries(hashtagClothes)
      .filter(([hashtag]) => hashtag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="relative min-h-screen bg-[#0b0b0e] overflow-hidden text-white font-sans flex flex-col items-center">
      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-pink-500/20 blur-[100px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      {/* Top Nav */}
      <nav className="w-full max-w-3xl flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-white/5 border-b border-white/10 rounded-b-3xl sticky top-0 z-20">
        <button onClick={() => window.location.href = '/'} className="p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition">
          <i className="fa-solid fa-arrow-left text-xl text-white"></i>
        </button>
        <div className="relative flex-1 mx-4">
          <input
            type="text"
            placeholder="Search #hashtag"
            className="w-full px-4 py-2 rounded-full bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <i className="fa-solid fa-magnifying-glass absolute right-4 top-3 text-gray-400"></i>
        </div>
        <div className="w-10"></div>
      </nav>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-3xl mt-6 mb-10 px-6"
        >
          <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_40px_rgba(0,0,0,0.4)] flex flex-col items-center gap-6 transition-all duration-300 relative">
            {loading && <div className="loader"><div className="spinner"></div></div>}

            {/* STEP 1: Clothes Selection */}
            {step === 1 && (
              <>
                <h2 className="text-2xl font-semibold text-white">Select Your Clothes</h2>
                <div className="scrollClothesDark w-full max-h-[60vh] overflow-y-auto rounded-2xl p-2">
                  {Object.entries(filteredHashtagClothes).length > 0 ? Object.entries(filteredHashtagClothes).map(([hashtag, clothes]) => (
                    <div key={hashtag} className="mb-5">
                      <h3 className="text-center text-gray-300 font-medium mb-3">#{hashtag}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {clothes.map(cloth => (
                          <motion.div
                            key={cloth.cloth_id}
                            onClick={() => toggleSelect(cloth)}
                            whileHover={{ scale: 1.05 }}
                            className={`overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer ${
                              selectedClothes.some(c => c.cloth_id === cloth.cloth_id)
                                ? 'border-pink-500 shadow-[0_0_20px_rgba(255,64,129,0.4)]'
                                : 'border-white/10 hover:border-white/30'
                            }`}
                          >
                            <img
                              src={`${API_ROUTES.displayImg}/${cloth.image}`}
                              alt=""
                              className="w-full h-40 object-cover rounded-2xl"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-400 text-center mt-10">No clothes found for this hashtag.</p>
                  )}
                </div>
                <button
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-white font-semibold active:scale-95 transition disabled:opacity-50"
                  disabled={!selectedClothes.length}
                  onClick={() => setStep(2)}
                >
                  Next →
                </button>
              </>
            )}

            {/* STEP 2: Activity */}
            {step === 2 && (
              <>
                <h2 className="text-2xl font-semibold text-white">Choose Activity</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                  {['Sports','Office','Party','Religious','Casual','College'].map(opt => (
                    <button key={opt} className="optionBtnDark" onClick={() => { setActivity(opt); setStep(3); }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* STEP 3: Comfort */}
            {step === 3 && (
              <>
                <h2 className="text-2xl font-semibold text-white">Comfort Preferences</h2>
                <div className="sliderContainerDark w-full">
                  <label>Fit: {comfort.fit}</label>
                  <input type="range" min="1" max="10" value={comfort.fit} onChange={e => setComfort({ ...comfort, fit: Number(e.target.value) })} />
                  <label>Movement: {comfort.movement}</label>
                  <input type="range" min="1" max="10" value={comfort.movement} onChange={e => setComfort({ ...comfort, movement: Number(e.target.value) })} />
                </div>
                <button className="primaryBtnDark" onClick={() => setStep(4)}>Next →</button>
              </>
            )}

            {/* STEP 4: Psychology */}
            {step === 4 && (
              <>
                <h2 className="text-2xl font-semibold text-white">Mood & Expression</h2>
                <div className="sliderContainerDark w-full">
                  <label>Mood: {psychology.mood}</label>
                  <input type="range" min="1" max="10" value={psychology.mood} onChange={e => setPsychology({ ...psychology, mood: Number(e.target.value) })} />
                  <label>Self Expression: {psychology.selfExpression}</label>
                  <input type="range" min="1" max="10" value={psychology.selfExpression} onChange={e => setPsychology({ ...psychology, selfExpression: Number(e.target.value) })} />
                  <label>Nostalgia: {psychology.nostalgia}</label>
                  <input type="range" min="1" max="10" value={psychology.nostalgia} onChange={e => setPsychology({ ...psychology, nostalgia: Number(e.target.value) })} />
                </div>
                <button className="primaryBtnDark" onClick={handleSubmit}>Generate Outfit</button>
              </>
            )}

            {/* STEP 5: Results */}
            {step === 5 && (
              <>
                <h2 className="text-2xl font-semibold text-white">Your Outfit Suggestions</h2>
                <div className="outfitListDark w-full">
                  {outfits.map((outfit, i) => (
                    <div key={i} className="outfitCardDark">
                      <h4 className="text-white font-medium">{outfit.title}</h4>
                      <div className="outfitImagesDark">
                        {outfit.cloth_ids.map(id => {
                          const cloth = selectedClothes.find(c => c.cloth_id === id);
                          return cloth && <motion.img key={id} src={`${API_ROUTES.displayImg}/${cloth.image}`} alt="" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl" />;
                        })}
                      </div>
                      {outfit.description && <p className="text-gray-300 text-sm mt-2 italic">{outfit.description}</p>}
                    </div>
                  ))}
                </div>
                <button className="primaryBtnDark" onClick={() => setStep(1)}>Generate Another</button>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ERROR MODAL */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50"
        >
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-[90%] max-w-md text-center shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-3">Upgrade Required</h2>
            <p className="text-gray-300 text-sm mb-6">{errorMsg}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => window.location.href = '/premium'}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md text-sm font-medium hover:opacity-90"
              >
                Upgrade Plan
              </button>
              <button
                onClick={() => setErrorMsg('')}
                className="px-4 py-2 bg-white/10 text-gray-300 rounded-md text-sm hover:bg-white/20"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OutfitGenerator;
