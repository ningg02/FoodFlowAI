# Food Rescue Dashboard - Agentic AI

A full-featured React application demonstrating an Agentic AI system for food rescue and urban sustainability. This dashboard orchestrates multiple AI agents to optimize food donation logistics, demand prediction, route planning, and impact tracking.

## Features

- **🤖 Multi-Agent System**: Five specialized AI agents working in concert:
  - Detection Agent: Categorizes and estimates food donations
  - Demand Agent: Predicts recipient needs and ranks facilities
  - Logistics Agent: Plans optimal delivery routes
  - Matching Agent: Allocates food to recipients based on capacity and need
  - Impact Agent: Tracks and visualizes rescued food over time

- **📊 Real-time Visualization**: Interactive charts showing weekly impact and analytics
- **🗺️ Route Planning**: Visual map showing delivery routes and facilities
- **📝 Activity Logging**: Track all donations and allocations
- **💫 Smooth Animations**: Powered by Framer Motion

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Charting library for data visualization
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 16+ and npm (or yarn/pnpm)

### Installation

1. Navigate to the project directory:
```bash
cd food-rescue-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Donate Food**: Fill out the form with food type, name, quantity, and unit
2. **Submit**: Click "Orchestrate" to trigger the multi-agent workflow
3. **Watch**: Observe as each agent processes the donation:
   - Detection categorizes the food
   - Demand identifies optimal recipients
   - Logistics plans the delivery route
   - Matching allocates food proportionally
   - Impact updates the analytics
4. **Monitor**: View recent activity in the operations console

## Project Structure

```
food-rescue-app/
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── src/
│   ├── main.jsx           # React entry point
│   ├── App.jsx            # Main App component
│   ├── index.css          # Global styles with Tailwind
│   └── components/
│       └── FoodRescueDashboard.jsx  # Main dashboard component
└── README.md              # This file
```

## Customization

### Mock Data
The dashboard currently uses simulated data. To connect to real APIs:
- Replace agent functions with actual API calls
- Update `runAgents()` to handle async API responses
- Add error handling and loading states

### Styling
- Modify `tailwind.config.js` to customize colors and theme
- Edit component styles directly in JSX className props
- Add global styles in `src/index.css`

### Agents
Each agent function can be found in `FoodRescueDashboard.jsx`:
- `detectionAgent()` - Line 72
- `demandAgent()` - Line 79
- `logisticsAgent()` - Line 94
- `matchingAgent()` - Line 102
- `impactAgent()` - Line 117

## License

This is a demo application for educational and prototyping purposes.

## Notes

- This is a demonstration with simulated data
- Agent logic uses mock calculations - replace with real ML models for production
- Map visualization is simplified - integrate with real mapping services for actual deployment
- Activity log shows the 10 most recent entries
