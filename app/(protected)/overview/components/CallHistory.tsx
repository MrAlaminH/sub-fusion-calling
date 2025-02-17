"use client";

import { CallHistory as SharedCallHistory } from "@/components/shared/CallHistory";
import { CallRecord } from "@/components/shared/CallHistory/types";

interface CallHistoryProps {
  calls: CallRecord[];
  onCallClick?: (call: CallRecord) => void;
}

export function CallHistory({ calls, onCallClick }: CallHistoryProps) {
  return (
    <SharedCallHistory
      calls={calls}
      showGrade={true}
      showStatus={true}
      onCallClick={onCallClick}
    />
  );
}
