// storage.js
const DB_NAME = 'ChekiAppDB';
const STORE_NAME = 'photos';
const DB_VERSION = 1;

export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// 写真を保存してIDを返す
export async function savePhoto(blob) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add({ blob, createdAt: new Date() });
    request.onsuccess = () => resolve(request.result); // 採番されたID
    request.onerror = () => reject(request.error);
  });
}

// IDを指定して写真を取得
export async function getPhoto(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(Number(id));
    request.onsuccess = () => resolve(request.result ? request.result.blob : null);
    request.onerror = () => reject(request.error);
  });
}
