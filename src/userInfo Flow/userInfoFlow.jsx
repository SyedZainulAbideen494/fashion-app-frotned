import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./userDetails.css"; // your styling here
import maleImg from '../assets/images/icons8-male-50.png'
import femaleImg from '../assets/images/icons8-female-50.png'
import otherGenderImg from '../assets/images/icons8-follow-each-other-48.png'
import triangleImg from '../assets/images/icons8-triangle-26.png'
import invertedTriangleImg from '../assets/images/icons8-triangle-arrow-30.png'
import RoundImg from '../assets/images/icons8-round-50.png'
import rectangleImg from '../assets/images/icons8-rectangle-48.png'
import tremImg from '../assets/images/icons8-basic-64.png'
import notSureImg from '../assets/images/icons8-confused-26.png'
import ovalFaceImg from '../assets/images/icons8-interior-mirror-50.png'
import squareImg from '../assets/images/icons8-square-50.png'
import diamondImg from '../assets/images/icons8-kite-shape-50.png'
import heartImg from '../assets/images/icons8-heart-24.png'
import axios from 'axios';
import { API_ROUTES } from "../app_modules/apiRoutes";
import { nav } from "framer-motion/m";
import { useNavigate } from "react-router-dom";

function zodiacFromDate(dob) {
  if (!dob) return null;
  const date = new Date(dob);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  return null;
}
// Dummy image URLs (replace with your assets)
const genderOptions = [
  { label: "Male", img: maleImg },
  { label: "Female", img: femaleImg },
  { label: "Other", img: otherGenderImg }
];

const bodyTypes = [
  { label: "Triangle", img: triangleImg },
  { label: "Inverted Triangle", img: invertedTriangleImg},
  { label: "Round", img: RoundImg },
  { label: "Rectangle", img: rectangleImg },
  { label: "Trapezium", img: tremImg },
  { label: "Not Sure", img: notSureImg}
];

const colorPreferences = [
  { name: 'Warm', colorCode: '#D2691E', hashtags: ['#WarmVibes', '#GoldenHourGlow', '#AutumnTones'] },
  { name: 'Cool', colorCode: '#4682B4', hashtags: ['#CoolTones', '#IcyVibes', '#WinterChic'] },
  { name: 'Neutral', colorCode: '#D2B48C', hashtags: ['#NeutralStyle', '#BeigeVibes', '#CreamAesthetic'] },
  { name: 'Earthy', colorCode: '#556B2F', hashtags: ['#EarthyTones', '#NatureVibes', '#ForestAesthetic'] },
  { name: 'Pastel', colorCode: '#FFD1DC', hashtags: ['#PastelVibes', '#SoftAndDreamy', '#CottonCandySky'] },
  { name: 'Vibrant', colorCode: '#FF4500', hashtags: ['#BoldAndBright', '#ColorPop', '#NeonMood'] },
  { name: 'Not Sure', colorCode: '#808080', hashtags: ['#StyleExplorer', '#FindYourVibe', '#FashionJourney'] },
];



const eyeColors = [
  { name: "Brown", colorCode: "#8B4513", hashtags: ["#WarmEyes", "#SoftGaze", "#NaturalCharm"] },
  { name: "Light Brown", colorCode: "#A0522D", hashtags: ["#GoldenBrown", "#HoneyEyes", "#AmberGaze"] },
  { name: "Dark Brown", colorCode: "#5C4033", hashtags: ["#DeepBrown", "#RichEyes", "#ClassicLook"] },
  { name: "Blue", colorCode: "#4682B4", hashtags: ["#OceanEyes", "#CoolGaze", "#SkyVibes"] },
  { name: "Light Blue", colorCode: "#87CEEB", hashtags: ["#IceBlue", "#AquaGaze", "#CrystalEyes"] },
  { name: "Green", colorCode: "#3CB371", hashtags: ["#EmeraldEyes", "#NatureVibes", "#FreshLook"] },
  { name: "Hazel", colorCode: "#BDB76B", hashtags: ["#GoldenGaze", "#UniqueLook", "#EarthyVibes"] },
  { name: "Amber", colorCode: "#FFBF00", hashtags: ["#GoldenEyes", "#SunsetGaze", "#AmberBeauty"] },
  { name: "Grey", colorCode: "#708090", hashtags: ["#MistyEyes", "#CoolTone", "#UrbanVibe"] },
  { name: "Light Grey", colorCode: "#B0C4DE", hashtags: ["#FrostGaze", "#SilverEyes", "#IcyLook"] },
  { name: "Violet", colorCode: "#8A2BE2", hashtags: ["#RareViolet", "#MysticEyes", "#UniqueCharm"] },
  { name: "Black", colorCode: "#000000", hashtags: ["#DeepBlack", "#MysteriousEyes", "#BoldLook"] },
  { name: "Not Sure", colorCode: "#808080", hashtags: ["#MysteryLook", "#StyleExplorer", "#FindYourVibe"] }
];


