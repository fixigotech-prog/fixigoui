export type Locale = (typeof locales)[number];

export const locales = ['en', 'hi', 'kn', 'te'] as const;
export const defaultLocale: Locale = 'en';
