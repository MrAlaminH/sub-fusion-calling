import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TimeframeType } from "../lib/timeframe-utils";

interface AnalyticsCardProps {
  title: string;
  value: { value: number; change: number };
  prefix?: string;
  index?: number;
  data: Array<{ value: number }>;
  timeframe: TimeframeType;
}

const chartColors = [
  { stroke: "#4169E1", fill: "#40E0D0" },
  { stroke: "#9370DB", fill: "#DA70D6" },
  { stroke: "#20B2AA", fill: "#40E0D0" },
  { stroke: "#FF69B4", fill: "#FFB6C1" },
];

const gradients = [
  "bg-gradient-to-r from-[#40E0D0] to-[#4169E1]",
  "bg-gradient-to-r from-[#DA70D6] to-[#9370DB]",
  "bg-gradient-to-r from-[#40E0D0] to-[#20B2AA]",
  "bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4]",
];

const formatChange = (change: number) => {
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
};

const formatValue = (value: number, prefix?: string) => {
  if (value >= 1000) {
    return `${prefix || ""}${(value / 1000).toFixed(1)}k`;
  }
  return `${prefix || ""}${value.toFixed(value % 1 === 0 ? 0 : 2)}`;
};

const getComparisonText = (timeframe: TimeframeType) => {
  switch (timeframe) {
    case "daily":
      return "Previous 24h";
    case "weekly":
      return "Previous 7d";
    case "monthly":
      return "Previous 30d";
  }
};

const AnimatedValue = ({
  value,
  prefix,
}: {
  value: number;
  prefix?: string;
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key={value}
    >
      {formatValue(displayValue, prefix)}
    </motion.span>
  );
};

export function AnalyticsCard({
  title,
  value,
  prefix,
  index = 0,
  data,
  timeframe,
}: AnalyticsCardProps) {
  const chartColor = chartColors[index % chartColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      className="h-full w-full"
    >
      <Card
        className={cn(
          "relative h-full overflow-hidden border-0 rounded-xl w-full",
          gradients[index % gradients.length],
          "text-white hover:shadow-xl transition-all duration-200"
        )}
      >
        <CardContent className="p-4 sm:p-6 h-full">
          <motion.div
            className="flex flex-col h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                <AnimatedValue value={value.value} prefix={prefix} />
              </h3>
              <motion.span
                className="text-xs sm:text-sm text-white/90"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {getComparisonText(timeframe)}
              </motion.span>
            </div>
            <motion.div
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 sm:mt-4 gap-2 sm:gap-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <p className="text-sm font-medium text-white/90">{title}</p>
              <div className="flex items-center gap-1">
                <motion.span
                  className="text-xs font-medium bg-white/10 px-2 py-0.5 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    delay: 0.5,
                  }}
                >
                  {formatChange(value.change)}
                </motion.span>
              </div>
            </motion.div>
            <motion.div
              className="h-12 sm:h-16 mt-3 sm:mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id={`gradient-${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={chartColor.fill}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="100%"
                        stopColor={chartColor.fill}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={chartColor.stroke}
                    strokeWidth={2}
                    fill={`url(#gradient-${index})`}
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
