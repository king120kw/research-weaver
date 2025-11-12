import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    navigate("/welcome");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-destructive/5 via-background to-destructive/10 px-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardContent className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-destructive/10 p-6">
              <LogOut className="h-12 w-12 text-destructive" />
            </div>
          </div>

          <h1 className="mb-3 text-2xl font-bold text-foreground">
            Log Out?
          </h1>
          
          <p className="mb-8 text-muted-foreground">
            Are you sure you want to log out of your account?
          </p>

          <div className="space-y-3">
            <Button
              onClick={handleLogout}
              variant="destructive"
              size="lg"
              className="w-full"
            >
              Yes, Log Out
            </Button>
            
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="lg"
              className="w-full"
            >
              Cancel
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            You can always log back in anytime
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Logout;
