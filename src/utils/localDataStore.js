const PREFIX = "codecraftbd:";

const canUseStorage = () => typeof window !== "undefined" && window.localStorage;

const normalizeList = (value) => (Array.isArray(value) ? value : []);

export const getCollection = (key, fallback = []) => {
  if (!canUseStorage()) return normalizeList(fallback);

  const storageKey = `${PREFIX}${key}`;
  const existing = window.localStorage.getItem(storageKey);

  if (!existing) {
    window.localStorage.setItem(storageKey, JSON.stringify(fallback));
    return normalizeList(fallback);
  }

  try {
    return normalizeList(JSON.parse(existing));
  } catch {
    window.localStorage.setItem(storageKey, JSON.stringify(fallback));
    return normalizeList(fallback);
  }
};

export const setCollection = (key, data) => {
  const collection = normalizeList(data);

  if (canUseStorage()) {
    window.localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(collection));
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("codecraft:data-change", { detail: key }));
  }
  return collection;
};

export const getSettingsData = (fallback) => {
  if (!canUseStorage()) return fallback;

  const storageKey = `${PREFIX}settings`;
  const existing = window.localStorage.getItem(storageKey);

  if (!existing) {
    window.localStorage.setItem(storageKey, JSON.stringify(fallback));
    return fallback;
  }

  try {
    return JSON.parse(existing);
  } catch {
    window.localStorage.setItem(storageKey, JSON.stringify(fallback));
    return fallback;
  }
};

export const setSettingsData = (settings) => {
  if (canUseStorage()) {
    window.localStorage.setItem(`${PREFIX}settings`, JSON.stringify(settings));
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("codecraft:data-change", { detail: "settings" }));
  }
  return settings;
};

export const createRecord = (key, fallback, data) => {
  const collection = getCollection(key, fallback);
  const now = new Date().toISOString();
  const record = {
    ...data,
    _id: data._id || Date.now().toString(),
    slug:
      data.slug ||
      data.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ||
      data.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    createdAt: data.createdAt || now,
  };

  setCollection(key, [record, ...collection]);
  return record;
};

export const updateRecord = (key, fallback, id, data) => {
  const collection = getCollection(key, fallback);
  const updated = collection.map((item) =>
    item._id === id ? { ...item, ...data, _id: id, updatedAt: new Date().toISOString() } : item,
  );
  setCollection(key, updated);
  return updated.find((item) => item._id === id);
};

export const deleteRecord = (key, fallback, id) => {
  const collection = getCollection(key, fallback);
  setCollection(
    key,
    collection.filter((item) => item._id !== id),
  );
};

export const findBySlug = (key, fallback, slug) =>
  getCollection(key, fallback).find((item) => item.slug === slug);

export const findById = (key, fallback, id) =>
  getCollection(key, fallback).find((item) => item._id === id);
