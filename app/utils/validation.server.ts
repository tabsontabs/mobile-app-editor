import type { MobileHomeConfig, CarouselConfig, TextConfig, CtaConfig } from '~/types/config';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

function validateCarousel(carousel: CarouselConfig): string[] {
  const errors: string[] = [];

  if (!Array.isArray(carousel.slides)) {
    errors.push('Carousel slides must be an array');
  } else {
    carousel.slides.forEach((slide, index) => {
      if (!slide.id) {
        errors.push(`Slide ${index + 1}: id is required`);
      }
      if (!slide.imageUrl) {
        errors.push(`Slide ${index + 1}: imageUrl is required`);
      }
      if (!slide.altText) {
        errors.push(`Slide ${index + 1}: altText is required`);
      }
    });
  }

  return errors;
}

function validateText(text: TextConfig): string[] {
  const errors: string[] = [];

  if (typeof text.heading !== 'string') {
    errors.push('Text heading must be a string');
  }

  if (typeof text.headingColor !== 'string' || !text.headingColor.match(/^#[0-9A-Fa-f]{6}$/)) {
    errors.push('Text headingColor must be a valid hex color');
  }

  if (typeof text.description !== 'string') {
    errors.push('Text description must be a string');
  }

  if (typeof text.descriptionColor !== 'string' || !text.descriptionColor.match(/^#[0-9A-Fa-f]{6}$/)) {
    errors.push('Text descriptionColor must be a valid hex color');
  }

  return errors;
}

function validateCta(cta: CtaConfig): string[] {
  const errors: string[] = [];

  if (typeof cta.primaryText !== 'string' || !cta.primaryText.trim()) {
    errors.push('CTA primaryText is required');
  }

  if (typeof cta.primaryUrl !== 'string' || !cta.primaryUrl.trim()) {
    errors.push('CTA primaryUrl is required');
  }

  if (typeof cta.primaryColor !== 'string' || !cta.primaryColor.match(/^#[0-9A-Fa-f]{6}$/)) {
    errors.push('CTA primaryColor must be a valid hex color');
  }

  if (typeof cta.primaryTextColor !== 'string' || !cta.primaryTextColor.match(/^#[0-9A-Fa-f]{6}$/)) {
    errors.push('CTA primaryTextColor must be a valid hex color');
  }

  return errors;
}

export function validateConfig(config: MobileHomeConfig): ValidationResult {
  const errors: string[] = [];

  if (!config) {
    return { isValid: false, errors: ['Config is required'] };
  }

  if (!config.carousel) {
    errors.push('Carousel config is required');
  } else {
    errors.push(...validateCarousel(config.carousel));
  }

  if (!config.text) {
    errors.push('Text config is required');
  } else {
    errors.push(...validateText(config.text));
  }

  if (!config.cta) {
    errors.push('CTA config is required');
  } else {
    errors.push(...validateCta(config.cta));
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
