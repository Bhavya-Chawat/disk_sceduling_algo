# Disk Scheduling Algorithm Simulator

A comprehensive web-based simulator for visualizing and comparing various disk scheduling algorithms. Built with Next.js 13+, TypeScript, Tailwind CSS, and Framer Motion, this application provides interactive visualizations and detailed performance metrics for disk scheduling algorithms.

## 🚀 Key Features

- **Interactive Visualization** - Real-time animation of disk head movement across tracks
- **Multi-Algorithm Support** - Compare FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK algorithms
- **Performance Analytics** - Detailed metrics including total seek time, average seek time, and step-by-step breakdowns
- **Algorithm Comparison** - Side-by-side performance comparison of all algorithms
- **Educational Content** - Theory explanations with advantages/disadvantages for each algorithm
- **Responsive Design** - Works seamlessly across desktop, tablet, and mobile devices
- **Random Data Generation** - Quickly generate test scenarios with randomized inputs

## 📊 Algorithms Implemented

### 1. FCFS (First Come First Serve)
Processes requests in the order they arrive in the queue. Simple to implement but not optimal for seek time minimization.

### 2. SSTF (Shortest Seek Time First)
Services the request closest to the current head position. Reduces average seek time but can cause starvation.

### 3. SCAN (Elevator Algorithm)
Moves the head in one direction, servicing all requests along the way, then reverses direction at the end.

### 4. C-SCAN (Circular SCAN)
Moves the head in one direction only. When it reaches the end, it jumps to the beginning without servicing requests.

### 5. LOOK
Similar to SCAN but reverses direction when there are no more requests in the current direction, rather than going to the disk extremes.

### 6. C-LOOK
Circular version of LOOK. When no more requests in current direction, jumps to farthest request in opposite direction.

## 🛠️ Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd disk-scheduling-algorithm-simulator
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development Server

To run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

The page will reload automatically when you make changes to the code.

### Production Build

To create a production build:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm start
# or
yarn start
```

## 🧭 Application Pages

### Home Page
The landing page provides an overview of the application features and supported algorithms.

### Simulator Page
Configure and run simulations for individual algorithms:
- Set initial head position
- Define request queue
- Choose algorithm and direction
- Visualize disk head movement
- View performance metrics

### Comparison Page
Compare all algorithms side-by-side with the same input parameters:
- See total and average seek times for each algorithm
- Identify the best performing algorithm
- View detailed results with request sequences
- Generate random test data

### Theory Page
Educational resource explaining:
- Fundamental disk scheduling concepts
- Performance metrics (seek time, rotational latency, etc.)
- Advantages and disadvantages of each algorithm
- Time complexity analysis

## 🏗️ Project Architecture

```
.
├── app/                    # Next.js 13+ app directory with App Router
│   ├── api/               # API routes (future expansion)
│   ├── compare/           # Algorithm comparison page
│   ├── simulator/         # Main simulator page
│   ├── theory/            # Theory explanation page
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── layout/            # Layout components (Navbar, Footer)
│   ├── simulator/         # Simulator-specific components
│   └── ui/                # Reusable UI components
├── lib/                   # Core logic and utilities
│   ├── algorithms/        # Disk scheduling algorithm implementations
│   ├── simulationRunner.ts # Simulation orchestration
│   └── utils.ts           # Utility functions
├── public/                # Static assets
└── styles/                # Global styles
```

## 🔧 Technologies Used

- **Next.js 13+** - React framework with App Router for SSR and SSG
- **TypeScript** - Type-safe JavaScript for enhanced developer experience
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Framer Motion** - Animation library for smooth transitions and visualizations
- **Recharts** - Declarative charting library built on D3
- **Lucide React** - Beautiful SVG icons as React components

## 📈 Performance Metrics

The simulator calculates and displays key performance indicators:
- **Total Seek Time** - Sum of all head movements
- **Average Seek Time** - Total seek time divided by number of requests
- **Request Sequence** - Order in which requests are serviced
- **Step-by-Step Analysis** - Movement from track to track with individual seek times

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.