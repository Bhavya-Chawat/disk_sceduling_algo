import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { InfiniteGrid } from "@/components/ui/InfiniteGrid";
import { DiskScene } from "@/components/three/DiskScene";
import { MetricsPanel } from "@/components/ui/MetricsPanel";
import { TrackVisualization } from "@/components/ui/TrackVisualization";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  AlgorithmType,
  AlgorithmResult,
  Direction,
  ALGORITHMS,
} from "@/lib/algorithms";
import {
  Play,
  Pause,
  RotateCcw,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Download,
  FileText,
  FileSpreadsheet,
  Image,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Preset example scenarios
interface PresetScenario {
  name: string;
  description: string;
  requests: number[];
  initialHead: number;
  algorithm: AlgorithmType;
  direction: Direction;
  totalTracks: number;
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    name: "Best Case FCFS",
    description:
      "Sequential requests showing FCFS at its best - minimal seek time when requests are in order",
    requests: [50, 55, 60, 65, 70, 75, 80, 85],
    initialHead: 50,
    algorithm: "fcfs",
    direction: "right",
    totalTracks: 200,
  },
  {
    name: "SSTF Starvation Demo",
    description:
      "Shows how SSTF can cause starvation - request at track 180 waits while closer requests are served",
    requests: [50, 52, 48, 54, 46, 56, 44, 180],
    initialHead: 50,
    algorithm: "sstf",
    direction: "right",
    totalTracks: 200,
  },
  {
    name: "Elevator Pattern",
    description:
      "Classic elevator movement - SCAN sweeps through requests efficiently in one direction then reverses",
    requests: [98, 37, 14, 124, 65, 67, 183, 122],
    initialHead: 53,
    algorithm: "scan",
    direction: "right",
    totalTracks: 200,
  },
  {
    name: "Random Heavy Load",
    description:
      "Stress test with 12 random requests spread across the disk - compare algorithm performance",
    requests: [10, 190, 45, 155, 78, 132, 25, 168, 90, 110, 5, 195],
    initialHead: 100,
    algorithm: "clook",
    direction: "right",
    totalTracks: 200,
  },
  {
    name: "Worst Case FCFS",
    description:
      "Wild zigzag pattern - shows why FCFS can be inefficient with random arrival order",
    requests: [10, 180, 20, 170, 30, 160, 40, 150],
    initialHead: 100,
    algorithm: "fcfs",
    direction: "right",
    totalTracks: 200,
  },
  {
    name: "LOOK vs SCAN",
    description:
      "Demonstrates LOOK optimization - no unnecessary movement to disk edges",
    requests: [60, 80, 100, 120, 140],
    initialHead: 50,
    algorithm: "look",
    direction: "right",
    totalTracks: 200,
  },
];

// Validation helper functions
const validateHeadPosition = (
  head: number,
  totalTracks: number
): { valid: boolean; message?: string } => {
  if (isNaN(head) || head < 0) {
    return { valid: false, message: "Head position cannot be negative" };
  }
  if (head >= totalTracks) {
    return {
      valid: false,
      message: `Head position must be less than ${totalTracks}`,
    };
  }
  return { valid: true };
};

const validateTotalTracks = (
  tracks: number
): { valid: boolean; message?: string } => {
  if (isNaN(tracks) || tracks < 50) {
    return { valid: false, message: "Total tracks must be at least 50" };
  }
  if (tracks > 500) {
    return { valid: false, message: "Total tracks cannot exceed 500" };
  }
  return { valid: true };
};

const parseAndValidateRequests = (
  input: string,
  totalTracks: number
): { requests: number[]; warnings: string[]; errors: string[] } => {
  const warnings: string[] = [];
  const errors: string[] = [];
  const seen = new Set<number>();
  const validRequests: number[] = [];

  const parts = input
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "");

  for (const part of parts) {
    const num = parseInt(part);
    if (isNaN(num)) {
      warnings.push(`"${part}" is not a valid number`);
      continue;
    }
    if (num < 0) {
      warnings.push(`Negative value ${num} ignored`);
      continue;
    }
    if (num >= totalTracks) {
      warnings.push(`Track ${num} exceeds max (${totalTracks - 1})`);
      continue;
    }
    if (seen.has(num)) {
      warnings.push(`Duplicate track ${num} ignored`);
      continue;
    }
    seen.add(num);
    validRequests.push(num);
  }

  if (validRequests.length === 0 && parts.length > 0) {
    errors.push("No valid track requests found");
  }

  return { requests: validRequests, warnings, errors };
};

