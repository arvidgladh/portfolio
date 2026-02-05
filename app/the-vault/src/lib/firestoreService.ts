// Mockad Firestore-service: lagrar data i memory + localStorage

import {
  HistoricalMonth,
  Subscription,
  Transaction,
  UserSettings,
} from "./firestoreSchema";

type Listener<T> = (value: T) => void;

type UserStore = {
  transactions: Transaction[];
  subscriptions: Subscription[];
  userSettings: UserSettings | null;
  historicalData: HistoricalMonth[];
};

const memoryStore = new Map<string, UserStore>();
const STORAGE_PREFIX = "vault_store_";

const txListeners = new Map<string, Set<Listener<Transaction[]>>>();
const subsListeners = new Map<string, Set<Listener<Subscription[]>>>();
const settingsListeners = new Map<string, Set<Listener<UserSettings | null>>>();
const historyListeners = new Map<string, Set<Listener<HistoricalMonth[]>>>();

function generateId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function getInitialStore(): UserStore {
  return {
    transactions: [],
    subscriptions: [],
    userSettings: null,
    historicalData: [],
  };
}

function readFromStorage(userId: string): UserStore | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + userId);
    if (!raw) return null;
    return JSON.parse(raw) as UserStore;
  } catch (err) {
    console.warn("Failed to read local store", err);
    return null;
  }
}

function persist(userId: string) {
  if (typeof window === "undefined") return;
  const store = memoryStore.get(userId);
  if (!store) return;
  try {
    window.localStorage.setItem(
      STORAGE_PREFIX + userId,
      JSON.stringify(store)
    );
  } catch (err) {
    console.warn("Failed to persist local store", err);
  }
}

function getStore(userId: string): UserStore {
  const existing = memoryStore.get(userId);
  if (existing) return existing;

  const fromLocal = readFromStorage(userId);
  const next = fromLocal ?? getInitialStore();
  memoryStore.set(userId, next);
  return next;
}

function registerListener<T>(
  map: Map<string, Set<Listener<T>>>,
  userId: string,
  listener: Listener<T>
) {
  const set = map.get(userId) ?? new Set<Listener<T>>();
  set.add(listener);
  map.set(userId, set);
}

function removeListener<T>(
  map: Map<string, Set<Listener<T>>>,
  userId: string,
  listener: Listener<T>
) {
  const set = map.get(userId);
  if (!set) return;
  set.delete(listener);
  if (set.size === 0) {
    map.delete(userId);
  } else {
    map.set(userId, set);
  }
}

function notify<T>(
  map: Map<string, Set<Listener<T>>>,
  userId: string,
  payload: T
) {
  const set = map.get(userId);
  if (!set) return;
  set.forEach((cb) => cb(payload));
}

// ---------------------------------------------------------------------------
// TRANSACTIONS
// ---------------------------------------------------------------------------

export async function createTransaction(
  userId: string,
  data: Transaction
) {
  const store = getStore(userId);
  const newTx: Transaction = {
    ...data,
    id: generateId("tx"),
    createdAt: Date.now(),
  };
  store.transactions = [newTx, ...store.transactions];
  memoryStore.set(userId, store);
  persist(userId);
  notify(txListeners, userId, store.transactions);
  return newTx;
}

export function listenToTransactions(
  userId: string,
  callback: (items: Transaction[]) => void
) {
  const store = getStore(userId);
  callback(store.transactions);
  registerListener(txListeners, userId, callback);
  return () => removeListener(txListeners, userId, callback);
}

// ---------------------------------------------------------------------------
// SUBSCRIPTIONS
// ---------------------------------------------------------------------------

export async function createSubscription(
  userId: string,
  data: Subscription
) {
  const store = getStore(userId);
  const newSub: Subscription = {
    ...data,
    id: generateId("sub"),
    createdAt: Date.now(),
  };
  store.subscriptions = [...store.subscriptions, newSub];
  memoryStore.set(userId, store);
  persist(userId);
  notify(subsListeners, userId, store.subscriptions);
  return newSub;
}

export function listenToSubscriptions(
  userId: string,
  callback: (items: Subscription[]) => void
) {
  const store = getStore(userId);
  callback(store.subscriptions);
  registerListener(subsListeners, userId, callback);
  return () => removeListener(subsListeners, userId, callback);
}

// ---------------------------------------------------------------------------
// USER SETTINGS
// ---------------------------------------------------------------------------

export function listenToUserSettings(
  userId: string,
  callback: (settings: UserSettings | null) => void
) {
  const store = getStore(userId);
  callback(store.userSettings);
  registerListener(settingsListeners, userId, callback);
  return () => removeListener(settingsListeners, userId, callback);
}

export async function upsertUserSettings(
  userId: string,
  data: UserSettings
) {
  const store = getStore(userId);
  store.userSettings = { ...(store.userSettings ?? {} as UserSettings), ...data };
  memoryStore.set(userId, store);
  persist(userId);
  notify(settingsListeners, userId, store.userSettings);
}

// ---------------------------------------------------------------------------
// HISTORICAL MONTH AGGREGATES
// ---------------------------------------------------------------------------

export function listenToHistoricalData(
  userId: string,
  callback: (items: HistoricalMonth[]) => void
) {
  const store = getStore(userId);
  callback(store.historicalData);
  registerListener(historyListeners, userId, callback);
  return () => removeListener(historyListeners, userId, callback);
}

export async function saveHistoricalMonth(
  userId: string,
  month: string,
  data: Omit<HistoricalMonth, "month">
) {
  const store = getStore(userId);
  const existingIdx = store.historicalData.findIndex(
    (h) => h.month === month
  );
  const entry: HistoricalMonth = { month, ...data };
  if (existingIdx >= 0) {
    store.historicalData[existingIdx] = entry;
  } else {
    store.historicalData.push(entry);
  }
  store.historicalData.sort((a, b) => a.month.localeCompare(b.month));
  memoryStore.set(userId, store);
  persist(userId);
  notify(historyListeners, userId, store.historicalData);
}
