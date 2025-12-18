"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Shuffle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Algorithm, Direction } from "../../lib/algorithms/types";
import {
  parseRequestString,
  validateRequests,
  generateRandomRequests,
} from "../../lib/utils";

interface SimulationFormProps {
  onSubmit: (data: {
    algorithm: Algorithm;
    requests: number[];
    initialHead: number;
    totalTracks: number;
    direction: Direction;
  }) => void;
}

export default function SimulationForm({ onSubmit }: SimulationFormProps) {
  const [algorithm, setAlgorithm] = useState<Algorithm>("FCFS");
  const [requestsInput, setRequestsInput] = useState(
    "98, 183, 37, 122, 14, 124, 65, 67"
  );
  const [initialHead, setInitialHead] = useState("53");
  const [totalTracks, setTotalTracks] = useState("200");
  const [direction, setDirection] = useState<Direction>("right");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const requests = parseRequestString(requestsInput);
    const head = parseInt(initialHead, 10);
    const tracks = parseInt(totalTracks, 10);

    if (isNaN(head) || head < 0 || head >= tracks) {
      setError(`Initial head position must be between 0 and ${tracks - 1}`);
      return;
    }

    const validation = validateRequests(requests, tracks);
    if (!validation.valid) {
      setError(validation.error || "Invalid requests");
      return;
    }

    onSubmit({
      algorithm,
      requests,
      initialHead: head,
      totalTracks: tracks,
      direction,
    });
  };

  const handleRandomize = () => {
    const tracks = parseInt(totalTracks, 10) || 200;
    const random = generateRandomRequests(8, tracks);
    setRequestsInput(random.join(", "));
    setInitialHead(Math.floor(Math.random() * tracks).toString());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Simulation Configuration</CardTitle>
          <CardDescription>
            Configure the parameters for disk scheduling simulation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="algorithm">Algorithm</Label>
                <Select
                  id="algorithm"
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
                >
                  <option value="FCFS">FCFS</option>
                  <option value="SSTF">SSTF</option>
                  <option value="SCAN">SCAN</option>
                  <option value="C-SCAN">C-SCAN</option>
                  <option value="LOOK">LOOK</option>
                  <option value="C-LOOK">C-LOOK</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direction">Direction</Label>
                <Select
                  id="direction"
                  value={direction}
                  onChange={(e) => setDirection(e.target.value as Direction)}
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialHead">
                  Initial Head Position (Track)
                </Label>
                <Input
                  id="initialHead"
                  type="number"
                  value={initialHead}
                  onChange={(e) => setInitialHead(e.target.value)}
                  placeholder="53"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalTracks">Total Tracks</Label>
                <Input
                  id="totalTracks"
                  type="number"
                  value={totalTracks}
                  onChange={(e) => setTotalTracks(e.target.value)}
                  placeholder="200"
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requests">Request Queue (Track Numbers)</Label>
              <Input
                id="requests"
                value={requestsInput}
                onChange={(e) => setRequestsInput(e.target.value)}
                placeholder="98, 183, 37, 122, 14, 124, 65, 67"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Play className="w-4 h-4 mr-2" />
                Run Simulation
              </Button>
              <Button type="button" onClick={handleRandomize} className="glass">
                <Shuffle className="w-4 h-4 mr-2" />
                Randomize
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
