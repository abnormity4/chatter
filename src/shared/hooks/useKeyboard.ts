import { useEffect } from 'react';

const useKeyboard = (
  keys: string[],
  callback: () => void,
  removeAfter: boolean = false,
) => {
  const normalizedKeys = keys.map((key) => key.toLowerCase());

  const removeEvent = () => {
    document.removeEventListener('keypress', handleKeypress);
  };

  const handleKeypress = (event: KeyboardEvent) => {
    if (normalizedKeys.includes(event.key.toLowerCase())) {
      callback();

      if (removeAfter) {
        removeEvent();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keypress', handleKeypress);

    return () => {
      removeEvent();
    };
  }, [keys]);
};

export default useKeyboard;
