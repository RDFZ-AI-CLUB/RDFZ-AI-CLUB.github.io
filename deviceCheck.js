function isMobileDevice() {
    // 使用正则表达式匹配常见的移动设备标识符
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android/i.test(userAgent) || /iPhone|iPad|iPod/i.test(userAgent);
}

// 如果是移动端设备，跳转到指定页面
if (isMobileDevice()) {
    window.location.href = "/m.html";  // 移动端跳转到这个 URL
}