// Export functions
const generateCSV = (result: AlgorithmResult, initialHead: number): string => {
  const lines = [
    "Step,From Track,To Track,Seek Distance,Cumulative Seek",
    `0,Start,${initialHead},0,0`,
  ];
  let cumulative = 0;
  result.steps.forEach((step, index) => {
    cumulative += step.distance;
    lines.push(
      `${index + 1},${step.from},${step.to},${step.distance},${cumulative}`
    );
  });
  lines.push("");
  lines.push("Summary");
  lines.push(`Algorithm,${result.name}`);
  lines.push(`Total Seek Time,${result.totalSeekTime}`);
  lines.push(`Average Seek Time,${result.averageSeekTime.toFixed(2)}`);
  lines.push(`Total Steps,${result.steps.length}`);
  lines.push("");
  lines.push("Seek Sequence");
  lines.push(result.sequence.join(","));
  return lines.join("\n");
};

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

const generateTextReport = (
  result: AlgorithmResult,
  algorithm: AlgorithmType,
  initialHead: number,
  requests: number[],
  totalTracks: number,
  direction: Direction
): string => {
  const algoInfo = ALGORITHMS.find((a) => a.id === algorithm);
  const lines = [
    "═══════════════════════════════════════════════════════════════",
    "           DISK SCHEDULING ALGORITHM SIMULATION REPORT          ",
    "═══════════════════════════════════════════════════════════════",
    "",
    `Generated: ${new Date().toLocaleString()}`,
    "",
    "───────────────────────────────────────────────────────────────",
    "                        CONFIGURATION                          ",
    "───────────────────────────────────────────────────────────────",
    "",
    `Algorithm:           ${result.name} (${result.fullName})`,
    `Initial Head:        ${initialHead}`,
    `Total Tracks:        ${totalTracks}`,
    `Direction:           ${
      direction === "right" ? "Right (Increasing)" : "Left (Decreasing)"
    }`,
    `Request Queue:       [${requests.join(", ")}]`,
    "",
    "───────────────────────────────────────────────────────────────",
    "                        ALGORITHM INFO                         ",
    "───────────────────────────────────────────────────────────────",
    "",
    `Description: ${algoInfo?.description || "N/A"}`,
    `Time Complexity: ${algoInfo?.complexity || "N/A"}`,
    "",
    "Pros:",
    ...(algoInfo?.pros.map((p) => `  ✓ ${p}`) || []),
    "",
    "Cons:",
    ...(algoInfo?.cons.map((c) => `  ✗ ${c}`) || []),
    "",
    "───────────────────────────────────────────────────────────────",
    "                     STEP-BY-STEP EXECUTION                    ",
    "───────────────────────────────────────────────────────────────",
    "",
  ];

  let cumulative = 0;
  result.steps.forEach((step, index) => {
    cumulative += step.distance;
    lines.push(
      `Step ${(index + 1).toString().padStart(2)}: Move from track ${step.from
        .toString()
        .padStart(3)} to ${step.to.toString().padStart(3)}`
    );
    lines.push(
      `         Distance = |${step.to} - ${step.from}| = ${step.distance} tracks`
    );
    lines.push(`         Cumulative: ${cumulative} tracks`);
    lines.push("");
  });

  lines.push("───────────────────────────────────────────────────────────────");
  lines.push("                          RESULTS                             ");
  lines.push("───────────────────────────────────────────────────────────────");
  lines.push("");
  lines.push(`Seek Sequence:       ${result.sequence.join(" → ")}`);
  lines.push(`Total Seek Time:     ${result.totalSeekTime} tracks`);
  lines.push(
    `Average Seek Time:   ${result.averageSeekTime.toFixed(2)} tracks`
  );
  lines.push(`Number of Steps:     ${result.steps.length}`);
  lines.push("");
  lines.push("═══════════════════════════════════════════════════════════════");

  return lines.join("\n");
};

