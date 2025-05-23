
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface NavigationProps {
  transparent?: boolean;
}

const Navigation = ({ transparent = false }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "py-3 bg-white/70 dark:bg-black/70 backdrop-blur-lg shadow-md"
          : transparent
          ? "py-6 bg-transparent"
          : "py-4 bg-white/50 dark:bg-black/50 backdrop-blur-md"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <h1 
            className={cn(
              "text-xl font-bold bg-gradient-to-r from-purple to-skyblue bg-clip-text text-transparent transition-all",
              isScrolled && "text-lg"
            )}
          >
            ScholarVista
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavLink to="/" isActive={location.pathname === "/"}>
            Home
          </NavLink>
          <NavLink to="/features" isActive={location.pathname === "/features"}>
            Features
          </NavLink>
          <NavLink to="/about" isActive={location.pathname === "/about"}>
            About
          </NavLink>
          <NavLink to="/contact" isActive={location.pathname === "/contact"}>
            Contact
          </NavLink>
          
          <div className="ml-2">
            <ThemeToggle />
          </div>
          
          <Link to="/login">
            <Button className="ml-4 bg-purple hover:bg-purple-dark text-white">
              Sign In
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <Button 
            variant="ghost"
            size="icon"
            className="text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 dark:bg-background/95 backdrop-blur-md border-b border-border animate-fade-in">
          <nav className="container mx-auto py-4 px-6 flex flex-col space-y-3">
            <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/features" onClick={() => setIsMenuOpen(false)}>
              Features
            </MobileNavLink>
            <MobileNavLink to="/about" onClick={() => setIsMenuOpen(false)}>
              About
            </MobileNavLink>
            <MobileNavLink to="/contact" onClick={() => setIsMenuOpen(false)}>
              Contact
            </MobileNavLink>
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full bg-purple hover:bg-purple-dark text-white mt-2">
                Sign In
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, isActive, children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "text-purple bg-purple/10"
          : "text-foreground/70 hover:text-foreground hover:bg-accent"
      )}
    >
      {children}
    </Link>
  );
};

interface MobileNavLinkProps {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}

const MobileNavLink = ({ to, onClick, children }: MobileNavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "px-4 py-3 rounded-md text-base font-medium",
        isActive ? "text-purple bg-purple/10" : "text-foreground/70"
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Navigation;
