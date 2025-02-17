"use client";

import * as React from "react";
import { AnalyticsCard } from "./components/AnalyticsCard";
import { CallsChart } from "./components/CallsChart";
import { ConnectionTest } from "./components/ConnectionTest";
import { TimeframeFilter } from "./components/TimeframeFilter";
import { VAPICallService } from "@/lib/services/vapi-calls";
import { AICallData } from "@/lib/types";
import { TimeframeType } from "./lib/timeframe-utils";
import {
  calculateAnalytics,
  calculateChartData,
  generateCardChartData,
  type AnalyticsData,
  type SimpleCallData,
} from "./lib/analytics-service";
import { DashboardSkeleton } from "./components/LoadingSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { CallRecord } from "@/components/shared/CallHistory/types";
import { PageHeader } from "../components/page-header";

export default function DashboardPage() {
  // State Management
  const [timeframe, setTimeframe] = React.useState<TimeframeType>("daily");
  const [analytics, setAnalytics] = React.useState<AnalyticsData | null>(null);
  const [calls, setCalls] = React.useState<CallRecord[]>([]); // Changed to CallRecord[]
  const [chartData, setChartData] = React.useState<
    { name: string; calls: number }[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [distributionData, setDistributionData] = React.useState([
    { name: "Completed", value: 0, color: "#10b981" },
    { name: "In Progress", value: 0, color: "#3b82f6" },
    { name: "Failed", value: 0, color: "#ef4444" },
  ]);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);
    const seconds = Math.floor((minutes * 60) % 60);
    return `${String(hours).padStart(2, "0")}:${String(
      remainingMinutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const convertToCallRecord = React.useCallback(
    (vapiCall: AICallData): CallRecord => ({
      id: vapiCall.id,
      customerName: vapiCall.customer_name || "Unknown",
      customerEmail: vapiCall.customer_email || "",
      customerNumber: vapiCall.customer_number || "",
      customerInitial: (vapiCall.customer_name?.[0] || "U").toUpperCase(),
      date: vapiCall.started_at,
      duration: formatDuration(vapiCall.duration_minutes),
      type: vapiCall.type || "",
      status: vapiCall.ended_at ? "Completed" : "In Progress", // Status based on ended_at
      summary: vapiCall.summary || "",
      transcript: vapiCall.transcript || "",
      cost: vapiCall.cost || 0,
      assistant_name: vapiCall.assistant_name || "",
      assistant_model_model: vapiCall.assistant_model_model || "",
      assistant_transcriber_model: vapiCall.assistant_transcriber_model || "",
      grade:
        vapiCall.analysis_success_evaluation === undefined
          ? null
          : vapiCall.analysis_success_evaluation,
      tags: [],
      ended_reason: vapiCall.ended_reason || "",
      recording_url: vapiCall.recording_url || "",
      stereo_recording_url: vapiCall.stereo_recording_url || "",
      phone_number_id: vapiCall.phone_number_id || "",
    }),
    []
  );

  // Analytics Calculations
  const calculateDistribution = (callData: CallRecord[]) => {
    const total = callData.length;
    if (total === 0) return;

    const statusCount = callData.reduce((acc, call) => {
      const status = call.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("Status Counts:", statusCount); // VERIFY THIS OUTPUT

    setDistributionData([
      {
        name: "Completed",
        value: Math.round(((statusCount["completed"] || 0) / total) * 100),
        color: "#10b981",
      },
      {
        name: "In Progress",
        value: Math.round(((statusCount["in progress"] || 0) / total) * 100),
        color: "#3b82f6",
      },
      {
        name: "Failed",
        value: Math.round(
          (((statusCount["failed"] || 0) + (statusCount["error"] || 0)) /
            total) *
            100
        ),
        color: "#ef4444",
      },
    ]);
  };

  // Data Fetching and Subscription
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const vapiCalls = await VAPICallService.getVAPICalls();
        const callRecords = vapiCalls.map(convertToCallRecord); // Convert to CallRecord
        setAnalytics(calculateAnalytics(vapiCalls, timeframe));
        setCalls(callRecords);
        setChartData(calculateChartData(vapiCalls, timeframe));
        calculateDistribution(callRecords);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const unsubscribe = VAPICallService.subscribeToVAPICalls((newCall) => {
      setCalls((prevCalls) => {
        const newCallRecord = convertToCallRecord(newCall);
        const existingIndex = prevCalls.findIndex(
          (call) => call.id === newCall.id
        );
        const updatedCalls =
          existingIndex >= 0
            ? prevCalls.map((call, index) =>
                index === existingIndex ? newCallRecord : call
              )
            : [newCallRecord, ...prevCalls];
        calculateDistribution(updatedCalls);
        return updatedCalls;
      });

      setAnalytics(calculateAnalytics([newCall], timeframe));
      setChartData(calculateChartData([newCall], timeframe));
    });

    return () => unsubscribe();
  }, [timeframe, convertToCallRecord]);

  const analyticsCards =
    analytics && calls.length
      ? [
          {
            title: "Total Call Minutes",
            value: analytics.totalMinutes,
            data: generateCardChartData(
              calls.map(
                (call): SimpleCallData => ({
                  started_at: call.date,
                  duration_minutes:
                    parseFloat(call.duration.split(":")[0]) * 60 +
                    parseFloat(call.duration.split(":")[1]),
                  cost: call.cost,
                })
              ),
              "minutes",
              timeframe
            ),
          },
          {
            title: "Number of Calls",
            value: analytics.totalCalls,
            data: generateCardChartData(
              calls.map(
                (call): SimpleCallData => ({
                  started_at: call.date,
                  duration_minutes:
                    parseFloat(call.duration.split(":")[0]) * 60 +
                    parseFloat(call.duration.split(":")[1]),
                  cost: call.cost,
                })
              ),
              "calls",
              timeframe
            ),
          },
          {
            title: "Total Spent",
            value: analytics.totalSpent,
            prefix: "$",
            data: generateCardChartData(
              calls.map(
                (call): SimpleCallData => ({
                  started_at: call.date,
                  duration_minutes:
                    parseFloat(call.duration.split(":")[0]) * 60 +
                    parseFloat(call.duration.split(":")[1]),
                  cost: call.cost,
                })
              ),
              "cost",
              timeframe
            ),
          },
          {
            title: "Average Cost per Call",
            value: analytics.averageCost,
            prefix: "$",
            data: generateCardChartData(
              calls.map(
                (call): SimpleCallData => ({
                  started_at: call.date,
                  duration_minutes:
                    parseFloat(call.duration.split(":")[0]) * 60 +
                    parseFloat(call.duration.split(":")[1]),
                  cost: call.cost,
                })
              ),
              "average",
              timeframe
            ),
          },
        ]
      : [];

  return (
    <div className="flex min-h-full w-full flex-col">
      <PageHeader title="Overview">
        <TimeframeFilter value={timeframe} onChange={setTimeframe} />
      </PageHeader>

      <div className="flex-1 space-y-4 p-4 md:p-8">
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <ConnectionTest />
            <div className="space-y-6 max-w-[2000px] mx-auto">
              {/* Analytics Cards Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {analyticsCards.map((card, index) => (
                  <AnalyticsCard
                    key={card.title}
                    title={card.title}
                    value={card.value}
                    prefix={card.prefix}
                    index={index}
                    data={card.data}
                    timeframe={timeframe}
                  />
                ))}
              </div>

              {/* Call Volume Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="w-full bg-white lg:col-span-2">
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Call Volume Over Time
                      </h2>
                      <div className="h-[400px] w-full">
                        <CallsChart
                          data={chartData}
                          distributionData={distributionData}
                          totalCalls={calls.length}
                          type="area"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="w-full bg-white">
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Call Distribution
                      </h2>
                      <div className="h-[400px] w-full">
                        <CallsChart
                          data={[]}
                          distributionData={distributionData}
                          totalCalls={calls.length}
                          type="pie" // ENSURE THIS IS SET TO "pie"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
