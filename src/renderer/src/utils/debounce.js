// 防抖函数封装
export function debounce(fn, delay) {
    let timer = null;
    return function () {
      if (timer !== null) clearTimeout(timer);
      timer = setTimeout(() => {
        fn();
      }, delay);
    };
  }