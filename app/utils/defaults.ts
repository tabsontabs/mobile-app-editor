import type { MobileHomeConfig } from '~/types/config';

export const defaultConfig: MobileHomeConfig = {
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
        aspectRatio: 'landscape',
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
    heading: 'Test Test Test',
    headingColor: '#000000',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    descriptionColor: '#334155',
  },
  cta: {
    primaryText: 'Test',
    primaryUrl: '/test',
    primaryColor: '#000000',
    primaryTextColor: '#ffffff',
  },
  lastUpdated: new Date().toISOString(),
};

export function generateSlideId(): string {
  return 'slide-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}
