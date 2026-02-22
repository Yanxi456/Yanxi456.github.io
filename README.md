# Yanxi456.github.io · 学习笔记站点 / Study Notes Site

![build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![license](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 🧭 项目简介 · Overview

**ZH:**  
本仓库是个人学习笔记与展示站点，对应 GitHub Pages 主页 `https://yanxi456.github.io`。页面采用原生 HTML + Tailwind CSS CDN + 原生 JavaScript 构建，通过本地 Markdown/PDF 文件驱动内容展示，主要面向网络空间安全与计算机基础学习记录。

**EN:**  
This repository hosts a personal study-notes website served via GitHub Pages (`https://yanxi456.github.io`). It is built with plain HTML, Tailwind CSS (CDN), and vanilla JavaScript, rendering local Markdown/PDF notes for cybersecurity and computer science learning.

### 项目信息 · Project Info

- 名称 Name: **Yanxi456.github.io**
- 描述 Description: 中山大学网络空间安全学院学生学习笔记 / Study notes for cybersecurity and CS
- 作者 Author: **Yanxi456**
- 版本 Version: 静态站点/ Static site, versioned by Git tags
- 许可证 License: MIT

---

## 📁 项目结构 · Project Structure

仓库为纯静态站点结构，无 `package.json`、`src/`、`lib/` 等构建型目录，核心目录如下：

```bash
.
├── index.html                # 主站首页与笔记阅读入口 / Main landing & note viewer
├── search.html               # 笔记搜索独立页面 / Standalone search page
├── search.js                 # 搜索逻辑脚本 / Search logic (filter & viewer)
├── notes/                    # 本地笔记内容（Markdown/PDF）
│   ├── 数学/                 # Mathematics（数论、分析、理论随笔等）
│   ├── 计算机科学/           # Computer Science（算法、系统、安全等）
│   └── 工程/                 # Engineering Practice（项目实践与工具链）
├── logo.svg                  # 顶部导航中的校徽图标
├── sysu_logos_nobg.png       # 备用中大 LOGO 资源
├── README.md                 # 当前文档 / This file
├── CLAUDE.md                 # 辅助说明（与站点运行无强依赖）
└── .gitignore                # Git 忽略规则
```



---

## 🛠 技术栈 · Tech Stack

**前端 · Frontend**

- HTML5 + CSS3
- [Tailwind CSS](https://tailwindcss.com/)（通过 CDN 动态配置 `appleGray/appleText` 等自定义配色）
- 原生 JavaScript（无框架依赖）
- [marked.js](https://github.com/markedjs/marked)：将 Markdown 渲染为 HTML 用于笔记阅读

**运行环境 · Runtime**

- 静态资源托管：GitHub Pages（或任意静态 HTTP 服务器）
- 浏览器支持：现代 Chromium/Firefox/Safari（移动端适配良好）

---

## ✨ 核心功能 · Core Features

1. **学习主页 / Learning Landing Page**
   - 展示学校、学院与 GitHub 个人信息
   - 以卡片形式概览学习方向与当前动态
   - 顶部导航固定，滚动时保持可访问

2. **本地笔记阅读 / Local Notes Viewer**
   - `notes/` 目录下按类别组织 Markdown/PDF 笔记
   - 使用 marked.js 渲染 Markdown，并内嵌展示 PDF
   - 左侧笔记分类导航，统一行距与悬停样式

3. **独立搜索页 / Dedicated Search Page**
   - 入口：主页「学习笔记」卡片中的按钮跳转到 `search.html`
   - 支持按 **标题 / 标签 / 内容（全文）** 即时过滤
   - 按分类（算法与数据结构 / 数论与数学 / 工程实践 / 理论随笔）筛选
   - 点击搜索结果后在同页打开笔记内容或 PDF 预览

4. **静态资源组织 / Static Assets**
   - 学院与学校徽标图标
   - 工程实践目录下的 README 提示如何挂载 PDF 笔记

---

## 🚀 安装与运行 · Installation & Usage

> 本项目为纯静态站点，无 NPM 依赖与构建步骤。  
> This is a purely static site without NPM dependencies or build steps.

### 1. 克隆仓库 · Clone

```bash
git clone https://github.com/Yanxi456/Yanxi456.github.io.git
cd Yanxi456.github.io
```

### 2. 本地预览 · Local Preview

推荐使用任意静态 HTTP 服务器：

**Python**

```bash
python -m http.server 8080
# 浏览器打开 / Open in browser:
# http://localhost:8080
```

**Node（如已全局安装 serve）**

```bash
npx serve -p 8080
```

然后访问：

- 首页 / Home: `http://localhost:8080/index.html`
- 搜索页 / Search: `http://localhost:8080/search.html`

### 3. 笔记目录结构 · Notes Layout

在 `notes/` 下按分类放置 Markdown/PDF 文件，例如：

```bash
notes/
├── 算法与数据结构/
│   ├── dijkstra.md
│   ├── fenwick.md
│   └── tarjan.md
├── 数论与数学/
│   ├── miller-rabin.md
│   └── jacobi.md
├── 理论随笔/
│   └── essay.md
└── 工程实践/
    └── README.md  # 关于如何添加 PDF 的说明
```

在前端脚本中，通过一个类似 `notesData` 的对象登记这些文件路径，即可在站点内导航与搜索。

---

## ⚙️ 环境配置 · Environment Configuration

扫描结果：

- 未检测到 `.env` / `.env.*` 配置文件
- 未检测到 `config/` 目录或独立配置脚本
- 未检测到 `docker-compose.yml`、`Dockerfile`、`Makefile`

因此：

- 环境依赖仅为：任意现代浏览器 + 静态 HTTP 服务
- 若未来需要后端或动态配置，可引入 `.env` 与构建工具（例如 Vite/Next）并在此处补充说明

---

## 📦 部署方式 · Deployment

推荐使用 GitHub Pages（当前仓库即为标准结构）：

1. 将代码推送到 GitHub 仓库 `Yanxi456/Yanxi456.github.io`
2. 在仓库 **Settings → Pages** 中选择 `Deploy from a branch`
3. 选择分支 `main`，目录保持 `/root`
4. 保存后等待几分钟，GitHub Pages 会自动构建静态站点
5. 部署完成后，访问：`https://yanxi456.github.io`

如需自托管：

- 使用 Nginx/Apache 等 Web 服务器，将仓库根目录作为站点根目录即可

---

## 🧪 测试指南 · Testing Guide

当前仓库未包含自动化测试目录（例如 `tests/`、`__tests__/` 等），也未配置 Jest/Vitest 等测试框架。  
测试主要依赖手动浏览器验证：

- 不同浏览器（Chrome / Firefox / Safari）下：
  - 首页布局是否正常、导航是否固定
  - 笔记侧边栏行距是否统一
  - 搜索页输入、分类筛选与结果展示是否正常
- 不同分辨率与缩放比例下：
  - 搜索结果卡片是否适配移动端
  - Markdown 与 PDF 显示区域是否可滚动与可读

未来如引入构建与测试工具，可在此处补充：

```bash
# 示例（未来可能使用）
npm test
```

---

## 📚 文档资源 · Documentation Resources

目前仓库中未检测到顶层 `docs/` 目录，但以下内容可视为内嵌文档：

- `notes/工程实践/README.md`  
  - 说明如何在「工程实践」分类下添加 PDF 笔记  
  - 提供示例目录结构与注意事项

如后续新增 `docs/`、更多 Markdown 说明或教程，可在此处维护索引。

---

## 🔧 脚本工具 · Script Utilities

扫描结果显示仓库根目录未包含 `scripts/` 目录或自动化脚本文件。  
若未来添加数据更新脚本、部署脚本等，推荐结构：

```bash
scripts/
├── deploy.sh          # 一键部署脚本
├── update-notes.py    # 批量处理/转换笔记
└── sync-assets.js     # 静态资源同步脚本
```

并在本节补充脚本说明与使用示例。

---

## 🤝 贡献指南 · Contributing

**ZH:**  
当前仓库以个人使用为主，若发现排版问题、错别字或有更好的交互改进建议，可以通过 Issue 或 Pull Request 提交。建议在提交前：

- 保持代码风格与现有实现一致（Tailwind + 原生 JS）
- 遵循现有目录结构（尤其是 `notes/` 分类）

**EN:**  
This repository is primarily for personal use, but contributions (bug fixes, UI improvements, note organization ideas) are welcome.  
Before opening a PR, please:

- Follow the existing style (Tailwind, vanilla JS)
- Keep the `notes/` structure consistent

---

## 📄 License

License: MIT  
本项目基于 MIT License 开源，你可以自由地使用、复制、修改和分发本仓库内容，但需在分发的副本中保留原作者与许可证声明。 
