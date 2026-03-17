import React from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-sm text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold font-display mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">
          We encountered an unexpected error. Don't worry, your data is safe in our database.
        </p>
        
        <div className="bg-muted/50 rounded-lg p-4 mb-8 text-left overflow-auto max-h-32">
          <p className="text-xs font-mono text-destructive break-all">{(error as Error).message}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={resetErrorBoundary} className="w-full gap-2">
            <RefreshCcw className="h-4 w-4" /> Try Again
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/"} className="w-full gap-2">
            <Home className="h-4 w-4" /> Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

export function GlobalErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app so the error doesn't happen again
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function ComponentErrorBoundary({ children, name = "component" }: { children: React.ReactNode; name?: string }) {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div className="p-6 border border-destructive/20 bg-destructive/5 rounded-xl text-center">
          <p className="text-sm font-medium text-destructive mb-2 font-display">Failed to load {name}</p>
          <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{(error as Error).message}</p>
          <Button variant="outline" size="sm" onClick={resetErrorBoundary} className="gap-2">
            <RefreshCcw className="h-3.5 w-3.5" /> Retry
          </Button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
