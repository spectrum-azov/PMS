import { uk } from './uk';
import { en } from './en';

export type { TranslationKey } from './uk';
export type Language = 'uk' | 'en';

export const translations: Record<Language, typeof uk> = { uk, en };
