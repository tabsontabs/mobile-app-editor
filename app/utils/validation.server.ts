import type { CarouselConfig, TextConfig, CtaConfig, ConfigPayload, StoredConfig } from '~/types/config';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;
const URL_REGEX = /^(https?:\/\/|\/|#)/;

function isValidHexColor(color: unknown): boolean {
  return typeof color === 'string' && HEX_COLOR_REGEX.test(color);
}

function isValidUrl(url: unknown): boolean {
  if (typeof url !== 'string') return false;
  // Allow relative URLs starting with / or # or full http(s) URLs
  return URL_REGEX.test(url);
}

function validateCarousel(carousel: CarouselConfig): string[] {
  const errors: string[] = [];

  if (!carousel) {
    errors.push('Carousel config is required');
    return errors;
  }

  if (!Array.isArray(carousel.slides)) {
    errors.push('Carousel slides must be an array');
    return errors;
  }

  carousel.slides.forEach((slide, index) => {
    const prefix = `Slide ${index + 1}`;
    
    if (!slide.id || typeof slide.id !== 'string') {
      errors.push(`${prefix}: id is required and must be a string`);
    }
    
    if (!slide.imageUrl || typeof slide.imageUrl !== 'string') {
      errors.push(`${prefix}: imageUrl is required and must be a string`);
    } else if (!isValidUrl(slide.imageUrl)) {
      errors.push(`${prefix}: imageUrl must be a valid URL`);
    }
    
    if (!slide.altText || typeof slide.altText !== 'string') {
      errors.push(`${prefix}: altText is required and must be a string`);
    }
    
    if (slide.linkUrl !== undefined && slide.linkUrl !== '' && !isValidUrl(slide.linkUrl)) {
      errors.push(`${prefix}: linkUrl must be a valid URL if provided`);
    }
    
    if (!['portrait', 'landscape', 'square'].includes(slide.aspectRatio)) {
      errors.push(`${prefix}: aspectRatio must be 'portrait', 'landscape', or 'square'`);
    }
  });

  return errors;
}

function validateText(text: TextConfig): string[] {
  const errors: string[] = [];

  if (!text) {
    errors.push('Text config is required');
    return errors;
  }

  if (typeof text.heading !== 'string') {
    errors.push('Text heading must be a string');
  }

  if (!isValidHexColor(text.headingColor)) {
    errors.push('Text headingColor must be a valid hex color (e.g., #000000)');
  }

  if (typeof text.description !== 'string') {
    errors.push('Text description must be a string');
  }

  if (!isValidHexColor(text.descriptionColor)) {
    errors.push('Text descriptionColor must be a valid hex color (e.g., #000000)');
  }

  return errors;
}

function validateCta(cta: CtaConfig): string[] {
  const errors: string[] = [];

  if (!cta) {
    errors.push('CTA config is required');
    return errors;
  }

  if (typeof cta.primaryText !== 'string' || !cta.primaryText.trim()) {
    errors.push('CTA primaryText is required and must be a non-empty string');
  }

  if (typeof cta.primaryUrl !== 'string' || !cta.primaryUrl.trim()) {
    errors.push('CTA primaryUrl is required');
  } else if (!isValidUrl(cta.primaryUrl)) {
    errors.push('CTA primaryUrl must be a valid URL');
  }

  if (!isValidHexColor(cta.primaryColor)) {
    errors.push('CTA primaryColor must be a valid hex color (e.g., #000000)');
  }

  if (!isValidHexColor(cta.primaryTextColor)) {
    errors.push('CTA primaryTextColor must be a valid hex color (e.g., #ffffff)');
  }

  return errors;
}

/**
 * Validates a ConfigPayload (the data portion of a stored config)
 */
export function validateConfigPayload(payload: ConfigPayload): ValidationResult {
  const errors: string[] = [];

  if (!payload) {
    return { isValid: false, errors: ['Configuration payload is required'] };
  }

  if (!payload.carousel) {
    errors.push('Carousel config is required');
  } else {
    errors.push(...validateCarousel(payload.carousel));
  }

  if (!payload.text) {
    errors.push('Text config is required');
  } else {
    errors.push(...validateText(payload.text));
  }

  if (!payload.cta) {
    errors.push('CTA config is required');
  } else {
    errors.push(...validateCta(payload.cta));
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a full StoredConfig including metadata
 */
export function validateStoredConfig(config: StoredConfig): ValidationResult {
  const errors: string[] = [];

  if (!config) {
    return { isValid: false, errors: ['Configuration is required'] };
  }

  if (!config.id || typeof config.id !== 'string') {
    errors.push('Configuration id is required and must be a string');
  }

  if (typeof config.schemaVersion !== 'number' || config.schemaVersion < 1) {
    errors.push('Configuration schemaVersion must be a positive number');
  }

  if (!config.updatedAt || typeof config.updatedAt !== 'string') {
    errors.push('Configuration updatedAt is required');
  }

  if (!config.createdAt || typeof config.createdAt !== 'string') {
    errors.push('Configuration createdAt is required');
  }

  if (!config.data) {
    errors.push('Configuration data payload is required');
  } else {
    const payloadValidation = validateConfigPayload(config.data);
    errors.push(...payloadValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates import data (can be either ConfigPayload or StoredConfig)
 */
export function validateImportData(data: unknown): ValidationResult {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Import data must be a valid object'] };
  }

  const obj = data as Record<string, unknown>;

  // Check if it's a StoredConfig format
  if ('data' in obj && 'id' in obj && 'schemaVersion' in obj) {
    return validateStoredConfig(obj as unknown as StoredConfig);
  }

  // Check if it's a ConfigPayload format
  if ('carousel' in obj && 'text' in obj && 'cta' in obj) {
    return validateConfigPayload(obj as unknown as ConfigPayload);
  }

  return {
    isValid: false,
    errors: ['Import data must contain carousel, text, and cta configurations'],
  };
}
