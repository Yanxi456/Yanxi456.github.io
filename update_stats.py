import json
import os
from datetime import datetime, timezone
import time
from typing import Any, Dict, List, Optional

import requests


GITHUB_API_BASE = "https://api.github.com"
STATS_FILE = "stats.json"


def get_session() -> requests.Session:
    session = requests.Session()
    token = os.getenv("GH_TOKEN") or os.getenv("GITHUB_TOKEN")

    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "Yanxi456-stats-script",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    else:
        print("[warn] GH_TOKEN / GITHUB_TOKEN 未设置，将以未授权方式访问 GitHub API（速率限制较低）")

    session.headers.update(headers)
    return session


def fetch_all_repos(session: requests.Session) -> List[Dict[str, Any]]:
    """
    获取当前 Token 所属用户的所有仓库（owner 身份），过滤 fork 仓库。
    """
    repos: List[Dict[str, Any]] = []
    page = 1

    print("[info] 开始获取仓库列表（type=owner, fork=false）...")

    while True:
        params = {
            "per_page": 100,
            "page": page,
            "type": "owner",
            "sort": "full_name",
            "direction": "asc",
        }
        resp = session.get(f"{GITHUB_API_BASE}/user/repos", params=params, timeout=30)
        if resp.status_code != 200:
            print(f"[error] 获取仓库失败: HTTP {resp.status_code} {resp.text}")
            break

        batch = resp.json()
        if not batch:
            break

        repos.extend(batch)
        print(f"[info] 已获取 {len(repos)} 个仓库条目...")
        page += 1

    non_fork_repos = [r for r in repos if not r.get("fork")]
    print(f"[info] 过滤 fork 后，非 fork 仓库数量: {len(non_fork_repos)}")
    return non_fork_repos


def fetch_repo_code_frequency(
    session: requests.Session,
    owner: str,
    name: str,
    retries: int = 5,
    backoff_seconds: int = 8,
) -> Optional[List[List[int]]]:
    """
    使用 /stats/code_frequency 接口获取某仓库每周的增删行统计。
    返回格式为 [[week_unix_timestamp, additions, deletions], ...]
    若处于计算中可能返回 202，此时返回 None 并跳过该仓库。
    """
    url = f"{GITHUB_API_BASE}/repos/{owner}/{name}/stats/code_frequency"

    for attempt in range(1, retries + 1):
        resp = session.get(url, timeout=60)

        if resp.status_code == 202:
            # GitHub 正在异步生成统计数据，等待后重试
            if attempt == retries:
                print(f"[warn] 仓库 {owner}/{name} 的统计数据仍在生成（HTTP 202），已达最大重试次数，跳过。")
                return None
            sleep_sec = backoff_seconds
            print(f"[info] 仓库 {owner}/{name} 统计数据生成中（HTTP 202），{sleep_sec}s 后重试 {attempt}/{retries}...")
            time.sleep(sleep_sec)
            continue

        if resp.status_code == 204:
            # 无内容，多见于空仓库或尚无统计数据，返回空数组视为 0 行
            print(f"[warn] 仓库 {owner}/{name} code_frequency 返回 204 No Content，记为 0 行。")
            return []

        if resp.status_code != 200:
            print(f"[warn] 获取 {owner}/{name} code_frequency 失败: HTTP {resp.status_code}")
            return None

        data = resp.json()
        if not isinstance(data, list):
            print(f"[warn] 仓库 {owner}/{name} code_frequency 返回数据格式异常。")
            return None

        return data

    return None


def fetch_repo_languages(session: requests.Session, owner: str, name: str) -> Optional[Dict[str, int]]:
    """
    备用方案：获取语言字节数。这里将字节数粗略转换为“行数”近似值。
    """
    url = f"{GITHUB_API_BASE}/repos/{owner}/{name}/languages"
    resp = session.get(url, timeout=30)
    if resp.status_code != 200:
        print(f"[warn] 获取 {owner}/{name} languages 失败: HTTP {resp.status_code}")
        return None
    data = resp.json()
    if not isinstance(data, dict):
        return None
    return {k: int(v) for k, v in data.items()}


def compute_total_lines(session: requests.Session, repos: List[Dict[str, Any]]) -> int:
    """
    通过累加各仓库 code_frequency 中的 (additions - deletions) 估算总代码行数。
    注意：这是近似值，适合作为可视化趋势使用。
    """
    total_lines = 0

    for repo in repos:
        full_name = repo.get("full_name", "")
        owner = repo.get("owner", {}).get("login", "")
        name = repo.get("name", "")
        if not owner or not name:
            continue

        print(f"[info] 统计仓库: {full_name}")
        freq = fetch_repo_code_frequency(session, owner, name)
        repo_total = 0

        if freq is not None:
            for week in freq:
                if not isinstance(week, list) or len(week) < 3:
                    continue
                _, additions, deletions = week
                # deletions 通常为负数，这里按官方文档，以 additions - deletions 计算净变化
                repo_total += int(additions) - int(deletions)
        else:
            # 备用：用 languages API 的字节数估算行数（假设 50 字节 ≈ 1 行）
            langs = fetch_repo_languages(session, owner, name)
            if langs:
                byte_sum = sum(langs.values())
                repo_total = byte_sum // 50  # 粗略估算
                print(f"[info] 仓库 {full_name} 使用 languages 估算总代码行数: {repo_total}")

        print(f"[info] 仓库 {full_name} 估算总代码行数: {repo_total}")
        total_lines += max(repo_total, 0)

    print(f"[info] 所有仓库估算总代码行数: {total_lines}")
    return max(total_lines, 0)


def load_existing_stats() -> List[Dict[str, Any]]:
    if not os.path.exists(STATS_FILE):
        print("[info] stats.json 不存在，将创建新文件。")
        return []

    try:
        with open(STATS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        if isinstance(data, list):
            return data
        print("[warn] stats.json 内容不是数组，将重置为新数组。")
        return []
    except Exception as e:
        print(f"[error] 读取 stats.json 失败: {e}")
        return []


def save_stats(data: List[Dict[str, Any]]) -> None:
    with open(STATS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[info] stats.json 已更新，共 {len(data)} 条记录。")


def update_stats() -> None:
    session = get_session()
    repos = fetch_all_repos(session)
    if not repos:
        print("[warn] 未找到任何非 fork 仓库，终止统计。")
        return

    total_lines = compute_total_lines(session, repos)

    today = datetime.now(timezone.utc).date().isoformat()
    existing = load_existing_stats()

    # 若当天已有记录，则覆盖；否则追加
    updated = False
    for entry in existing:
        if entry.get("date") == today:
            entry["total_lines"] = total_lines
            updated = True
            break

    if not updated:
        existing.append({"date": today, "total_lines": total_lines})

    # 按日期排序，保证前端读取时有序
    existing.sort(key=lambda x: x.get("date", ""))
    save_stats(existing)


if __name__ == "__main__":
    update_stats()

