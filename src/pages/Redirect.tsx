import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { urlShortenerService } from '@/utils/urlShortener';
import { logger } from '@/utils/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertCircle, Clock } from 'lucide-react';

const Redirect = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!shortCode) {
      setError('Invalid short code');
      return;
    }

    logger.info('Attempting to redirect', { shortCode }, 'Redirect');

    const url = urlShortenerService.getShortenedUrl(shortCode);
    
    if (!url) {
      setError('URL not found or has expired');
      logger.warn('URL not found or expired during redirect', { shortCode }, 'Redirect');
      return;
    }

    // Record the click
    urlShortenerService.recordClick(shortCode, document.referrer)
      .then(() => {
        logger.info('Click recorded successfully', { shortCode }, 'Redirect');
      })
      .catch((err) => {
        logger.error('Failed to record click', err, 'Redirect');
      });

    setRedirectUrl(url.originalUrl);
    
    // Start countdown for redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = url.originalUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [shortCode]);

  if (error) {
    return (
      <div className="container mx-auto max-w-2xl py-16">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Link Not Found
            </CardTitle>
            <CardDescription>
              The link you're looking for doesn't exist or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                This could happen if:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>The link was mistyped</li>
                <li>The link has expired</li>
                <li>The link was deleted by its creator</li>
              </ul>
              <Button asChild className="w-full">
                <a href="/">Create New Short Link</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!redirectUrl) {
    return (
      <div className="container mx-auto max-w-2xl py-16">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-16">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Redirecting...
          </CardTitle>
          <CardDescription>
            You will be redirected to your destination in {countdown} seconds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Destination:</p>
            <div className="p-3 bg-muted rounded-md break-all text-sm">
              {redirectUrl}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Redirecting in {countdown} seconds...</span>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => window.location.href = redirectUrl}
              className="flex-1"
            >
              Go Now
            </Button>
            <Button 
              variant="outline" 
              asChild
              className="flex-1"
            >
              <a href="/">Cancel</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Redirect;