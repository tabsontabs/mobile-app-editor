import { useConfig } from '~/context/ConfigContext';
import { generateSlideId } from '~/utils/defaults';
import type { CarouselSlide } from '~/types/config';

const MAX_SLIDES = 5;

export function CarouselEditor() {
  const { config, updateCarousel } = useConfig();
  const { carousel } = config;

  const canAddSlide = carousel.slides.length < MAX_SLIDES;

  const handleAddSlide = () => {
    if (!canAddSlide) return;
    const newSlide: CarouselSlide = {
      id: generateSlideId(),
      imageUrl: '',
      altText: '',
      linkUrl: '',
      aspectRatio: 'landscape',
    };
    updateCarousel({ slides: [...carousel.slides, newSlide] });
  };

  const handleRemoveSlide = (id: string) => {
    updateCarousel({ slides: carousel.slides.filter((s) => s.id !== id) });
  };

  const handleUpdateSlide = (id: string, updates: Partial<CarouselSlide>) => {
    updateCarousel({
      slides: carousel.slides.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= carousel.slides.length) return;

    const newSlides = [...carousel.slides];
    [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
    updateCarousel({ slides: newSlides });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">
            Carousel
            <span className="ml-2 text-sm font-normal text-slate-400">
              ({carousel.slides.length}/{MAX_SLIDES})
            </span>
          </h3>
          <span className="text-sm font-normal">
            You may add up to 5 slides.
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddSlide}
          disabled={!canAddSlide}
          className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Add Slide
        </button>
      </div>

      <div className="space-y-3">
        {carousel.slides.map((slide, index) => (
          <div
            key={slide.id}
            className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Slide {index + 1}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMoveSlide(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveSlide(index, 'down')}
                  disabled={index === carousel.slides.length - 1}
                  className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveSlide(slide.id)}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={slide.imageUrl}
                onChange={(e) => handleUpdateSlide(slide.id, { imageUrl: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Alt Text</label>
              <input
                type="text"
                placeholder="Describe the image"
                value={slide.altText}
                onChange={(e) => handleUpdateSlide(slide.id, { altText: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Link URL <span className="font-normal text-slate-400">(optional)</span></label>
              <input
                type="url"
                placeholder="https://example.com/page"
                value={slide.linkUrl || ''}
                onChange={(e) => handleUpdateSlide(slide.id, { linkUrl: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Aspect Ratio</label>
              <div className="flex gap-2">
                {(['portrait', 'landscape', 'square'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => handleUpdateSlide(slide.id, { aspectRatio: ratio })}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      slide.aspectRatio === ratio
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {ratio.charAt(0).toUpperCase() + ratio.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        {carousel.slides.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">
            No slides yet. Click "Add Slide" to create one.
          </p>
        )}
      </div>
    </div>
  );
}
