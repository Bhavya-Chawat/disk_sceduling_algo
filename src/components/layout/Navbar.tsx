import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HardDrive,
  BookOpen,
  Play,
  BarChart3,
  Sun,
  Moon,
  Contrast,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme, highContrast, toggleHighContrast } = useTheme();

  const navItems = [
    { path: "/", label: "Home", icon: HardDrive },
    { path: "/simulator", label: "Simulator", icon: Play },
    { path: "/theory", label: "Theory", icon: BookOpen },
    { path: "/compare", label: "Compare", icon: BarChart3 },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            aria-label="Home - Disk Scheduler"
          >
            <img
              src="/favicon.ico"
              alt=""
              className="w-10 h-10 group-hover:scale-110 transition-transform"
              aria-hidden="true"
            />
            <span className="font-bold text-lg hidden sm:block">
              <span className="text-foreground">Disk</span>
              <span className="text-primary">Scheduler</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1" role="menubar">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  role="menuitem"
                  aria-current={isActive ? "page" : undefined}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 rounded-lg bg-primary/10 -z-10"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </Link>
              );
            })}

            {/* High Contrast Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleHighContrast}
                  className={`ml-2 w-9 h-9 ${
                    highContrast ? "text-primary bg-primary/10" : ""
                  }`}
                  aria-label={
                    highContrast
                      ? "Disable high contrast mode"
                      : "Enable high contrast mode"
                  }
                  aria-pressed={highContrast}
                >
                  <Contrast className="w-4 h-4" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{highContrast ? "Disable" : "Enable"} high contrast</p>
              </TooltipContent>
            </Tooltip>

            {/* Theme Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="w-9 h-9"
                  aria-label={
                    theme === "light"
                      ? "Switch to dark mode"
                      : "Switch to light mode"
                  }
                >
                  {theme === "light" ? (
                    <Moon className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Sun className="w-4 h-4" aria-hidden="true" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Switch to {theme === "light" ? "dark" : "light"} mode</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
