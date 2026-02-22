// 笔记数据 - 与 index.html 同步
const repoOwner = 'Yanxi456';
const repoName = 'Yanxi456.github.io';
const noteCategories = ['数学', '计算机科学', '工程'];
const useGitHubApi = location.hostname.endsWith('github.io');
let notesData = {};

async function fetchRepoTree() {
  const repoResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}`);
  if (!repoResponse.ok) {
    throw new Error('无法获取仓库信息');
  }
  const repoInfo = await repoResponse.json();
  const branch = repoInfo.default_branch;
  const treeResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/trees/${branch}?recursive=1`);
  if (!treeResponse.ok) {
    throw new Error('无法获取仓库目录');
  }
  const treeInfo = await treeResponse.json();
  return treeInfo.tree || [];
}

function isNoteFile(path) {
  return /\.(md|markdown|pdf)$/i.test(path);
}

function formatNoteTitle(relativePath) {
  const parts = relativePath.split('/');
  const fileName = parts.pop() || '';
  const baseName = fileName.replace(/\.[^/.]+$/, '');
  const titleParts = parts.concat(baseName).map(part => part.replace(/[_-]+/g, ' '));
  return titleParts.join(' / ');
}

function buildNotesData(tree) {
  const data = {};
  noteCategories.forEach(category => {
    data[category] = [];
  });
  tree.forEach(item => {
    if (item.type !== 'blob') return;
    const category = noteCategories.find(name => item.path.startsWith(`notes/${name}/`));
    if (!category) return;
    if (!isNoteFile(item.path)) return;
    const relativePath = item.path.slice(`notes/${category}/`.length);
    const title = formatNoteTitle(relativePath);
    data[category].push({
      title,
      file: item.path,
      isPdf: /\.pdf$/i.test(item.path),
      tags: [],
    });
  });
  noteCategories.forEach(category => {
    data[category].sort((a, b) => a.title.localeCompare(b.title, 'zh-Hans-CN'));
  });
  return data;
}

async function loadNotesData() {
  try {
    const tree = await fetchRepoTree();
    return buildNotesData(tree);
  } catch (error) {
    console.warn(error);
    const fallback = {};
    noteCategories.forEach(category => {
      fallback[category] = [];
    });
    return fallback;
  }
}

function getLocalFallbackNotesData() {
  const data = {};
  noteCategories.forEach(category => {
    data[category] = [];
  });

  data['数学'].push(
    {
      title: formatNoteTitle('数论与数学/jacobi.md'),
      file: 'notes/数学/数论与数学/jacobi.md',
      isPdf: false,
      tags: ['数论', '二次剩余', '密码学'],
    },
    {
      title: formatNoteTitle('数论与数学/miller-rabin.md'),
      file: 'notes/数学/数论与数学/miller-rabin.md',
      isPdf: false,
      tags: ['数论', '素数', '概率算法'],
    },
    {
      title: formatNoteTitle('理论随笔/essay.md'),
      file: 'notes/数学/理论随笔/essay.md',
      isPdf: false,
      tags: ['学习', '数学', '思考'],
    },
  );

  data['计算机科学'].push(
    {
      title: formatNoteTitle('算法与数据结构/dijkstra.md'),
      file: 'notes/计算机科学/算法与数据结构/dijkstra.md',
      isPdf: false,
      tags: ['图论', '最短路径', '优先队列'],
    },
    {
      title: formatNoteTitle('算法与数据结构/tarjan.md'),
      file: 'notes/计算机科学/算法与数据结构/tarjan.md',
      isPdf: false,
      tags: ['图论', 'DFS', '强连通分量'],
    },
    {
      title: formatNoteTitle('算法与数据结构/fenwick.md'),
      file: 'notes/计算机科学/算法与数据结构/fenwick.md',
      isPdf: false,
      tags: ['数据结构', '前缀和', 'BIT'],
    },
  );

  data['工程'].push(
    {
      title: formatNoteTitle('工程实践/README.md'),
      file: 'notes/工程/工程实践/README.md',
      isPdf: false,
      tags: ['工程', '项目管理'],
    },
  );

  return data;
}

