import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, 
  LayoutDashboard, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronDown 
} from "lucide-react";

interface ProfileDropdownProps {
  onNavigate: (section: string) => void;
}

export default function ProfileDropdown({ onNavigate }: ProfileDropdownProps) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleMenuClick = (action: string) => {
    setIsOpen(false);
    
    switch (action) {
      case "dashboard":
        onNavigate("dashboard");
        console.log("Navigating to Dashboard");
        break;
      case "profile":
        onNavigate("profile");
        console.log("Navigating to Profile");
        break;
      case "settings":
        onNavigate("settings");
        console.log("Navigating to Settings");
        break;
      case "help":
        onNavigate("help");
        console.log("Navigating to Help");
        break;
      case "logout":
        logout();
        console.log("User logged out");
        break;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 px-3 hover-elevate"
          data-testid="button-profile-dropdown"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
            <AvatarFallback className="text-xs">
              {getInitials(user.fullName || user.username)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline font-medium">
            {user.fullName || user.username}
          </span>
          <ChevronDown className="h-4 w-4 transition-transform duration-200" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.fullName || user.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => handleMenuClick("dashboard")}
          data-testid="menu-dashboard"
          className="cursor-pointer"
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleMenuClick("profile")}
          data-testid="menu-profile"
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleMenuClick("settings")}
          data-testid="menu-settings"
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleMenuClick("help")}
          data-testid="menu-help"
          className="cursor-pointer"
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => handleMenuClick("logout")}
          data-testid="menu-logout"
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}