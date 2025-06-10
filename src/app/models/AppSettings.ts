export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    enabled: boolean;
    reminderTime: string;
    soundEnabled: boolean;
  };
  layout: 'compact' | 'card';
  startOfWeek: number; // 0-6 (Sunday-Saturday)
}
