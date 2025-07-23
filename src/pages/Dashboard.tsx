import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
import { urlShortenerService } from '@/utils/urlShortener';
import { ShortenedUrl } from '@/types/url';
import { 
  User, 
  LogOut, 
  Link as LinkIcon, 
  BarChart3, 
  Plus,
  TrendingUp,
  Clock,
  MousePointer
} from 'lucide-react';

const Dashboard = () => {
  const [userEmail, setUserEmail] = useState<string>('');
  const [recentUrls, setRecentUrls] = useState<ShortenedUrl[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const email = localStorage.getItem('userEmail');
    
    if (!isAuthenticated || !email) {
      navigate('/login');
      return;
    }

    setUserEmail(email);
    loadRecentUrls();
    logger.info('Dashboard loaded for user', { email }, 'Dashboard');
  }, [navigate]);

  const loadRecentUrls = () => {
    const allUrls = urlShortenerService.getAllShortenedUrls();
    // Get the 5 most recent URLs
    const recent = allUrls
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
    setRecentUrls(recent);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.'
    });
    
    logger.info('User logged out', { email: userEmail }, 'Dashboard');
    navigate('/login');
  };

  const getStats = () => {
    const allUrls = urlShortenerService.getAllShortenedUrls();
    const totalClicks = allUrls.reduce((sum, url) => sum + url.clickCount, 0);
    const activeUrls = allUrls.filter(url => !url.expiresAt || new Date() < url.expiresAt).length;
    
    return {
      totalUrls: allUrls.length,
      totalClicks,
      activeUrls
    };
  };

  const stats = getStats();

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userEmail}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/stats')}>
            <BarChart3 className="w-4 h-4 mr-2" />
            View All Stats
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <LinkIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total URLs</p>
                <p className="text-2xl font-bold">{stats.totalUrls}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MousePointer className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold">{stats.totalClicks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active URLs</p>
                <p className="text-2xl font-bold">{stats.activeUrls}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to manage your URLs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => navigate('/')}
              className="justify-start h-auto p-4"
              variant="outline"
            >
              <Plus className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Create New Short URL</div>
                <div className="text-sm text-muted-foreground">Shorten a new link</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => navigate('/stats')}
              className="justify-start h-auto p-4"
              variant="outline"
            >
              <BarChart3 className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">View Analytics</div>
                <div className="text-sm text-muted-foreground">Detailed statistics</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent URLs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent URLs
          </CardTitle>
          <CardDescription>
            Your 5 most recently created short URLs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentUrls.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No URLs created yet</p>
              <Button onClick={() => navigate('/')} className="mt-4">
                Create Your First Short URL
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentUrls.map((url) => (
                <div key={url.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                        {url.shortCode}
                      </code>
                      <Badge variant="secondary">
                        {url.clickCount} clicks
                      </Badge>
                      {url.expiresAt && new Date() > url.expiresAt && (
                        <Badge variant="destructive">Expired</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {url.originalUrl}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created {url.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="text-center pt-4">
                <Button variant="outline" onClick={() => navigate('/stats')}>
                  View All URLs
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;