function isPrime(n) {
    // 1 和负数不是质数
    if (n <= 1) return false;

    // 2 和 3 是质数
    if (n <= 3) return true;

    // 排除偶数和3的倍数
    if (n % 2 === 0 || n % 3 === 0) return false;

    // 检查从5开始，步长为6的数
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) {
            return false;
        }
    }

    // 如果没有找到因数，则是质数
    return true;
}

function nextPrime(n) {
    let num = n + 1; // 从 n 的下一个数开始检查
    while (!isPrime(num)) {
        num++;
    }
    return num;
}

//检测字符串是否只包含整数,是则返回该整数,否则返回false
function extractInteger(str) {
    // 使用正则表达式检查是否是整数
    const match = /^-?\d+$/.exec(str);

    if (match) {
        return parseInt(str, 10);  // 如果是整数，返回该整数
    } else {
        return false;  // 如果不是整数，返回 false
    }
}


function isPerfectSquare(n) {
    if (n < 0) return false;  // 负数不是平方数

    const sqrt = Math.sqrt(n);  // 求平方根
    if (Number.isInteger(sqrt)) {
        return sqrt;  // 如果平方根是整数，返回它
    } else {
        return false;  // 不是平方数，返回 false
    }
}
