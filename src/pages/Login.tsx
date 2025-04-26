
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would validate credentials
    toast({
      title: "Login successful",
      description: "Redirecting to your dashboard...",
    });
    
    // Mock login - in a real app we would validate credentials
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-neutral-light flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple to-skyblue bg-clip-text text-transparent">
              ScholarVista
            </h1>
          </Link>
        </div>
        
        <Card className="glass-dialog animate-fade-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  className="bg-white/50 border-white/30"
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  className="bg-white/50 border-white/30"
                  required
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="remember" className="rounded text-purple focus:ring-purple" />
                  <label htmlFor="remember" className="text-foreground/70">Remember me</label>
                </div>
                <a href="#" className="text-purple hover:underline">
                  Forgot password?
                </a>
              </div>
              <Button
                type="submit"
                className="w-full bg-purple hover:bg-purple-dark text-white"
              >
                Sign in
              </Button>
              <p className="text-center text-sm text-foreground/70">
                Don't have an account?{" "}
                <Link to="/signup" className="text-purple hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
