// src/components/ImageComparisonSlider.jsx — POLISHED EDITION
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { asset } from '../utils/assets';

const compareImg1 = asset('Final Selection SCOT/imageComparison/Imagecomparison1.png');
const compareImg2 = asset('Final Selection SCOT/imageComparison/imagecomparison2.png');
const zipSetMain = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP SET .png');
const zipSetT1 = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP SET 3.png');
const zipSetT2 = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP SET 1.png');
const zipSetGMain = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP SET G2.png');
const zipSetG3s = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP SET G3.png');
const zipSetG4s = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP SET G4.png');
const zipSetG5s = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP SET G5.png');
const zipSetGT1 = asset('Final Selection SCOT/SU ESSENTIAL ZIP SET/SU ESSENTIAL ZIP SET G1.png');

// PDP images for the two sets

const ImageComparisonSlider = () => {
  const navigate = useNavigate();
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

  const handleMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX || e.touches?.[0]?.clientX;
    if (!x) return;
    const pct = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, pct)));
  };

  // Mouse: drag anywhere on the slider (desktop only, doesn't affect scroll)
  const handleMouseStart = (e) => {
    e.preventDefault();
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
  };

  // Touch: drag starts ONLY on the knob — so touching the images
  // anywhere else scrolls the page normally
  const handleTouchStart = (e) => {
    e.stopPropagation();
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);
  };

  const handleEnd = () => {
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('touchmove', handleMove);
    window.removeEventListener('mouseup', handleEnd);
    window.removeEventListener('touchend', handleEnd);
    window.removeEventListener('touchcancel', handleEnd);
  };

  return (
    <div className="ics-root">
      {/* Header */}
      <div className="ics-header">
        <p className="ics-label">New Drop</p>
        <h2 className="ics-heading">SU Essential Zip Set</h2>
      </div>

      {/* Slider */}
      <div className="ics-slider-wrap">
        <div
          ref={containerRef}
          className="ics-slider"
          onMouseDown={handleMouseStart}
        >
          {/* Left — Green */}
          <div className="ics-img-layer" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
            <img src={compareImg1} alt="SU Essential Zip Set — Black" className="ics-img" />
            <span className="ics-tag ics-tag--left">Black</span>
          </div>

          {/* Right — Brown */}
          <div className="ics-img-layer" style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}>
            <img src={compareImg2} alt="SU Essential Zip Set — Gray" className="ics-img" />
            <span className="ics-tag ics-tag--right">Gray</span>
          </div>

          {/* Handle */}
          <div className="ics-handle" style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}>
            <div className="ics-handle__knob" onTouchStart={handleTouchStart}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="ics-actions">
        <button
          className="btn-standard"
          onClick={() => navigate('/product', { state: { product: {
            name: "SU Essential Zip Set — Black",
            tagline: "Everyday. Elevated.",
            image: zipSetMain,
            images: [zipSetT1, zipSetT2],
            price: 1300,
            isNew: true,
          } } })}
        >
          Shop Black Set
        </button>
        <button
          className="btn-standard"
          onClick={() => navigate('/product', { state: { product: {
            name: "SU Essential Zip Set — Gray",
            tagline: "Everyday. Elevated.",
            image: zipSetGMain,
            images: [zipSetGT1, zipSetG3s, zipSetG4s, zipSetG5s],
            price: 1300,
            isNew: true,
          } } })}
        >
          Shop Gray Set
        </button>
      </div>

      <style jsx>{`
        .ics-root {
          max-width: 1380px;
          margin: 0 auto;
          padding: 80px 40px;
          background: #F7F5F2;
        }
        @media (max-width: 768px) { .ics-root { padding: 56px 20px; } }

        .ics-header { margin-bottom: 40px; }

        .ics-label {
          display: inline-block;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.22em;
          text-transform: uppercase; color: #999;
          border-bottom: 1px solid #E0DBD5; padding-bottom: 6px; margin-bottom: 12px;
        }
        .ics-heading {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: clamp(24px, 3vw, 42px); font-weight: 400;
          letter-spacing: -0.02em; line-height: 1.1; color: #1A1A1A; margin: 0;
        }

        .ics-slider-wrap {
          width: 100%; max-width: 960px; margin: 0 auto;
          overflow: hidden;
          touch-action: pan-y; /* page scrolls normally over the images */
        }
        .ics-slider {
          position: relative; width: 100%;
          height: 520px; cursor: col-resize;
          user-select: none;
          touch-action: pan-y;
        }
        @media (max-width: 768px) { .ics-slider { height: 340px; } }

        .ics-img-layer { position: absolute; inset: 0; }
        .ics-img {
          width: 100%; height: 100%;
          object-fit: contain;   /* full image, exactly as shot — no cropping */
          pointer-events: none;
        }
        .ics-img-layer { background: var(--paper-dark, #EDEAE5); }

        .ics-tag {
          position: absolute; bottom: 20px;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 0.2em;
          text-transform: uppercase; color: #fff;
          background: rgba(0,0,0,0.45); padding: 5px 12px;
        }
        .ics-tag--left  { left: 16px; }
        .ics-tag--right { right: 16px; }

        .ics-handle {
          position: absolute;
          top: 0; bottom: 0;
          width: 2px;
          background: #fff;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ics-handle__knob {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 48px; height: 48px; border-radius: 50%;
          background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.25);
          display: flex; align-items: center; justify-content: center;
          color: #1A1A1A;
          flex-shrink: 0;
          pointer-events: auto;   /* knob is touchable even though the line isn't */
          touch-action: none;     /* dragging the knob doesn't scroll the page */
        }

        .ics-actions {
          display: flex; gap: 16px; justify-content: center; margin-top: 40px;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
};

export default ImageComparisonSlider;