// 当前搜索状态
let currentMode = 'all';
let currentResults = [];

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
  if (useGitHubApi) {
    notesData = await loadNotesData();
  } else {
    notesData = getLocalFallbackNotesData();
  }
  initSearch();
  checkUrlParams();
});

// 从 URL 参数获取搜索关键词
function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');
  const category = params.get('category');
  
  if (category) {
    currentMode = category;
    updateModeButtons();
  }
  
  if (query) {
    document.getElementById('search-input').value = query;
    performSearch(query);
  }
}

// 初始化搜索功能
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  
  // 搜索按钮点击
  searchBtn.addEventListener('click', () => {
    performSearch(searchInput.value);
  });
  
  // 回车搜索
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch(searchInput.value);
    }
  });
  
  // 实时搜索（防抖）
  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performSearch(searchInput.value);
    }, 300);
  });
  
  // 分类模式切换
  document.querySelectorAll('.search-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentMode = btn.dataset.mode;
      updateModeButtons();
      performSearch(document.getElementById('search-input').value);
    });
  });
  
  // 返回搜索按钮
  document.getElementById('back-to-search').addEventListener('click', () => {
    document.getElementById('note-viewer').classList.add('hidden');
    document.getElementById('search-results').classList.remove('hidden');
  });
}

// 更新模式按钮状态
function updateModeButtons() {
  document.querySelectorAll('.search-mode-btn').forEach(btn => {
    if (btn.dataset.mode === currentMode) {
      btn.classList.add('border-gray-900', 'text-gray-900');
      btn.classList.remove('border-transparent', 'text-appleSecondary');
    } else {
      btn.classList.remove('border-gray-900', 'text-gray-900');
      btn.classList.add('border-transparent', 'text-appleSecondary');
    }
  });
}

// 执行搜索
async function performSearch(query) {
  const resultsContainer = document.getElementById('search-results');
  
  // 更新 URL 参数
  const url = new URL(window.location);
  if (query) {
    url.searchParams.set('q', query);
  } else {
    url.searchParams.delete('q');
  }
  if (currentMode !== 'all') {
    url.searchParams.set('category', currentMode);
  } else {
    url.searchParams.delete('category');
  }
  window.history.replaceState({}, '', url);
  
  // 空查询显示所有笔记
  if (!query.trim()) {
    await showAllNotes();
    return;
  }
  
  const queryLower = query.toLowerCase();
  const results = [];
  
  // 搜索每个分类下的笔记
  for (const [category, notes] of Object.entries(notesData)) {
    // 按分类过滤
    if (currentMode !== 'all' && category !== currentMode) {
      continue;
    }
    
    for (const note of notes) {
      // 搜索标题、标签
      let matched = false;
      let matchType = '';
      
      if (note.title.toLowerCase().includes(queryLower)) {
        matched = true;
        matchType = 'title';
      } else if (note.tags && note.tags.some(tag => tag.toLowerCase().includes(queryLower))) {
        matched = true;
        matchType = 'tag';
      }
      
      // 全文搜索
      if (!note.isPdf) {
        try {
          const content = await fetchNoteContent(note.file);
          if (content.toLowerCase().includes(queryLower)) {
            matched = true;
            matchType = 'content';
          }
        } catch (e) {
          console.warn(`无法加载笔记: ${note.file}`);
        }
      }
      
      if (matched) {
        results.push({ ...note, category, matchType });
      }
    }
  }
  
  currentResults = results;
  displayResults(results, query);
}

// 显示所有笔记
async function showAllNotes() {
  const results = [];
  
  for (const [category, notes] of Object.entries(notesData)) {
    if (currentMode !== 'all' && category !== currentMode) {
      continue;
    }
    
    for (const note of notes) {
      results.push({ ...note, category, matchType: '' });
    }
  }
  
  currentResults = results;
  displayResults(results, '');
}

