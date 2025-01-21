// 节流函数封装
export function throttle(fn, delay, immediate = false) {
    let timer = null;
    let called = false;
    return function () {
        if (immediate && !called) {
            fn.apply(this, arguments);
            called = true;
            timer = setTimeout(() => {
                called = false;
            }, delay);
        } else if (!timer) {
            timer = setTimeout(() => {
                fn.apply(this, arguments);
                timer = null;
            }, delay);
        }
    };
}