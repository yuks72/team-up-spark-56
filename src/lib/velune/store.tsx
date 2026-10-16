import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { AppState, Project, Profile } from "./types";
import { makeSeed, PEERS } from "./seed";

const KEY = "velune:v1";

export const uid = () => Math.random().toString(36).slice(2, 10);

interface Store {
  state: AppState;
  update: (fn: (s: AppState) => AppState) => void;
  updateProject: (id: string, fn: (p: Project) => Project) => void;
  setProfile: (p: Profile) => void;
  bumpActivity: () => void;
  reset: () => void;
  createOpen: boolean;
  setCreateOpen: (v: boolean) => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => makeSeed());
  const [createOpen, setCreateOpen] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...makeSeed(), ...JSON.parse(raw) });
    } catch {
      /* ignore corrupt storage */
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (loaded.current) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const update = useCallback((fn: (s: AppState) => AppState) => setState(fn), []);
  const value = useMemo<Store>(
    () => ({
      state,
      update,
      updateProject: (id, fn) =>
        setState((s) => ({ ...s, projects: s.projects.map((p) => (p.id === id ? fn(p) : p)) })),
      setProfile: (profile) => setState((s) => ({ ...s, profile })),
      bumpActivity: () =>
        setState((s) => {
          const a = [...s.activity];
          a[a.length - 1] = (a[a.length - 1] ?? 0) + 1;
          return { ...s, activity: a };
        }),
      reset: () => setState(makeSeed()),
      createOpen,
      setCreateOpen,
    }),
    [state, update, createOpen],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}

export interface Member {
  id: string;
  name: string;
  avatar: number;
}
export function useMembers(): Record<string, Member> {
  const { state } = useStore();
  return useMemo(() => {
    const m: Record<string, Member> = { me: { id: "me", name: state.profile.name || "You", avatar: 1 } };
    PEERS.forEach((p) => (m[p.id] = { id: p.id, name: p.name, avatar: p.avatar }));
    return m;
  }, [state.profile.name]);
}

export function useToday() {
  const [today, setToday] = useState("");
  useEffect(() => setToday(new Date().toISOString().slice(0, 10)), []);
  return today;
}

export function fmtDate(d: string) {
  if (!d) return "No date";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: dt.getFullYear() !== 2026 ? "numeric" : undefined });
}
