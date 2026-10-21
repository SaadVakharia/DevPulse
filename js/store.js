/**
 * DevPulse - Central Shared State & Storage Engine
 * Module: Core State Architecture
 * Contributor: Member 1 (Lead Developer)
 */

class DevPulseStore {
  constructor() {
    this.STORAGE_KEY = 'DEVPULSE_STATE_V1';
    this.listeners = new Map();

    // Default State Template
    this.defaultState = {
      theme: 'dark',
      github: {
        lastUser: 'torvalds',
        cache: null
      },
      pomodoro: {
        currentMode: 'pomodoro', // 'pomodoro' | 'shortBreak' | 'longBreak'
        timeLeft: 25 * 60,
        isRunning: false,
        sessionsCompleted: 0,
        ambientSound: 'off',
        ambientVolume: 40
      },
      tasks: [
        { id: '1', text: 'Clone repository and setup dev environment', priority: 'high', completed: true, createdAt: Date.now() - 3600000 },
        { id: '2', text: 'Implement GitHub REST API fetch module', priority: 'high', completed: true, createdAt: Date.now() - 1800000 },
        { id: '3', text: 'Test Web Audio API ambient noise generator', priority: 'medium', completed: false, createdAt: Date.now() },
        { id: '4', text: 'Review team Pull Requests for ROSPL milestone', priority: 'medium', completed: false, createdAt: Date.now() }
      ],
      notes: {
        content: `# DevPulse Quick Notes\n\n- Welcome to **DevPulse**!\n- Modular open-source dashboard.\n- Track GitHub stars, sprint tasks, and stay in deep work mode.\n\n\`\`\`js\nconsole.log("Ready to ship!");\n\`\`\``
      }
    };

    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return { ...this.defaultState, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not read state from localStorage, using defaults', e);
    }
    return { ...this.defaultState };
  }

  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }

  getState() {
    return this.state;
  }

  setState(path, value) {
    const keys = path.split('.');
    let current = this.state;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    this.saveState();
    this.notify(path, value);
  }

  subscribe(path, callback) {
    if (!this.listeners.has(path)) {
      this.listeners.set(path, new Set());
    }
    this.listeners.get(path).add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(path)?.delete(callback);
    };
  }

  notify(path, value) {
    if (this.listeners.has(path)) {
      this.listeners.get(path).forEach(cb => cb(value, this.state));
    }
    // Also notify wildcard root subscribers
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(cb => cb(path, value, this.state));
    }
  }
}

export const store = new DevPulseStore();
