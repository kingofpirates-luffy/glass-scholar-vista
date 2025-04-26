
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationProps {
  transparent?: boolean;
}

const Navigation = ({ transparent = false }: NavigationProps) => {
  return (
    <nav
      className={cn(
        "w-full fixed top-0 z-50 px-4 py-3",
        transparent ? "bg-transparent" : "glass"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-purple to-skyblue bg-clip-text text-transparent">
            ScholarVista
          </h1>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm text-foreground/80 hover:text-purple transition-colors">
            Home
          </Link>
          <Link to="/features" className="text-sm text-foreground/80 hover:text-purple transition-colors">
            Features
          </Link>
          <Link to="/about" className="text-sm text-foreground/80 hover:text-purple transition-colors">
            About
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" className="glass-button text-foreground">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