const hairColors = [
  { name: "Black", colorCode: "#000000", hashtags: ["#ClassicBlack", "#BoldLook", "#TimelessStyle"] },
  { name: "Brown", colorCode: "#8B4513", hashtags: ["#WarmBrown", "#NaturalCharm", "#EverydayStyle"] },
  { name: "Blonde", colorCode: "#FFD700", hashtags: ["#GoldenHair", "#SummerVibes", "#BrightStyle"] },
  { name: "Red", colorCode: "#B22222", hashtags: ["#FieryRed", "#BoldStatement", "#PassionateVibe"] },
  { name: "Grey", colorCode: "#A9A9A9", hashtags: ["#SilverStyle", "#MatureCharm", "#CoolVibe"] },
  { name: "Not Sure", colorCode: "#808080", hashtags: ["#HairExplorer", "#FindYourStyle", "#FashionJourney"] },
];


const faceTypes = [
  { label: "Oval", img: ovalFaceImg },
  { label: "Round", img: RoundImg},
  { label: "Square", img: squareImg },
  { label: "Heart", img: heartImg },
  { label: "Diamond", img: diamondImg },
  { label: "Not Sure", img: notSureImg }
];

export default function UserDetailsForm() {
  const steps = [
    "Name",
    "Date of Birth",
    "Gender",
    "Body Type",
    "Style Description",
    "Color Preferences",
    "Eye Color",
    "Hair Color",
    "Face Type",
    "Clothes to Enhance/Hide",
    "Try New Styles",
    "Dress to Fit In?",
    "Fun Fact"
  ];

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const nav = useNavigate()

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleSelect = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    nextStep();
  };

  const handleSubmit = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    const payload = {
      token,   // Send token here
      name: formData.name,
      dob: formData.dob,
      gender: formData.gender,
      bodyType: formData.bodyType,
      stylePref: formData.style,
      zodiac: formData.dob ? zodiacFromDate(formData.dob) : null,
      colorPreferences: formData.colorPreferences,
      eyeColor: formData.eyeColor,
      hairColor: formData.hairColor,
      faceType: formData.faceType,
      enhanceHide: formData.enhanceHide,
      newStyle: formData.newStyle,
      fitIn: formData.fitIn,
    };

    await axios.post(`${API_ROUTES.baseURL}/save-details`, payload);

