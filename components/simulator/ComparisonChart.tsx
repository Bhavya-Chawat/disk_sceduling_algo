"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { SimulationResult } from "../../lib/algorithms/types";

interface ComparisonChartProps {
  results: SimulationResult[];
}

export default function ComparisonChart({ results }: ComparisonChartProps) {
  const chartData = results.map((result) => ({
    name: result.algorithm,
    "Total Seek Time": result.totalSeekTime,
    "Average Seek Time": parseFloat(result.averageSeekTime.toFixed(2)),
  }));

  const colors = [
    { total: "#3b82f6", avg: "#60a5fa" },
    { total: "#8b5cf6", avg: "#a78bfa" },
    { total: "#ec4899", avg: "#f472b6" },
    { total: "#f59e0b", avg: "#fbbf24" },
    { total: "#10b981", avg: "#34d399" },
    { total: "#06b6d4", avg: "#22d3ee" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="name" />
              <YAxis
                label={{
                  value: "Seek Time (tracks)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "8px",
                }}
                formatter={(value) => `${value} tracks`}
              />
              <Legend />
              <Bar
                dataKey="Total Seek Time"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="Average Seek Time"
                fill="#8b5cf6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.map((result, idx) => (
              <motion.div
                key={result.algorithm}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * idx }}
                whileHover={{ scale: 1.05 }}
                className="glass-card p-4 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ background: colors[idx % colors.length].total }}
                  />
                  <div>
                    <div className="font-semibold">{result.algorithm}</div>
                    <div className="text-sm text-gray-600">
                      Total: {result.totalSeekTime} tracks | Avg:{" "}
                      {result.averageSeekTime.toFixed(2)} tracks
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
