import { useAuth } from "@/contexts/AuthContext";
import { SyncStatusIndicator } from "@/components/SyncStatusIndicator";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AppHeader() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border px-4 h-14 flex items-center justify-between md:hidden">
      <div>
        <h1 className="font-semibold text-foreground">Deyon Clinic</h1>
      </div>
      <div className="flex items-center gap-2">
        <SyncStatusIndicator />
        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          className="h-10 w-10"
          aria-label="Sign out"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
