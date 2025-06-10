export const CHART_LEVELS = [0, 1, 2, 3, 4] as const;

export type ChartLevel = (typeof CHART_LEVELS)[number];
