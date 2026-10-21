/**
 * DevPulse - Sprint Tasks & Action Items Module
 * Module: Task State & Kanban Operations
 * Contributor: Member 4
 */

import { store } from '../store.js';

export class TasksModule {
  constructor() {
    this.form = document.getElementById('newTaskForm');
    this.input = document.getElementById('newTaskInput');
    this.prioritySelect = document.getElementById('taskPrioritySelect');
    this.container = document.getElementById('taskListContainer');
    this.badge = document.getElementById('tasksCountBadge');
    this.clearBtn = document.getElementById('clearCompletedTasksBtn');
    this.filterBtns = document.querySelectorAll('.task-filter-tabs .filter-btn');

    this.currentFilter = 'all'; // 'all' | 'pending' | 'completed'

    this.init();
  }

  init() {
    this.render();
    this.bindEvents();

    // Subscribe to store updates for tasks
    store.subscribe('tasks', () => {
      this.render();
    });
  }

  bindEvents() {
    // Add new task
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = this.input.value.trim();
      if (!text) return;

      const priority = this.prioritySelect.value;
      this.addTask(text, priority);
      this.input.value = '';
    });

    // Clear completed
    this.clearBtn.addEventListener('click', () => {
      this.clearCompleted();
    });

    // Filters
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.render();
      });
    });

    // Delegated actions (toggle complete, delete)
    this.container.addEventListener('click', (e) => {
      const item = e.target.closest('.task-item');
      if (!item) return;
      const id = item.dataset.id;

      if (e.target.classList.contains('task-checkbox')) {
        this.toggleTask(id);
      } else if (e.target.closest('.task-del-btn')) {
        this.deleteTask(id);
      }
    });
  }

  getTasks() {
    return store.getState().tasks || [];
  }

  addTask(text, priority) {
    const tasks = this.getTasks();
    const newTask = {
      id: Date.now().toString(),
      text,
      priority,
      completed: false,
      createdAt: Date.now()
    };
    const updated = [newTask, ...tasks];
    store.setState('tasks', updated);
  }

  toggleTask(id) {
    const tasks = this.getTasks();
    const updated = tasks.map(t => {
      if (t.id === id) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    store.setState('tasks', updated);
  }

  deleteTask(id) {
    const tasks = this.getTasks();
    const updated = tasks.filter(t => t.id !== id);
    store.setState('tasks', updated);
  }

  clearCompleted() {
    const tasks = this.getTasks();
    const updated = tasks.filter(t => !t.completed);
    store.setState('tasks', updated);
  }

  render() {
    const tasks = this.getTasks();
    const completedCount = tasks.filter(t => t.completed).length;
    this.badge.textContent = `${completedCount}/${tasks.length} Done`;

    // Filter tasks
    let filtered = tasks;
    if (this.currentFilter === 'pending') {
      filtered = tasks.filter(t => !t.completed);
    } else if (this.currentFilter === 'completed') {
      filtered = tasks.filter(t => t.completed);
    }

    if (filtered.length === 0) {
      this.container.innerHTML = `
        <li class="empty-state">
          <i class="fa-regular fa-clipboard" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block; opacity: 0.4;"></i>
          No ${this.currentFilter === 'all' ? '' : this.currentFilter} tasks found.
        </li>
      `;
      return;
    }

    this.container.innerHTML = filtered.map(t => `
      <li class="task-item ${t.completed ? 'completed' : ''}" data-id="${t.id}">
        <input type="checkbox" class="task-checkbox" ${t.completed ? 'checked' : ''} aria-label="Mark task done">
        <span class="task-text">${this.escapeHtml(t.text)}</span>
        <span class="task-priority-tag priority-${t.priority}">${t.priority}</span>
        <button class="task-del-btn" title="Delete Task" aria-label="Delete Task">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </li>
    `).join('');
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }
}
