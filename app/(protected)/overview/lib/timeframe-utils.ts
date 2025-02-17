import { format } from "date-fns";

export type TimeframeType = "daily" | "weekly" | "monthly";

export interface DateRange {
  start: Date;
  end: Date;
}

export const getDateRangeForTimeframe = (timeframe: TimeframeType): DateRange => {
  const end = new Date();
  const start = new Date();

  switch (timeframe) {
    case "daily":
      // Last 24 hours
      start.setHours(end.getHours() - 24);
      break;
    case "weekly":
      // Last 7 days
      start.setDate(end.getDate() - 7);
      break;
    case "monthly":
      // Last 30 days (29 days ago to today = 30 days total)
      start.setDate(end.getDate() - 29);
      // Set to start of day
      start.setHours(0, 0, 0, 0);
      // Set end to end of day
      end.setHours(23, 59, 59, 999);
      break;
  }

  return { start, end };
};

export const getTimeframePeriodLabels = (timeframe: TimeframeType): string[] => {
  switch (timeframe) {
    case "daily": {
      // Generate last 24 hours in 1-hour intervals
      const labels = [];
      const now = new Date();
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now);
        time.setHours(now.getHours() - i);
        labels.push(format(time, "ha")); // Format as "1AM", "2AM", etc.
      }
      return labels;
    }
    case "weekly": {
      // Generate last 7 days
      const labels = [];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        labels.push(format(date, "EEE")); // Format as "Mon", "Tue", etc.
      }
      return labels;
    }
    case "monthly": {
      // Generate last 30 days (29 days ago to today = 30 days total)
      const labels = [];
      const now = new Date();
      // Set to end of current day to match the date range
      now.setHours(23, 59, 59, 999);
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        labels.push(format(date, "MMM d")); // Format as "Jan 1", etc.
      }
      return labels;
    }
  }
};

export const getTimeframeGroupingFormat = (timeframe: TimeframeType): string => {
  switch (timeframe) {
    case "daily":
      return "HH:00"; // Hour format
    case "weekly":
      return "EEE"; // Short day name
    case "monthly":
      return "MMM d"; // Month and day
  }
};

export const formatDateForGrouping = (date: Date, timeframe: TimeframeType): string => {
  switch (timeframe) {
    case "daily":
      return format(date, "ha"); // Format as "1AM", "4PM", etc.
    case "weekly":
      return format(date, "EEE"); // Format as "Mon", "Tue", etc.
    case "monthly":
      return format(date, "MMM d"); // Format as "Jan 1", etc.
  }
};

export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}; 