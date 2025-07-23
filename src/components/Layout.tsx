import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link as LinkIcon, BarChart3, Github } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <LinkIcon className="w-6 h-6 text-primary" />
              LinkLet
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                asChild
              >
                <Link to="/" className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Shorten
                </Link>
              </Button>

              <Button
                variant={isActive('/stats') ? 'default' : 'ghost'}
                asChild
              >
                <Link to="/stats" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Statistics
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                Built with React, TypeScript, and Tailwind CSS
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Custom logging middleware • Local storage • No external dependencies
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  Source Code
                </a>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;