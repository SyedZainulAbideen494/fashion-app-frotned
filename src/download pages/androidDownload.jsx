import React, { useEffect, useState } from "react";
import { API_ROUTES } from "../app_modules/apiRoutes";
import { useNavigate } from "react-router-dom";

const DownloadPageAndroid = () => {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [copied, setCopied] = useState(false);
  const [cardHover, setCardHover] = useState(false);
  const nav = useNavigate()
  const downloadLink = "https://fashion-app-frotned.vercel.app/android/download";

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (ua.includes("Instagram")) setIsInAppBrowser(true);

    const beforeInstallPromptHandler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    return () =>
      window.removeEventListener("beforeinstallprompt", beforeInstallPromptHandler);
  }, []);

 const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

    

      if (response.ok) {
        console.log('Download request logged successfully');
      } else {
        console.error('Failed to log download request');
      }

      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(downloadLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Unable to copy. Long-press to copy manually.");
    }
  };

  // Styles
  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    background:
      "radial-gradient(1200px 600px at 10% 10%, rgba(255,255,255,0.02), transparent 6%), radial-gradient(900px 400px at 90% 90%, rgba(255,255,255,0.015), transparent 6%), #0a0a0a",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
    color: "rgba(255,255,255,0.92)",
  };

  const cardStyle = {
    width: "min(900px, 95%)",
    borderRadius: 24,
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    alignItems: "center",
    backdropFilter: "blur(16px) saturate(130%)",
    WebkitBackdropFilter: "blur(16px) saturate(130%)",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: cardHover
      ? "0 20px 40px rgba(0,0,0,0.6)"
      : "0 8px 20px rgba(0,0,0,0.4)",
    transform: cardHover ? "translateY(-6px)" : "none",
    transition: "all 0.25s ease",
    textAlign: "center",
  };

  const badgeStyle = {
    width: 90,
    height: 90,
    borderRadius: 28,
    background: "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
    border: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 36,
    fontWeight: 700,
    color: "#fff",
    letterSpacing: 1,
    boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
  };

  const titleStyle = {
    fontSize: 24,
    fontWeight: 700,
    margin: "10px 0 6px",
    color: "white",
  };

  const metaStyle = {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 8,
  };

  const descStyle = {
    fontSize: 15,
    color: "rgba(255,255,255,0.88)",
    lineHeight: 1.6,
    maxWidth: 600,
  };

  const buttonBase = {
    border: "none",
    borderRadius: 14,
    padding: "10px 18px",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const primaryBtn = {
    ...buttonBase,
    background: "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
  };

  const secondaryBtn = {
    ...buttonBase,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.85)",
  };

  const noteBox = {
    background: "rgba(255,255,255,0.03)",
    padding: "14px 18px",
    borderRadius: 16,
    fontSize: 13,
    border: "1px solid rgba(255,255,255,0.06)",
    marginTop: 20,
    color: "rgba(255,255,255,0.86)",
  };

  const modalStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(6px)",
    zIndex: 1000,
  };

  const modalBox = {
    width: "min(420px, 92%)",
    borderRadius: 20,
    background: "rgba(255,255,255,0.05)",
    padding: 24,
    border: "1px solid rgba(255,255,255,0.08)",
    textAlign: "center",
    color: "#fff",
  };

  // App data
  const app = {
    title: "Air Closet",
    rating: 4.9,
    version: "2.0.1",
    updated: "Oct 20, 2025",
    desc: "Air Closet brings a premium, elegant fashion experience right to your phone — minimal, fluid, and Apple-level sleek.",
  };

  return (
    <div style={pageStyle}>
      {isInAppBrowser && (
        <div style={modalStyle}>
          <div style={modalBox}>
            <h2 style={{ marginBottom: 10 }}>Open in Chrome</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
              Instagram’s browser doesn’t support app installs.
              <br />
              Tap the <b>⋮</b> menu → <b>Open in Chrome</b>.
            </p>
            <button
              style={{ ...primaryBtn, marginTop: 16 }}
              onClick={handleCopyLink}
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      )}

      <div
        style={cardStyle}
        onMouseEnter={() => setCardHover(true)}
        onMouseLeave={() => setCardHover(false)}
      >
        <div style={badgeStyle}>F</div>
        <h1 style={titleStyle}>{app.title}</h1>
        <div style={metaStyle}>
          ⭐ {app.rating} &nbsp;•&nbsp; Version {app.version} &nbsp;•&nbsp; Updated{" "}
          {app.updated}
        </div>
        <p style={descStyle}>{app.desc}</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
          <button
            style={primaryBtn}
            onClick={handleInstallClick}
            onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(1px)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            Install App
          </button>


          <button style={secondaryBtn} onClick={nav('/')}>
Use on Web          </button>
        </div>

        <div style={noteBox}>
          <div style={{ fontWeight: 600 }}>If install doesn’t start:</div>
          <div style={{ marginTop: 6 }}>
            Copy & paste this in Chrome: <br />
            <b>{downloadLink}</b>
          </div>
        </div>

        <div
          style={{
            marginTop: 20,
            fontSize: 12,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Sleek • Minimal • Air
        </div>
      </div>
    </div>
  );
};

export default DownloadPageAndroid;
