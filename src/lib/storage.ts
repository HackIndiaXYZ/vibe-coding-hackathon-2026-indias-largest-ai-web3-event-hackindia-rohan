import localforage from "localforage";

const docsStore = localforage.createInstance({
  name: "sahayak-ai",
  storeName: "documents",
});

const profileStore = localforage.createInstance({
  name: "sahayak-ai",
  storeName: "profiles",
});

export async function saveDocument(id: string, data: unknown): Promise<void> {
  await docsStore.setItem(id, data);
}

export async function getDocument<T>(id: string): Promise<T | null> {
  return docsStore.getItem<T>(id);
}

export async function getAllDocuments<T>(): Promise<T[]> {
  const items: T[] = [];
  await docsStore.iterate<T, void>((value) => { items.push(value); });
  return items;
}

export async function removeDocument(id: string): Promise<void> {
  await docsStore.removeItem(id);
}

export async function saveProfile(id: string, data: unknown): Promise<void> {
  await profileStore.setItem(id, data);
}

export async function getProfile<T>(id: string): Promise<T | null> {
  return profileStore.getItem<T>(id);
}

export async function clearAll(): Promise<void> {
  await docsStore.clear();
  await profileStore.clear();
}
