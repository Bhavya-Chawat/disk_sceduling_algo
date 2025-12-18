# 💾 Disk Scheduling Algorithm Simulator

A comprehensive, interactive web-based simulator for visualizing and comparing various disk scheduling algorithms. This educational project provides real-time animations, detailed performance metrics, and algorithm comparisons to help students and professionals understand how different disk scheduling strategies optimize disk head movement and minimize seek time.

**Live Features**: Interactive simulations | Algorithm comparison | Visual animations | Performance analytics | Educational theory explanations

---

## 🌟 Key Features

✨ **Interactive Real-Time Visualization**

- Smooth animations of disk head movement across tracks
- Visual representation of seek paths and distances
- Step-by-step playback with adjustable speed controls

🔄 **Algorithm Comparison**

- Select and compare any combination of algorithms
- Side-by-side performance metrics with bar charts
- Identify best-performing algorithm for your scenarios
- Unit-aware display (all times shown in "tracks")

📊 **Performance Analytics**

- **Total Seek Time** - Sum of all head movements (in tracks)
- **Average Seek Time** - Mean seek distance per request (in tracks)
- **Step-by-Step Breakdown** - Track each movement individually
- **Visual Charts** - Bar graphs with proper unit labeling

📚 **Comprehensive Algorithm Theory**

- Detailed explanations for each algorithm
- Advantages and disadvantages comparison
- Time complexity analysis
- Real-world use case recommendations
- Implementation code examples

🎨 **Modern UI/UX**

- Glass-morphism design with gradient accents
- Fully responsive (mobile, tablet, desktop)
- Smooth Framer Motion animations
- Intuitive card-based algorithm selection
- Accessibility-first design

🎲 **Random Data Generation**

- Instantly generate test scenarios
- Randomize head position and request queues
- Quick iteration for testing different cases

---

## 🚀 Live Features & Improvements

### ✅ Recently Added

- ✨ **Algorithm Selection Cards** - Beautiful card UI with color feedback for selected algorithms
- 🎯 **Select All / Deselect All** - Quick toggle for all algorithms
- 📈 **Unit-Aware Displays** - All numeric values display with proper units ("tracks")
- 📊 **Enhanced Charts** - Y-axis labels showing "Seek Time (tracks)" with tooltip formatters
- 🎨 **Softened UI** - Light gradient backgrounds for better visual hierarchy
- 👥 **Creator Attribution** - Prominently displayed on home page and footer

---

## 📊 Algorithms Implemented

### 1. **FCFS** (First Come First Serve)

```
Pattern: → → → (processes in arrival order)
Use Case: Simple systems where fairness > performance
Time Complexity: O(n)
```

Processes requests in exact arrival order. Simplest to implement but often results in high seek times.

### 2. **SSTF** (Shortest Seek Time First)

```
Pattern: Nearest → Nearest → ... (greedy nearest approach)
Use Case: Scenarios where short-term optimization is valued
Time Complexity: O(n²)
```

Always services the closest request. Reduces average seek time but can cause request starvation.

### 3. **SCAN** (Elevator Algorithm)

```
Pattern: → → → (end) ← ← ← (start) → ...
Use Case: High-traffic disk systems
Time Complexity: O(n log n)
```

Moves in one direction servicing all requests, then reverses. Provides good fairness and performance balance.

### 4. **C-SCAN** (Circular SCAN)

```
Pattern: → → → (end) [jump] → → → (repeat)
Use Case: Uniform response time requirements
Time Complexity: O(n log n)
```

Moves in one direction only; jumps back to start instead of reversing. More uniform wait times.

### 5. **LOOK** (LOOK-Ahead)

```
Pattern: → (last request) ← (last request on other side)
Use Case: Optimized systems avoiding unnecessary movement
Time Complexity: O(n log n)
```

Like SCAN but reverses at last request instead of disk end. Eliminates wasted movement.

### 6. **C-LOOK** (Circular LOOK)

```
Pattern: → (last request) [jump to opposite last] → ...
Use Case: High-performance systems requiring efficiency
Time Complexity: O(n log n)
```

Combines LOOK efficiency with circular approach. Most sophisticated algorithm, often used in modern systems.

