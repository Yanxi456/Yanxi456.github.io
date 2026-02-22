# Tarjan 强连通分量算法

## 算法概述

Tarjan 算法用于在线性时间内找出有向图中的所有强连通分量（SCC）。

## 核心概念

- **强连通**：两个顶点 u 和 v，如果存在从 u 到 v 和从 v 到 u 的路径，则称它们强连通
- **强连通分量**：图中的极大强连通子图

## 算法思想

使用 DFS 遍历图，维护两个数组：
- `dfn[u]`：节点 u 的发现时间
- `low[u]`：节点 u 能追溯到的最小发现时间

当 `low[u] == dfn[u]` 时，以 u 为根的搜索树构成一个强连通分量。

## 代码实现

```cpp
#include <vector>
#include <stack>
#include <algorithm>

using namespace std;

class Tarjan {
    int n, timeCnt, sccCnt;
    vector<vector<int>> adj;
    vector<int> dfn, low, inStack;
    stack<int> st;
    vector<vector<int>> sccs;
    
public:
    Tarjan(int n) : n(n), timeCnt(0), sccCnt(0) {
        adj.resize(n);
        dfn.assign(n, -1);
        low.assign(n, 0);
        inStack.assign(n, 0);
    }
    
    void addEdge(int u, int v) {
        adj[u].push_back(v);
    }
    
    vector<vector<int>> getSCCs() {
        for (int i = 0; i < n; i++) {
            if (dfn[i] == -1) dfs(i);
        }
        return sccs;
    }
    
private:
    void dfs(int u) {
        dfn[u] = low[u] = timeCnt++;
        st.push(u);
        inStack[u] = 1;
        
        for (int v : adj[u]) {
            if (dfn[v] == -1) {
                dfs(v);
                low[u] = min(low[u], low[v]);
            } else if (inStack[v]) {
                low[u] = min(low[u], dfn[v]);
            }
        }
        
        if (low[u] == dfn[u]) {
            vector<int> scc;
            while (true) {
                int v = st.top(); st.pop();
                inStack[v] = 0;
                scc.push_back(v);
                if (v == u) break;
            }
            sccs.push_back(scc);
        }
    }
};
```

## 时间复杂度

O(V + E)，每个顶点和边仅访问一次
