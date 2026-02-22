# Miller-Rabin 素性检测

## 算法原理

Miller-Rabin 是一种概率性素性检测算法，用于判断一个大数是否为素数。

## 费马小定理

如果 p 是素数，a 是任意整数，则：
$$a^{p-1} \equiv 1 \pmod{p}$$

## 算法步骤

1. 将 n-1 写成 $2^r \cdot d$ 的形式（d 为奇数）
2. 随机选择底数 a（2 ≤ a ≤ n-2）
3. 验证以下条件之一成立：
   - $a^d \equiv 1 \pmod{n}$ 或
   - $a^{2^j \cdot d} \equiv -1 \pmod{n}$ 对某个 j (0 ≤ j < r)

## 代码实现

```cpp
#include <cstdlib>
#include <ctime>

using namespace std;

long long mod_pow(long long a, long long d, long long mod) {
    long long res = 1;
    while (d) {
        if (d & 1) res = (__int128)res * a % mod;
        a = (__int128)a * a % mod;
        d >>= 1;
    }
    return res;
}

bool miller_rabin(long long n) {
    if (n < 2) return false;
    if (n == 2) return true;
    if (n % 2 == 0) return false;
    
    // 分解 n-1 = 2^r * d
    long long d = n - 1;
    int r = 0;
    while (d % 2 == 0) {
        d /= 2;
        r++;
    }
    
    // 确定性底数（64位整数）
    long long bases[] = {2, 325, 9375, 28178, 450775, 9780504, 1795265022};
    
    for (long long a : bases) {
        if (a % n == 0) continue;
        
        long long x = mod_pow(a, d, n);
        if (x == 1 || x == n - 1) continue;
        
        bool cont = false;
        for (int i = 1; i < r; i++) {
            x = (__int128)x * x % n;
            if (x == n - 1) {
                cont = true;
                break;
            }
        }
        if (cont) continue;
        return false;
    }
    return true;
}
```

## 确定性版本

对于 64 位整数，只需测试以下 7 个底数即可保证正确：
{2, 325, 9375, 28178, 450775, 9780504, 1795265022}
