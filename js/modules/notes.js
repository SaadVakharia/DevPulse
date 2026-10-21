/**
 * DevPulse - Live Markdown Scratchpad & Code Notes Module
 * Module: Markdown Parsing & Note Exporting
 * Contributor: Member 4
 */

import { store } from '../store.js';

export class NotesModule {
  constructor() {
    this.editor = document.getElementById('notesEditor');
    this.preview = document.getElementById('notesPreview');
    this.toggleModeBtn = document.getElementById('toggleNoteModeBtn');
    this.previewLabel = document.getElementById('previewModeLabel');
    this.exportBtn = document.getElementById('exportNoteMdBtn');
    this.wordCountLabel = document.getElementById('notesWordCount');
    this.toolbar = document.querySelector('.notes-toolbar');

    this.isPreviewMode = false;
    this.debounceTimer = null;

    this.init();
  }

  init() {
    const savedNotes = store.getState().notes?.content || '';
    this.editor.value = savedNotes;
    this.updateStats();
    this.bindEvents();
  }

  bindEvents() {
    // Input typing with debounce
    this.editor.addEventListener('input', () => {
      this.updateStats();
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        store.setState('notes.content', this.editor.value);
      }, 400);
    });

    // Toggle Preview / Edit mode
    this.toggleModeBtn.addEventListener('click', () => {
      this.togglePreview();
    });

    // Export .md file
    this.exportBtn.addEventListener('click', () => {
      this.exportMarkdownFile();
    });

    // Toolbar actions
    if (this.toolbar) {
      this.toolbar.addEventListener('click', (e) => {
        const btn = e.target.closest('.tool-btn');
        if (!btn) return;
        const tag = btn.dataset.tag;
        this.insertFormatting(tag);
      });
    }
  }

  togglePreview() {
    this.isPreviewMode = !this.isPreviewMode;
    if (this.isPreviewMode) {
      this.preview.innerHTML = this.parseMarkdown(this.editor.value);
      this.preview.classList.remove('hidden');
      this.editor.style.display = 'none';
      this.previewLabel.textContent = 'Edit';
      this.toggleModeBtn.querySelector('i').className = 'fa-solid fa-pen-to-square';
    } else {
      this.preview.classList.add('hidden');
      this.editor.style.display = 'block';
      this.editor.focus();
      this.previewLabel.textContent = 'Preview';
      this.toggleModeBtn.querySelector('i').className = 'fa-regular fa-eye';
    }
  }

  insertFormatting(type) {
    if (this.isPreviewMode) {
      this.togglePreview(); // Switch back to edit mode to format
    }

    const start = this.editor.selectionStart;
    const end = this.editor.selectionEnd;
    const selected = this.editor.value.substring(start, end);
    let replacement = '';

    switch (type) {
      case 'bold':
        replacement = `**${selected || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selected || 'italic text'}*`;
        break;
      case 'heading':
        replacement = `\n## ${selected || 'Heading'}\n`;
        break;
      case 'code':
        replacement = selected.includes('\n')
          ? `\n\`\`\`javascript\n${selected || '// code here'}\n\`\`\`\n`
          : `\`${selected || 'code'}\``;
        break;
      case 'list':
        replacement = `\n- ${selected || 'List item'}\n`;
        break;
      case 'task':
        replacement = `\n- [ ] ${selected || 'New task item'}\n`;
        break;
      default:
        return;
    }

    this.editor.setRangeText(replacement, start, end, 'end');
    this.updateStats();
    store.setState('notes.content', this.editor.value);
  }

  updateStats() {
    const text = this.editor.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    this.wordCountLabel.textContent = `${words} words`;
  }

  exportMarkdownFile() {
    const content = this.editor.value;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DevPulse_Notes_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /* Lightweight, Secure Client-side Markdown to HTML Parser */
  parseMarkdown(md) {
    if (!md) return '<p class="text-dim">No content to preview.</p>';

    // Escape raw HTML first for security
    let html = md.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));

    // Code blocks ```code```
    html = html.replace(/```([a-z]*)\n([\s\S]*?)```/gm, (match, lang, code) => {
      return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
    });

    // Inline code `code`
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold & Italic
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Task items - [ ] and - [x]
    html = html.replace(/^\s*-\s*\[x\]\s+(.*)/gim, '<p><i class="fa-solid fa-square-check text-accent"></i> $1</p>');
    html = html.replace(/^\s*-\s*\[\s\]\s+(.*)/gim, '<p><i class="fa-regular fa-square"></i> $1</p>');

    // Bullet lists
    html = html.replace(/^\s*-\s+(.*)/gim, '<li>$1</li>');
    html = html.replace(/(<li>[\s\S]*?<\/li>)/gm, '<ul>$1</ul>');

    // Paragraph line breaks
    html = html.replace(/\n\n+/g, '<br><br>');

    return html;
  }
}
