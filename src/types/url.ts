export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  customShortUrl?: string;
  createdAt: Date;
  expiresAt?: Date;
  validUntilMinutes?: number;
  clickCount: number;
  clicks: UrlClick[];
}

export interface UrlClick {
  timestamp: Date;
  referrer: string;
  userAgent: string;
  ipAddress: string;
  location: string;
}

export interface CreateUrlRequest {
  originalUrl: string;
  customShortUrl?: string;
  validUntilMinutes?: number;
}