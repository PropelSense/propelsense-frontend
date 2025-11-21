# PropelSense Dashboard

A modern data science dashboard built with Next.js and Recharts, showcasing various data visualization techniques similar to Python's matplotlib and seaborn libraries. The project follows an MVC-like architecture for clean code organization and maintainability.

## Features

- **Multiple Chart Types**:

  - Line charts for time series analysis
  - Bar charts for category comparisons
  - Area charts for cumulative distributions
  - Pie charts for distribution analysis
  - Scatter plots for correlation analysis
  - Composed charts for multi-metric visualization

- **Modern UI**: Built with Tailwind CSS with dark mode support
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **TypeScript**: Fully typed for better development experience
- **Modular Architecture**: MVC-like structure for easy maintenance and scalability
- **Real-Time Weather**: Integrated OpenWeatherMap API for live weather data

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Composable charting library built on React components

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up Weather API (Optional but recommended):

   - Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up is free and provides 1,000 API calls per day
   - Create a `.env.local` file in the root directory:

   ```bash
   NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
   ```

   - If no API key is provided, the dashboard will use sample weather data

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure (MVC-like Architecture)

```
propel-sense/
├── app/
│   ├── page.tsx                    # Controller/View: Main dashboard page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                  # Global styles
│   └── components/
│       ├── charts/                  # View: Chart components
│       │   ├── TimeSeriesChart.tsx
│       │   ├── BarComparisonChart.tsx
│       │   ├── AreaChart.tsx
│       │   ├── PieChart.tsx
│       │   ├── ScatterChart.tsx
│       │   ├── ComposedChart.tsx
│       │   └── index.ts            # Barrel export
│       ├── StatsCards.tsx          # View: Stats cards component
│       └── WeatherWidget.tsx        # View: Real-time weather widget
├── lib/
│   ├── types/                      # Model: Type definitions
│   │   └── chart.types.ts
│   ├── data/                       # Model: Data and sample datasets
│   │   ├── sampleData.ts
│   │   ├── statsData.ts
│   │   └── index.ts                # Barrel export
│   ├── services/                   # Service: API communication layer
│   │   ├── dataService.ts
│   │   └── index.ts
│   └── constants/                  # Constants
│       └── app.ts
├── public/                          # Static assets
└── package.json
```

### Architecture Overview

The project follows an **MVC-like pattern**:

- **Model Layer** (`lib/`):

  - `lib/types/` - TypeScript type definitions for data structures
  - `lib/data/` - Data models and sample datasets

- **View Layer** (`app/components/`):

  - Reusable chart components with props for data and configuration
  - Each chart component is self-contained and accepts input values

- **Controller Layer** (`app/page.tsx`):
  - Main dashboard page that orchestrates data and components
  - Clean, readable code that imports models and views

## Chart Components

All chart components are modular and accept props for customization:

### TimeSeriesChart

```tsx
<TimeSeriesChart
  data={timeSeriesData}
  title="Time Series Analysis"
  height={300}
  showLegend={true}
/>
```

### BarComparisonChart

```tsx
<BarComparisonChart
  data={categoryData}
  title="Category Comparison"
  height={300}
  valueKey="value"
  targetKey="target"
/>
```

### AreaChart

```tsx
<AreaChart
  data={timeSeriesData}
  title="Cumulative Distribution"
  height={300}
  color="#0088FE"
/>
```

### PieChart

```tsx
<PieChart
  data={distributionData}
  title="Distribution Analysis"
  height={300}
  showLabel={true}
/>
```

### ScatterChart

```tsx
<ScatterChart
  data={scatterData}
  title="Scatter Plot Analysis"
  height={300}
  xLabel="X Value"
  yLabel="Y Value"
/>
```

### ComposedChart

```tsx
<ComposedChart
  data={correlationData}
  title="Feature Correlation & Importance"
  height={300}
  barKey="correlation"
  lineKey="importance"
/>
```

## Customization

### Adding New Data

1. Add data to `lib/data/sampleData.ts` or create a new data file
2. Define types in `lib/types/chart.types.ts` if needed
3. Import and use in `app/page.tsx`

### Creating New Chart Components

1. Create a new component in `app/components/charts/`
2. Accept props for data and configuration
3. Export from `app/components/charts/index.ts`
4. Use in `app/page.tsx`

### Modifying Existing Charts

Each chart component accepts props for customization:

- `data` - The dataset to visualize
- `title` - Chart title
- `height` - Chart height in pixels
- Additional props specific to each chart type

## Charting Library

This project uses [Recharts](https://recharts.org/), a free and open-source charting library for React. It provides:

- Multiple chart types (Line, Bar, Area, Pie, Scatter, etc.)
- Responsive design
- Customizable styling
- Interactive tooltips and legends
- Similar functionality to matplotlib/seaborn in Python

## License

MIT
