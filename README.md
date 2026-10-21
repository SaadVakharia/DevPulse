# ⚡ DevPulse — Modern Developer Productivity Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Pure Vanilla JS](https://img.shields.io/badge/Built%20With-Vanilla%20JS%20%7C%20HTML5%20%7C%20CSS3-f7df1e.svg)](https://developer.mozilla.org)
[![Zero Config](https://img.shields.io/badge/Dependencies-0%20(Pure%20Web%20APIs)-purple.svg)](#)

> An open-source, modular, client-side developer dashboard featuring real-time GitHub activity analytics, a Web Audio Pomodoro focus engine with synthesized ambient soundscapes, priority sprint tasks, and a live Markdown scratchpad with file export.

Developed as a collaborative Open Source Group Project for the **Recent Open Source Project Lab (ROSPL)** course under the **University of Mumbai**.

---

## 🚀 Key Features

- **🐙 GitHub Activity Pulse (`modules/github.js`)**:
  - Live query of any GitHub developer profile via the GitHub REST API (zero authentication key required).
  - Displays avatar, bio, follower metrics, public repositories, and top updated repositories with star counts and language indicators.
- **⏱️ Focus Engine & Ambient Synthesizer (`modules/pomodoro.js`)**:
  - 25/5/15 Pomodoro work/break interval cycles with visual progress track.
  - Zero-dependency soundscapes generated dynamically using the **Web Audio API**: Raindrops (brownian noise), White noise, 40Hz Gamma binaural beats, and Ocean waves.
  - Harmonic chime notifications upon session completion.
- **✅ Sprint Tasks & Action Items (`modules/tasks.js`)**:
  - Daily prioritized task manager (High, Medium, Low) with local persistence and dynamic status filtering (All, Pending, Completed).
- **📝 Live Markdown Scratchpad (`modules/notes.js`)**:
  - Split-screen live preview with instant markdown rendering (headings, codeblocks, checklists, quotes).
  - Toolbar text injection and word counter.
  - One-click `.md` file download for developer logs.
- **🌓 Adaptive Theme & State Store (`store.js` & `main.css`)**:
  - Sleek Cyber Glassmorphism UI with smooth light/dark toggle.
  - Reactive pub-sub global state management persisted automatically via `localStorage`.
  - Global productivity shortcuts: `/` to search GitHub, `Space` to toggle Pomodoro.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Markup** | HTML5 Semantic Elements | Accessible document outline and accessibility tags |
| **Styles** | Vanilla CSS3 (Custom Design Tokens) | Glassmorphism, backdrop filters, CSS Grid & Flexbox, smooth animations |
| **Logic** | Vanilla JavaScript (ES6+ Modules) | Decoupled modular architecture without external framework overhead |
| **Audio** | HTML5 Web Audio API | Client-side sound synthesis (noise buffers & oscillators) |
| **APIs** | GitHub REST API v3 | Real-time developer data fetch without mandatory tokens |
| **Storage** | Browser `localStorage` | Offline state synchronization and zero-database setup |

---

## 📂 Project Architecture

```
DevPulse/
├── index.html              # Main application markup & shell
├── LICENSE                 # MIT License
├── README.md               # Project documentation
├── CONTRIBUTING.md         # Team branching & PR contribution guidelines
├── css/
│   ├── main.css            # Design tokens, glassmorphism, responsive grid
│   ├── github.css          # GitHub explorer & repo card styles
│   ├── pomodoro.css        # Timer rings & audio controls
│   └── tasks-notes.css     # Task checklist & markdown styles
└── js/
    ├── app.js              # Central application bootstrap & shortcuts
    ├── store.js            # Reactive state store & LocalStorage engine
    └── modules/
        ├── github.js       # GitHub REST API fetch & profile render
        ├── pomodoro.js     # Timer logic & Web Audio synthesizer
        ├── tasks.js        # Sprint task management & filters
        └── notes.js        # Markdown parser & .md file exporter
```

---

## ⚡ Quick Start

DevPulse has **zero npm dependencies** and requires **no build step**. It runs natively in any modern web browser!

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/DevPulse.git
   cd DevPulse
   ```

2. **Open the project:**
   - Either double click `index.html` to open directly in your browser.
   - Or run with a local server (e.g. VS Code **Live Server** extension, or `python -m http.server 3000`).

3. Open `http://localhost:3000` (or `http://127.0.0.1:5500`) in your browser.

---

## 👥 Contributors & Team Roles (ROSPL)

This project was built collaboratively by a team of 4 engineering students:

- **Member 1 (Lead Developer)**: Core Application Architecture, Glassmorphism Design System, Global Store (`app.js`, `store.js`, `main.css`).
- **Member 2**: GitHub REST API Analytics & Repository Explorer Module (`modules/github.js`, `css/github.css`).
- **Member 3**: Focus Pomodoro Engine & Web Audio Soundscape Synthesizer (`modules/pomodoro.js`, `css/pomodoro.css`).
- **Member 4**: Sprint Task Kanban & Live Markdown Scratchpad Module (`modules/tasks.js`, `modules/notes.js`, `css/tasks-notes.css`).

See [CONTRIBUTING.md](CONTRIBUTING.md) for individual branch logs and pull request history.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
