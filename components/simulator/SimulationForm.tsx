"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SimulationFormProps {
  initialHead?: number;
  trackSize?: number;
  requests?: string;
  direction?: "left" | "right";
  algorithm?: string;
  onSimulate: (params: {
    initialHead: number;
    trackSize: number;
    requests: number[];
    direction: "left" | "right";
    algorithm: string;
  }) => void;
  algorithms: { name: string; description: string }[];
}

export function SimulationForm({
  initialHead = 50,
  trackSize = 200,
  requests = "82, 170, 43, 140, 24, 16, 190",
  direction = "right",
  algorithm = "fcfs",
  onSimulate,
  algorithms,
}: SimulationFormProps) {
  const [formData, setFormData] = useState({
    initialHead,
    trackSize,
    requests,
    direction,
    algorithm,
  });

  const generateRandomRequests = () => {
    const count = 8;
    const randomReqs = Array.from({ length: count }, () =>
      Math.floor(Math.random() * formData.trackSize)
    );
    setFormData((prev) => ({
      ...prev,
      requests: randomReqs.join(", "),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requestArray = formData.requests
      .split(",")
      .map((r) => parseInt(r.trim()))
      .filter((r) => !isNaN(r));

    onSimulate({
      initialHead: formData.initialHead,
      trackSize: formData.trackSize,
      requests: requestArray,
      direction: formData.direction as "left" | "right",
      algorithm: formData.algorithm,
    });
  };

  return (
    <Card className="glass-panel-strong sticky top-20">
      <CardHeader>
        <CardTitle className="text-section">Simulation Parameters</CardTitle>
        <CardDescription>
          Configure the disk scheduling simulation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Algorithm Selection */}
          <div className="space-y-2">
            <Label
              htmlFor="algorithm"
              className="text-sm font-medium text-gray-300 mb-2 block"
            >
              Algorithm
            </Label>
            <Select
              value={formData.algorithm}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  algorithm: value,
                }))
              }
            >
              <SelectTrigger className="bg-white/5 border-disk-primary-400/30">
                <SelectValue placeholder="Choose algorithm" />
              </SelectTrigger>
              <SelectContent>
                {algorithms.map((algo) => (
                  <SelectItem key={algo.name} value={algo.name.toLowerCase()}>
                    {algo.name} - {algo.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initialHead">Initial Head Position</Label>
              <Input
                id="initialHead"
                type="number"
                min={0}
                max={formData.trackSize - 1}
                value={formData.initialHead}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    initialHead: parseInt(e.target.value) || 0,
                  }))
                }
                className="bg-white/5 border-disk-primary-400/30 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trackSize">Track Size</Label>
              <Input
                id="trackSize"
                type="number"
                min={100}
                max={1000}
                value={formData.trackSize}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    trackSize: parseInt(e.target.value) || 200,
                  }))
                }
                className="bg-white/5 border-disk-primary-400/30 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requests">Request Queue (comma-separated)</Label>
            <div className="flex gap-2">
              <Input
                id="requests"
                value={formData.requests}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    requests: e.target.value,
                  }))
                }
                placeholder="82, 170, 43, 140, 24, 16, 190"
                className="bg-white/5 border-disk-primary-400/30 text-white flex-1"
              />
              <Button
                type="button"
                onClick={generateRandomRequests}
                variant="outline"
                className="glass-panel border-disk-primary-400/50 whitespace-nowrap"
              >
                Random
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Direction (for SCAN, C-SCAN, LOOK, C-LOOK)</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="direction"
                  checked={formData.direction === "left"}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      direction: "left",
                    }))
                  }
                  className="accent-disk-primary-400"
                />
                <span className="text-sm text-gray-300">Left</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="direction"
                  checked={formData.direction === "right"}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      direction: "right",
                    }))
                  }
                  className="accent-disk-primary-400"
                />
                <span className="text-sm text-gray-300">Right</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-disk-primary-500 to-disk-primary-600 hover:scale-105 transition-transform"
            >
              Run Simulation
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full glass-panel border-disk-primary-400/50"
            >
              Step Through
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-gray-400 hover:text-white"
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
