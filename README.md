# 🖴 Disk Scheduling Algorithm Visualizer

<div align="center">

![Disk Scheduling Visualizer](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-r160-000000?style=for-the-badge&logo=three.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite)

**An interactive educational tool for visualizing and understanding disk scheduling algorithms in Operating Systems**

[🚀 Live Demo](#) • [📖 Documentation](#features) • [🛠️ Installation](#installation)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Supported Algorithms](#supported-algorithms)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Team Information](#team-information)
- [References](#references)
- [License](#license)

---

## 🎯 Overview

The **Disk Scheduling Algorithm Visualizer** is a comprehensive web application designed to help students, educators, and enthusiasts understand how different disk scheduling algorithms work in operating systems. Through interactive 3D visualizations and detailed step-by-step explanations, users can grasp complex concepts with ease.

### Why This Project?

Disk scheduling is a fundamental concept in Operating Systems that determines the order in which disk I/O requests are serviced. Understanding these algorithms is crucial for:

- **Operating System courses** in computer science curricula
- **System performance optimization** in real-world applications
- **Interview preparation** for software engineering roles
- **Research** in storage systems and I/O optimization

---

## ✨ Features

### 🎮 Interactive Simulator

- **Real-time 3D visualization** using Three.js with rotating disk platters and moving read/write head
- **2D track visualization** showing the seek path and request queue
- **Step-by-step playback** with play/pause, forward, and backward controls
- **Adjustable simulation speed** from 0.5x to 3x
- **Timeline scrubbing** for jumping to any step in the simulation

### 📊 Algorithm Comparison

- **Side-by-side comparison** of all 6 algorithms with identical input
- **Interactive bar charts** visualizing total seek time differences
- **Performance ranking** with detailed metrics
- **Percentage difference** calculation from the best-performing algorithm

### 📚 Comprehensive Theory

- **In-depth explanations** for each algorithm with examples
- **Mathematical formulas** and complexity analysis
- **Pros and cons** for each scheduling strategy
- **Real-world use cases** and practical applications

### 🎛️ User Controls

- **Custom request queue** input with comma-separated values
- **Randomize function** for generating test scenarios
- **Preset examples** demonstrating best/worst cases
- **Direction selection** (left/right) for directional algorithms
- **Total tracks configuration** (50-500)

### 📤 Export Functionality

- **PDF report generation** with complete analysis
- **CSV export** of seek sequences
- **Downloadable comparison charts**
- **Step-by-step solution documents**

### ♿ Accessibility

- **Keyboard navigation** support (Space for play/pause, arrows for stepping)
- **ARIA labels** for screen reader compatibility
- **High contrast mode** option
- **Responsive design** for all screen sizes

---

## 🔧 Supported Algorithms

| Algorithm  | Full Name                | Description                            | Time Complexity |
| ---------- | ------------------------ | -------------------------------------- | --------------- |
| **FCFS**   | First Come First Serve   | Processes requests in arrival order    | O(n)            |
| **SSTF**   | Shortest Seek Time First | Selects the nearest request            | O(n²)           |
| **SCAN**   | Elevator Algorithm       | Sweeps to disk end, then reverses      | O(n log n)      |
| **C-SCAN** | Circular SCAN            | One-directional sweep, jumps back      | O(n log n)      |
| **LOOK**   | LOOK Algorithm           | Like SCAN but reverses at last request | O(n log n)      |
| **C-LOOK** | Circular LOOK            | Combines C-SCAN and LOOK optimizations | O(n log n)      |

---

## 📸 Screenshots

### Home Page

> _The landing page with 3D disk animation and quick navigation to simulator, theory, and comparison sections._

### Simulator

> _Interactive simulator with 3D visualization, controls panel, and real-time metrics._

### Algorithm Comparison

> _Side-by-side comparison of all algorithms with bar charts and performance rankings._

### Theory Section

> _Comprehensive theory pages with explanations, formulas, and examples._

---

## 🛠️ Tech Stack

### Frontend Framework

- **React 18.3** - UI library with hooks and functional components
- **TypeScript 5.8** - Type-safe JavaScript
- **Vite 5.4** - Next-generation build tool

### Styling

- **Tailwind CSS 3.4** - Utility-first CSS framework
- **tailwindcss-animate** - Animation utilities
- **Framer Motion 11** - Declarative animations

### 3D Graphics

- **Three.js r160** - 3D graphics library
- **React Three Fiber 8** - React renderer for Three.js
- **React Three Drei 9** - Useful helpers for R3F

### UI Components

- **Radix UI** - Accessible, unstyled UI primitives
- **shadcn/ui** - Beautiful, customizable components
- **Lucide React** - Modern icon library

### Charts & Data Visualization

- **Recharts 2.15** - Composable charting library

### Routing & Forms

- **React Router DOM 6** - Client-side routing
- **React Hook Form 7** - Performant forms
- **Zod 3** - TypeScript-first schema validation

### Additional Libraries

- **date-fns** - Date utility library
- **clsx** - Conditional class names
- **tailwind-merge** - Merge Tailwind classes
- **Sonner** - Toast notifications

---

## 📦 Installation

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher (or **bun** / **yarn** / **pnpm**)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/disk-scheduling-visualizer.git
   cd disk-scheduling-visualizer
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   bun install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Available Scripts

| Command             | Description              |
| ------------------- | ------------------------ |
| `npm run dev`       | Start development server |
| `npm run build`     | Create production build  |
| `npm run build:dev` | Create development build |
| `npm run preview`   | Preview production build |
| `npm run lint`      | Run ESLint               |

---

## 📖 Usage

### Basic Simulation

1. **Navigate to Simulator** - Click "Launch Simulator" from the home page
2. **Select Algorithm** - Choose from FCFS, SSTF, SCAN, C-SCAN, LOOK, or C-LOOK
3. **Configure Parameters**:
   - Set initial head position (0 to total tracks - 1)
   - Set total number of tracks (50-500)
   - Choose initial direction for directional algorithms
4. **Enter Request Queue** - Input comma-separated track numbers or use "Randomize"
5. **Control Playback**:
   - ▶️ Play/Pause simulation
   - ⏮️ Step backward
   - ⏭️ Step forward
   - 🔄 Reset to beginning
   - ⚡ Adjust speed

### Using Preset Examples

Click "Try Example" buttons to load pre-configured scenarios:

- **Best Case FCFS** - Sequential requests showing FCFS efficiency
- **SSTF Starvation** - Demonstrates starvation problem in SSTF
- **Elevator Pattern** - Shows optimal SCAN behavior
- **Random Heavy Load** - Tests all algorithms under stress

### Comparing Algorithms

1. **Navigate to Compare** - Click "Compare Algorithms" from navigation
2. **Configure Input** - Same parameters apply to all algorithms
3. **Analyze Results**:
   - View bar chart comparison
   - Check performance rankings
   - Examine detailed metrics table
4. **Export Results** - Download as PDF, CSV, or image

---

## 📁 Project Structure

```
disk-scheduling-visualizer/
├── public/                 # Static assets
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.tsx          # Navigation bar
│   │   ├── three/
│   │   │   ├── DiskScene.tsx       # 3D disk visualization
│   │   │   └── HeroDiskPreview.tsx # Hero section 3D preview
│   │   └── ui/
│   │       ├── AlgorithmCard.tsx   # Algorithm info cards
│   │       ├── InfiniteGrid.tsx    # Background grid
│   │       ├── MetricsPanel.tsx    # Performance metrics display
│   │       ├── TrackVisualization.tsx # 2D track chart
│   │       └── ...                 # shadcn/ui components
│   ├── hooks/
│   │   ├── use-mobile.tsx          # Mobile detection
│   │   ├── use-theme.tsx           # Theme management
│   │   └── use-toast.ts            # Toast notifications
│   ├── lib/
│   │   ├── utils.ts                # Utility functions
│   │   └── algorithms/
│   │       ├── index.ts            # Algorithm exports
│   │       ├── types.ts            # Type definitions
│   │       ├── fcfs.ts             # FCFS implementation
│   │       ├── sstf.ts             # SSTF implementation
│   │       ├── scan.ts             # SCAN implementation
│   │       ├── cscan.ts            # C-SCAN implementation
│   │       ├── look.ts             # LOOK implementation
│   │       └── clook.ts            # C-LOOK implementation
│   ├── pages/
│   │   ├── Index.tsx               # Home page
│   │   ├── Simulator.tsx           # Main simulator
│   │   ├── Compare.tsx             # Algorithm comparison
│   │   ├── Theory.tsx              # Theory overview
│   │   ├── TheoryDetail.tsx        # Algorithm-specific theory
│   │   └── NotFound.tsx            # 404 page
│   ├── App.tsx                     # App component with routes
│   ├── App.css                     # Global styles
│   ├── index.css                   # Tailwind imports
│   ├── main.tsx                    # Entry point
│   └── vite-env.d.ts               # Vite types
├── fonts/                          # Custom fonts
├── index.html                      # HTML template
├── package.json                    # Dependencies
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite configuration
└── README.md                       # This file
```

---

## 👥 Team Information

### Project Contributors

| Name          | Role                 | Contributions                    |
| ------------- | -------------------- | -------------------------------- |
| **Developer** | Full Stack Developer | Complete application development |

### Acknowledgments

This project was developed as an educational tool for Operating Systems courses. Special thanks to:

- Operating Systems instructors who inspired this project
- The open-source community for the amazing libraries used
- Contributors who helped improve the visualizations

---

## 📚 References

### Academic Resources

1. **Silberschatz, A., Galvin, P. B., & Gagne, G.** (2018). _Operating System Concepts_ (10th ed.). Wiley.

   - Chapter 11: Mass-Storage Structure
   - Chapter 12: I/O Systems

2. **Tanenbaum, A. S., & Bos, H.** (2014). _Modern Operating Systems_ (4th ed.). Pearson.

   - Chapter 5: Input/Output

3. **Stallings, W.** (2017). _Operating Systems: Internals and Design Principles_ (9th ed.). Pearson.
   - Chapter 11: I/O Management and Disk Scheduling

### Online Resources

- [GeeksforGeeks - Disk Scheduling Algorithms](https://www.geeksforgeeks.org/disk-scheduling-algorithms/)
- [Wikipedia - Disk Scheduling](https://en.wikipedia.org/wiki/Disk_scheduling)
- [OS Dev - Disk Scheduling](https://wiki.osdev.org/Disk_Scheduling)

### Technical Documentation

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Disk Scheduling Visualizer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

<div align="center">

**Made with ❤️ for Operating Systems Education**

⭐ Star this repo if you found it helpful!

</div>
