// app/dashboard/company/messages/page.tsx
import { Suspense } from "react";
import MessagesContent from "./MessagesContent";
import { Loader2 } from "lucide-react";

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}