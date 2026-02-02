import type { ConfigPayload } from '~/types/config';

export const defaultConfig: ConfigPayload = {
  carousel: {
    slides: [
      {
        id: 'slide-1',
        imageUrl: 'https://articles.hepper.com/wp-content/uploads/2022/10/Long-haired-cream-dachshund-running.jpg',
        altText: 'blonde dachshund running',
        linkUrl: '#',
        aspectRatio: 'landscape',
      },
      {
        id: 'slide-2',
        imageUrl: 'https://www.borrowmydoggy.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F4ij0poqn%2Fproduction%2F2b1b8fc4b6cf03c02f869d67f3f16187396264c0-3999x3999.jpg%3Ffit%3Dmax%26auto%3Dformat&w=1080&q=75',
        altText: 'black and tan dachshund',
        linkUrl: '##',
        aspectRatio: 'square',
      },
      {
        id: 'slide-3',
        imageUrl: 'https://t3.ftcdn.net/jpg/02/22/15/32/360_F_222153281_QGFYDh6V99PQyxaaOIf4FYLfUZK8ECfV.jpg',
        altText: 'reddish brown dachshund',
        linkUrl: '###',
        aspectRatio: 'landscape',
      },
    ],
  },
  text: {
    heading: 'Welcome to Our Store',
    headingColor: '#000000',
    description: 'Browse our curated collection of premium items designed to elevate your everyday experience.',
    descriptionColor: '#000000',
  },
  cta: {
    primaryText: 'Shop Now',
    primaryUrl: '/shop',
    primaryColor: '#000000',
    primaryTextColor: '#ffffff',
  },
};

export function generateSlideId(): string {
  return `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
