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
  const formData = new FormData();

  // Append images in the exact order of selectedClothes
  for (const cloth of selectedClothes) {
    const response = await fetch(`${API_ROUTES.displayImg}/${cloth.image}`);
    const blob = await response.blob();
    formData.append('images', new File([blob], cloth.image, { type: blob.type }));
  }

  formData.append('activity', activity);
  formData.append('comfort', JSON.stringify(comfort));
  formData.append('psychology', JSON.stringify(psychology));

  // Include cloth_id, hashtag, type, image_name exactly
  formData.append('clothes', JSON.stringify(
    selectedClothes.map(c => ({
      cloth_id: c.cloth_id,
      hashtag: c.hashtag,
      type: c.type || 'unknown',
      image_name: c.image // important for mapping
    }))
  ));

  formData.append('token', localStorage.getItem('token'));

  try {
    const res = await axios.post(`${API_ROUTES.baseURL}/generate-outfit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    setOutfits(res.data.outfits.outfits); // JSON structure as returned by backend
    setStep(5);
  } catch (err) {
    console.error(err);
    alert('Error generating outfit.');
  }
  setLoading(false);
};


  const fade = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };

  return (
    <div className="darkContainer">
      {loading && <div className="loader"><div className="spinner"></div></div>}

      <AnimatePresence mode="wait">
        {/* Step 1: Clothes Selection */}
        {step === 1 && (
          <motion.div {...fade} key="step1" className="darkCard">
            <h2 className="titleDark">Select Your Clothes</h2>
            <div className="scrollClothesDark">
              {Object.entries(hashtagClothes).map(([hashtag, clothes]) => (
                <div key={hashtag}>
                  <h3 className="hashtagTitleDark">#{hashtag}</h3>
                  <div className="clothesGridDark">
                    {clothes.map(cloth => (
                      <motion.div
                        key={cloth.cloth_id}
                        className={`clothCardDark ${selectedClothes.some(c => c.cloth_id === cloth.cloth_id) ? 'selectedDark' : ''}`}
                        onClick={() => toggleSelect(cloth)}
                        whileHover={{ scale: 1.05 }}
                      >
                        <img src={`${API_ROUTES.displayImg}/${cloth.image}`} alt="" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="primaryBtnDark" disabled={!selectedClothes.length} onClick={() => setStep(2)}>Next →</button>
          </motion.div>
        )}

        {/* Step 2: Activity */}
        {step === 2 && (
          <motion.div {...fade} key="step2" className="darkCard">
            <h2 className="titleDark">Choose Activity</h2>
            <div className="optionGridDark">
              {['Sports','Office','Party','Religious','Casual','College'].map(opt => (
                <button key={opt} className="optionBtnDark" onClick={() => { setActivity(opt); setStep(3); }}>
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Comfort */}
        {step === 3 && (
          <motion.div {...fade} key="step3" className="darkCard">
            <h2 className="titleDark">Comfort Preferences</h2>
            <div className="sliderContainerDark">
              <label>Fit: {comfort.fit}</label>
              <input type="range" min="1" max="10" value={comfort.fit} onChange={e => setComfort({ ...comfort, fit: Number(e.target.value) })} />
              <label>Movement: {comfort.movement}</label>
              <input type="range" min="1" max="10" value={comfort.movement} onChange={e => setComfort({ ...comfort, movement: Number(e.target.value) })} />
            </div>
            <button className="primaryBtnDark" onClick={() => setStep(4)}>Next →</button>
          </motion.div>
        )}

        {/* Step 4: Psychology */}
        {step === 4 && (
          <motion.div {...fade} key="step4" className="darkCard">
            <h2 className="titleDark">Mood & Expression</h2>
            <div className="sliderContainerDark">
              <label>Mood: {psychology.mood}</label>
              <input type="range" min="1" max="10" value={psychology.mood} onChange={e => setPsychology({ ...psychology, mood: Number(e.target.value) })} />
              <label>Self Expression: {psychology.selfExpression}</label>
              <input type="range" min="1" max="10" value={psychology.selfExpression} onChange={e => setPsychology({ ...psychology, selfExpression: Number(e.target.value) })} />
              <label>Nostalgia: {psychology.nostalgia}</label>
              <input type="range" min="1" max="10" value={psychology.nostalgia} onChange={e => setPsychology({ ...psychology, nostalgia: Number(e.target.value) })} />
            </div>
            <button className="primaryBtnDark" onClick={handleSubmit}>Generate Outfit</button>
          </motion.div>
        )}

        {/* Step 5: Results */}
        {step === 5 && (
          <motion.div {...fade} key="step5" className="darkCard">
            <h2 className="titleDark">Your Outfit Suggestions</h2>
            <div className="outfitListDark">
              {outfits.map((outfit, i) => (
                <div key={i} className="outfitCardDark">
                  <h4>{outfit.title}</h4>
                  <div className="outfitImagesDark">
  {outfit.cloth_ids.map(id => {
    const cloth = selectedClothes.find(c => c.cloth_id === id);
    return cloth && <motion.img key={id} src={`${API_ROUTES.displayImg}/${cloth.image}`} alt="" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} />;
  })}
</div>
{/* Show AI explanation */}
{outfit.description && (
  <p className="text-slate-300 text-sm mt-2 italic">{outfit.description}</p>
)}

                </div>
              ))}
            </div>
            <button className="primaryBtnDark" onClick={() => setStep(1)}>Generate Another</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OutfitGenerator;
