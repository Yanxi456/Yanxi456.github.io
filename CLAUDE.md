# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Yanxi456.github.io is a personal GitHub Pages website with a cyberpunk/neon aesthetic, showcasing中山大学网络空间安全学院 (SYSU School of Cyberscience and Technology) identity. The project is a single-file static HTML application with dynamic code statistics tracking via GitHub API and automated GitHub Actions workflow.

## Architecture

The project follows a simple three-component architecture:

```
index.html (51KB)         # Single-file application: HTML + Tailwind + JS + ECharts
     |
     +-- stats.json       # Data source: time-series code line counts
     |
     +-- update_stats.py  # Backend: GitHub API script for statistics
     |
     +-- .github/workflows/update-stats.yml  # Automation: scheduled CI/CD
```

### Key Components

| Component | Purpose | Technology |
|-----------|---------|------------|
| **index.html** | Main page with cyberpunk UI, ECharts chart, and Giscus comments | HTML5 + Tailwind CSS (CDN) + ECharts (CDN) + Vanilla JS |
| **update_stats.py** | Fetches code frequency data from GitHub API and updates stats.json | Python 3.x + requests |
| **stats.json** | Time-series data for code line visualization | JSON |
| **update-stats.yml** | Runs stats script daily and commits results | GitHub Actions |
| **logo.svg**, **sysu_logos_nobg.png** | Branding assets | SVG, PNG |

## Development Commands

### Local Development

```bash
# Serve the site locally (any HTTP server)
python -m http.server 8000
# or
npx serve .
```

### Running Statistics Script Locally

```bash
# Set GitHub token for higher API rate limits
export GH_TOKEN="your_github_token_here"  # or GITHUB_TOKEN

# Run the stats script
python update_stats.py
```

### Git Workflow

```bash
# Commit and push changes
git add .
git commit -m "message"
git push origin main
```

## GitHub Actions

The `.github/workflows/update-stats.yml` workflow:

- **Triggers**: Daily at 02:00 UTC, on manual dispatch, and on pushes to `main`
- **Permissions**: Requires `contents: write` to commit stats.json updates
- **Concurrency**: Prevents multiple runs from conflicting
- **Environment Variables**: Uses `GH_TOKEN` secret for GitHub API access

## Important Design Patterns

### Cyberpunk Visual System

The UI uses a consistent cyberpunk aesthetic implemented through Tailwind CDN configuration:

```javascript
// Tailwind theme extension in index.html
colors: {
  neonCyan: '#0ff',
  neonPink: '#ff00ff',
  neonPurple: '#b388ff',
  darkBg: '#050816',
}
```

- **Scanlines**: CSS animation with linear gradient overlay
- **Noise layer**: Grain effect via external SVG background
- **Neon shadows**: Custom `shadow-neon-cyan` and `shadow-neon-pink` classes
- **Glass cards**: `backdrop-blur` with glowing borders

### ECharts Integration

The chart (`#code-chart`) loads data from `stats.json`:

```javascript
fetch('stats.json')
  .then(r => r.json())
  .then(data => {
    // Map dates and total_lines to ECharts series
    // Apply neon color scheme (cyan/pink gradient)
  })
```

### update_stats.py Logic

The Python script follows this flow:

1. **Authentication**: Uses `GH_TOKEN` or `GITHUB_TOKEN` environment variable for API access
2. **Repository Fetching**: Gets all `type=owner`, `fork=false` repositories via `/user/repos`
3. **Code Frequency**: For each repo, calls `/repos/{owner}/{repo}/stats/code_frequency`
   - Returns `[[week_ts, additions, deletions], ...]`
   - Handles HTTP 202 (calculating) with retries and backoff
   - Falls back to `/languages` API if code_frequency fails
4. **Line Calculation**: Accumulates `additions - deletions` for total estimate
5. **Data Update**: Upserts current date's record into `stats.json`, sorted by date

### Error Handling

- **API 202**: Retry up to 5 times with 8-second backoff
- **API 204**: Treat as 0 lines (empty repo)
- **Missing stats.json**: Create new file on first run
- **JSON corruption**: Reset to empty array with warning

## GitHub Pages Deployment

The site is deployed via GitHub Pages from the repository root. Ensure:

1. Repository Settings > Pages > Source is set to `main` branch
2. `index.html` exists at repository root
3. All assets (logo.svg, sysu_logos_nobg.png) are committed

## Giscus Comments Integration

Giscus is embedded at the bottom of the page for discussions:

- Uses GitHub Discussions for storage
- Requires `data-repo`, `data-repo-id`, `data-category`, `data-category-id` configuration
- Set `data-theme="dark"` to match cyberpunk aesthetic
