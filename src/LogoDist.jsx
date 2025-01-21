import React, { useState, useEffect } from 'react';
import firstImage from './star1.png';
import secondImage from './star2.png';

const SHAPE_PATHS = {
  circle1: "M150 20 C230 20 280 70 280 150 C280 230 230 280 150 280 C70 280 20 230 20 150 C20 70 70 20 150 20 Z",
  circle2: "M150 20 C220 20 270 70 270 150 C270 230 220 280 150 280 C80 280 30 230 30 150 C30 70 80 20 150 20 Z",
  star: "M150,150 L265.48,102.16 Q300.00,150.00 265.48,197.84 Z M150,150 L265.48,197.84 Q256.07,256.07 197.84,265.48 Z M150,150 L197.84,265.48 Q150.00,300.00 102.16,265.48 Z M150,150 L102.16,265.48 Q43.93,256.07 34.52,197.84 Z M150,150 L34.52,197.84 Q0.00,150.00 34.52,102.16 Z M150,150 L34.52,102.16 Q43.93,43.93 102.16,34.52 Z M150,150 L102.16,34.52 Q150.00,0.00 197.84,34.52 Z M150,150 L197.84,34.52 Q256.07,43.93 265.48,102.16 Z",
  hexagon: "M131.29 16.80 Q150.00 6.00 168.71 16.80 L256.00 67.20 Q274.71 78.00 274.71 99.60 L274.71 200.40 Q274.71 222.00 256.00 232.80 L168.71 283.20 Q150.00 294.00 131.29 283.20 L44.00 232.80 Q25.29 222.00 25.29 200.40 L25.29 99.60 Q25.29 78.00 44.00 67.20 Z",
  circle3: "M150 20 C220 20 270 70 270 150 C270 230 220 280 150 280 C80 280 30 230 30 150 C30 70 80 20 150 20 Z",
  circle4: "M150 20 C230 20 280 70 280 150 C280 230 230 280 150 280 C70 280 20 230 20 150 C20 70 70 20 150 20 Z",
  hexagon2: "M131.29 16.80 Q150.00 6.00 168.71 16.80 L256.00 67.20 Q274.71 78.00 274.71 99.60 L274.71 200.40 Q274.71 222.00 256.00 232.80 L168.71 283.20 Q150.00 294.00 131.29 283.20 L44.00 232.80 Q25.29 222.00 25.29 200.40 L25.29 99.60 Q25.29 78.00 44.00 67.20 Z"
};

const ANIMATION_STATES = {
  INITIAL: 'initialRotation',
  COLLAPSING: 'collapsing',
  EMERGING: 'emerging',
  PAUSED: 'paused'
};

const STAR_STATES = {
  WHITE: 'white',
  BLACK: 'black',
  COLLAPSING: 'collapsing',
  PAUSED: 'paused'
};

