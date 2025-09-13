import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthDialog } from "@/contexts/AuthDialogContext";
import { Loader2 } from "lucide-react";

export default function AuthDialog() {
  const { login, register } = useAuth();
  const { isOpen, activeTab, closeDialog, setActiveTab } = useAuthDialog();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Sign In form
  const [signInData, setSignInData] = useState({
    username: "",
    password: ""
  });

  // Sign Up form
  const [signUpData, setSignUpData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(signInData.username, signInData.password);
      if (success) {
        closeDialog();
        // Reset form
        setSignInData({ username: "", password: "" });
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (signUpData.password !== signUpData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (signUpData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const success = await register(signUpData.username, signUpData.email, signUpData.password);
      if (success) {
        closeDialog();
        // Reset form
        setSignUpData({ username: "", email: "", password: "", confirmPassword: "" });
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-heading text-2xl">
            Welcome to CareerPath
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "signin" | "signup")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin" data-testid="tab-signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup" data-testid="tab-signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Welcome back! Continue your career journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-username">Username</Label>
                    <Input
                      id="signin-username"
                      type="text"
                      placeholder="Enter your username"
                      value={signInData.username}
                      onChange={(e) => setSignInData({ ...signInData, username: e.target.value })}
                      disabled={isLoading}
                      required
                      data-testid="input-signin-username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      disabled={isLoading}
                      required
                      data-testid="input-signin-password"
                    />
                  </div>
                  
                  {error && (
                    <div className="text-sm text-destructive text-center" data-testid="error-message">
                      {error}
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                    data-testid="button-signin-submit"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Start your career discovery journey today!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="Choose a username"
                      value={signUpData.username}
                      onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                      disabled={isLoading}
                      required
                      data-testid="input-signup-username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      disabled={isLoading}
                      required
                      data-testid="input-signup-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      disabled={isLoading}
                      required
                      data-testid="input-signup-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                      disabled={isLoading}
                      required
                      data-testid="input-signup-confirm-password"
                    />
                  </div>
                  
                  {error && (
                    <div className="text-sm text-destructive text-center" data-testid="error-message">
                      {error}
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                    data-testid="button-signup-submit"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}