/**
 * LankaVoyage Social Media Configuration
 * Configure official social channels here or via environment variables.
 * If a URL is empty/undefined, UI elements gracefully render contact modal or hide direct outbound links without breaking.
 */

export interface SocialLinkConfig {
  name: string;
  url: string | null;
  ariaLabel: string;
  iconType: 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'whatsapp';
}

export const SOCIAL_LINKS: Record<string, SocialLinkConfig> = {
  instagram: {
    name: 'Instagram',
    url: import.meta.env.VITE_SOCIAL_INSTAGRAM || null,
    ariaLabel: 'Follow LankaVoyage on Instagram (Opens in a new tab)',
    iconType: 'instagram'
  },
  facebook: {
    name: 'Facebook',
    url: import.meta.env.VITE_SOCIAL_FACEBOOK || null,
    ariaLabel: 'Follow LankaVoyage on Facebook (Opens in a new tab)',
    iconType: 'facebook'
  },
  tiktok: {
    name: 'TikTok',
    url: import.meta.env.VITE_SOCIAL_TIKTOK || null,
    ariaLabel: 'Follow LankaVoyage on TikTok (Opens in a new tab)',
    iconType: 'tiktok'
  },
  youtube: {
    name: 'YouTube',
    url: import.meta.env.VITE_SOCIAL_YOUTUBE || null,
    ariaLabel: 'Watch LankaVoyage journeys on YouTube (Opens in a new tab)',
    iconType: 'youtube'
  },
  whatsapp: {
    name: 'WhatsApp Concierge',
    url: import.meta.env.VITE_SOCIAL_WHATSAPP || 'https://wa.me/94771234567',
    ariaLabel: 'Chat with LankaVoyage 24/7 Concierge on WhatsApp (Opens in a new tab)',
    iconType: 'whatsapp'
  }
};
