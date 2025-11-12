
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [sloganVisible, setSloganVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      // Staggered animation sequence
      setTimeout(() => setImageVisible(true), 200);
      setTimeout(() => setTitleVisible(true), 500);
      setTimeout(() => setSloganVisible(true), 700);
      setTimeout(() => setButtonVisible(true), 900);
    }
  }, [isLoaded]);

  return (
    <div className="min-h-screen w-full gradient-welcome relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 gradient-mesh opacity-30"></div>

      {/* Main Content Container */}
      <div className={`min-h-screen w-full relative z-10 transition-all duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>

        {/* Desktop Layout - Enhanced */}
        <div className="hidden lg:flex justify-center items-center min-h-screen">
          <div className="flex items-center gap-12 max-w-7xl mx-auto">
            {/* Left side - Enhanced Hero Video with 3D Effects */}
            <div className="relative animate-fade-in-scale">
              {/* Enhanced 3D cutout shape with multiple shadow layers */}
              <div
                className={`bg-gradient-to-br from-purple-200 to-purple-300 transition-all duration-1000 ease-out ${
                  imageVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{
                  width: 'clamp(480px, 45vw, 620px)',
                  height: 'clamp(600px, 55vw, 720px)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: '0 8px 25px rgba(168, 85, 247, 0.15)'
                }}
              >
                <video
                  src="/learning-video.mp4"
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>

            {/* Right side - Enhanced Text and Authentication */}
            <div className="animate-fade-in-up max-w-md">
              <h1 className="text-fluid-display font-bold text-gray-800 mb-6 leading-tight">
                YadaLearn
              </h1>
              <p className="text-fluid-subheading text-gray-600 mb-12 leading-relaxed">
                Every Lesson a Treasure
              </p>

              {/* Authentication Section */}
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-black text-white text-lg font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full rounded-full border-2 border-black bg-white text-black text-lg font-semibold px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden h-full flex flex-col items-center justify-center px-6">
          {/* Hero Video with Complex Shadow - Mobile */}
          <div className="mb-12">
            <div
              className={`bg-gradient-to-br from-purple-200 to-purple-300 transition-all duration-1000 ease-out ${
                imageVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{
                width: '320px',
                height: '420px',
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: '0 8px 20px rgba(168, 85, 247, 0.15)'
              }}
            >
              <video
                src="/learning-video.mp4"
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>

          {/* Text and Authentication - Mobile */}
          <div className="text-center space-y-6">
            <h1
              className={`text-5xl font-bold text-gray-800 transition-all duration-700 ease-out ${
                titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              YadaLearn
            </h1>
            <p
              className={`text-xl text-gray-600 transition-all duration-700 ease-out delay-200 ${
                sloganVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Every Lesson a Treasure
            </p>

            {/* Authentication Section - Mobile */}
            <div
              className={`transition-all duration-700 ease-out ${
                buttonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full rounded-full bg-black px-16 py-5 font-semibold text-white text-xl shadow-lg hover:scale-105 hover:bg-gray-900 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full rounded-full border-2 border-black bg-white px-16 py-5 font-semibold text-black text-xl shadow-lg hover:scale-105 hover:bg-gray-50 transition-all"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