export default function Simulator() {
  const [algorithm, setAlgorithm] = useState<AlgorithmType>("fcfs");
  const [direction, setDirection] = useState<Direction>("right");
  const [totalTracks, setTotalTracks] = useState(200);
  const [initialHead, setInitialHead] = useState(53);
  const [requestsInput, setRequestsInput] = useState(
    "98, 183, 37, 122, 14, 124, 65, 67"
  );
  const [requests, setRequests] = useState<number[]>([
    98, 183, 37, 122, 14, 124, 65, 67,
  ]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Parse and validate requests from input
  useEffect(() => {
    const {
      requests: parsed,
      warnings,
      errors,
    } = parseAndValidateRequests(requestsInput, totalTracks);

    if (errors.length > 0) {
      setValidationError(errors[0]);
      setRequests([]);
    } else {
      setValidationError(null);
      setRequests(parsed);

      // Show warnings as toasts
      if (warnings.length > 0 && warnings.length <= 3) {
        warnings.forEach((warning) => {
          toast({
            title: "Input Warning",
            description: warning,
            variant: "default",
          });
        });
      } else if (warnings.length > 3) {
        toast({
          title: "Multiple Input Warnings",
          description: `${warnings.length} invalid entries were ignored`,
          variant: "default",
        });
      }
    }
  }, [requestsInput, totalTracks]);

  // Run algorithm when inputs change
  useEffect(() => {
    if (requests.length > 0) {
      const newResult = runAlgorithm(
        algorithm,
        initialHead,
        requests,
        totalTracks,
        direction
      );
      setResult(newResult);
      setCurrentStep(-1);
      setIsPlaying(false);
    } else {
      setResult(null);
    }
  }, [algorithm, initialHead, requests, totalTracks, direction]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying || !result) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= result.steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, result, speed]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (result && requests.length > 0) {
            setIsPlaying((prev) => !prev);
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          handleStepForward();
          break;
        case "ArrowLeft":
          e.preventDefault();
          handleStepBackward();
          break;
        case "KeyR":
          e.preventDefault();
          handleReset();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [result, requests.length]);

  const handleRandomize = useCallback(() => {
    const newRequests = generateRandomRequests(8, totalTracks);
    setRequestsInput(newRequests.join(", "));
    setInitialHead(Math.floor(Math.random() * totalTracks));
    toast({
      title: "Randomized",
      description: "New random request queue generated",
    });
  }, [totalTracks]);

  const handleReset = useCallback(() => {
    setCurrentStep(-1);
    setIsPlaying(false);
  }, []);

  const handleStepForward = useCallback(() => {
    if (result && currentStep < result.steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [result, currentStep]);

  const handleStepBackward = useCallback(() => {
    if (currentStep > -1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleHeadChange = useCallback(
    (value: string) => {
      const num = parseInt(value);
      if (value === "") {
        setInitialHead(0);
        return;
      }

      const validation = validateHeadPosition(num, totalTracks);
      if (!validation.valid) {
        toast({
          title: "Invalid Head Position",
          description: validation.message,
          variant: "destructive",
        });
        return;
      }
      setInitialHead(num);
    },
    [totalTracks]
  );

  const handleTotalTracksChange = useCallback(
    (value: string) => {
      const num = parseInt(value);
      if (value === "") {
        return;
      }

      const validation = validateTotalTracks(num);
      if (!validation.valid) {
        toast({
          title: "Invalid Total Tracks",
          description: validation.message,
          variant: "destructive",
        });
        return;
      }
      setTotalTracks(num);

      // Adjust head if it exceeds new total
      if (initialHead >= num) {
        setInitialHead(num - 1);
        toast({
          title: "Head Position Adjusted",
          description: `Head position set to ${
            num - 1
          } to fit within track range`,
        });
      }
    },
    [initialHead]
  );

  const handleLoadPreset = useCallback((preset: PresetScenario) => {
    setAlgorithm(preset.algorithm);
    setDirection(preset.direction);
    setTotalTracks(preset.totalTracks);
    setInitialHead(preset.initialHead);
    setRequestsInput(preset.requests.join(", "));
    setCurrentStep(-1);
    setIsPlaying(false);

    toast({
      title: `Loaded: ${preset.name}`,
      description: preset.description,
    });
  }, []);

  const handleExportCSV = useCallback(() => {
    if (!result) return;
    const csv = generateCSV(result, initialHead);
    downloadFile(
      csv,
      `disk-scheduling-${algorithm}-${Date.now()}.csv`,
      "text/csv"
    );
    toast({
      title: "Exported",
      description: "CSV file downloaded successfully",
    });
  }, [result, algorithm, initialHead]);

  const handleExportReport = useCallback(() => {
    if (!result) return;
    const report = generateTextReport(
      result,
      algorithm,
      initialHead,
      requests,
      totalTracks,
      direction
    );
    downloadFile(
      report,
      `disk-scheduling-report-${algorithm}-${Date.now()}.txt`,
      "text/plain"
    );
    toast({
      title: "Exported",
      description: "Report file downloaded successfully",
    });
  }, [result, algorithm, initialHead, requests, totalTracks, direction]);

  const handleExportPDF = useCallback(() => {
    if (!result) return;
    const algoInfo = ALGORITHMS.find((a) => a.id === algorithm);

    // Generate HTML content for PDF
    let cumulativeSeek = 0;
    const stepsHTML = result.steps
      .map((step, index) => {
        cumulativeSeek += step.distance;
        return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
            index + 1
          }</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
            step.from
          }</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
            step.to
          }</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
            step.distance
          } tracks</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${cumulativeSeek} tracks</td>
        </tr>
      `;
      })
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Disk Scheduling Report - ${result.name}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
          h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
          h2 { color: #1e40af; margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          .header { text-align: center; margin-bottom: 30px; }
          .config-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #f8fafc; padding: 20px; border-radius: 8px; }
          .config-item { display: flex; justify-content: space-between; }
          .config-label { font-weight: 600; color: #64748b; }
          .config-value { font-weight: 500; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th { background: #2563eb; color: white; padding: 12px 8px; text-align: left; }
          .results-box { background: #ecfdf5; border: 2px solid #10b981; padding: 20px; border-radius: 8px; margin-top: 20px; }
          .results-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center; }
          .result-item { }
          .result-value { font-size: 28px; font-weight: bold; color: #059669; }
          .result-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
          .sequence { font-family: monospace; background: #f1f5f9; padding: 15px; border-radius: 8px; word-wrap: break-word; }
          .pros-cons { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px; }
          .pros { background: #ecfdf5; padding: 15px; border-radius: 8px; }
          .cons { background: #fef2f2; padding: 15px; border-radius: 8px; }
          .pros h4 { color: #059669; margin-top: 0; }
          .cons h4 { color: #dc2626; margin-top: 0; }
          ul { margin: 0; padding-left: 20px; }
          li { margin: 5px 0; }
          .footer { margin-top: 40px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🖴 Disk Scheduling Algorithm Report</h1>
          <p style="color: #64748b;">Generated on ${new Date().toLocaleString()}</p>
        </div>

        <h2>📋 Configuration</h2>
        <div class="config-grid">
          <div class="config-item"><span class="config-label">Algorithm:</span><span class="config-value">${
            result.name
          } (${result.fullName})</span></div>
          <div class="config-item"><span class="config-label">Initial Head Position:</span><span class="config-value">${initialHead}</span></div>
          <div class="config-item"><span class="config-label">Total Tracks:</span><span class="config-value">${totalTracks}</span></div>
          <div class="config-item"><span class="config-label">Direction:</span><span class="config-value">${
            direction === "right" ? "Right (Increasing)" : "Left (Decreasing)"
          }</span></div>
          <div class="config-item" style="grid-column: 1 / -1;"><span class="config-label">Request Queue:</span><span class="config-value">[${requests.join(
            ", "
          )}]</span></div>
        </div>

        <h2>ℹ️ Algorithm Information</h2>
        <p><strong>Description:</strong> ${algoInfo?.description || "N/A"}</p>
        <p><strong>Time Complexity:</strong> ${
          algoInfo?.complexity || "N/A"
        }</p>
        <div class="pros-cons">
          <div class="pros">
            <h4>✓ Advantages</h4>
            <ul>${
              algoInfo?.pros.map((p) => `<li>${p}</li>`).join("") || ""
            }</ul>
          </div>
          <div class="cons">
            <h4>✗ Disadvantages</h4>
            <ul>${
              algoInfo?.cons.map((c) => `<li>${c}</li>`).join("") || ""
            }</ul>
          </div>
        </div>

        <h2>📊 Results Summary</h2>
        <div class="results-box">
          <div class="results-grid">
            <div class="result-item">
              <div class="result-value">${result.totalSeekTime}</div>
              <div class="result-label">Total Seek Time (tracks)</div>
            </div>
            <div class="result-item">
              <div class="result-value">${result.averageSeekTime.toFixed(
                2
              )}</div>
              <div class="result-label">Average Seek Time (tracks)</div>
            </div>
            <div class="result-item">
              <div class="result-value">${result.steps.length}</div>
              <div class="result-label">Total Steps</div>
            </div>
          </div>
        </div>

        <h2>🔄 Seek Sequence</h2>
        <div class="sequence">${result.sequence.join(" → ")}</div>

        <h2>📝 Step-by-Step Execution</h2>
        <table>
          <thead>
            <tr>
              <th>Step</th>
              <th>From Track</th>
              <th>To Track</th>
              <th>Seek Distance</th>
              <th>Cumulative Seek</th>
            </tr>
          </thead>
          <tbody>
            ${stepsHTML}
          </tbody>
        </table>

        <div class="footer">
          <p>Generated by Disk Scheduling Algorithm Visualizer</p>
        </div>
      </body>
      </html>
    `;

    // Open in new window for printing
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
  }, [result, algorithm, initialHead, requests, totalTracks, direction]);

  // Memoized algorithm info
  const currentAlgoInfo = useMemo(() => {
    return ALGORITHMS.find((a) => a.id === algorithm);
  }, [algorithm]);

  return (
    <div className="min-h-screen bg-background relative">
      <InfiniteGrid />
      <Navbar />

      <main className="relative pt-24 pb-4 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              Disk Scheduling Simulator
            </h1>
            <p className="text-sm text-muted-foreground">
              Visualize how different algorithms handle disk I/O requests
            </p>
          </motion.div>

          {/* Controls Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-4 rounded-xl mb-4"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Algorithm Select */}
              <div className="space-y-2">
                <Label>Algorithm</Label>
                <Select
                  value={algorithm}
                  onValueChange={(v) => setAlgorithm(v as AlgorithmType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALGORITHMS.map((algo) => (
                      <SelectItem key={algo.id} value={algo.id}>
                        {algo.name} - {algo.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Direction Select */}
              <div className="space-y-2">
                <Label>Initial Direction</Label>
                <Select
                  value={direction}
                  onValueChange={(v) => setDirection(v as Direction)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left (Decreasing)</SelectItem>
                    <SelectItem value="right">Right (Increasing)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Initial Head */}
              <div className="space-y-2">
                <Label>Initial Head Position</Label>
                <Input
                  type="number"
                  min={0}
                  max={totalTracks - 1}
                  value={initialHead}
                  onChange={(e) => handleHeadChange(e.target.value)}
                  aria-label="Initial head position"
                />
              </div>

              {/* Total Tracks */}
              <div className="space-y-2">
                <Label>Total Tracks</Label>
                <Input
                  type="number"
                  min={50}
                  max={500}
                  value={totalTracks}
                  onChange={(e) => handleTotalTracksChange(e.target.value)}
                  aria-label="Total number of tracks"
                />
              </div>
            </div>

            {/* Requests Input */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Label>Request Queue (comma-separated)</Label>
                <div className="flex gap-2 flex-wrap">
                  {/* Preset Examples Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Try Example
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-72">
                      <DropdownMenuLabel>Preset Scenarios</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {PRESET_SCENARIOS.map((preset) => (
                        <DropdownMenuItem
                          key={preset.name}
                          onClick={() => handleLoadPreset(preset)}
                          className="flex flex-col items-start cursor-pointer"
                        >
                          <span className="font-medium">{preset.name}</span>
                          <span className="text-xs text-muted-foreground mt-0.5">
                            {preset.description.slice(0, 60)}...
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRandomize}
                    className="gap-2"
                  >
                    <Shuffle className="w-4 h-4" />
                    Randomize
                  </Button>

                  {/* Export Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        disabled={!result}
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
                aria-label="Request queue input"
                className={validationError ? "border-destructive" : ""}
              />
              {validationError && (
                <p className="text-xs text-destructive">{validationError}</p>
              )}
              {requests.length === 0 &&
                !validationError &&
                requestsInput.trim() !== "" && (
                  <p className="text-xs text-yellow-500">
                    No valid requests entered
                  </p>
                )}
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="mt-3 text-xs text-muted-foreground">
              <span className="font-medium">Keyboard:</span>{" "}
              <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">
                Space
              </kbd>{" "}
              Play/Pause,{" "}
              <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">
                ←
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">
                →
              </kbd>{" "}
              Step,{" "}
              <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">
                R
              </kbd>{" "}
              Reset
            </div>
          </motion.div>

          {/* Main Visualization Area */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* 3D Scene */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 glass rounded-xl overflow-hidden"
            >
              <div className="h-[320px] md:h-[380px]">
                <DiskScene
                  result={result}
                  currentStep={currentStep}
                  totalTracks={totalTracks}
                  isPlaying={isPlaying}
                />
              </div>

              {/* Playback Controls */}
              <div className="p-4 border-t border-border/50">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleStepBackward}
                    disabled={currentStep <= -1}
                    aria-label="Step backward"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>

                  <Button
                    size="icon"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12"
                    disabled={!result || requests.length === 0}
                    aria-label={
                      isPlaying ? "Pause simulation" : "Play simulation"
                    }
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleStepForward}
                    disabled={!result || currentStep >= result.steps.length - 1}
                    aria-label="Step forward"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleReset}
                    aria-label="Reset simulation"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>

                  <div className="flex items-center gap-2 ml-4">
                    <Label className="text-sm text-muted-foreground">
                      Speed:
                    </Label>
                    <Slider
                      value={[speed]}
                      onValueChange={([v]) => setSpeed(v)}
                      min={0.5}
                      max={3}
                      step={0.5}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground w-8">
                      {speed}x
                    </span>
                  </div>
                </div>

                {/* Timeline */}
                {result && (
                  <div className="mt-4">
                    <Slider
                      value={[currentStep + 1]}
                      onValueChange={([v]) => setCurrentStep(v - 1)}
                      min={0}
                      max={result.steps.length}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Start</span>
                      <span>
                        Step {currentStep + 1} / {result.steps.length}
                      </span>
                      <span>End</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Metrics Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <MetricsPanel
                result={result}
                currentStep={currentStep}
                algorithmId={algorithm}
              />

              {/* Algorithm Info */}
              {result && (
                <div className="glass p-4 rounded-xl">
                  <h3 className="font-semibold text-foreground mb-2">
                    About {result.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {
                      ALGORITHMS.find((a) => a.name === result.name)
                        ?.description
                    }
                  </p>

                  <div className="mt-4 space-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Pros:
                      </span>
                      <ul className="text-xs text-success mt-1 space-y-1">
                        {ALGORITHMS.find((a) => a.name === result.name)
                          ?.pros.slice(0, 2)
                          .map((pro, i) => (
                            <li key={i}>✓ {pro}</li>
                          ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Cons:
                      </span>
                      <ul className="text-xs text-orange mt-1 space-y-1">
                        {ALGORITHMS.find((a) => a.name === result.name)
                          ?.cons.slice(0, 2)
                          .map((con, i) => (
                            <li key={i}>✗ {con}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* 2D Track Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <TrackVisualization
              result={result}
              totalTracks={totalTracks}
              currentStep={currentStep}
              algorithmId={algorithm}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
