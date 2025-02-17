"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CallDetailsSlideOver } from "@/components/shared/CallHistory/CallDetailsSlideOver";
import { CallHistory } from "@/components/shared/CallHistory";
import { CallRecord } from "@/components/shared/CallHistory/types";
import { VAPICallService } from "@/lib/services/vapi-calls";
import { CallLogsSkeleton } from "@/components/shared/CallHistory/LoadingSkeleton";
import { PageHeader } from "../components/page-header";

export default function CallLogsPage() {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [slideOverOpen, setSlideOverOpen] = useState(false);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        setLoading(true);
        const vapiCalls = await VAPICallService.getVAPICalls();
        const callRecords = vapiCalls.map((call) => ({
          id: call.id,
          customerName: call.customer_name || "Unknown",
          customerEmail: call.customer_email || "",
          customerNumber: call.customer_number || "",
          customerInitial: (call.customer_name?.[0] || "U").toUpperCase(),
          date: call.started_at,
          duration: formatDuration(call.duration_minutes),
          type: call.type || "",
          status: call.ended_at ? "Completed" : "In Progress",
          summary: call.summary || "",
          transcript: call.transcript || "",
          cost: call.cost || 0,
          assistant_name: call.assistant_name || "",
          assistant_model_model: call.assistant_model_model || "",
          assistant_transcriber_model: call.assistant_transcriber_model || "",
          grade:
            call.analysis_success_evaluation === undefined
              ? null
              : call.analysis_success_evaluation,
          tags: [],
          ended_reason: call.ended_reason || "",
          recording_url: call.recording_url || "",
          stereo_recording_url: call.stereo_recording_url || "",
          phone_number_id: call.phone_number_id || "",
        }));
        setCalls(callRecords);
      } catch (error) {
        console.error("Error fetching calls:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, []);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);
    const seconds = Math.floor((minutes * 60) % 60);
    return `${String(hours).padStart(2, "0")}:${String(
      remainingMinutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleCallClick = (call: CallRecord) => {
    setSelectedCall(call);
    setSlideOverOpen(true);
  };

  if (loading) {
    return <CallLogsSkeleton />;
  }

  return (
    <div className="flex min-h-full w-full flex-col">
      <PageHeader title="Call Logs" />

      <div className="flex-1 space-y-4 p-4 md:p-8">
        <Card>
          <CardContent className="p-0">
            <CallHistory
              calls={calls}
              title="Call Logs"
              subtitle="View and manage your call history"
              showGrade={true}
              showStatus={true}
              onCallClick={handleCallClick}
            />
          </CardContent>
        </Card>

        <CallDetailsSlideOver
          call={selectedCall}
          open={slideOverOpen}
          onClose={() => {
            setSlideOverOpen(false);
            setSelectedCall(null);
          }}
        />
      </div>
    </div>
  );
}
