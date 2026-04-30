type AnyFunction = (...args: any[]) => any;

export function debounce<T extends AnyFunction>(func: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  } as T & { cancel: () => void };

  debounced.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debounced;
}
