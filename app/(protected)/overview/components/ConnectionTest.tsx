"use client";

import { useEffect, useState } from "react";
import { VAPICallService } from "@/lib/services/vapi-calls";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ConnectionTest() {
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        await VAPICallService.testConnection();
        setConnectionError(null);
      } catch (err) {
        setConnectionError(
          err instanceof Error ? err.message : "Failed to connect to database"
        );
      }
    };

    testConnection();
  }, []);

  // Only show something if there's an error
  if (!connectionError) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        "fixed right-4 top-4 z-50 w-auto max-w-[300px]",
        "rounded-lg shadow-lg border"
      )}
    >
      <Alert variant="destructive" className="bg-red-50 border-red-200">
        <div className="flex items-center gap-2">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
        </div>
        <AlertDescription className="mt-2 text-sm">
          {connectionError}
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}
