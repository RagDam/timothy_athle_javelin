export interface InstagramPost {
  url: string;
  id: string;
  type: 'reel' | 'post';
  thumbnailUrl?: string;
  caption?: string;
  authorName?: string;
  html?: string;
  isValid: boolean;
}

export interface InstagramOEmbedResponse {
  version: string;
  title: string;
  author_name: string;
  author_url: string;
  author_id: number;
  media_id: string;
  provider_name: string;
  provider_url: string;
  type: string;
  width: number;
  height: number | null;
  html: string;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
}

export interface InstagramFeedData {
  posts: InstagramPost[];
  lastFetched: string;
}
