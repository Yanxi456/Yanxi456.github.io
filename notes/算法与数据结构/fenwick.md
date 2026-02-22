# 树状数组（Fenwick Tree）

## 概述

树状数组是一种高效的数据结构，用于维护序列的前缀和，支持：
- 单点更新：O(log n)
- 区间查询：O(log n)

## 核心思想

通过二进制分解，将数组划分为不同大小的区间块。

## 代码实现

```cpp
class Fenwick {
    int n;
    vector<int> bit;
    
public:
    Fenwick(int n) : n(n), bit(n + 1, 0) {}
    
    // 更新：给位置 idx 增加 val
    void update(int idx, int val) {
        for (; idx <= n; idx += idx & -idx) {
            bit[idx] += val;
        }
    }
    
    // 查询：前缀和 [1, idx]
    int query(int idx) {
        int res = 0;
        for (; idx > 0; idx -= idx & -idx) {
            res += bit[idx];
        }
        return res;
    }
    
    // 区间和 [l, r]
    int rangeQuery(int l, int r) {
        return query(r) - query(l - 1);
    }
};
```

## 应用场景

1. 动态前缀和
2. 逆序对计数
3. 区间修改 + 区间查询（需要两个树状数组）
4. 维护第 k 小/大的数
