import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PageLoader from "@/components/PageLoader";
import { toast } from "sonner";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    
    const params = new URLSearchParams(search || hash.replace('#', '?'));
    const error = params.get('error_description') || params.get('error');
    
    if (error) {
      toast.error(error);
      navigate("/login", { replace: true });
      return;
    }

    // Give Supabase a moment to process the token if it's in the URL
    const timer = setTimeout(() => {
      if (session) {
        toast.success("Successfully authenticated!");
        navigate("/dashboard", { replace: true });
      } else {
        toast.success("Email confirmed. Please log in.");
        navigate("/login", { replace: true });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate, session]);

  return <PageLoader />;
}
