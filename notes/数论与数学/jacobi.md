# Jacobi 符号

## 定义

Jacobi 符号是勒让德符号的推广，用于判断奇整数 n 的平方剩余情况。

## 勒让德符号

对于奇素数 p 和整数 a：
$$\left(\frac{a}{p}\right) = \begin{cases} 1 & \text{如果 } a \text{ 是模 } p \text{ 的二次剩余} \\ -1 & \text{如果 } a \text{ 是模 } p \text{ 的二次非剩余} \\ 0 & \text{如果 } p \mid a \end{cases}$$

## Jacobi 符号

$$\left(\frac{a}{n}\right) = \left(\frac{a}{p_1}\right)^{\alpha_1} \cdots \left(\frac{a}{p_k}\right)^{\alpha_k}$$

其中 $n = p_1^{\alpha_1} \cdots p_k^{\alpha_k}$ 为质因数分解。

## 重要性质

1. **互反律**：
$$\left(\frac{m}{n}\right) = \left(\frac{n}{m}\right) \cdot (-1)^{\frac{(m-1)(n-1)}{4}}$$

2. **乘法性**：
$$\left(\frac{ab}{n}\right) = \left(\frac{a}{n}\right) \left(\frac{b}{n}\right)$$

## 代码实现

```cpp
long long jacobi(long long a, long long n) {
    if (a == 0) return 0;
    if (a == 1) return 1;
    
    int sign = 1;
    while (a != 0) {
        // 处理因子 2
        int t = __builtin_ctzll(a);  // a 中 2 的因子个数
        a >>= t;
        
        if (t % 2 == 1) {
            long long n8 = n % 8;
            if (n8 == 3 || n8 == 5) sign = -sign;
        }
        
        // 互反律
        if ((a & 3) == 3 && (n & 3) == 3) sign = -sign;
        
        swap(a, n);
        a %= n;
    }
    
    return n == 1 ? sign : 0;
}
```

## 应用

- **Solovay-Strassen 素性检测**
- **判断二次剩余**（辅助判断）
