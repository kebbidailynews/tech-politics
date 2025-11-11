// src/components/ui/LoadingSpinner.tsx
import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Loading TechPolitics…
        </p>
      </div>
    </div>
  );
}