---

## 🛠️ Tech Stack

| Technology        | Purpose                          | Version |
| ----------------- | -------------------------------- | ------- |
| **Next.js**       | React framework with App Router  | 14.2.0  |
| **TypeScript**    | Type-safe development            | 5.4.0   |
| **Tailwind CSS**  | Styling & responsive design      | 3.4.0   |
| **Framer Motion** | Animations & transitions         | 11.0.0  |
| **Recharts**      | Performance visualization charts | 2.12.0  |
| **Lucide React**  | Beautiful SVG icons              | 0.263.1 |
| **React**         | UI library                       | 18.3.1  |

---

## 📦 Getting Started

### Prerequisites

- **Node.js** v14 or higher
- **npm** or **yarn** package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Bhavya-Chawat/disk_sceduling_algo.git
   cd disk_sceduling_algo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Build

```bash
npm run build      # Create optimized build
npm start          # Start production server
```

---

## 🧭 Application Pages

### 🏠 **Home Page** (`/`)

- Project overview and feature highlights
- Algorithm cards with descriptions
- Quick links to simulator and comparison tools
- Creator attribution section

### ⚙️ **Simulator Page** (`/simulator`)

- **Input Configuration**:

  - Algorithm selection (dropdown)
  - Initial head position (Track number)
  - Total disk tracks
  - Seek direction (Left/Right)
  - Request queue (comma-separated track numbers)

- **Real-Time Visualization**:

  - Animated disk head movement
  - Track visualization with markers
  - Seek path animation
  - Step-by-step playback controls

- **Performance Metrics**:
  - Total seek time (in tracks)
  - Average seek time (in tracks)
  - Step-by-step breakdown with distances
  - Algorithm comparison card

### 📊 **Comparison Page** (`/compare`)

- **Algorithm Selection**:

  - Card-based algorithm picker
  - Multi-select with visual feedback
  - Select All / Deselect All options
  - Color-coded selection state

- **Configuration**:

  - Same parameters as simulator
  - Random data generation button
  - Validation with helpful error messages

- **Comparison Results**:
  - Performance bar chart (units: tracks)
  - Best algorithm highlighted with trophy 🏆
  - Detailed results for each algorithm
  - Seek sequence visualization

### 📚 **Theory Page** (`/theory`)

- Detailed algorithm explanations
- Pros and cons comparison
- Time complexity analysis
- Use case recommendations
- Implementation considerations

---

## 📁 Project Structure

```
disk_sceduling_algo/
├── 📄 README.md                 # Project documentation
├── 📦 package.json              # Dependencies & scripts
├── ⚙️  next.config.mjs           # Next.js configuration
├── 🎨 tailwind.config.ts        # Tailwind CSS config
├── 📋 tsconfig.json             # TypeScript config
│
├── app/                         # Next.js App Router
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Root layout
│   ├── api/
│   │   └── export-report/       # API for report export
│   ├── simulator/
│   │   └── page.tsx             # Simulator page
│   ├── compare/
│   │   └── page.tsx             # Comparison page (with selection UI)
│   └── theory/
│       └── page.tsx             # Theory/education page
│
├── components/                  # React components
│   ├── layout/
│   │   ├── Navbar.tsx           # Navigation bar
│   │   └── Footer.tsx           # Footer (with creators & GitHub link)
│   ├── simulator/
│   │   ├── SimulationForm.tsx   # Input form with unit labels
│   │   ├── SimulationSummary.tsx # Results display (with units)
│   │   ├── DiskHeadAnimation.tsx # Animated head visualization
│   │   ├── DiskTrackVisual.tsx   # Track visualization
│   │   ├── EnhancedDiskVisual.tsx# Enhanced track diagram
│   │   └── ComparisonChart.tsx   # Bar chart (with Y-axis labels & units)
│   └── ui/                       # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       └── table.tsx
│
├── lib/                         # Core business logic
│   ├── simulationRunner.ts      # Algorithm executor
│   ├── utils.ts                 # Utilities (parsing, validation)
│   └── algorithms/              # Algorithm implementations
│       ├── types.ts             # TypeScript interfaces
│       ├── fcfs.ts              # FCFS algorithm
│       ├── sstf.ts              # SSTF algorithm
│       ├── scan.ts              # SCAN algorithm
│       ├── cscan.ts             # C-SCAN algorithm
│       ├── look.ts              # LOOK algorithm
│       └── clook.ts             # C-LOOK algorithm
│
├── styles/
│   └── globals.css              # Global styles & animations
│
└── public/                      # Static assets
```

