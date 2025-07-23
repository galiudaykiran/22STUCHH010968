import { ShortenedUrl } from '@/types/url';
import { logger } from './logger';

const STORAGE_KEY = 'shortened_urls';

export const storageUtils = {
  getShortenedUrls(): ShortenedUrl[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((url: any) => ({
        ...url,
        createdAt: new Date(url.createdAt),
        expiresAt: url.expiresAt ? new Date(url.expiresAt) : undefined,
        clicks: url.clicks.map((click: any) => ({
          ...click,
          timestamp: new Date(click.timestamp)
        }))
      }));
    } catch (error) {
      logger.error('Failed to load shortened URLs from storage', error, 'storage');
      return [];
    }
  },

  saveShortenedUrl(url: ShortenedUrl): void {
    try {
      const existing = this.getShortenedUrls();
      const updated = [...existing, url];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      logger.info('Saved shortened URL to storage', { shortCode: url.shortCode }, 'storage');
    } catch (error) {
      logger.error('Failed to save shortened URL to storage', error, 'storage');
    }
  },

  updateShortenedUrl(updatedUrl: ShortenedUrl): void {
    try {
      const existing = this.getShortenedUrls();
      const updated = existing.map(url => 
        url.id === updatedUrl.id ? updatedUrl : url
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      logger.info('Updated shortened URL in storage', { shortCode: updatedUrl.shortCode }, 'storage');
    } catch (error) {
      logger.error('Failed to update shortened URL in storage', error, 'storage');
    }
  },

  deleteShortenedUrl(id: string): void {
    try {
      const existing = this.getShortenedUrls();
      const updated = existing.filter(url => url.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      logger.info('Deleted shortened URL from storage', { id }, 'storage');
    } catch (error) {
      logger.error('Failed to delete shortened URL from storage', error, 'storage');
    }
  },

  clearAllUrls(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      logger.info('Cleared all shortened URLs from storage', {}, 'storage');
    } catch (error) {
      logger.error('Failed to clear shortened URLs from storage', error, 'storage');
    }
  }
};