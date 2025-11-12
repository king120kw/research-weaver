import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface CarouselItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface Carousel3DProps {
  items: CarouselItem[];
  onItemClick?: (item: CarouselItem) => void;
  title?: string;
  subtitle?: string;
}

export const Carousel3D = ({ items, onItemClick, title = "TOP TEACHERS", subtitle = "Discover our expert educators" }: Carousel3DProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [memberName, setMemberName] = useState(items[0]?.name || '');
  const [memberRole, setMemberRole] = useState(items[0]?.role || '');

  const updateCarousel = (newIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const nextIndex = (newIndex + items.length) % items.length;
    setCurrentIndex(nextIndex);

    // Update member info with fade effect
    setMemberName(items[nextIndex].name);
    setMemberRole(items[nextIndex].role);

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  const getCardPosition = (index: number) => {
    const offset = (index - currentIndex + items.length) % items.length;

    if (offset === 0) return 'center';
    if (offset === 1) return 'right-1';
    if (offset === 2) return 'right-2';
    if (offset === items.length - 1) return 'left-1';
    if (offset === items.length - 2) return 'left-2';
    return 'hidden';
  };

  const getCardClasses = (position: string) => {
    const baseClasses = 'absolute w-64 h-80 rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 ease-out cursor-pointer';

    switch (position) {
      case 'center':
        return cn(baseClasses, 'z-10 scale-110 translate-x-0');
      case 'left-1':
        return cn(baseClasses, 'z-5 scale-90 -translate-x-52 opacity-90');
      case 'left-2':
        return cn(baseClasses, 'z-1 scale-80 -translate-x-[320px] opacity-70');
      case 'right-1':
        return cn(baseClasses, 'z-5 scale-90 translate-x-52 opacity-90');
      case 'right-2':
        return cn(baseClasses, 'z-1 scale-80 translate-x-[320px] opacity-70');
      default:
        return cn(baseClasses, 'opacity-0 pointer-events-none');
    }
  };

  // Touch handlers for mobile swipe
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      updateCarousel(currentIndex + 1);
    } else if (isRightSwipe) {
      updateCarousel(currentIndex - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        updateCarousel(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        updateCarousel(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  return (
    <div className="w-full py-8">
      {/* Title */}
      <h1 className="text-6xl md:text-7xl font-black text-center mb-12 text-gray-800 tracking-tight">
        {title}
      </h1>

      {/* Carousel Container */}
      <div
        className="relative w-full max-w-6xl mx-auto h-96 flex items-center justify-center carousel-3d"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, index) => {
          const position = getCardPosition(index);
          return (
            <div
              key={item.id}
              className={getCardClasses(position)}
              onClick={() => {
                if (position === 'center') {
                  onItemClick?.(item);
                } else {
                  updateCarousel(index);
                }
              }}
            >
              <Avatar className="w-full h-full rounded-3xl">
                <AvatarImage
                  src={item.avatar}
                  alt={item.name}
                  className="object-cover transition-all duration-700"
                />
                <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                  {item.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        <button
          onClick={() => updateCarousel(currentIndex - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-gray-800/60 hover:bg-gray-800/80 text-white flex items-center justify-center transition-all hover:scale-110"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => updateCarousel(currentIndex + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-gray-800/60 hover:bg-gray-800/80 text-white flex items-center justify-center transition-all hover:scale-110"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Member Info */}
      <div className="text-center mt-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 relative inline-block">
          <span className="absolute -left-32 top-1/2 w-28 h-0.5 bg-gray-800"></span>
          {memberName}
          <span className="absolute -right-32 top-1/2 w-28 h-0.5 bg-gray-800"></span>
        </h2>
        <p className="text-lg text-gray-600 uppercase tracking-wider font-medium">
          {memberRole}
        </p>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-3 mt-12">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => updateCarousel(index)}
            className={cn(
              'w-3 h-3 rounded-full transition-all',
              index === currentIndex
                ? 'bg-gray-800 scale-125'
                : 'bg-gray-300 hover:bg-gray-400'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
