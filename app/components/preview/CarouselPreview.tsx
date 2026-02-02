import { useState, useEffect } from 'react';
import { useConfig } from '~/context/ConfigContext';

export function CarouselPreview() {
  const { config } = useConfig();
  const { carousel } = config;
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (carousel.slides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % carousel.slides.length);
  };

  const prevSlide = () => {
    if (carousel.slides.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + carousel.slides.length) % carousel.slides.length);
  };

  useEffect(() => {
    // Reset to first slide if current index is out of bounds
    if (currentIndex >= carousel.slides.length) {
      setCurrentIndex(0);
    }
  }, [carousel.slides.length, currentIndex]);

  if (carousel.slides.length === 0) {
    return (
      <div className="w-full h-48 bg-slate-100 rounded-lg flex items-center justify-center">
        <span className="text-slate-400 text-sm">No slides configured</span>
      </div>
    );
  }

  const currentSlide = carousel.slides[currentIndex];

  // determine the tallest aspect ratio among all slides
  // portrait (3/4) is tallest, then square (1/1), then landscape (16/9)
  const aspectRatioPriority = { portrait: 3, square: 2, landscape: 1 };
  
  const tallestAspectRatio = carousel.slides.reduce((tallest, slide) => {
    const slideRatio = slide.aspectRatio || 'landscape';
    return aspectRatioPriority[slideRatio] > aspectRatioPriority[tallest] ? slideRatio : tallest;
  }, 'landscape' as 'portrait' | 'landscape' | 'square');

  const containerAspectClass = {
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[16/9]',
    square: 'aspect-square',
  }[tallestAspectRatio];

  const currentSlideAspectClass = {
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[16/9]',
    square: 'aspect-square',
  }[currentSlide?.aspectRatio || 'landscape'];

  return (
    <div className="relative w-full overflow-hidden bg-slate-900">
      {/* slide Container - uses tallest aspect ratio */}
      <div className={`relative ${containerAspectClass} flex items-center justify-center`}>
        {/* image wrapper - uses its own aspect ratio */}
        <div className={`relative ${currentSlideAspectClass} max-w-full`}>
          {currentSlide?.linkUrl ? (
            <a href={currentSlide.linkUrl} className="block w-full h-full">
              <img
                src={currentSlide.imageUrl}
                alt={currentSlide.altText}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect fill="%23374151" width="400" height="200"/><text fill="%239ca3af" font-size="14" x="50%" y="50%" text-anchor="middle" dy=".3em">Image not found</text></svg>';
                }}
              />
            </a>
          ) : (
            <img
              src={currentSlide?.imageUrl}
              alt={currentSlide?.altText}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect fill="%23374151" width="400" height="200"/><text fill="%239ca3af" font-size="14" x="50%" y="50%" text-anchor="middle" dy=".3em">Image not found</text></svg>';
              }}
            />
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {carousel.slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            aria-label="Next slide"
          >
            ›
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {carousel.slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {carousel.slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
