'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, Play, Shuffle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import ComparisonChart from '../../components/simulator/ComparisonChart';
import { runAllAlgorithms } from '../../lib/simulationRunner';
import { SimulationResult, Direction } from '../../lib/algorithms/types';
import { parseRequestString, validateRequests, generateRandomRequests } from '../../lib/utils';

export default function ComparePage() {
  const [requestsInput, setRequestsInput] = useState('98, 183, 37, 122, 14, 124, 65, 67');
  const [initialHead, setInitialHead] = useState('53');
  const [totalTracks, setTotalTracks] = useState('200');
  const [direction, setDirection] = useState<Direction>('right');
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [error, setError] = useState('');

  const handleCompare = () => {
    setError('');
    const requests = parseRequestString(requestsInput);
    const head = parseInt(initialHead, 10);
    const tracks = parseInt(totalTracks, 10);

    if (isNaN(head) || head < 0 || head >= tracks) {
      setError(`Initial head position must be between 0 and ${tracks - 1}`);
      return;
    }

    const validation = validateRequests(requests, tracks);
    if (!validation.valid) {
      setError(validation.error || 'Invalid requests');
      return;
    }

    const allResults = runAllAlgorithms({
      requests,
      initialHead: head,
      totalTracks: tracks,
      direction,
    });

    setResults(allResults);
  };

  const handleRandomize = () => {
    const tracks = parseInt(totalTracks, 10) || 200;
    const random = generateRandomRequests(8, tracks);
    setRequestsInput(random.join(', '));
    setInitialHead(Math.floor(Math.random() * tracks).toString());
  };

  const getBestAlgorithm = () => {
    if (results.length === 0) return null;
    return results.reduce((best, current) =>
      current.totalSeekTime < best.totalSeekTime ? current : best
    );
  };

  const bestAlgorithm = getBestAlgorithm();

  return (
    <div className="container mx-auto max-w-7xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Algorithm Comparison
        </h1>
        <p className="text-gray-600 text-lg">
          Compare all disk scheduling algorithms side-by-side
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-blue-500" />
              Comparison Configuration
            </CardTitle>
            <CardDescription>
              Run all algorithms with the same parameters to compare performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="initialHead">Initial Head Position</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="direction">Direction</Label>
                  <Select
                    id="direction"
                    value={direction}
                    onChange={(e) => setDirection(e.target.value as Direction)}
                    className="w-full"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requests">Request Queue</Label>
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
                  onClick={handleCompare}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Compare All Algorithms
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRandomize}
                  className="glass"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Randomize
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {results.length > 0 && (
        <>
          {bestAlgorithm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 rounded-2xl border-2 border-green-300"
            >
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl">
                  🏆
                </div>
                <div>
                  <div className="text-sm text-gray-600">Best Performance</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-cyan-500 bg-clip-text text-transparent">
                    {bestAlgorithm.algorithm}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total Seek Time: {bestAlgorithm.totalSeekTime} | Average: {bestAlgorithm.averageSeekTime.toFixed(2)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <ComparisonChart results={results} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Detailed Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.map((result, idx) => (
                    <motion.div
                      key={result.algorithm}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="glass-card p-6 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                          {result.algorithm}
                        </h3>
                        <div className="flex gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-500">
                              {result.totalSeekTime}
                            </div>
                            <div className="text-xs text-gray-600">Total Seek</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">
                              {result.averageSeekTime.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-600">Avg Seek</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.sequence.map((track, trackIdx) => (
                          <span
                            key={`${result.algorithm}-${trackIdx}`}
                            className="px-3 py-1 glass rounded-lg text-sm font-medium"
                          >
                            {track}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}

      {results.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="glass-card rounded-2xl p-12 inline-block">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20"
            />
            <p className="text-gray-500 text-lg">
              Configure parameters and click Compare to see all algorithms
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}