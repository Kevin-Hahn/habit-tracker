export const CHART_LEVELS = [0, 1, 2, 3, 4] as const;

export const PROGRESS_RING_CONFIG = {
  radius: 26,
  circumference: 2 * Math.PI * 26,
} as const;

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 600,
} as const;

export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
} as const;

export const Z_INDEX = {
  dropdown: 1000,
  modal: 1050,
  toast: 1080,
} as const;

export type ChartLevel = (typeof CHART_LEVELS)[number];
