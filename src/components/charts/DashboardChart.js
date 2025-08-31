"use client";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function DashboardChart({
  data,
  dataKey,
  name,
  color = "#3B82F6",
  type = "line",
  multiline = false,
}) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No data available
      </div>
    );
  }

  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="_id"
            className="text-xs"
            tick={{ fill: "currentColor" }}
          />
          <YAxis className="text-xs" tick={{ fill: "currentColor" }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === "area") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="_id"
            className="text-xs"
            tick={{ fill: "currentColor" }}
          />
          <YAxis className="text-xs" tick={{ fill: "currentColor" }} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fillOpacity={1}
            fill="url(#colorArea)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis
          dataKey={multiline ? "date" : "_id"}
          className="text-xs"
          tick={{ fill: "currentColor" }}
        />
        <YAxis className="text-xs" tick={{ fill: "currentColor" }} />
        <Tooltip content={<CustomTooltip />} />
        {multiline ? (
          <>
            <Line
              type="monotone"
              dataKey="doctors"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Doctors"
            />
            <Line
              type="monotone"
              dataKey="clinics"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Clinics"
            />
            {/* <Line
              type="monotone"
              dataKey="pharmacies"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Pharmacies"
            /> */}
            <Line
              type="monotone"
              dataKey="patients"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Patients"
            />
          </>
        ) : (
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 4 }}
            name={name}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