---

## 🎯 Usage Examples

### Running a Single Algorithm Simulation

1. Navigate to **Simulator** page
2. Select algorithm (e.g., SCAN)
3. Enter parameters:
   - Initial Head: 50
   - Total Tracks: 200
   - Requests: 98, 183, 37, 122, 14
   - Direction: Right
4. Click "Run Simulation"
5. Observe animations and review metrics showing times **in tracks**

### Comparing Multiple Algorithms

1. Go to **Compare** page
2. Select algorithms using cards (e.g., SCAN, LOOK, C-LOOK)
3. Click "Select All" for all algorithms
4. Enter same parameters for fair comparison
5. Click "Compare Algorithms"
6. View results:
   - Best algorithm highlighted with 🏆
   - Chart showing performance **in tracks**
   - Detailed breakdown per algorithm

---

## 📈 Performance Metrics Explained

### Seek Time (measured in tracks)

- **Definition**: Distance the disk head must move
- **Total Seek Time**: Sum of all individual movements
- **Average Seek Time**: Total ÷ Number of requests
- **Example**: Moving from track 50 → 98 = 48 tracks

### Display Format

All numeric displays include unit labels:

- ✅ "50 tracks" (not just "50")
- ✅ "3.2 tracks" (average with decimal)
- ✅ Chart Y-axis: "Seek Time (tracks)"
- ✅ Tooltips: "50 tracks", "3.2 tracks"

---

## 🤝 Created By

👥 **Project Developers**:

- **Kruthi Krishna**
- **Bhavya Chawat**

🔗 **Repository**: [github.com/Bhavya-Chawat/disk_sceduling_algo](https://github.com/Bhavya-Chawat/disk_sceduling_algo)

---

## 🎓 Educational Value

This simulator is designed for:

- 📚 Computer Science students learning OS concepts
- 👨‍🏫 Educators teaching disk I/O scheduling
- 🧑‍💻 Software engineers understanding storage optimization
- 🎯 Anyone interested in algorithm visualization and analysis

### Learning Outcomes

- Understand how disk scheduling affects performance
- Compare trade-offs between algorithms
- Visualize abstract algorithms in action
- Analyze performance metrics quantitatively

---

## ✨ Features Highlight

| Feature                       | Details                                  |
| ----------------------------- | ---------------------------------------- |
| **Interactive Visualization** | Real-time animations with speed control  |
| **Multiple Algorithms**       | 6 different disk scheduling algorithms   |
| **Unit-Aware Display**        | All values show "tracks" unit            |
| **Algorithm Selection**       | Beautiful card UI with Select All option |
| **Performance Charts**        | Labeled axes and formatted tooltips      |
| **Theory Content**            | Comprehensive algorithm explanations     |
| **Responsive Design**         | Works on mobile, tablet, desktop         |
| **Random Generator**          | Quick test case generation               |
| **Educational Content**       | Pros, cons, complexity, use cases        |

---

## 🚀 Future Enhancements

- 📱 Mobile app version
- 📊 Export simulation results
- 🎥 Video tutorials
- 🌐 Multi-language support
- 🎮 Interactive quizzes
- 🏆 Performance leaderboard
- 📝 Custom algorithm creation

---

## 📝 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 💡 Tips for Best Experience

1. **Start with FCFS** to understand the basics
2. **Use Compare page** to see relative algorithm performance
3. **Experiment with random data** for various scenarios
4. **Read Theory page** to understand algorithm concepts
5. **Pay attention to units** - everything is in "tracks"

---

## 🙏 Acknowledgments

Built as an educational project for Operating Systems learning. Special thanks to all contributors and everyone using this tool to learn about disk scheduling algorithms!

---

**Last Updated**: December 19, 2025  
**Version**: 1.0.0
