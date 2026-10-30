export interface StorageOperationResult<T> {
  success: boolean;
  data: T;
  error?: string;
  isFallback: boolean;
}

export interface IBrowserStorage {
  getItem<T>(key: string, fallback: T): StorageOperationResult<T>;
  setItem<T>(key: string, value: T): boolean;
  removeItem(key: string): boolean;
  clearNamespace(namespacePrefix: string): boolean;
}
