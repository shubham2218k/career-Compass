import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Globe, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import AuthDialog from "./AuthDialog";

interface NavbarProps {
  onThemeToggle: () => void;
  isDark: boolean;
  onNavigate?: (section: string) => void;
}

export default function Navbar({ onThemeToggle, isDark, onNavigate }: NavbarProps) {
  const { isAuthenticated } = useAuth();
  const [language, setLanguage] = useState("EN");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogTab, setAuthDialogTab] = useState<"signin" | "signup">("signin");

  const navItems = [
    { name: "Home", href: "#", active: true },
    { name: "About", href: "#about" },
    { name: "Library", href: "#library" },
    { name: "AI Chat", href: "#chat" },
    { name: "Roadmap", href: "#roadmap" },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "EN" ? "हि" : "EN");
    console.log(`Language switched to: ${language === "EN" ? "Hindi" : "English"}`);
  };

  const handleSignInClick = () => {
    setAuthDialogTab("signin");
    setAuthDialogOpen(true);
  };

  const handleSignUpClick = () => {
    setAuthDialogTab("signup");
    setAuthDialogOpen(true);
  };

  const handleNavigate = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="font-heading font-bold text-xl text-primary">
              CareerPath
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  item.active
                    ? "text-primary font-semibold border-b-2 border-primary pb-1"
                    : "text-muted-foreground"
                }`}
                data-testid={`link-nav-${item.name.toLowerCase().replace(" ", "-")}`}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              data-testid="button-language-toggle"
              className="gap-1"
            >
              <Globe className="h-4 w-4" />
              {language}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onThemeToggle}
              data-testid="button-theme-toggle"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {isAuthenticated ? (
              <ProfileDropdown onNavigate={handleNavigate} />
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignInClick}
                  data-testid="button-sign-in"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSignUpClick}
                  data-testid="button-sign-up"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    item.active ? "text-primary font-semibold" : "text-muted-foreground"
                  }`}
                  data-testid={`link-mobile-${item.name.toLowerCase().replace(" ", "-")}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleLanguage}
                    className="gap-1"
                  >
                    <Globe className="h-4 w-4" />
                    {language}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onThemeToggle}
                  >
                    {isDark ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {isAuthenticated ? (
                  <ProfileDropdown onNavigate={handleNavigate} />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleSignInClick}
                    >
                      Sign In
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleSignUpClick}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Dialog */}
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        defaultTab={authDialogTab}
      />
    </nav>
  );
}