const LogoDist = () => {
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [animationPhase, setAnimationPhase] = useState(ANIMATION_STATES.INITIAL);
  const [starState, setStarState] = useState(STAR_STATES.WHITE);
  
  // Get all shapes from SHAPE_PATHS
  const shapes = [
    SHAPE_PATHS.circle1,
    SHAPE_PATHS.circle2,
    SHAPE_PATHS.star,
    SHAPE_PATHS.hexagon,
    SHAPE_PATHS.circle3,
    SHAPE_PATHS.circle4,
    SHAPE_PATHS.hexagon2
  ];

  const handleAnimationCycle = () => {
    let timeoutId;

    const startNewCycle = () => {
      setAnimationPhase(ANIMATION_STATES.INITIAL);
      setStarState(STAR_STATES.WHITE);
      
      timeoutId = setTimeout(() => {
        setStarState(STAR_STATES.COLLAPSING);
        setAnimationPhase(ANIMATION_STATES.COLLAPSING);
        
        timeoutId = setTimeout(() => {
          setStarState(STAR_STATES.BLACK);
          setAnimationPhase(ANIMATION_STATES.EMERGING);
          
          timeoutId = setTimeout(() => {
            setStarState(STAR_STATES.PAUSED);
            timeoutId = setTimeout(startNewCycle, 1200);
          }, 2200);
        }, 2000);
      }, 15400); // Changed from 8000 to 15400 to allow for all 7 shapes (7 * 2200ms)
    };

    startNewCycle();
    return () => timeoutId && clearTimeout(timeoutId);
  };

  const handleShapeRotation = () => {
    let interval;
    if (animationPhase === ANIMATION_STATES.INITIAL) {
      interval = setInterval(() => {
        setCurrentShapeIndex(prev => (prev + 1) % shapes.length);
      }, 2200);
    }
    return () => interval && clearInterval(interval);
  };

  useEffect(handleAnimationCycle, []);
  useEffect(handleShapeRotation, [animationPhase, shapes.length]);

  const getShapeClassName = () => {
    const classNames = {
      [ANIMATION_STATES.INITIAL]: 'shape-rotating',
      [ANIMATION_STATES.COLLAPSING]: 'shape-collapsing',
      [ANIMATION_STATES.EMERGING]: 'shape-hidden'
    };
    return classNames[animationPhase] || '';
  };

  const getStarStyle = (starType) => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: starType === 'white' 
      ? ['white', 'collapsing'].includes(starState) ? 'block' : 'none'
      : ['black', 'paused'].includes(starState) ? 'block' : 'none',
    animation: starType === 'white'
      ? starState === 'collapsing' ? 'rotateAndCollapse 2s forwards' : 'none'
      : starState === 'black' ? 'emergeAndRotate 2s forwards' : 'none'
  });

  return (
    <div style={{ position: "relative", width: "400px", height: "400px" }}>
      <svg
        width="400"
        height="400"
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
        className={getShapeClassName()}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="morphGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0066CC" className="gradient-start" />
            <stop offset="100%" stopColor="#1E90FF" className="gradient-end" />
          </linearGradient>
        </defs>
        <path
          d={shapes[currentShapeIndex]}
          fill="url(#morphGradient)"
          style={{ transition: "d 1.5s ease-in-out" }}
        />
      </svg>

      <div className="star-container" style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "200px",
        height: "200px",
        zIndex: 1
      }}>
        <img src={firstImage} alt="White star" className="star white-star" style={getStarStyle('white')} />
        <img src={secondImage} alt="Black star" className="star black-star" style={getStarStyle('black')} />
      </div>

      <style>
        {`
          .shape-rotating {
            animation: rotateBackground 5s linear infinite;
          }

          .shape-collapsing {
            animation: collapseShape 2s forwards;
          }

          .shape-hidden {
            opacity: 0;
            transform: scale(0.01);
          }

          .star {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }

          @keyframes collapseShape {
            0% { 
              transform: rotate(0deg) scale(1);
              opacity: 1;
            }
            100% { 
              transform: rotate(540deg) scale(0.01);
              opacity: 0;
            }
          }

          @keyframes rotateAndCollapse {
            0% { 
              transform: rotate(0deg) scale(1); 
              opacity: 1;
            }
            100% { 
              transform: rotate(180deg) scale(0.01);
              opacity: 0;
            }
          }

          @keyframes emergeAndRotate {
            0% { 
              transform: rotate(0deg) scale(0.01);
              opacity: 0;
            }
            50% {
              transform: rotate(180deg) scale(0.5);
              opacity: 0.5;
            }
            100% { 
              transform: rotate(360deg) scale(1);
              opacity: 1;
            }
          }

          @keyframes rotateBackground {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes shiftColorStart {
            0% { stop-color: #0066CC; }
            25% { stop-color: #0080FF; }
            50% { stop-color: #4169E1; }
            75% { stop-color: #1E90FF; }
            100% { stop-color: #0066CC; }
          }

          @keyframes shiftColorEnd {
            0% { stop-color: #1E90FF; }
            25% { stop-color: #4682B4; }
            50% { stop-color: #9932CC; }
            75% { stop-color: #8A2BE2; }
            100% { stop-color: #1E90FF; }
          }

          .gradient-start {
            animation: shiftColorStart 6s linear infinite;
          }

          .gradient-end {
            animation: shiftColorEnd 6s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default LogoDist;