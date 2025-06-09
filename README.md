# 🌱 Habit Tracker

A beautiful, modern habit tracking application built with Angular that helps you build and maintain positive daily habits. Track your progress, analyze your patterns, and stay motivated with comprehensive statistics and insights.

## ✨ Features

### 🎯 Habit Management

- **Create Custom Habits**: Set up personalized habits with flexible frequencies (daily, weekly)
- **Multiple Categories**: Organize habits into Health, Learning, Personal, Spiritual, and Social categories
- **Rich Customization**: Choose from 10+ earth-tone colors and add descriptive tags
- **Habit Templates**: Quick-start with pre-made habit templates for common goals

### 📊 Progress Tracking

- **Daily Dashboard**: View today's habits with completion progress and streak counters
- **Activity Heatmap**: Visual year-long view (52 weeks) of your habit completion patterns
- **Category Performance**: Track completion rates across different habit categories
- **Completion Trends**: 30-day trend analysis with interactive charts

### 🔥 Motivation & Insights

- **Streak Tracking**: Monitor current and longest streaks for each habit
- **Personal Insights**: AI-powered recommendations based on your patterns
- **Progress Statistics**: Comprehensive stats including completion rates and active streaks
- **Visual Progress**: Animated progress rings and charts

### 🧠 Mood & Reflection

- **Mood Tracking**: Log daily mood levels with 5-point scale
- **Energy Monitoring**: Track energy levels and correlate with habit completion
- **Daily Reflection**: Record thoughts and observations about your day
- **Correlation Analysis**: Understand relationships between mood, energy, and habits

### 🎨 Beautiful Design

- **Dark & Light Themes**: Toggle between themes with earth-tone color scheme
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: Delightful transitions and micro-interactions
- **Accessible**: Built with accessibility best practices and ARIA labels

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd habit-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200` to see the application running.

## 📱 How to Use

### Setting Up Your First Habits

1. **Add a New Habit**

   - Click the "+" button on the main dashboard
   - Choose from pre-made templates or create a custom habit
   - Set frequency (daily or weekly)
   - Select a category and color
   - Add optional tags and descriptions

2. **Complete Daily Habits**
   - View today's habits on the main dashboard
   - Click the checkmark to mark habits as complete
   - Watch your progress ring fill up as you complete more habits
   - Build streaks by completing habits consistently

### Tracking Your Progress

3. **View Statistics**

   - Navigate to the "Statistics" page from the dashboard
   - Explore your completion trends over the last 30 days
   - Check category performance to see which areas you excel in
   - Review the activity heatmap for long-term patterns

4. **Monitor Mood & Energy**
   - Click "Track Mood" on the dashboard
   - Rate your mood and energy levels on a 5-point scale
   - Add daily reflections to capture thoughts and insights
   - View correlations between mood, energy, and habit completion

### Customization

5. **Personalize Your Experience**
   - Switch between dark and light themes
   - Customize habit colors and categories
   - Edit or deactivate habits as your routine evolves
   - Use the insights to optimize your habit routine

## 🏗️ Architecture

The application follows modern Angular best practices with a clean architecture:

### Smart/Dumb Component Pattern

- **Container Components**: Handle state management and business logic
- **Presentation Components**: Focus purely on UI rendering and user interactions
- **Service Layer**: Centralized data management and business logic

### Key Services

- **HabitService**: Manages habit CRUD operations and completion tracking
- **StatisticsService**: Calculates trends, insights, and analytics
- **ThemeService**: Handles dark/light theme switching
- **LocalStorageService**: Persists data locally in the browser

### Component Structure

```
src/app/
├── components/
│   ├── habit-dashboard/          # Main dashboard container & component
│   ├── habit-form/               # Habit creation/editing forms
│   ├── habit-card/               # Individual habit display cards
│   ├── habit-stats/              # Statistics and analytics
│   ├── mood-tracker/             # Mood and energy tracking
│   └── reflection/               # Daily reflection component
├── services/                     # Business logic and data management
├── constants/                    # Shared constants and configurations
└── styles.css                    # Global styles and theme variables
```

## 🛠️ Technologies Used

- **Frontend Framework**: Angular 18+
- **Styling**: CSS with custom properties for theming
- **State Management**: Angular Signals for reactive state
- **Data Persistence**: Local Storage with service abstraction
- **Charts & Visualizations**: Custom SVG-based components
- **Icons**: Custom SVG icons and Unicode emojis
- **Responsive Design**: CSS Grid and Flexbox

## 🎯 Development Philosophy

This project demonstrates:

- **Component-Driven Development**: Modular, reusable components
- **Separation of Concerns**: Clear boundaries between presentation and logic
- **Accessibility First**: ARIA labels, semantic HTML, keyboard navigation
- **Performance Optimization**: Lazy loading, computed values, minimal re-renders
- **User Experience**: Smooth animations, instant feedback, intuitive design

## 📈 Future Enhancements

Potential areas for expansion:

- **Data Export**: Export habit data to CSV or PDF
- **Habit Sharing**: Share habits and progress with friends
- **Advanced Analytics**: More detailed insights and goal setting
- **Notifications**: Browser notifications for habit reminders
- **Cloud Sync**: Synchronize data across multiple devices
- **Mobile App**: Native mobile application

## 🤝 Contributing

This is a demonstration project showcasing modern Angular development practices. The codebase serves as an excellent reference for:

- Angular component architecture
- State management patterns
- CSS theming and responsive design
- TypeScript best practices
- Accessibility implementation

## 📄 License

This project is for educational and demonstration purposes.

---

**Start building better habits today!** 🌟

_Track, analyze, and improve your daily routines with this comprehensive habit tracking solution._
