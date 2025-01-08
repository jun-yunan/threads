import { useState, useEffect } from 'react';

/**
 * Custom hook để xử lý debounce cho giá trị đầu vào.
 * @param value - Giá trị đầu vào cần được debounce.
 * @param delay - Thời gian trì hoãn tính bằng mili giây.
 * @returns - Giá trị đầu vào sau khi đã debounce.
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
