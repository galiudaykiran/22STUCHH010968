import { ShortenedUrl, CreateUrlRequest, UrlClick } from '@/types/url';
import { logger } from './logger';
import { storageUtils } from './storage';

// Generate a random short code
function generateShortCode(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Check if a short code is already in use
function isShortCodeTaken(shortCode: string): boolean {
  const existingUrls = storageUtils.getShortenedUrls();
  return existingUrls.some(url => url.shortCode === shortCode);
}

// Generate a unique short code
function generateUniqueShortCode(): string {
  let shortCode;
  do {
    shortCode = generateShortCode();
  } while (isShortCodeTaken(shortCode));
  return shortCode;
}

// Validate URL format
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Mock geolocation data
function getMockLocation(): string {
  const locations = ['New York, US', 'London, UK', 'Tokyo, JP', 'Sydney, AU', 'Toronto, CA'];
  return locations[Math.floor(Math.random() * locations.length)];
}

export const urlShortenerService = {
  createShortenedUrl(request: CreateUrlRequest): Promise<ShortenedUrl> {
    return new Promise((resolve, reject) => {
      logger.info('Creating shortened URL', request, 'urlShortener');

      // Validate original URL
      if (!isValidUrl(request.originalUrl)) {
        const error = 'Invalid URL format';
        logger.error(error, request, 'urlShortener');
        reject(new Error(error));
        return;
      }

      // Check if custom short URL is provided and available
      let shortCode = request.customShortUrl;
      if (shortCode) {
        if (isShortCodeTaken(shortCode)) {
          const error = 'Custom short URL is already taken';
          logger.error(error, { shortCode }, 'urlShortener');
          reject(new Error(error));
          return;
        }
      } else {
        shortCode = generateUniqueShortCode();
      }

      // Calculate expiration date
      let expiresAt: Date | undefined;
      if (request.validUntilMinutes && request.validUntilMinutes > 0) {
        expiresAt = new Date(Date.now() + request.validUntilMinutes * 60 * 1000);
      }

      const shortenedUrl: ShortenedUrl = {
        id: crypto.randomUUID(),
        originalUrl: request.originalUrl,
        shortCode,
        customShortUrl: request.customShortUrl,
        createdAt: new Date(),
        expiresAt,
        validUntilMinutes: request.validUntilMinutes,
        clickCount: 0,
        clicks: []
      };

      // Save to storage
      storageUtils.saveShortenedUrl(shortenedUrl);
      
      logger.info('Successfully created shortened URL', { 
        shortCode: shortenedUrl.shortCode,
        originalUrl: shortenedUrl.originalUrl 
      }, 'urlShortener');

      resolve(shortenedUrl);
    });
  },

  getShortenedUrl(shortCode: string): ShortenedUrl | null {
    const urls = storageUtils.getShortenedUrls();
    const url = urls.find(u => u.shortCode === shortCode);
    
    if (!url) {
      logger.warn('Shortened URL not found', { shortCode }, 'urlShortener');
      return null;
    }

    // Check if URL has expired
    if (url.expiresAt && new Date() > url.expiresAt) {
      logger.warn('Shortened URL has expired', { shortCode }, 'urlShortener');
      return null;
    }

    return url;
  },

  recordClick(shortCode: string, referrer: string = ''): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = this.getShortenedUrl(shortCode);
      
      if (!url) {
        reject(new Error('URL not found or expired'));
        return;
      }

      const click: UrlClick = {
        timestamp: new Date(),
        referrer: referrer || window.location.origin,
        userAgent: navigator.userAgent,
        ipAddress: '127.0.0.1', // Mock IP
        location: getMockLocation()
      };

      url.clicks.push(click);
      url.clickCount = url.clicks.length;

      storageUtils.updateShortenedUrl(url);
      
      logger.info('Recorded click for shortened URL', { 
        shortCode,
        clickCount: url.clickCount 
      }, 'urlShortener');

      resolve();
    });
  },

  getAllShortenedUrls(): ShortenedUrl[] {
    return storageUtils.getShortenedUrls();
  },

  deleteShortenedUrl(id: string): void {
    storageUtils.deleteShortenedUrl(id);
    logger.info('Deleted shortened URL', { id }, 'urlShortener');
  }
};