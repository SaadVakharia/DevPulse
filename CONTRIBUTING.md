# 🤝 DevPulse — Team Contribution & Pull Request Guide

This document describes the exact Git & GitHub workflow followed by all 4 team members to build, test, and merge contributions into **DevPulse**.

---

## 📌 Team Role & Module Mapping

| Team Member | Module Ownership | Target Branch Name | Files Committed | Pull Request Title |
| :--- | :--- | :--- | :--- | :--- |
| **Member 1** (Lead) | App Shell, Theme, State Engine | `main` & `feat/core-shell` | `index.html`, `css/main.css`, `js/app.js`, `js/store.js` | `feat: setup app shell and central state store` |
| **Member 2** | GitHub Dev Activity Explorer | `feat/github-tracker` | `js/modules/github.js`, `css/github.css` | `feat: integrate GitHub REST API and user profile cards` |
| **Member 3** | Pomodoro & Web Audio Synthesizer | `feat/pomodoro-focus` | `js/modules/pomodoro.js`, `css/pomodoro.css` | `feat: add pomodoro timer engine and web audio ambient soundscapes` |
| **Member 4** | Tasks Kanban & Markdown Scratchpad | `feat/tasks-notes` | `js/modules/tasks.js`, `js/modules/notes.js`, `css/tasks-notes.css` | `feat: add sprint task checklist and live markdown editor` |

---

## 🚀 Step-by-Step GitHub Workflow for Your Team

### Phase 1: Repository Setup (Done by Member 1)

1. Go to [GitHub.com/new](https://github.com/new) and create a new **Public** repository named `DevPulse`.
2. Add the other 3 members as Collaborators:
   - Go to **Settings** > **Collaborators** > **Add people** > invite the 3 teammates.
3. Push the base project:
   ```bash
   cd DevPulse
   git init
   git branch -M main
   git remote add origin https://github.com/<member1-username>/DevPulse.git
   git add index.html css/main.css js/app.js js/store.js LICENSE README.md CONTRIBUTING.md
   git commit -m "feat: initial commit - core shell, design system and reactive state store"
   git push -u origin main
   ```

---

### Phase 2: Feature Branch & Contribution (Members 2, 3, and 4)

Each team member performs these steps on their own PC:

#### Member 2 (GitHub Module)
```bash
# 1. Clone repository
git clone https://github.com/<member1-username>/DevPulse.git
cd DevPulse

# 2. Create and switch to your feature branch
git checkout -b feat/github-tracker

# 3. Add your module files
git add js/modules/github.js css/github.css

# 4. Commit with descriptive conventional message
git commit -m "feat(github): implement REST API profile fetch, star counter and repository cards"

# 5. Push branch to GitHub
git push origin feat/github-tracker
```
*(Now go to GitHub -> Compare & pull request -> Title: `feat: integrate GitHub REST API analytics` -> Assign Member 1 as Reviewer -> Merge!)*

---

#### Member 3 (Pomodoro & Ambient Audio Module)
```bash
# 1. Clone or pull latest main
git clone https://github.com/<member1-username>/DevPulse.git
cd DevPulse
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feat/pomodoro-focus

# 3. Add module files
git add js/modules/pomodoro.js css/pomodoro.css

# 4. Commit
git commit -m "feat(pomodoro): implement timer engine, session tracking and web audio synthesizer"

# 5. Push branch to GitHub
git push origin feat/pomodoro-focus
```
*(Now go to GitHub -> Compare & pull request -> Title: `feat: add focus pomodoro and ambient sound generator` -> Merge!)*

---

#### Member 4 (Tasks & Markdown Notes Module)
```bash
# 1. Clone or pull latest main
git clone https://github.com/<member1-username>/DevPulse.git
cd DevPulse
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feat/tasks-notes

# 3. Add module files
git add js/modules/tasks.js js/modules/notes.js css/tasks-notes.css

# 4. Commit
git commit -m "feat(tasks-notes): add sprint action checklist and live markdown scratchpad with export"

# 5. Push branch to GitHub
git push origin feat/tasks-notes
```
*(Now go to GitHub -> Compare & pull request -> Title: `feat: add task kanban and markdown scratchpad` -> Merge!)*

---

## 📸 Screenshots Needed for Project Report

When completing the workflow above, each member should take screenshots for **Chapter 11 (GitHub Repository & Contribution Graph)**:

1. **Terminal Screenshot**: Showing `git checkout -b <branch>`, `git add`, `git commit`, and `git push`.
2. **GitHub PR Screenshot**: Showing the Open Pull Request with description and file diff.
3. **Merge Pull Request Screenshot**: Showing the green merged badge and "Pull request successfully merged".
4. **Insights / Contributors Graph**: On GitHub, go to **Insights** > **Contributors** to show all 4 member usernames with commit activity.
