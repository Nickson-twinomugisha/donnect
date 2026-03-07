import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      signup(email, password, name, "staff");
      toast({ title: "Account created", description: "Welcome to Donnect!" });
      navigate("/dashboard");
    } else {
      const success = login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        toast({ title: "Login failed", description: "Invalid credentials. Try admin@donnect.com or staff@donnect.com with any password.", variant: "destructive" });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Droplets className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-display text-foreground tracking-tight">Donnect</h1>
        </div>

        <Card className="border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="font-display">{isSignup ? "Create Account" : "Welcome Back"}</CardTitle>
            <CardDescription>
              {isSignup ? "Sign up to start managing donations" : "Sign in to your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@donnect.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              <Button type="submit" className="w-full">{isSignup ? "Create Account" : "Sign In"}</Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button className="text-primary hover:underline" onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? "Sign in" : "Sign up"}
              </button>
            </div>

            <div className="mt-6 p-3 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Demo Accounts:</p>
              <p>Admin: admin@donnect.com</p>
              <p>Staff: staff@donnect.com</p>
              <p className="mt-1 italic">Any password works</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
