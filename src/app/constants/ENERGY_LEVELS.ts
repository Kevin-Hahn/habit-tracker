export const ENERGY_LEVELS = [
  { value: 1, icon: '🪫', label: 'Drained' },
  { value: 2, icon: '🪫', label: 'Low' },
  { value: 3, icon: '🔋', label: 'Moderate' },
  { value: 4, icon: '⚡', label: 'High' },
  { value: 5, icon: '⚡', label: 'Energized' },
] as const;

export type EnergyLevel = (typeof ENERGY_LEVELS)[number];
