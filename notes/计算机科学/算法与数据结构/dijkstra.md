# Dijkstra 最短路径算法

## 算法概述

Dijkstra 算法用于计算图中从一个起点到所有其他节点的最短路径。

## 核心思想

1. 维护一个集合 S，包含已确定最短距离的顶点
2. 每次从集合 V-S 中选择距离最小的顶点加入 S
3. 更新该顶点相邻顶点的距离

## 代码实现

```cpp
#include <vector>
#include <queue>
#include <climits>

using namespace std;

vector<int> dijkstra(int n, int src, vector<vector<pair<int,int>>>& adj) {
    vector<int> dist(n, INT_MAX);
    dist[src] = 0;
    
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
    pq.push({0, src});
    
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}
```

## 时间复杂度

- 使用优先队列：O((V+E) log V)
- V 为顶点数，E 为边数
