// Configuration types for the mobile app editor

export type AspectRatio = 'portrait' | 'landscape' | 'square';

export interface CarouselSlide {
  id: string;
  imageUrl: string;
  altText: string;
  linkUrl?: string;
  aspectRatio: AspectRatio;
}

export interface CarouselConfig {
  slides: CarouselSlide[];
}

export interface TextConfig {
  heading: string;
  headingColor: string;
  description: string;
  descriptionColor: string;
}

export interface CtaConfig {
  primaryText: string;
  primaryUrl: string;
  primaryColor: string;
  primaryTextColor: string;
}

// The configuration payload (what the editor works with)
export interface ConfigPayload {
  carousel: CarouselConfig;
  text: TextConfig;
  cta: CtaConfig;
}

// Full stored configuration with metadata
export interface StoredConfig {
  id: string;
  schemaVersion: number;
  updatedAt: string;
  createdAt: string;
  data: ConfigPayload;
}

export type ConfigSection = 'carousel' | 'text' | 'cta';

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string[];
  };
}

export interface ConfigListResponse {
  configs: Array<{
    id: string;
    schemaVersion: number;
    updatedAt: string;
    createdAt: string;
  }>;
}

// Current schema version
export const CURRENT_SCHEMA_VERSION = 1;
