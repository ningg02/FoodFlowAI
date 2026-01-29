# FoodFlowAI

## Overview

The Food Rescue Dashboard is a cutting-edge web application that demonstrates how agentic AI systems can orchestrate complex logistics to reduce food waste and improve urban sustainability. The system coordinates five specialized AI agents that work together to optimize every aspect of food donation - from detection and categorization to demand prediction, route planning, and impact tracking.

## The Agent System

### 1. Detection Agent
Analyzes and categorizes donated food items, estimates weight, and assesses perishability to ensure optimal handling.

### 2. Demand Agent
Predicts which facilities need food most urgently by analyzing capacity, location, and current needs.

### 3. Logistics Agent
Plans the most efficient delivery routes, calculates ETAs, and optimizes vehicle usage.

### 4. Matching Agent
Allocates food donations proportionally to recipients based on capacity and need scores.

### 5. Impact Agent
Tracks and visualizes the cumulative impact of food rescue operations over time.

## Getting Started

### Installation

1. **Change directory to project files**
   ```bash
   cd foodflowai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the application running.

## Usage

### Donating Food

1. **Select Food Type**: Choose between Perishable or Non-Perishable
2. **Enter Details**: Provide the food name, quantity, and unit
3. **Submit**: Click "Orchestrate" to activate the agent system
4. **Watch the Magic**: Observe as each agent processes your donation in sequence

### Monitoring Operations

- **Detection Panel**: View food categorization and estimated weight
- **Demand Panel**: See ranked facilities and their need scores
- **Route Map**: Visualize the planned delivery route
- **Matching Panel**: Check food allocation to each facility
- **Impact Chart**: Track weekly rescued food quantities
- **Activity Log**: Review recent donation history
