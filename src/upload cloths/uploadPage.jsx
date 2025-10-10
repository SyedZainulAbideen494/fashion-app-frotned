import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Lottie from 'lottie-react';
import { FiUpload, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import successAnimation from '../userInfo Flow/Success.json';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { API_ROUTES } from '../app_modules/apiRoutes';

/* ========= Animations ========= */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

/* ========= Page ========= */
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 50px 16px;
  background: linear-gradient(135deg, var(--bg-900), var(--bg-800));
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

/* ========= Card ========= */
const Card = styled.div`
  width: 100%;
  max-width: 460px;
  padding: 38px 30px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px) saturate(1.15);
  -webkit-backdrop-filter: blur(18px) saturate(1.15);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 22px;
  align-items: center;
  text-align: center;
  position: relative;
  animation: ${fadeUp} 0.6s ease forwards;
`;

const BackBtn = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(6px);
  padding: 8px 12px;
  border-radius: 10px;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;

  &:hover {
    color: #fff;
    transform: translateX(-3px);
    background: rgba(255,255,255,0.08);
  }
`;

const Title = styled.h2`
  margin-top: 10px;
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  margin-top: -4px;
  color: var(--muted);
  font-size: 0.95rem;
  max-width: 300px;
`;

/* ========= Upload ========= */
const DropZone = styled.label`
  width: 100%;
  border: 2px dashed rgba(255,255,255,0.1);
  border-radius: 18px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.02);
  backdrop-filter: blur(6px);

  &:hover {
    background: rgba(255,255,255,0.04);
    border-color: rgba(var(--accent),0.4);
    transform: translateY(-2px);
  }

  input {
    display: none;
  }
`;

const DropText = styled.span`
  font-size: 0.95rem;
  color: var(--muted);
`;

const Preview = styled.img`
  width: 100%;
  border-radius: 16px;
  object-fit: cover;
  max-height: 240px;
  border: 1px solid rgba(255,255,255,0.08);
  animation: ${fadeUp} 0.4s ease forwards;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
`;

/* ========= Hashtag ========= */
const HashtagInput = styled.input`
  width: 100%;
  padding: 13px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
  color: #fff;
  outline: none;
  transition: all 0.15s ease;
  margin-top: 4px;

  &:focus {
    border-color: rgba(var(--accent),0.5);
    background: rgba(255,255,255,0.03);
  }

  &::placeholder {
    color: var(--muted);
  }
`;

const TagsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const TagBtn = styled.button`
  padding: 6px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
  color: var(--muted);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255,255,255,0.04);
    color: #fff;
    transform: translateY(-2px);
  }
`;

/* ========= Button ========= */
const UploadBtn = styled.button`
  width: 100%;
  padding: 15px;
  border-radius: 14px;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  color: #fff;
  background: linear-gradient(90deg, rgba(var(--accent),0.4), rgba(var(--accent),0.2));
  background-size: 200% 100%;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  &:hover {
    animation: ${shimmer} 1.2s linear infinite;
    transform: translateY(-2px) scale(1.01);
  }
`;

/* ========= Modal ========= */
const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalCard = styled.div`
  width: 90%;
  max-width: 340px;
  background: rgba(255,255,255,0.05);
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(18px);
  padding: 26px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: ${fadeUp} 0.4s ease forwards;
`;

const FloatingLottie = styled(Lottie)`
  height: 140px;
  animation: ${float} 6s ease-in-out infinite;
`;

const Spinner = styled.div`
  width: 46px;
  height: 46px;
  border: 3px solid rgba(255,255,255,0.15);
  border-top: 3px solid rgba(var(--accent),0.8);
  border-radius: 50%;
  margin: 0 auto;
  animation: ${spin} 1s linear infinite;
