import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { urlShortenerService } from '@/utils/urlShortener';
import { logger } from '@/utils/logger';
import { ShortenedUrl } from '@/types/url';
import { BarChart3, Search, Trash2, Copy, ExternalLink, Clock, MapPin, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Statistics = () => {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [filteredUrls, setFilteredUrls] = useState<ShortenedUrl[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadUrls();
  }, []);

  useEffect(() => {
    filterUrls();
  }, [urls, searchTerm]);

  const loadUrls = () => {
    const allUrls = urlShortenerService.getAllShortenedUrls();
    setUrls(allUrls);
    logger.info('Loaded URLs for statistics', { count: allUrls.length }, 'Statistics');
  };

  const filterUrls = () => {
    if (!searchTerm.trim()) {
      setFilteredUrls(urls);
      return;
    }

    const filtered = urls.filter(url => 
      url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (url.customShortUrl && url.customShortUrl.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUrls(filtered);
  };

  const deleteUrl = (id: string) => {
    urlShortenerService.deleteShortenedUrl(id);
    loadUrls();
    toast({
      title: 'Deleted',
      description: 'URL has been deleted successfully.'
    });
    logger.info('Deleted URL from statistics page', { id }, 'Statistics');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'URL copied to clipboard.'
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please copy the URL manually.',
        variant: 'destructive'
      });
    }
  };

  const getShortUrl = (shortCode: string) => {
    return `${window.location.origin}/r/${shortCode}`;
  };

  const isExpired = (url: ShortenedUrl) => {
    return url.expiresAt && new Date() > url.expiresAt;
  };

  const getTotalClicks = () => {
    return urls.reduce((total, url) => total + url.clickCount, 0);
  };

  const getUniqueLocations = () => {
    const locations = new Set<string>();
    urls.forEach(url => {
      url.clicks.forEach(click => {
        locations.add(click.location);
      });
    });
    return locations.size;
  };

  const getTopReferrers = () => {
    const referrerCounts: { [key: string]: number } = {};
    urls.forEach(url => {
      url.clicks.forEach(click => {
        const referrer = click.referrer || 'Direct';
        referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1;
      });
    });

    return Object.entries(referrerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="w-8 h-8" />
            URL Statistics
          </h1>
          <p className="text-muted-foreground mt-2">
            Track and analyze your shortened URLs
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total URLs</p>
                <p className="text-2xl font-bold">{urls.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold">{getTotalClicks()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Locations</p>
                <p className="text-2xl font-bold">{getUniqueLocations()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active URLs</p>
                <p className="text-2xl font-bold">{urls.filter(url => !isExpired(url)).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="urls" className="space-y-4">
        <TabsList>
          <TabsTrigger value="urls">URLs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="urls" className="space-y-4">
          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search URLs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* URLs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your Shortened URLs</CardTitle>
              <CardDescription>
                Showing {filteredUrls.length} of {urls.length} URLs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredUrls.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {urls.length === 0 ? 'No URLs created yet' : 'No URLs match your search'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Short URL</TableHead>
                        <TableHead>Original URL</TableHead>
                        <TableHead>Clicks</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUrls.map((url) => (
                        <TableRow key={url.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <code className="bg-muted px-2 py-1 rounded text-sm">
                                {url.shortCode}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(getShortUrl(url.shortCode))}
                                className="h-6 w-6"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate" title={url.originalUrl}>
                              {url.originalUrl}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {url.clickCount}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={isExpired(url) ? "destructive" : "default"}>
                              {isExpired(url) ? 'Expired' : 'Active'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {url.createdAt.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteUrl(url.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Referrers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Referrers</CardTitle>
                <CardDescription>Sources driving the most clicks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getTopReferrers().length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No click data available</p>
                  ) : (
                    getTopReferrers().map(([referrer, count], index) => (
                      <div key={referrer} className="flex items-center justify-between">
                        <span className="text-sm truncate flex-1" title={referrer}>
                          {referrer}
                        </span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Clicks</CardTitle>
                <CardDescription>Latest URL interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {urls.flatMap(url => 
                    url.clicks.map(click => ({
                      ...click,
                      shortCode: url.shortCode
                    }))
                  )
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .slice(0, 5)
                  .map((click, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div>
                        <code className="bg-muted px-1 rounded">{click.shortCode}</code>
                        <span className="text-muted-foreground ml-2">{click.location}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {click.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                  {urls.every(url => url.clicks.length === 0) && (
                    <p className="text-muted-foreground text-center py-4">No clicks recorded yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;