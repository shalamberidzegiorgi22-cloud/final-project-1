export function readLocalStorage(key, fallbackValue, isValid = () => true) {
  if (typeof window === 'undefined') return fallbackValue;

  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null) return fallbackValue;

    const parsedValue = JSON.parse(storedValue);
    return isValid(parsedValue) ? parsedValue : fallbackValue;
  } catch (error) {
    console.error(`Unable to read "${key}" from localStorage.`, error);
    return fallbackValue;
  }
}

export function writeLocalStorage(key, value) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Unable to save "${key}" to localStorage.`, error);
  }
}