`;

export default function ClothingUpload() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [hashtag, setHashtag] = useState('');
  const [previousTags, setPreviousTags] = useState([]);
  const [showUploading, setShowUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPremiumError, setShowPremiumError] = useState(false);
const [premiumErrorMsg, setPremiumErrorMsg] = useState('');

  const nav = useNavigate();

  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await Axios.post(`${API_ROUTES.baseURL}/hashtags/previous`, { token });
        setPreviousTags(res.data);
      } catch (err) {
        console.error('Error fetching hashtags:', err);
      }
    };
    fetchHashtags();
  }, []);

  const handleFileChange = e => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) setPreviewUrl(URL.createObjectURL(selected));
  };

 const handleUpload = async () => {
  if (!file || !hashtag.trim()) return alert('Please select an image and enter a hashtag');
  setShowUploading(true);

  setTimeout(async () => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('hashtag', hashtag.trim());
    formData.append('token', localStorage.getItem('token'));

    try {
      const res = await Axios.post(`${API_ROUTES.baseURL}/upload/cloths`, formData);
      if (res.data.success) {
        setShowUploading(false);
        setShowSuccess(true);
      } else if (res.data.errorMessage) {
        // Plan restriction or other backend error
        setShowUploading(false);
        setPremiumErrorMsg(res.data.errorMessage);
        setShowPremiumError(true);
      }
    } catch (err) {
      setShowUploading(false);
      if (err.response?.data?.errorMessage) {
        setPremiumErrorMsg(err.response.data.errorMessage);
        setShowPremiumError(true);
      } else {
        alert('Unexpected error occurred. Please try again.');
      }
    }
  }, 700);
};

  return (
    <Page>
      <Card>
        <BackBtn onClick={() => nav('/')}>
          <FiArrowLeft size={16} /> Back
        </BackBtn>

        <Title>Upload Clothing</Title>
        <Subtitle>Make your wardrobe smarter 🧠✨</Subtitle>

        {!previewUrl ? (
          <DropZone>
            <FiUpload size={34} />
            <DropText>Click or drag your outfit image here</DropText>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </DropZone>
        ) : (
          <Preview src={previewUrl} alt="Preview" />
        )}

        <HashtagInput
          placeholder="#streetwear #winterfit"
          value={hashtag}
          onChange={e => setHashtag(e.target.value)}
        />

        <TagsWrapper>
          {previousTags.map((tag, idx) => (
            <TagBtn key={idx} onClick={() => setHashtag(tag)}>
              {tag}
            </TagBtn>
          ))}
        </TagsWrapper>

        <UploadBtn onClick={handleUpload}>
          <BsStars size={18} /> Upload Now
        </UploadBtn>
      </Card>

      {showUploading && (
        <ModalBackdrop>
          <ModalCard>
            <Spinner />
            <h3 style={{ margin: 0 }}>Uploading your fit 👕✨</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>
              Just a sec, making it stylish...
            </p>
          </ModalCard>
        </ModalBackdrop>
      )}

      {showSuccess && (
        <ModalBackdrop>
          <ModalCard>
            <FloatingLottie animationData={successAnimation} loop={false} />
            <h3 style={{ margin: 0 }}>Uploaded Successfully</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>
              Your outfit has been added to your wardrobe 🎉
            </p>
            <UploadBtn onClick={() => nav('/')}>
              <FiCheckCircle /> Done
            </UploadBtn>
          </ModalCard>
        </ModalBackdrop>
      )}
      {showPremiumError && (
  <ModalBackdrop>
    <ModalCard>
      <h3 style={{ margin: 0, color: '#ff7675' }}>Upload Limit Reached 🚫</h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
        {premiumErrorMsg}
      </p>
      <UploadBtn onClick={() => nav('/premium')}>
        Upgrade Plan
      </UploadBtn>
      <UploadBtn
        style={{ background: 'rgba(255,255,255,0.05)', marginTop: '8px' }}
        onClick={() => setShowPremiumError(false)}
      >
        Close
      </UploadBtn>
    </ModalCard>
  </ModalBackdrop>
)}

    </Page>
  );
}
