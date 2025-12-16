
export enum AlbumType {
  FAMILY = 'FAMILY',
  BABY = 'BABY',
  GALLERY = 'GALLERY',
  WEDDING = 'WEDDING',
}

export interface ExifInfo {
  device?: string; // e.g. iPhone 13 Pro
  params?: string; // e.g. 26mm f1.5
  iso?: string;
}

export type MediaType = 'image' | 'video';

export interface Photo {
  id: string;
  url: string[]; // Modified to array to support multiple images per entry
  width?: number;
  height?: number;
  title: string;
  date: string;
  description: string; // Manual rich description
  tags: string[];
  location?: string;
  photographer?: string; // Who took the photo?
  albumType: AlbumType;
  mediaType?: MediaType; // Defaults to 'image'
  poster?: string; // Cover image for video
  exif?: ExifInfo; // Optional photography metadata
}

export interface WeddingSeries {
  id: string;
  title: string;
  subtitle: string;
  cover: string; // Cover image for the series card
  date: string;
  photographer: string;
  description: string;
  photos: Photo[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  age?: string;
  title: string;
  description: string;
  photos: Photo[];
}

export type NavItem = {
  label: string;
  path: string;
};
