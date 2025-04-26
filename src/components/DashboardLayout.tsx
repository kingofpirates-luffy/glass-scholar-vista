
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, MessageCircle, BookOpen, Calendar, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-neutral-light">
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button variant="outline" size="icon" onClick={toggleSidebar} className="glass-button">
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 glass transition-all duration-300 transform",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-center py-6 mb-8">
            <Link to="/" className={cn("flex items-center", !isSidebarOpen && "lg:justify-center")}>
              {isSidebarOpen ? (
                <h1 className="text-xl font-semibold bg-gradient-to-r from-purple to-skyblue bg-clip-text text-transparent">
                  ScholarVista
                </h1>
              ) : (
                <span className="text-xl font-bold text-purple">S</span>
              )}
            </Link>
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-2">
              <NavItem
                to="/dashboard"
                icon={<LayoutDashboard className="h-5 w-5" />}
                label="Dashboard"
                collapsed={!isSidebarOpen}
              />
              <NavItem
                to="/dashboard/chat"
                icon={<MessageCircle className="h-5 w-5" />}
                label="Study Assistant"
                collapsed={!isSidebarOpen}
              />
              <NavItem
                to="/dashboard/courses"
                icon={<BookOpen className="h-5 w-5" />}
                label="Courses"
                collapsed={!isSidebarOpen}
              />
              <NavItem
                to="/dashboard/calendar"
                icon={<Calendar className="h-5 w-5" />}
                label="Calendar"
                collapsed={!isSidebarOpen}
              />
              <NavItem
                to="/dashboard/settings"
                icon={<Settings className="h-5 w-5" />}
                label="Settings"
                collapsed={!isSidebarOpen}
              />
            </ul>
          </nav>
          
          <div className="mt-auto pt-4 border-t border-white/20">
            <div className={cn(
              "flex items-center",
              isSidebarOpen ? "justify-between" : "justify-center"
            )}>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                {isSidebarOpen && (
                  <div>
                    <p className="text-sm font-medium">Jane Doe</p>
                    <p className="text-xs text-muted-foreground">Computer Science</p>
                  </div>
                )}
              </div>
              {isSidebarOpen && (
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:flex hidden">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn(
        "transition-all duration-300",
        isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        <div className="p-6 pt-16 lg:pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const NavItem = ({ to, icon, label, collapsed }: NavItemProps) => (
  <li>
    <Link
      to={to}
      className={cn(
        "flex items-center p-3 rounded-lg text-foreground/80 hover:bg-white/20 transition-colors",
        collapsed ? "justify-center" : "gap-3"
      )}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  </li>
);

export default DashboardLayout;
