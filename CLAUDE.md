# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Yanxi456.github.io is a personal GitHub Pages website with a minimalist Apple-inspired aesthetic, showcasing 中山大学网络空间安全学院 (SYSU School of Cyberscience and Technology) identity. The project is a single-file static HTML application serving as an entry point to learning notes.

## Architecture

```
index.html         # Single-file homepage: HTML + Tailwind CSS
     |
     +-- logo.svg  # Branding: SYSU logo
```

### Key Components

| Component | Purpose | Technology |
|-----------|---------|------------|
| **index.html** | Main page with minimalist UI and Giscus comments | HTML5 + Tailwind CSS (CDN) |
| **logo.svg** | Branding asset | SVG |

### External Resources

- **Notes Repository**: [Yanxi456/notes](https://github.com/Yanxi456/notes) - Contains learning notes with Markdown, LaTeX math formulas, and code highlighting

## Development Commands

### Local Development

```bash
# Serve the site locally
python -m http.server 8000
# or
npx serve .
```

Then visit http://localhost:8000

### Git Workflow

```bash
# Commit and push changes
git add .
git commit -m "message"
git push origin main
```

## Visual Design

The UI uses a minimalist Apple-inspired aesthetic:

- **Background**: Pure white (#ffffff) or subtle gradient
- **Text**: Dark gray (#1d1d1f) for primary, medium gray (#86868b) for secondary
- **Typography**: System fonts (-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto)
- **Cards**: White background with subtle shadows and rounded corners
- **Spacing**: Generous whitespace for breathing room
- **Interactions**: Smooth transitions, subtle hover effects

## GitHub Pages Deployment

The site is deployed via GitHub Pages from the repository root:

1. Repository Settings > Pages > Source is set to `main` branch
2. `index.html` exists at repository root
3. All assets (logo.svg) are committed

## Giscus Comments Integration

Giscus is embedded for discussions:

- Uses GitHub Discussions for storage
- Requires `data-repo`, `data-repo-id`, `data-category`, `data-category-id` configuration
- Set `data-theme="light"` to match the minimalist aesthetic

## Notes Format

The learning notes in the external repository support:

- **Markdown**: Standard markdown syntax
- **LaTeX Math**: MathJax/KaTeX for rendering mathematical formulas (e.g., `$$...$$` or `\(...\)`)
- **Code Highlighting**: Support for multiple languages (cpp, python, etc.)
