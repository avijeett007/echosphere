export const socialPlatforms = [
  'Facebook',
  'Instagram',
  'TikTok',
  'X',
  'Discord',
  'YouTube',
] as const;

export type SocialPlatform = (typeof socialPlatforms)[number];

export interface BrandTemplate {
  brandName: string;
  title: string;
  slogan: string;
  color: string;
}

export interface Post {
  id: string;
  platforms: SocialPlatform[];
  text: string;
  hashtags: string;
  imageUrl?: string;
  imagePrompt?: string;
  videoUrl?: string;
  brandTemplate?: BrandTemplate;
  submittedAt: string;
}
