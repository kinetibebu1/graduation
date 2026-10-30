import { IBrowserStorage, StorageOperationResult } from "@/types/storage";

const STORAGE_PREFIX = "studyhabit:v1:";

/**
 * Checks whether localStorage is available and functional in the current environment.
 */
function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const testKey = `${STORAGE_PREFIX}__probe__`;
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

class SafeBrowserStorage implements IBrowserStorage {
  private prefix: string;

  constructor(prefix: string = STORAGE_PREFIX) {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Safely retrieves an item from localStorage with graceful fallback on SSR, missing keys,
   * JSON parsing failures, or failed validation.
   */
  getItem<T>(
    key: string,
    fallback: T,
    validate?: (value: unknown) => value is T
  ): StorageOperationResult<T> {
    if (!isLocalStorageAvailable()) {
      return {
        success: false,
        data: fallback,
        isFallback: true,
        error: "Storage not available in this environment (SSR or restricted)",
      };
    }

    const fullKey = this.getKey(key);

    try {
      const rawValue = window.localStorage.getItem(fullKey);

      if (rawValue === null) {
        return {
          success: true,
          data: fallback,
          isFallback: true,
        };
      }

      const parsed: unknown = JSON.parse(rawValue);

      if (validate && !validate(parsed)) {
        console.warn(
          `[StudyHabit Storage] Data validation failed for key "${fullKey}". Using fallback.`,
          parsed
        );
        return {
          success: false,
          data: fallback,
          isFallback: true,
          error: "Stored data does not match expected schema",
        };
      }

      return {
        success: true,
        data: parsed as T,
        isFallback: false,
      };
    } catch (err) {
      console.warn(
        `[StudyHabit Storage] Error reading key "${fullKey}". Falling back safely.`,
        err
      );
      return {
        success: false,
        data: fallback,
        isFallback: true,
        error: err instanceof Error ? err.message : "Failed to parse stored data",
      };
    }
  }

  /**
   * Safely sets an item in localStorage, handling quota errors and serialized types.
   */
  setItem<T>(key: string, value: T): boolean {
    if (!isLocalStorageAvailable()) {
      return false;
    }

    const fullKey = this.getKey(key);

    try {
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(fullKey, serialized);
      return true;
    } catch (err) {
      console.error(
        `[StudyHabit Storage] Failed to write key "${fullKey}" to storage.`,
        err
      );
      return false;
    }
  }

  /**
   * Safely removes a specific key.
   */
  removeItem(key: string): boolean {
    if (!isLocalStorageAvailable()) {
      return false;
    }

    try {
      window.localStorage.removeItem(this.getKey(key));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Clears all keys belonging to this namespace without touching other app or browser data.
   */
  clearNamespace(customPrefix?: string): boolean {
    if (!isLocalStorageAvailable()) {
      return false;
    }

    const targetPrefix = customPrefix ?? this.prefix;

    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(targetPrefix)) {
          keysToRemove.push(key);
        }
      }

      for (const key of keysToRemove) {
        window.localStorage.removeItem(key);
      }
      return true;
    } catch {
      return false;
    }
  }
}

export const safeStorage = new SafeBrowserStorage();
export { isLocalStorageAvailable };
