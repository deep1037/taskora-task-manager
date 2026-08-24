# 📋 TASKORA — Modern Productivity Dashboard & Task Manager

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Geometric%20Design%20Tokens-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic%20%26%20Accessible-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Internship](https://img.shields.io/badge/Codveda%20Internship-Level%201%20Task%203-5B6CFF)](https://github.com)

> **TASKORA** is a sleek, modern productivity SaaS dashboard engineered with pure **Vanilla HTML5, CSS3, and JavaScript (ES6+)**. Built with crisp geometric design principles, balanced neutral surfaces, and micro-interactions, TASKORA delivers an intuitive, fast, and feature-complete task management experience with zero external runtime dependencies.

---

## 🌟 Live Demo & Preview

- **Preview Dashboard**: Clean, responsive Notion/Linear-inspired productivity workspace with real-time statistics, natural date calculations, multi-filter querying, and full persistence.

---

## 🚀 Key Features

### 1. ⏱ Dynamic Greeting & Time-Aware Dashboard Header
- **Time-Sensitive Greetings**: Automatically greets users with `"Good Morning"`, `"Good Afternoon"`, `"Good Evening"`, or `"Good Night"`.
- **Dynamic Productivity Status**: Real-time message reflecting unfinished tasks (e.g., *"You have 5 tasks remaining today."* or *"You're all caught up!"*).
- **Motivational State Indicator**: Context-sensitive motivational pill with emojis reacting to completion rate:
  - *`0%` — `✨ Let's make some progress today.`*
  - *`≥50%` — `🚀 Great progress. Keep the momentum going!`*
  - *`100%` — `🎉 Amazing! You've completed everything for today.`*
- **Live Formatted Date Badge**: Displays current day & date (e.g., *"Monday, August 24"*).

### 2. 📊 Live Progress Tracking & Animated Metric Counters
- **Daily Progress Bar**: Real-time progress bar calculated dynamically as `(completed / total) * 100%` with smooth cubic-bezier transitions.
- **Typographic Number Ticker**: Eased JavaScript counter animations when task counts change across `Total Tasks`, `Active`, and `Completed` metric cards.

### 3. 🎯 Natural Relative Date Engine
- Intelligent date parsing calculating real-time calendar day offsets:
  - **`Today`** (Highlighted accent)
  - **`Tomorrow`**
  - **`1 day overdue`** / **`X days overdue`** (Highlighted danger alert)
  - Standard formatted dates (e.g., **`Aug 28`**, **`Sep 02`**)

### 4. 🔍 Multi-Dimensional Filter & Live Search with Keyword Highlighting
- **Sidebar Categorization**:
  - `Dashboard` / `All Tasks`
  - `Important` (Filters for High Priority items)
  - `Completed` (Archive view)
  - Workspaces: `Study`, `Work`, `Personal`
- **Status Tabs**: Instant switching between `All`, `Active`, and `Completed`.
- **Priority Filter**: Instant dropdown selector for `All Priorities`, `High`, `Medium`, and `Low`.
- **Real-Time Search Highlighting**: Live matching search query with `<mark>` highlight tags inside task titles and instant clear button (`✕`).

### 5. 🗂 Complete Task CRUD & Interactive Modals
- **Create Task**: Comprehensive dialog with field validation (Title, Category, Priority, Due Date).
- **Edit Task**: Pre-filled modal to update task metadata seamlessly.
- **Delete Confirmation Modal**: Custom danger modal preventing accidental deletion.
- **Three-Dot Action Dropdown Menu**: Accessible dropdown menu per task row with click-outside detection.
- **Custom Animated Checkboxes**: Smooth SVG checkmark drawing & bounce micro-animations.

### 6. ⌨️ Keyboard Shortcuts
- <kbd>N</kbd> — Open Create New Task modal from anywhere.
- <kbd>/</kbd> — Focus search bar immediately.
- <kbd>Esc</kbd> — Close any active modal, dialog, or dropdown menu.
- <kbd>Enter</kbd> — Submit active modal forms.

### 7. 🔔 Toast Notification System & Data Management
- Floating bottom-right toast notifications for all major user actions (Task Created, Updated, Deleted, Status Toggled).
- Auto-dismisses in 3 seconds with smooth slide-up and fade transitions.
- **Workspace Settings**: Reset to 12 pre-seeded sample SaaS tasks or clear completed tasks in one click.
- **Full LocalStorage Persistence**: Changes persist across page reloads and browser sessions.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Structure** | **HTML5** | Semantic, accessible markup (`<header>`, `<main>`, `<aside>`, `<section>`, ARIA roles) |
| **Styling** | **CSS3** | Geometric design tokens (CSS variables), CSS Grid & Flexbox, micro-animations |
| **Typography** | **Google Fonts** | `Plus Jakarta Sans` for clean SaaS typography & `JetBrains Mono` for shortcuts |
| **Logic & Engine**| **Vanilla JavaScript (ES6+)** | Modular state management, Event delegation, Date engine, LocalStorage API |
| **Build & Dev Tooling** | **Vite / Node.js** | Fast local development server and build pipeline |

---

## 📁 Project Structure

```
├── index.html            # Main HTML application file
├── css/
│   └── style.css         # Complete Geometric Balance design system & responsive styling
├── js/
│   └── script.js         # Core application logic, state, DOM rendering & event handlers
├── taskora/              # Standalone distribution package
│   ├── index.html
│   ├── css/style.css
│   └── js/script.js
├── metadata.json         # Project metadata and configuration
├── package.json          # Development server dependencies & npm scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite build & development server configuration
└── README.md             # Project documentation
```

---

## 💻 Getting Started & Local Development

### Option 1: Run with Vite Dev Server (Recommended)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/taskora-productivity-dashboard.git
   cd taskora-productivity-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

### Option 2: Run as Pure Static HTML/CSS/JS

Since TASKORA is built with pure Vanilla JavaScript, HTML5, and CSS3, you can also run it directly without any build tool:

1. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).
2. Alternatively, use VS Code's **Live Server** extension:
   - Right click `index.html` → Click **"Open with Live Server"**.

---

## 🎨 Design System & Visual Highlights

- **Aesthetic**: Geometric Balance & Clean SaaS Dashboard.
- **Palette**:
  - App Background: `#F7F7F5`
  - Sidebar & Card Background: `#FFFFFF`
  - Accent Color: `#5B6CFF` (Indigo geometric accent)
  - Text Primary: `#191919`
  - Success / Complete: `#16A34A`
  - Warning / Medium Priority: `#D97706`
  - Danger / High Priority: `#DC2626`
- **Typography Hierarchy**: Structured headings with tight letter-spacing (`-0.03em`) and tabular numeric metrics.

---

## 📋 Codveda Internship Context

This project was built for the **Codveda Web Development Internship**:
- **Track**: Web Development Internship
- **Level**: Level 1
- **Task**: Task 3 — *Introduction to JavaScript (DOM Manipulation, Events, Dynamic UI, Local Storage)*
- **Developer**: Deepak
- **Role**: Codveda Intern

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
