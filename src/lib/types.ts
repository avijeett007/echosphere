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
  id: string;
  name: string;
  slogan?: string;
  color?: string;
  logoUrl?: string;
}

export interface Post {
  id: string;
  platforms: SocialPlatform[];
  text: string;
  hashtags: string;
  imageUrl?: string;
  imagePrompt?: string;
  videoUrl?: string;
  brandTemplateId?: string;
  submittedAt: string;
}