nav('/')
  } catch (err) {
    alert('Failed to save.');
  }
};


  const cardSelectUI = (key, options) => (
    <div className="card-grid">
      {options.map((opt) => (
        <motion.div
          key={opt.label}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`select-card ${formData[key] === opt.label ? "selected" : ""}`}
          onClick={() => handleSelect(key, opt.label)}
        >
          <img src={opt.img} alt={opt.label} />
          <span>{opt.label}</span>
        </motion.div>
      ))}
    </div>
  );

  return (
  <div className="form-wrapper__user__flow">
  <AnimatePresence mode="wait">
    <motion.div
      key={step}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      className="step-container__user__flow"
    >
      {step === 0 && (
        <div>
          <h3>What's Your Name?</h3>
          <input
            className="input-field__user__flow"
            type="text"
            placeholder="Type here..."
            value={formData.name || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <button
            className="button__user__flow"
            onClick={nextStep}
            disabled={!formData.name}
          >
            Next
          </button>
        </div>
      )}

      {step === 1 && (
        <div>
          <h3>When Were You Born?</h3>
          <input
            className="input-field__user__flow"
            type="date"
            value={formData.dob || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dob: e.target.value }))
            }
          />
          <button
            className="button__user__flow"
            onClick={nextStep}
            disabled={!formData.dob}
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <>
          <h3>Select Your Gender</h3>
          {cardSelectUI("gender", genderOptions)}
        </>
      )}

      {step === 3 && (
        <>
          <h3>Select Your Body Type</h3>
          {cardSelectUI("bodyType", bodyTypes)}
        </>
      )}

      {step === 4 && (
        <div>
          <h3>Describe Your Style</h3>
          <textarea
            className="input-textarea__user__flow"
            placeholder="E.g. casual, chic, streetwear..."
            value={formData.style || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, style: e.target.value }))
            }
          />
          <button
            className="button__user__flow"
            onClick={nextStep}
            disabled={!formData.style}
          >
            Next
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="color-preferences__user__flow">
          <h3>Select Your Color Preferences</h3>
          {colorPreferences.map((pref, index) => (
            <div
              key={index}
              className="color-option__user__flow"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  colorPreferences: [pref.name],
                }));
                setStep((prev) => prev + 1);
              }}
            >
              <div
                className="color-box__user__flow"
                style={{ backgroundColor: pref.colorCode }}
              ></div>
              <span>{pref.name}</span>
            </div>
          ))}
        </div>
      )}

      {step === 6 && (
        <div className="color-preferences__user__flow">
          <h3>Select Your Eye Color</h3>
          {eyeColors.map((color, index) => (
            <div
              key={index}
              className="color-option__user__flow"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  eyeColor: color.name,
                }));
                setStep((prev) => prev + 1);
              }}
            >
              <div
                className="color-box__user__flow"
                style={{ backgroundColor: color.colorCode }}
              ></div>
              <span>{color.name}</span>
            </div>
          ))}
        </div>
      )}

      {step === 7 && (
        <div className="color-preferences__user__flow">
          <h3>Select Your Hair Color</h3>
          {hairColors.map((color, index) => (
            <div
              key={index}
              className="color-option__user__flow"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  hairColor: color.name,
                }));
                setStep((prev) => prev + 1);
              }}
            >
              <div
                className="color-box__user__flow"
                style={{ backgroundColor: color.colorCode }}
              ></div>
              <span>{color.name}</span>
            </div>
          ))}
        </div>
      )}

      {step === 8 && (
        <>
          <h3>Select Your Face Type</h3>
          {cardSelectUI("faceType", faceTypes)}
        </>
      )}

      {step === 9 && (
        <div>
          <h3>What Do You Want to Enhance/Hide?</h3>
          <div className="tag-grid__user__flow">
            {["Shoulders", "Waist", "Legs", "Arms"].map((item) => (
              <div
                key={item}
                className={`tag__user__flow ${
                  formData.enhanceHide?.includes(item) ? "selected" : ""
                }`}
                onClick={() => {
                  setFormData((prev) => {
                    const current = prev.enhanceHide || [];
                    return current.includes(item)
                      ? { ...prev, enhanceHide: current.filter((i) => i !== item) }
                      : { ...prev, enhanceHide: [...current, item] };
                  });
                }}
              >
                {item}
              </div>
            ))}
          </div>
          <button className="button__user__flow" onClick={nextStep}>
            Next
          </button>
        </div>
      )}

      {step === 10 && (
        <div>
          <h3>How Open Are You to New Styles?</h3>
          <input
            className="range__user__flow"
            type="range"
            min="0"
            max="10"
            value={formData.newStyle || 5}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                newStyle: parseInt(e.target.value),
              }))
            }
          />
          <button className="button__user__flow" onClick={nextStep}>
            Next
          </button>
        </div>
      )}

      {step === 11 && (
        <div>
          <h3>Do You Dress to Fit In?</h3>
          <div className="pill-buttons__user__flow">
            {["Yes", "No"].map((opt) => (
              <div
                key={opt}
                className={`pill__user__flow ${
                  formData.fitIn === opt ? "selected" : ""
                }`}
                onClick={() => handleSelect("fitIn", opt)}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 12 && (
        <div className="fun-fact__user__flow">
  <h3>✨ Fun Fact</h3>
  <p>
    Our AI analyzes the latest fashion trends in real-time to recommend the perfect outfits tailored just for you.
  </p>
  <button
    className="button__user__flow"
    onClick={() => handleSubmit(formData)}
    disabled={loading}
  >
    {loading ? "Saving..." : "Finish"}
  </button>
</div>

      )}
    </motion.div>
  </AnimatePresence>

  {step > 0 && (
    <button className="back-btn__user__flow" onClick={prevStep}>
      Back
    </button>
  )}
</div>

  );
}
