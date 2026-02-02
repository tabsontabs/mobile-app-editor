// Configuration types for the mobile app editor

export interface CarouselSlide {
  id: string;
  imageUrl: string;
  altText: string;
  linkUrl?: string;
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

export interface MobileHomeConfig {
  carousel: CarouselConfig;
  text: TextConfig;
  cta: CtaConfig;
  lastUpdated: string;
}

export type ConfigSection = 'carousel' | 'text' | 'cta';
