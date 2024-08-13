export const throttle = (fn: Function, delay: number) => {
  let last = 0;
  return function (...args: any) {
    const now = Date.now();
    if (now - last > delay) {
      last = now;
      fn(...args);
    }
  };
};
