import { useEffect, useState } from "react";

export type ActivityItem = {
  id: string;
  type: "email" | "notes" | "planner" | "research" | "chat";
  title: string;
  content: string;
  createdAt: number;
};

const KEY = "ai-workplace-history";

function read(): ActivityItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ActivityItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: ActivityItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items.slice(0, 100)));
  window.dispatchEvent(new Event("history-updated"));
}

export function addActivity(item: Omit<ActivityItem, "id" | "createdAt">) {
  const items = read();
  const next: ActivityItem = { ...item, id: crypto.randomUUID(), createdAt: Date.now() };
  write([next, ...items]);
  return next;
}

export function clearHistory() {
  write([]);
}

export function useHistory() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  useEffect(() => {
    setItems(read());
    const onUpdate = () => setItems(read());
    window.addEventListener("history-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("history-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);
  return items;
}

// Favourites
const FAV_KEY = "ai-workplace-favs";
export function useFavourites() {
  const [favs, setFavs] = useState<string[]>([]);
  useEffect(() => {
    try {
      setFavs(JSON.parse(localStorage.getItem(FAV_KEY) || "[]"));
    } catch {
      setFavs([]);
    }
  }, []);
  const toggle = (id: string) => {
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(FAV_KEY, JSON.stringify(next));
      return next;
    });
  };
  return { favs, toggle };
}
