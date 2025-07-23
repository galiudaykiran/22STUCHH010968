import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
import { Loader2, Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      logger.warn('Login form validation failed', { email }, 'Login');
      return;
    }

    setIsLoading(true);
    logger.info('Starting login process', { email }, 'Login');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock authentication logic
      const isValidCredentials = email === 'user@example.com' && password === 'password123';
      
      if (isValidCredentials) {
        // Store auth state (in a real app, this would be handled by your auth provider)
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        
        toast({
          title: 'Login Successful',
          description: 'Welcome back! Redirecting to dashboard...'
        });
        
        logger.info('Login successful', { email }, 'Login');
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
        
      } else {
        throw new Error('Invalid email or password');
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive'
      });
      
      logger.error('Login failed', { email, error: errorMessage }, 'Login');
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('user@example.com');
    setPassword('password123');
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <LogIn className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: undefined }));
                  }
                }}
                className={errors.email ? 'border-destructive' : ''}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }
                }}
                className={errors.password ? 'border-destructive' : ''}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Login Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>

            {/* Demo Login Helper */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Demo credentials:</p>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="text-xs"
              >
                Use Demo Login (user@example.com)
              </Button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button variant="link" className="p-0 h-auto text-sm">
                Sign up here
              </Button>
            </p>
            <Button variant="link" className="p-0 h-auto text-sm text-muted-foreground">
              Forgot your password?
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;