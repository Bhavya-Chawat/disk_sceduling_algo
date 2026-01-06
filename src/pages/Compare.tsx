import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { InfiniteGrid } from "@/components/ui/InfiniteGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  runAlgorithm,
  generateRandomRequests,
  ALGORITHMS,
  AlgorithmResult,
  Direction,
} from "@/lib/algorithms";
import {
  Shuffle,
  Trophy,
  TrendingDown,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  Activity,
  Flame,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { toast } from "@/hooks/use-toast";

const COLORS = {
  fcfs: "#2563EB",
  sstf: "#06B6D4",
  scan: "#F97316",
  cscan: "#10B981",
  look: "#3B82F6",
  clook: "#0891B2",
};

// Export helpers
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const generateComparisonCSV = (
  results: (AlgorithmResult & { id: string; color: string })[],
  requests: number[],
  initialHead: number,
  totalTracks: number,
  direction: Direction
): string => {
  const lines = [
    "Disk Scheduling Algorithm Comparison Report",
    `Generated: ${new Date().toLocaleString()}`,
    "",
    "Configuration",
    `Initial Head Position,${initialHead}`,
    `Total Tracks,${totalTracks}`,
    `Direction,${direction}`,
    `Request Queue,"${requests.join(", ")}"`,
    "",
    "Algorithm Comparison",
    "Algorithm,Full Name,Total Seek Time,Average Seek Time,Steps,Efficiency vs Best",
  ];

  const sortedResults = [...results].sort(
    (a, b) => a.totalSeekTime - b.totalSeekTime
  );
  const bestSeek = sortedResults[0]?.totalSeekTime || 0;

  sortedResults.forEach((result, index) => {
    const diff = result.totalSeekTime - bestSeek;
    const diffPercent =
      bestSeek > 0 ? ((diff / bestSeek) * 100).toFixed(1) : "0";
    lines.push(
      `${result.name},${result.fullName},${
        result.totalSeekTime
      },${result.averageSeekTime.toFixed(2)},${result.steps.length},${
        index === 0 ? "Best" : `+${diffPercent}%`
      }`
    );
  });

  lines.push("");
  lines.push("Seek Sequences");
  results.forEach((result) => {
    lines.push(`${result.name},"${result.sequence.join(" -> ")}"`);
  });

  return lines.join("\n");
};

const generateComparisonReport = (
  results: (AlgorithmResult & { id: string; color: string })[],
  requests: number[],
  initialHead: number,
  totalTracks: number,
  direction: Direction
): string => {
  const sortedResults = [...results].sort(
    (a, b) => a.totalSeekTime - b.totalSeekTime
  );
  const bestSeek = sortedResults[0]?.totalSeekTime || 0;

  const lines = [
    "═══════════════════════════════════════════════════════════════",
    "         DISK SCHEDULING ALGORITHM COMPARISON REPORT           ",
    "═══════════════════════════════════════════════════════════════",
    "",
    `Generated: ${new Date().toLocaleString()}`,
    "",
    "───────────────────────────────────────────────────────────────",
    "                        CONFIGURATION                          ",
    "───────────────────────────────────────────────────────────────",
    "",
    `Initial Head Position: ${initialHead}`,
    `Total Tracks:          ${totalTracks}`,
    `Direction:             ${
      direction === "right" ? "Right (Increasing)" : "Left (Decreasing)"
    }`,
    `Request Queue:         [${requests.join(", ")}]`,
    `Number of Requests:    ${requests.length}`,
    "",
    "───────────────────────────────────────────────────────────────",
    "                    PERFORMANCE RANKING                        ",
    "───────────────────────────────────────────────────────────────",
    "",
  ];

  sortedResults.forEach((result, index) => {
    const diff = result.totalSeekTime - bestSeek;
    const diffPercent =
      bestSeek > 0 ? ((diff / bestSeek) * 100).toFixed(1) : "0";
    lines.push(`#${index + 1} ${result.name.padEnd(8)} (${result.fullName})`);
    lines.push(`   Total Seek:   ${result.totalSeekTime} tracks`);
    lines.push(`   Average Seek: ${result.averageSeekTime.toFixed(2)} tracks`);
    lines.push(`   Steps:        ${result.steps.length}`);
    lines.push(
      `   vs Best:      ${index === 0 ? "BEST" : `+${diff} (+${diffPercent}%)`}`
    );
    lines.push("");
  });

  lines.push("───────────────────────────────────────────────────────────────");
  lines.push("                      SEEK SEQUENCES                          ");
  lines.push("───────────────────────────────────────────────────────────────");
  lines.push("");

  results.forEach((result) => {
    lines.push(`${result.name}: ${result.sequence.join(" → ")}`);
    lines.push("");
  });

  lines.push("───────────────────────────────────────────────────────────────");
  lines.push("                        ANALYSIS                              ");
  lines.push("───────────────────────────────────────────────────────────────");
  lines.push("");
  lines.push(`Best Algorithm:  ${sortedResults[0]?.name || "N/A"}`);
  lines.push(
    `Worst Algorithm: ${sortedResults[sortedResults.length - 1]?.name || "N/A"}`
  );

  const seekRange =
    sortedResults.length > 0
      ? sortedResults[sortedResults.length - 1].totalSeekTime -
        sortedResults[0].totalSeekTime
      : 0;
  lines.push(`Seek Time Range: ${seekRange} cylinders`);

  const avgSeek =
    results.reduce((sum, r) => sum + r.totalSeekTime, 0) / results.length;
  lines.push(`Average (all):   ${avgSeek.toFixed(2)} cylinders`);
  lines.push("");
  lines.push("═══════════════════════════════════════════════════════════════");

  return lines.join("\n");
};

export default function Compare() {
  const [direction, setDirection] = useState<Direction>("right");
  const [totalTracks, setTotalTracks] = useState(200);
  const [initialHead, setInitialHead] = useState(53);
  const [requestsInput, setRequestsInput] = useState(
    "98, 183, 37, 122, 14, 124, 65, 67"
  );

  const requests = useMemo(() => {
    return requestsInput
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n) && n >= 0 && n < totalTracks);
  }, [requestsInput, totalTracks]);

  const results = useMemo(() => {
    if (requests.length === 0) return [];

    return ALGORITHMS.map((algo) => ({
      ...runAlgorithm(algo.id, initialHead, requests, totalTracks, direction),
      id: algo.id,
      color: COLORS[algo.id],
    }));
  }, [initialHead, requests, totalTracks, direction]);

  const chartData = useMemo(() => {
    return results.map((r) => ({
      name: r.name,
      seekTime: r.totalSeekTime,
      color: r.color,
    }));
  }, [results]);

  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => a.totalSeekTime - b.totalSeekTime);
  }, [results]);

  // Generate seek trend data for line chart
  const seekTrendData = useMemo(() => {
    if (results.length === 0) return [];

    const maxSteps = Math.max(...results.map((r) => r.steps.length));
    const data = [];

    for (let i = 0; i <= maxSteps; i++) {
      const point: Record<string, number | string> = { step: i };
      results.forEach((result) => {
        if (i === 0) {
          point[result.name] = 0;
        } else if (i <= result.steps.length) {
          const cumulative = result.steps
            .slice(0, i)
            .reduce((sum, s) => sum + s.distance, 0);
          point[result.name] = cumulative;
        }
      });
      data.push(point);
    }
    return data;
  }, [results]);

  // Generate heat map data for track access patterns
  const heatMapData = useMemo(() => {
    if (results.length === 0) return [];

    const trackBuckets = 10;
    const bucketSize = Math.ceil(totalTracks / trackBuckets);

    return results.map((result) => {
      const buckets = new Array(trackBuckets).fill(0);
      result.sequence.forEach((track) => {
        const bucketIndex = Math.min(
          Math.floor(track / bucketSize),
          trackBuckets - 1
        );
        buckets[bucketIndex]++;
      });
      return {
        algorithm: result.name,
        buckets,
        color: result.color,
      };
    });
  }, [results, totalTracks]);

  const handleRandomize = () => {
    const newRequests = generateRandomRequests(8, totalTracks);
    setRequestsInput(newRequests.join(", "));
    setInitialHead(Math.floor(Math.random() * totalTracks));
    toast({
      title: "Randomized",
      description: "New random request queue generated",
    });
  };

  const handleExportCSV = useCallback(() => {
    if (results.length === 0) return;
    const csv = generateComparisonCSV(
      results,
      requests,
      initialHead,
      totalTracks,
      direction
    );
    downloadFile(
      csv,
      `disk-scheduling-comparison-${Date.now()}.csv`,
      "text/csv"
    );
    toast({
      title: "Exported",
      description: "CSV file downloaded successfully",
    });
  }, [results, requests, initialHead, totalTracks, direction]);

  const handleExportReport = useCallback(() => {
    if (results.length === 0) return;
    const report = generateComparisonReport(
      results,
      requests,
      initialHead,
      totalTracks,
      direction
    );
    downloadFile(
      report,
      `disk-scheduling-comparison-report-${Date.now()}.txt`,
      "text/plain"
    );
    toast({
      title: "Exported",
      description: "Report file downloaded successfully",
    });
  }, [results, requests, initialHead, totalTracks, direction]);

  const handleExportPDF = useCallback(() => {
    if (results.length === 0) return;

    const sortedResults = [...results].sort(
      (a, b) => a.totalSeekTime - b.totalSeekTime
    );
    const bestSeek = sortedResults[0]?.totalSeekTime || 0;

    const rankingRows = sortedResults
      .map((result, index) => {
        const diff = result.totalSeekTime - bestSeek;
        const diffPercent =
          bestSeek > 0 ? ((diff / bestSeek) * 100).toFixed(1) : "0";
        return `
        <tr style="${index === 0 ? "background: #ecfdf5;" : ""}">
          <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold; color: ${
            index === 0 ? "#059669" : "#64748b"
          };">#${index + 1}</td>
          <td style="padding: 12px; border-bottom: 1px solid #ddd;">
            <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: ${
              result.color
            }; margin-right: 8px;"></span>
            ${result.name}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #ddd;">${
            result.fullName
          }</td>
          <td style="padding: 12px; border-bottom: 1px solid #ddd; font-family: monospace; color: ${
            result.color
          };">${result.totalSeekTime} tracks</td>
          <td style="padding: 12px; border-bottom: 1px solid #ddd; font-family: monospace;">${result.averageSeekTime.toFixed(
            2
          )} tracks</td>
          <td style="padding: 12px; border-bottom: 1px solid #ddd;">${
            result.steps.length
          }</td>
          <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold; color: ${
            index === 0 ? "#059669" : "#f97316"
          };">${index === 0 ? "BEST" : `+${diffPercent}%`}</td>
        </tr>
      `;
      })
      .join("");

    const sequenceRows = results
      .map(
        (result) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">
          <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: ${
            result.color
          }; margin-right: 8px;"></span>
          ${result.name}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-family: monospace; font-size: 11px;">${result.sequence.join(
          " → "
        )}</td>
      </tr>
    `
      )
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Disk Scheduling Algorithm Comparison Report</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
          h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; text-align: center; }
          h2 { color: #1e40af; margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          .header { text-align: center; margin-bottom: 30px; }
          .config-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #f8fafc; padding: 20px; border-radius: 8px; }
          .config-item { text-align: center; }
          .config-label { font-size: 11px; color: #64748b; text-transform: uppercase; }
          .config-value { font-size: 18px; font-weight: bold; color: #1e40af; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th { background: #2563eb; color: white; padding: 12px 8px; text-align: left; font-size: 12px; }
          .winner-box { background: linear-gradient(135deg, #ecfdf5, #d1fae5); border: 2px solid #10b981; padding: 25px; border-radius: 12px; margin-top: 20px; text-align: center; }
          .winner-title { font-size: 14px; color: #059669; text-transform: uppercase; letter-spacing: 2px; }
          .winner-name { font-size: 32px; font-weight: bold; color: #047857; margin: 10px 0; }
          .winner-stats { font-size: 16px; color: #065f46; }
          .footer { margin-top: 40px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 Algorithm Comparison Report</h1>
          <p style="color: #64748b;">Generated on ${new Date().toLocaleString()}</p>
        </div>

        <h2>📋 Configuration</h2>
        <div class="config-grid">
          <div class="config-item">
            <div class="config-label">Initial Head</div>
            <div class="config-value">${initialHead}</div>
          </div>
          <div class="config-item">
            <div class="config-label">Total Tracks</div>
            <div class="config-value">${totalTracks}</div>
          </div>
          <div class="config-item">
            <div class="config-label">Direction</div>
            <div class="config-value">${
              direction === "right" ? "Right" : "Left"
            }</div>
          </div>
          <div class="config-item">
            <div class="config-label">Requests</div>
            <div class="config-value">${requests.length}</div>
          </div>
        </div>
        <p style="margin-top: 15px; background: #f1f5f9; padding: 10px; border-radius: 8px; font-family: monospace;">
          <strong>Request Queue:</strong> [${requests.join(", ")}]
        </p>

        <div class="winner-box">
          <div class="winner-title">🏆 Best Performing Algorithm</div>
          <div class="winner-name">${sortedResults[0]?.name || "N/A"}</div>
          <div class="winner-stats">${
            sortedResults[0]?.totalSeekTime || 0
          } tracks total seek time</div>
        </div>

        <h2>🏅 Performance Ranking</h2>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Algorithm</th>
              <th>Full Name</th>
              <th>Total Seek</th>
              <th>Average Seek</th>
              <th>Steps</th>
              <th>vs Best</th>
            </tr>
          </thead>
          <tbody>
            ${rankingRows}
          </tbody>
        </table>

        <h2>🔄 Seek Sequences</h2>
        <table>
          <thead>
            <tr>
              <th style="width: 100px;">Algorithm</th>
              <th>Sequence</th>
            </tr>
          </thead>
          <tbody>
            ${sequenceRows}
          </tbody>
        </table>

        <div class="footer">
          <p>Generated by Disk Scheduling Algorithm Visualizer</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
      toast({
        title: "PDF Ready",
        description: "Print dialog opened. Select 'Save as PDF' to download.",
      });
    }
  }, [results, requests, initialHead, totalTracks, direction]);

  return (
    <div className="min-h-screen bg-background relative">
      <InfiniteGrid />
      <Navbar />

      <main className="relative pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Algorithm Comparison
            </h1>
            <p className="text-muted-foreground">
              Compare all disk scheduling algorithms with the same input
            </p>
          </motion.div>

          {/* Input Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-6 rounded-xl mb-8"
          >
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label>Initial Head Position</Label>
                <Input
                  type="number"
                  min={0}
                  max={totalTracks - 1}
                  value={initialHead}
                  onChange={(e) =>
                    setInitialHead(parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Total Tracks</Label>
                <Input
                  type="number"
                  min={50}
                  max={500}
                  value={totalTracks}
                  onChange={(e) =>
                    setTotalTracks(parseInt(e.target.value) || 200)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Direction</Label>
                <Select
                  value={direction}
                  onValueChange={(v) => setDirection(v as Direction)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Request Queue</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRandomize}
                    className="gap-2"
                  >
                    <Shuffle className="w-4 h-4" />
                    Randomize
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        disabled={results.length === 0}
                      >
                        <Download className="w-4 h-4" />
                        Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleExportPDF}
                        className="cursor-pointer"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Export as PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleExportCSV}
                        className="cursor-pointer"
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Export as CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleExportReport}
                        className="cursor-pointer"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Export as Text
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <Input
                value={requestsInput}
                onChange={(e) => setRequestsInput(e.target.value)}
                placeholder="Enter track numbers separated by commas"
              />
            </div>
          </motion.div>

          {results.length > 0 && (
            <>
              {/* Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-6 rounded-xl mb-8"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Total Seek Time Comparison (tracks)
                </h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ left: 60, right: 20 }}
                    >
                      <XAxis
                        type="number"
                        stroke="hsl(var(--muted-foreground))"
                        label={{
                          value: "Seek Time (tracks)",
                          position: "insideBottom",
                          offset: -5,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: "hsl(var(--foreground))" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                        formatter={(value: number) => [
                          `${value} tracks`,
                          "Seek Time",
                        ]}
                      />
                      <Bar dataKey="seekTime" radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Rankings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass p-6 rounded-xl mb-8"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Performance Ranking
                </h2>

                <div className="space-y-3">
                  {sortedResults.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        index === 0
                          ? "bg-success/10 border border-success/30"
                          : "bg-secondary/30"
                      }`}
                    >
                      <span
                        className={`text-2xl font-bold ${
                          index === 0 ? "text-success" : "text-muted-foreground"
                        }`}
                      >
                        #{index + 1}
                      </span>

                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: result.color }}
                      />

                      <div className="flex-1">
                        <span className="font-semibold text-foreground">
                          {result.name}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({result.fullName})
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span
                            className="font-mono font-semibold"
                            style={{ color: result.color }}
                          >
                            {result.totalSeekTime}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            tracks
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <TrendingDown className="w-3 h-3" />
                          <span>
                            Avg: {result.averageSeekTime.toFixed(1)} tracks
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Detailed Comparison Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass p-6 rounded-xl overflow-x-auto"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Detailed Metrics
                </h2>

                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-4 text-left text-muted-foreground">
                        Algorithm
                      </th>
                      <th className="py-3 px-4 text-right text-muted-foreground">
                        Total Seek (tracks)
                      </th>
                      <th className="py-3 px-4 text-right text-muted-foreground">
                        Average Seek (tracks)
                      </th>
                      <th className="py-3 px-4 text-right text-muted-foreground">
                        Steps
                      </th>
                      <th className="py-3 px-4 text-right text-muted-foreground">
                        vs Best
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedResults.map((result, index) => {
                      const bestSeek = sortedResults[0].totalSeekTime;
                      const diff = result.totalSeekTime - bestSeek;
                      const diffPercent = ((diff / bestSeek) * 100).toFixed(1);

                      return (
                        <tr
                          key={result.id}
                          className="border-b border-border/50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: result.color }}
                              />
                              <span className="font-semibold text-foreground">
                                {result.name}
                              </span>
                            </div>
                          </td>
                          <td
                            className="py-3 px-4 text-right font-mono"
                            style={{ color: result.color }}
                          >
                            {result.totalSeekTime}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                            {result.averageSeekTime.toFixed(1)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                            {result.steps.length}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {index === 0 ? (
                              <span className="text-success font-semibold">
                                Best
                              </span>
                            ) : (
                              <span className="text-orange font-mono">
                                +{diffPercent}%
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </motion.div>

              {/* Seek Time Trend Graph */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass p-6 rounded-xl mb-8 mt-8"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Cumulative Seek Time Trends
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Shows how total seek time accumulates over each step for all
                  algorithms
                </p>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={seekTrendData}
                      margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
                    >
                      <XAxis
                        dataKey="step"
                        stroke="hsl(var(--muted-foreground))"
                        label={{
                          value: "Step",
                          position: "insideBottom",
                          offset: -5,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        label={{
                          value: "Cumulative Seek (tracks)",
                          angle: -90,
                          position: "insideLeft",
                          fill: "hsl(var(--muted-foreground))",
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                        labelFormatter={(value) => `Step ${value}`}
                        formatter={(value: number, name: string) => [
                          `${value} tracks`,
                          name,
                        ]}
                      />
                      <Legend />
                      {results.map((result) => (
                        <Line
                          key={result.id}
                          type="monotone"
                          dataKey={result.name}
                          stroke={result.color}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Heat Map for Track Access Patterns */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="glass p-6 rounded-xl mb-8"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Track Access Heat Map
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Visualizes how each algorithm distributes access across track
                  ranges (intensity shows frequency)
                </p>
                <div className="space-y-4">
                  {/* Track range labels */}
                  <div className="flex">
                    <div className="w-20 flex-shrink-0 text-xs text-muted-foreground text-right pr-2">
                      Track Range
                    </div>
                    <div className="flex-1 flex">
                      {Array.from({ length: 10 }, (_, i) => (
                        <div
                          key={i}
                          className="flex-1 text-center text-xs text-muted-foreground"
                        >
                          {Math.floor((i * totalTracks) / 10)}-
                          {Math.floor(((i + 1) * totalTracks) / 10) - 1}
                        </div>
                      ))}
                    </div>
                  </div>

                  {heatMapData.map((data) => {
                    const maxCount = Math.max(...data.buckets, 1);
                    return (
                      <div key={data.algorithm} className="flex items-center">
                        <div className="w-20 flex-shrink-0 text-sm font-medium text-foreground">
                          {data.algorithm}
                        </div>
                        <div className="flex-1 flex gap-0.5">
                          {data.buckets.map((count, i) => {
                            const intensity = count / maxCount;
                            // Use a gradient from cool (blue/purple) to hot (red/orange)
                            const getHeatColor = (intensity: number) => {
                              if (intensity === 0)
                                return "hsl(var(--secondary))";
                              // Gradient: Blue -> Cyan -> Green -> Yellow -> Orange -> Red
                              const hue = 240 - intensity * 240; // 240 (blue) to 0 (red)
                              const saturation = 70 + intensity * 20; // 70% to 90%
                              const lightness = 55 - intensity * 15; // 55% to 40%
                              return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                            };
                            return (
                              <div
                                key={i}
                                className="flex-1 h-8 rounded-sm flex items-center justify-center text-xs font-mono transition-all hover:scale-105 hover:z-10 relative"
                                style={{
                                  backgroundColor: getHeatColor(intensity),
                                  color: intensity > 0.3 ? "white" : "inherit",
                                  textShadow:
                                    intensity > 0.3
                                      ? "0 1px 2px rgba(0,0,0,0.5)"
                                      : "none",
                                }}
                                title={`Tracks ${Math.floor(
                                  (i * totalTracks) / 10
                                )}-${
                                  Math.floor(((i + 1) * totalTracks) / 10) - 1
                                }: ${count} accesses`}
                              >
                                {count > 0 ? count : ""}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span>Intensity:</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-secondary/50">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: "hsl(240, 70%, 55%)" }}
                    />
                    <span>Low</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-secondary/50">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: "hsl(120, 80%, 45%)" }}
                    />
                    <span>Medium</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-secondary/50">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: "hsl(0, 90%, 45%)" }}
                    />
                    <span>High</span>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
