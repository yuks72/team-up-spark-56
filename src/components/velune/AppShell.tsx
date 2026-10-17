import { Link } from "@tanstack/react-router";
import { CalendarDays, Compass, FolderKanban, Home, Plus, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { useStore } from "@/lib/velune/store";
import { Avatar, OrbitMark } from "./bits";
import { CreateProjectDialog } from "./CreateProjectDialog";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/calendar", label: "Meet", icon: CalendarDays },
  { to: "/profile", label: "My Profile", icon: UserRound },
] as const;

function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-2 rounded-lg" aria-label="VELUNE home">
      <OrbitMark className="h-7 w-7 text-primary" />
      <span className="text-lg font-extrabold tracking-[0.28em]">VELUNE</span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { state, setCreateOpen } = useStore();
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-surface px-4 py-6 md:flex">
        <div className="px-2">
          <Wordmark />
          <p className="mt-2 text-xs text-muted-foreground">Find your people. Build your thing.</p>
        </div>
        <nav aria-label="Main" className="mt-8 flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[status=active]:bg-accent data-[status=active]:text-foreground"
            >
              <Icon className="h-4 w-4" aria-hidden /> {label}
            </Link>
          ))}
        </nav>
        <button className="btn btn-primary mt-6" onClick={() => setCreateOpen(true)}>
          <Plus /> New project
        </button>
        <Link to="/profile" className="mt-auto flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted">
          <Avatar name={state.profile.name || "You"} tone={1} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{state.profile.name || "You"}</p>
            <p className="truncate text-xs text-muted-foreground">{state.profile.commitment.split(" (")[0]} builder</p>
          </div>
        </Link>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:hidden">
        <Wordmark />
        <button className="btn btn-primary btn-sm" onClick={() => setCreateOpen(true)} aria-label="Start a project">
          <Plus /> New
        </button>
      </header>

      <main className="px-4 pb-28 pt-6 sm:px-8 md:ml-60 md:pb-12 md:pt-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>

      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-surface/95 backdrop-blur md:hidden">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="flex flex-col items-center gap-1 py-3 text-[11px] font-medium text-muted-foreground data-[status=active]:text-primary"
          >
            <Icon className="h-5 w-5" aria-hidden /> {label.replace("My ", "")}
          </Link>
        ))}
      </nav>
      <CreateProjectDialog />
    </div>
  );
}
