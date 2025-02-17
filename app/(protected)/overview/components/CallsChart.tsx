import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  TooltipProps,
} from "recharts";

interface ChartDataPoint {
  name: string;
  calls: number;
}

interface CallsChartProps {
  data: ChartDataPoint[];
  distributionData?: {
    name: string;
    value: number;
    color: string;
  }[];
  totalCalls: number;
  type?: "area" | "pie";
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ChartDataPoint;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">Calls: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export function CallsChart({
  data,
  distributionData,
  totalCalls,
  type = "area",
}: CallsChartProps) {
  if (type === "pie" && distributionData) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="relative w-full max-w-[250px] h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-2xl font-bold text-gray-900">{totalCalls}</div>
            <div className="text-xs text-gray-500">Total Calls</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4 w-full max-w-[250px]">
          {distributionData.map((item, index) => (
            <div key={index} className="text-center">
              <div
                className="text-lg font-semibold"
                style={{ color: item.color }}
              >
                {Math.round((item.value / 100) * totalCalls)}
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">
                {item.name}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 w-full max-w-[250px]">
          {distributionData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-2.5 h-2.5 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
              <span className="text-xs font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="callGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            interval="preserveEnd"
            minTickGap={30}
            padding={{ left: 10, right: 10 }}
            height={50}
            angle={-45}
            textAnchor="end"
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
            tick={{ fontSize: 10 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="calls"
            stroke="#3b82f6"
            strokeWidth={1.5}
            fill="url(#callGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
