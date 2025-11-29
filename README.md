# Disk Scheduling Algorithms Simulator

An interactive web-based visualization tool built using **Next.js**, **React**, **Tailwind CSS**, **Framer Motion**, **Recharts**, and **shadcn/ui**.  
This simulator helps users understand and compare classic **disk scheduling algorithms** used in Operating Systems.

---

## 🚀 Live Demo (Optional)

Add your deployed Vercel link here:
👉 https://your-app.vercel.app/

---

## 📖 Overview

Disk scheduling algorithms determine how an Operating System handles multiple disk I/O requests efficiently.  
This project provides:

- Visual simulation of head movement
- Step-by-step breakdown of seek operations
- Graphs and tables for analysis
- Comparison mode across algorithms
- Clean glassmorphism UI
- Fully interactive animations

---

## ✨ Features

### 🎛️ Simulation

- Input custom request sequences
- Choose algorithm:
  - FCFS
  - SSTF
  - SCAN
  - C‑SCAN
  - LOOK
  - C‑LOOK
- Adjustable head position
- Adjustable max track number

### 🎥 Visualization

- Smooth Framer Motion disk-head animation
- Track layout rendered with SVG
- Movement timeline
- Step counters and seek-time calculations

### 📊 Comparison Mode

- Run all algorithms side-by-side
- Bar charts (Recharts) for visual comparison
- Summary table (total movement, avg. seek, order processed)

### 🔍 Theory Page

- Explanation of each algorithm
- Pros and cons
- Best-use scenarios

---

## 🛠️ Tech Stack

**Frontend**

- React
- Next.js (App Router)
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Recharts

**Language**

- TypeScript

---

## 📂 Project Structure

```
disk-scheduling-simulator/
├── app/
│ ├── layout.tsx
│ ├── page.tsx
│ ├── simulator/
│ │ └── page.tsx
│ ├── compare/
│ │ └── page.tsx
│ ├── theory/
│ │ └── page.tsx
│ └── api/
│ └── export-report/
│ └── route.ts
│
├── components/
│ ├── ui/ # shadcn/ui components
│ └── simulator/
│ ├── SimulationForm.tsx
│ ├── DiskHeadAnimation.tsx
│ ├── DiskTrackVisual.tsx
│ ├── SimulationSummary.tsx
│ └── ComparisonChart.tsx
│
├── lib/
│ ├── algorithms/
│ │ ├── fcfs.ts
│ │ ├── sstf.ts
│ │ ├── scan.ts
│ │ ├── cscan.ts
│ │ ├── look.ts
│ │ ├── clook.ts
│ │ └── types.ts
│ ├── simulationRunner.ts
│ └── utils.ts
│
├── styles/
│ └── globals.css
├── public/
└── README.md

```

---

## 🧠 Algorithms Implemented

Each algorithm follows this return format:

```
{
  algorithm: "FCFS",
  sequence: number[],
  steps: { from, to, movement }[],
  totalMovement: number,
  averageMovement: number
}
```

Included:

- FCFS
- SSTF
- SCAN
- C‑SCAN
- LOOK
- C‑LOOK

▶️ Running Locally

1. Clone the repo

```
git clone https://github.com/your-username/disk-scheduler-simulator.git
cd disk-scheduler-simulator
```

2. Install dependencies

```
npm install
```

3. Run the dev server

```
npm run dev
```

4. Visit

```
http://localhost:3000
```

---

🤝 Contributors

- [Bhavya Chawat](https://github.com/Bhavya-Chawat)
- [A V Kruthi Krishna](https://github.com/kriidevx)

📜 License
MIT License. Feel free to use and modify.

⭐ If you like this project
Star the repo & share it!

---
