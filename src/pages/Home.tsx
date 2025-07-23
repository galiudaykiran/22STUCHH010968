import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { urlShortenerService } from '@/utils/urlShortener';
import { logger } from '@/utils/logger';
import { Copy, Link, Clock, Sparkles } from 'lucide-react';
import { ShortenedUrl } from '@/types/url';

const Home = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customShortUrl, setCustomShortUrl] = useState('');
  const [validUntilMinutes, setValidUntilMinutes] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null);
  const { toast } = useToast();

  const validateForm = (): string | null => {
    if (!originalUrl.trim()) {
      return 'Please enter a URL to shorten';
    }

    try {
      new URL(originalUrl);
    } catch {
      return 'Please enter a valid URL (e.g., https://example.com)';
    }

    if (customShortUrl && customShortUrl.length < 3) {
      return 'Custom short URL must be at least 3 characters long';
    }

    if (validUntilMinutes !== '' && (validUntilMinutes <= 0 || validUntilMinutes > 525600)) {
      return 'Valid until must be between 1 and 525600 minutes (1 year)';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      toast({
        title: 'Validation Error',
        description: validationError,
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    logger.info('Starting URL shortening process', { originalUrl, customShortUrl }, 'Home');

    try {
      const result = await urlShortenerService.createShortenedUrl({
        originalUrl: originalUrl.trim(),
        customShortUrl: customShortUrl.trim() || undefined,
        validUntilMinutes: validUntilMinutes === '' ? undefined : Number(validUntilMinutes)
      });

      setShortenedUrl(result);
      toast({
        title: 'Success!',
        description: 'Your URL has been shortened successfully.'
      });

      logger.info('URL shortened successfully', { shortCode: result.shortCode }, 'Home');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to shorten URL';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      logger.error('Failed to shorten URL', error, 'Home');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'Short URL copied to clipboard.'
      });
      logger.info('URL copied to clipboard', { url: text }, 'Home');
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please copy the URL manually.',
        variant: 'destructive'
      });
      logger.error('Failed to copy URL to clipboard', error, 'Home');
    }
  };

  const resetForm = () => {
    setOriginalUrl('');
    setCustomShortUrl('');
    setValidUntilMinutes('');
    setShortenedUrl(null);
  };

  const getShortUrl = () => {
    if (!shortenedUrl) return '';
    return `${window.location.origin}/r/${shortenedUrl.shortCode}`;
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">URL Shortener</h1>
        <p className="text-xl text-muted-foreground">
          Transform long URLs into short, shareable links
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Shorten Your URL
          </CardTitle>
          <CardDescription>
            Enter a long URL and optionally customize your short link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="originalUrl">Original URL *</Label>
              <Input
                id="originalUrl"
                type="url"
                placeholder="https://example.com/very/long/url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customShortUrl">Custom Short URL (optional)</Label>
              <Input
                id="customShortUrl"
                type="text"
                placeholder="my-custom-link"
                value={customShortUrl}
                onChange={(e) => setCustomShortUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validUntilMinutes" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Valid Until (minutes)
              </Label>
              <Input
                id="validUntilMinutes"
                type="number"
                placeholder="1440 (24 hours)"
                min="1"
                max="525600"
                value={validUntilMinutes}
                onChange={(e) => setValidUntilMinutes(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Shortening...' : 'Shorten URL'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {shortenedUrl && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Sparkles className="w-5 h-5" />
              Your Shortened URL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Short URL</Label>
              <div className="flex gap-2">
                <Input
                  value={getShortUrl()}
                  readOnly
                  className="bg-muted"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(getShortUrl())}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Original URL</Label>
              <Input
                value={shortenedUrl.originalUrl}
                readOnly
                className="bg-muted"
              />
            </div>

            {shortenedUrl.expiresAt && (
              <div className="space-y-2">
                <Label>Expires At</Label>
                <Input
                  value={shortenedUrl.expiresAt.toLocaleString()}
                  readOnly
                  className="bg-muted"
                />
              </div>
            )}

            <Button onClick={resetForm} variant="outline" className="w-full">
              Create Another
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Home;