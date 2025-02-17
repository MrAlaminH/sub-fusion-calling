import { AICallData } from "@/lib/types";
import { TimeframeType, getDateRangeForTimeframe, formatDateForGrouping, getTimeframePeriodLabels, calculatePercentageChange } from "./timeframe-utils";
import { format } from "date-fns";

export interface AnalyticsData {
  totalMinutes: { value: number; change: number };
  totalCalls: { value: number; change: number };
  totalSpent: { value: number; change: number };
  averageCost: { value: number; change: number };
}

export interface ChartDataPoint {
  name: string;
  calls: number;
}

export interface CardChartDataPoint {
  value: number;
}

export interface SimpleCallData {
  started_at: string;
  duration_minutes: number;
  cost: number;
}

export function generateCardChartData(
  calls: SimpleCallData[],
  metric: "minutes" | "calls" | "cost" | "average",
  timeframe: TimeframeType
): CardChartDataPoint[] {
  const { start, end } = getDateRangeForTimeframe(timeframe);

  // Filter calls by timeframe
  const filteredCalls = calls.filter((call) => {
    const callDate = new Date(call.started_at);
    return callDate >= start && callDate <= end;
  });

  let groupingFormat: string;
  switch (timeframe) {
    case "daily":
      groupingFormat = "yyyy-MM-dd";
      break;
    case "weekly":
      groupingFormat = "yyyy-'W'ww"; // Year-Week format
      break;
    case "monthly":
      groupingFormat = "yyyy-MM"; // Year-Month format
      break;
  }

  // Group data by the appropriate time period
  const groupedData = filteredCalls.reduce((acc, call) => {
    const date = new Date(call.started_at);
    const key = format(date, groupingFormat);

    if (!acc[key]) {
      acc[key] = {
        minutes: 0,
        calls: 0,
        cost: 0,
      };
    }

    acc[key].minutes += call.duration_minutes || 0;
    acc[key].calls += 1;
    acc[key].cost += call.cost || 0;
    return acc;
  }, {} as Record<string, { minutes: number; calls: number; cost: number }>);

  // Convert to array and sort by date
  const sortedData = Object.entries(groupedData)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([, values]) => {
      switch (metric) {
        case "minutes":
          return { value: values.minutes };
        case "calls":
          return { value: values.calls };
        case "cost":
          return { value: values.cost };
        case "average":
          return { value: values.calls ? values.cost / values.calls : 0 };
      }
    });

  // Ensure minimum number of data points based on timeframe
  const minDataPoints =
    timeframe === "daily" ? 7 : timeframe === "weekly" ? 4 : 3;
  while (sortedData.length < minDataPoints) {
    sortedData.unshift({ value: 0 });
  }

  return sortedData;
}

export const calculateAnalytics = (
  vapiCalls: AICallData[],
  timeframe: TimeframeType
): AnalyticsData => {
  const { start, end } = getDateRangeForTimeframe(timeframe);

  // Filter calls by timeframe
  const filteredCalls = vapiCalls.filter((call) => {
    const callDate = new Date(call.started_at);
    return callDate >= start && callDate <= end;
  });

  // Get previous period for comparison
  const periodLength = end.getTime() - start.getTime();
  const previousStart = new Date(start.getTime() - periodLength);
  const previousEnd = new Date(end.getTime() - periodLength);

  const previousCalls = vapiCalls.filter((call) => {
    const callDate = new Date(call.started_at);
    return callDate >= previousStart && callDate <= previousEnd;
  });

  const totalMinutes = filteredCalls.reduce(
    (acc, call) => acc + (call.duration_minutes || 0),
    0
  );
  const previousTotalMinutes = previousCalls.reduce(
    (acc, call) => acc + (call.duration_minutes || 0),
    0
  );

  const totalCost = filteredCalls.reduce(
    (acc, call) => acc + (call.cost || 0),
    0
  );
  const previousTotalCost = previousCalls.reduce(
    (acc, call) => acc + (call.cost || 0),
    0
  );

  return {
    totalMinutes: {
      value: totalMinutes,
      change: calculatePercentageChange(totalMinutes, previousTotalMinutes),
    },
    totalCalls: {
      value: filteredCalls.length,
      change: calculatePercentageChange(filteredCalls.length, previousCalls.length),
    },
    totalSpent: {
      value: totalCost,
      change: calculatePercentageChange(totalCost, previousTotalCost),
    },
    averageCost: {
      value: filteredCalls.length ? totalCost / filteredCalls.length : 0,
      change: calculatePercentageChange(
        filteredCalls.length ? totalCost / filteredCalls.length : 0,
        previousCalls.length ? previousTotalCost / previousCalls.length : 0
      ),
    },
  };
};

export const calculateChartData = (
  vapiCalls: AICallData[],
  timeframe: TimeframeType
): ChartDataPoint[] => {
  const { start, end } = getDateRangeForTimeframe(timeframe);
  const labels = getTimeframePeriodLabels(timeframe);

  // Initialize data points with zeros for all intervals
  const initialData = new Map<string, number>();
  labels.forEach((label: string) => initialData.set(label, 0));

  // Filter calls by timeframe
  const filteredCalls = vapiCalls.filter((call) => {
    const callDate = new Date(call.started_at);
    return callDate >= start && callDate <= end;
  });

  // Group calls by period
  filteredCalls.forEach((call) => {
    if (call.started_at) {
      const date = new Date(call.started_at);
      const period = formatDateForGrouping(date, timeframe);
      if (initialData.has(period)) {
        initialData.set(period, (initialData.get(period) || 0) + 1);
      }
    }
  });

  // Convert to array format expected by chart
  return Array.from(initialData.entries()).map(([name, calls]) => ({
    name,
    calls,
  }));
}; 