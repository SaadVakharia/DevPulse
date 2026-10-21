/**
 * DevPulse - GitHub Developer Analytics & Profile Module
 * Module: GitHub REST API Integration
 * Contributor: Member 2
 */

import { store } from '../store.js';

export class GitHubModule {
  constructor() {
    this.form = document.getElementById('ghUserForm');
    this.input = document.getElementById('ghUsernameInput');
    this.container = document.getElementById('ghProfileContainer');
    this.statusDot = document.getElementById('ghStatusDot');
    this.fetchBtn = document.getElementById('ghFetchBtn');

    this.init();
  }

  init() {
    // Form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = this.input.value.trim();
      if (username) {
        this.fetchDeveloperProfile(username);
      }
    });

    // Load initial user from store or default
    const savedUser = store.getState().github?.lastUser || 'torvalds';
    this.input.value = savedUser;
    this.fetchDeveloperProfile(savedUser);
  }

  showLoading() {
    this.container.innerHTML = `
      <div class="gh-skeleton">
        <div style="height: 20px; width: 60%; background: rgba(255,255,255,0.06); border-radius: 4px;"></div>
        <div style="height: 14px; width: 40%; background: rgba(255,255,255,0.04); border-radius: 4px;"></div>
        <div style="height: 60px; width: 100%; background: rgba(255,255,255,0.03); border-radius: 4px;"></div>
      </div>
    `;
    if (this.fetchBtn) {
      this.fetchBtn.disabled = true;
      this.fetchBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
    }
  }

  hideLoading() {
    if (this.fetchBtn) {
      this.fetchBtn.disabled = false;
      this.fetchBtn.innerHTML = `<span>Fetch</span> <i class="fa-solid fa-arrow-right"></i>`;
    }
  }

  async fetchDeveloperProfile(username) {
    this.showLoading();
    try {
      // 1. Fetch user profile
      const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
      
      if (userRes.status === 404) {
        throw new Error(`GitHub user "${username}" was not found.`);
      }
      if (userRes.status === 403) {
        throw new Error(`GitHub API rate limit exceeded. Please try again in a few minutes.`);
      }
      if (!userRes.ok) {
        throw new Error(`Failed to fetch user data (HTTP ${userRes.status})`);
      }

      const userData = await userRes.json();

      // 2. Fetch top recent repos
      let reposData = [];
      try {
        const repoRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=4`);
        if (repoRes.ok) {
          reposData = await repoRes.json();
        }
      } catch (repoErr) {
        console.warn('Could not fetch repos', repoErr);
      }

      // Save to store
      store.setState('github.lastUser', username);
      store.setState('github.cache', { userData, reposData });

      // Render
      this.renderProfile(userData, reposData);

    } catch (err) {
      this.renderError(err.message);
    } finally {
      this.hideLoading();
    }
  }

  renderProfile(user, repos) {
    const reposListHtml = repos.length > 0
      ? repos.map(repo => `
          <a href="${repo.html_url}" target="_blank" rel="noopener" class="gh-repo-card">
            <div>
              <div class="gh-repo-name" title="${repo.name}">
                <i class="fa-regular fa-folder-closed text-accent"></i> ${this.escapeHtml(repo.name)}
              </div>
              <p class="gh-repo-desc">${this.escapeHtml(repo.description || 'No description provided')}</p>
            </div>
            <div class="gh-repo-footer">
              <span class="gh-repo-lang">
                <span class="gh-lang-dot" style="background: ${this.getLanguageColor(repo.language)}"></span>
                ${repo.language || 'Plain'}
              </span>
              <span class="gh-repo-stars">
                <i class="fa-solid fa-star" style="color: #eab308;"></i> ${repo.stargazers_count}
              </span>
            </div>
          </a>
        `).join('')
      : `<p class="text-dim" style="font-size: 0.8rem;">No public repositories found.</p>`;

    this.container.innerHTML = `
      <div class="gh-profile-header">
        <img src="${user.avatar_url}" alt="${this.escapeHtml(user.login)}" class="gh-avatar">
        <div class="gh-meta">
          <div class="gh-name">
            ${this.escapeHtml(user.name || user.login)}
            <a href="${user.html_url}" target="_blank" rel="noopener" class="btn-ghost" title="View on GitHub" style="font-size: 0.85rem; padding: 2px 6px;">
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
          <div class="gh-login">@${this.escapeHtml(user.login)} ${user.location ? `• 📍 ${this.escapeHtml(user.location)}` : ''}</div>
          <p class="gh-bio">${this.escapeHtml(user.bio || 'Developer on GitHub')}</p>
        </div>
      </div>

      <div class="gh-stats-row">
        <div class="gh-stat-box">
          <span class="gh-stat-num">${user.public_repos.toLocaleString()}</span>
          <span class="gh-stat-lbl">Repos</span>
        </div>
        <div class="gh-stat-box">
          <span class="gh-stat-num">${user.followers.toLocaleString()}</span>
          <span class="gh-stat-lbl">Followers</span>
        </div>
        <div class="gh-stat-box">
          <span class="gh-stat-num">${user.following.toLocaleString()}</span>
          <span class="gh-stat-lbl">Following</span>
        </div>
        <div class="gh-stat-box">
          <span class="gh-stat-num">${user.public_gists.toLocaleString()}</span>
          <span class="gh-stat-lbl">Gists</span>
        </div>
      </div>

      <div class="gh-repos-section">
        <div class="gh-section-title">
          <i class="fa-solid fa-book-bookmark text-accent"></i> Recent Public Repositories
        </div>
        <div class="gh-repo-list">
          ${reposListHtml}
        </div>
      </div>
    `;
  }

  renderError(message) {
    this.container.innerHTML = `
      <div class="gh-error-msg">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span>${this.escapeHtml(message)}</span>
      </div>
    `;
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

  getLanguageColor(lang) {
    const colors = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Python: '#3572A5',
      C: '#555555',
      'C++': '#f34b7d',
      Java: '#b07219',
      Rust: '#dea584',
      Go: '#00ADD8'
    };
    return colors[lang] || '#06b6d4';
  }
}
