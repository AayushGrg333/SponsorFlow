// app/auth/callback/page.tsx
import { Suspense } from "react";
import OAuthCallbackContent from "./OAuthCallbackContent";
import { Loader2 } from "lucide-react";

export default function OAuthCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense fallback={
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Completing authentication...</p>
        </div>
      }>
        <OAuthCallbackContent />
      </Suspense>
    </div>
  );
}