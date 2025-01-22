export async function delay(duration) {
    // 创建一个 Promise，使用 setTimeout 来实现延迟 1 秒
    await new Promise(resolve => setTimeout(resolve, duration));
}
