export enum AlbumType {
  FAMILY = 'FAMILY',
  BABY = 'BABY',
}

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
