/**
 * @description Throttle function to limit the number of times a function can be called in a given time frame
 * @param {*} func
 * @param {*} timeFrame
 * @returns
 */
export function throttle(func, timeFrame) {
  let lastTime = 0;

  return function (...args) {
    const now = new Date();

    if (now - lastTime >= timeFrame) {
      func(...args);
      lastTime = now;
    }
  };
}
