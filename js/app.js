/**
 * DevPulse - Main Orchestrator & Application Bootstrap
 * Contributor: Member 1 (Lead Developer)
 */

import { store } from './store.js';
import { GitHubModule } from './modules/github.js';
import { PomodoroModule } from './modules/pomodoro.js';
import { TasksModule } from './modules/tasks.js';
import { NotesModule } from './modules/notes.js';

class DevPulseApp {
  constructor() {
    this.themeToggleBtn = document.getElementById('themeToggleBtn');
    this.clockTimeEl = document.getElementById('clockTime');
    this.clockDateEl = document.getElementById('clockDate');
    this.quickGithubBtn = document.getElementById('quickGithubBtn');

    this.init();
  }

  init() {
    console.log('⚡ Initializing DevPulse OSS Dashboard...');

    // 1. Setup Theme
    this.initTheme();

    // 2. Setup Live Clock
    this.initClock();

    // 3. Initialize Sub-modules
    try {
      this.github = new GitHubModule();
      this.pomodoro = new PomodoroModule();
      this.tasks = new TasksModule();
      this.notes = new NotesModule();
    } catch (e) {
      console.error('Error during module instantiation:', e);
    }

    // 4. Setup Global Keyboard Shortcuts & Event Listeners
    this.bindGlobalShortcuts();

    console.log('✅ DevPulse initialized successfully!');
  }

  initTheme() {
    const savedTheme = store.getState().theme || 'dark';
    this.applyTheme(savedTheme);

    this.themeToggleBtn.addEventListener('click', () => {
      const current = document.body.classList.contains('theme-light') ? 'light' : 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      this.applyTheme(next);
      store.setState('theme', next);
    });
  }

  applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      this.themeToggleBtn.innerHTML = `<i class="fa-solid fa-sun" style="color: #f59e0b;"></i>`;
    } else {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
      this.themeToggleBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
    }
  }

  initClock() {
    const update = () => {
      const now = new Date();
      
      // Time format HH:MM:SS
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      this.clockTimeEl.textContent = `${hours}:${mins}:${secs}`;

      // Date format: Mon, Oct 21
      const options = { weekday: 'short', month: 'short', day: '2-digit' };
      this.clockDateEl.textContent = now.toLocaleDateString('en-US', options);
    };

    update();
    setInterval(update, 1000);
  }

  bindGlobalShortcuts() {
    // Quick GitHub Search button
    if (this.quickGithubBtn) {
      this.quickGithubBtn.addEventListener('click', () => {
        const ghInput = document.getElementById('ghUsernameInput');
        ghInput.focus();
        ghInput.select();
      });
    }

    // Global keyboard listeners
    window.addEventListener('keydown', (e) => {
      // Don't trigger if user is actively typing in an input or textarea
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      // "/" key focuses the GitHub search input
      if (e.key === '/') {
        e.preventDefault();
        const ghInput = document.getElementById('ghUsernameInput');
        ghInput.focus();
        ghInput.select();
      }

      // "Space" key toggles the Pomodoro timer
      if (e.code === 'Space') {
        e.preventDefault();
        this.pomodoro?.toggleTimer();
      }
    });
  }
}

// Bootstrap once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DevPulseApp();
});