// 获取笔记内容
async function fetchNoteContent(file) {
  const response = await fetch(file);
  return await response.text();
}

// 高亮匹配文本
function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
}

// 转义正则特殊字符
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 显示搜索结果
function displayResults(results, query) {
  const container = document.getElementById('search-results');
  
  if (results.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-appleSecondary text-lg">未找到相关笔记</p>
        <p class="text-appleSecondary text-sm mt-2">尝试使用不同的关键词</p>
      </div>
    `;
    return;
  }
  
  let html = `<p class="text-sm text-appleSecondary mb-4">找到 ${results.length} 条结果</p>`;
  
  results.forEach((result, index) => {
    const tagsHtml = result.tags ? result.tags.map(tag => 
      `<span class="inline-block px-2 py-0.5 text-xs bg-gray-100 text-appleSecondary rounded-full mr-1">${tag}</span>`
    ).join('') : '';
    
    const titleHtml = query ? highlightMatch(result.title, query) : result.title;
    const matchTypeText = getMatchTypeText(result.matchType);
    
    html += `
      <div class="search-result p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow" data-index="${index}">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-base font-medium text-appleText">${titleHtml}</h3>
            <p class="text-xs text-appleSecondary mt-1">
              <span class="inline-block px-2 py-0.5 bg-gray-900 text-white rounded mr-2">${result.category}</span>
              ${matchTypeText}
            </p>
            <div class="mt-2">${tagsHtml}</div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-appleSecondary ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  // 添加点击事件
  container.querySelectorAll('.search-result').forEach(el => {
    el.addEventListener('click', () => {
      const index = parseInt(el.dataset.index);
      openNote(results[index]);
    });
  });
}

// 获取匹配类型文本
function getMatchTypeText(matchType) {
  switch (matchType) {
    case 'title': return '标题匹配';
    case 'content': return '内容匹配';
    case 'tag': return '标签匹配';
    default: return '';
  }
}

// 打开笔记
async function openNote(note) {
  const viewer = document.getElementById('note-viewer');
  const results = document.getElementById('search-results');
  const title = document.getElementById('note-title');
  const content = document.getElementById('note-content');
  const pdfContainer = document.getElementById('pdf-container');
  
  results.classList.add('hidden');
  viewer.classList.remove('hidden');
  title.textContent = note.title;
  
  if (note.isPdf) {
    content.classList.add('hidden');
    pdfContainer.classList.remove('hidden');
    document.getElementById('pdf-viewer').src = note.file;
  } else {
    pdfContainer.classList.add('hidden');
    content.classList.remove('hidden');
    content.innerHTML = '<p class="text-appleSecondary">加载中...</p>';
    
    try {
      const response = await fetch(note.file);
      const text = await response.text();
      content.innerHTML = marked.parse(text);
    } catch (error) {
      content.innerHTML = '<p class="text-red-500">无法加载笔记内容</p>';
    }
  }
}

// 静态索引页 fallback - 供 noscript 使用
function renderStaticIndex() {
  const container = document.getElementById('search-results');
  if (container.tagName === 'NOSCRIPT') return;
  
  let html = '<noscript><div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4"><p class="text-yellow-800">JavaScript 已禁用。以下是笔记索引：</p></div></noscript>';
  
  for (const [category, notes] of Object.entries(notesData)) {
    html += `<h3 class="text-lg font-semibold mt-6 mb-3">${category}</h3>`;
    html += '<ul class="space-y-2">';
    
    for (const note of notes) {
      const link = note.isPdf ? note.file : `index.html?note=${encodeURIComponent(note.file)}`;
      html += `<li><a href="${link}" class="text-appleSecondary hover:text-appleText">${note.title}</a></li>`;
    }
    
    html += '</ul>';
  }
  
  container.innerHTML = html;
}
