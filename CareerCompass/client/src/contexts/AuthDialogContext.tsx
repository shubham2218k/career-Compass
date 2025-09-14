import { createContext, useContext, useState, ReactNode } from "react";

interface AuthDialogContextType {
  isOpen: boolean;
  activeTab: "signin" | "signup";
  openDialog: (tab?: "signin" | "signup") => void;
  closeDialog: () => void;
  setActiveTab: (tab: "signin" | "signup") => void;
}

const AuthDialogContext = createContext<AuthDialogContextType | undefined>(undefined);

export function useAuthDialog() {
  const context = useContext(AuthDialogContext);
  if (context === undefined) {
    throw new Error("useAuthDialog must be used within an AuthDialogProvider");
  }
  return context;
}

interface AuthDialogProviderProps {
  children: ReactNode;
}

export function AuthDialogProvider({ children }: AuthDialogProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  const openDialog = (tab: "signin" | "signup" = "signin") => {
    setActiveTab(tab);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const value = {
    isOpen,
    activeTab,
    openDialog,
    closeDialog,
    setActiveTab,
  };

  return (
    <AuthDialogContext.Provider value={value}>
      {children}
    </AuthDialogContext.Provider>
  );
}