import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Flame, FolderKanban } from "lucide-react";
import { useStore, fmtDate, useToday } from "@/lib/velune/store";
import { isCompleted, streak } from "@/lib/velune/logic";
import { EmptyState } from "@/components/velune/bits";
import { ProjectCard } from "@/components/velune/ProjectCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — VELUNE" },
      { name: "description", content: "Your VELUNE orbit: projects, milestones and weekly momentum in one calm place." },
      { property: "og:title", content: "Home — VELUNE" },
      { property: "og:description", content: "Big ideas feel different when you build them together." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

function Home() {
  const { state, setCreateOpen } = useStore();
  const today = useToday();
  const active = state.projects.filter((p) => !isCompleted(p));
  const tasksDone = state.projects.reduce((n, p) => n + p.tasks.filter((t) => t.done).length, 0);
  const s = streak(state.activity);
  const upcoming = state.projects
    .flatMap((p) => p.milestones.filter((m) => !m.done).map((m) => ({ ...m, project: p })))
    .sort((a, b) => (a.date || "9").localeCompare(b.date || "9"))
    .slice(0, 5);
  const max = Math.max(1, ...state.activity);
  const week = state.activity.reduce((a, b) => a + b, 0);

  return (
    <>
      <section className="panel orbit-bg starfield relative mb-8 overflow-hidden p-6 sm:p-10">
        <svg className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 text-primary opacity-30" viewBox="0 0 200 200" fill="none" aria-hidden>
          <circle cx="100" cy="100" r="70" stroke="currentColor" strokeDasharray="2 6" />
          <circle cx="100" cy="100" r="95" stroke="currentColor" strokeOpacity=".5" />
          <circle cx="170" cy="100" r="4" fill="currentColor" />
        </svg>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Hi, {state.profile.name.split(" ")[0] || "there"}</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Welcome to your orbit.</h1>
        <p className="mt-3 max-w-md text-muted-foreground">Big ideas feel different when you build them together.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/discover" className="btn btn-primary">Find my people <ArrowRight /></Link>
          <button className="btn btn-secondary" onClick={() => setCreateOpen(true)}>Start a project</button>
        </div>
      </section>

      <section aria-label="Progress overview" className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat icon={<FolderKanban />} label="Active projects" value={active.length} />
        <Stat icon={<CheckCircle2 />} label="Tasks completed" value={tasksDone} />
        <Stat icon={<Flame />} label="Consistency streak" value={`${s} day${s === 1 ? "" : "s"}`} />
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your current projects</h2>
          <Link to="/projects" className="text-sm text-primary hover:text-lilac">View all</Link>
        </div>
        {active.length === 0 ? (
          <EmptyState title="No projects in orbit yet" text="Start something small, or find a collaborator first — both are good beginnings." action={<button className="btn btn-primary" onClick={() => setCreateOpen(true)}>Start a project</button>} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{active.slice(0, 3).map((p) => <ProjectCard key={p.id} project={p} />)}</div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="panel p-6 lg:col-span-3">
          <h2 className="mb-4 font-semibold">Upcoming milestones</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">No milestones on the horizon. Add one inside a project.</p>
          ) : (
            <ul className="divide-y divide-border">
              {upcoming.map((m) => {
                const overdue = today && m.date && m.date < today;
                const soon = today && m.date && !overdue && (new Date(m.date).getTime() - new Date(today).getTime()) / 864e5 <= 7;
                return (
                  <li key={m.project.id + m.id}>
                    <Link to="/projects/$id" params={{ id: m.project.id }} className="flex items-center gap-4 rounded-lg py-3 hover:text-lilac">
                      <div className="w-14 shrink-0 text-center"><p className="text-xs text-muted-foreground">{fmtDate(m.date).split(" ")[0]}</p><p className="text-lg font-bold">{m.date ? new Date(m.date + "T00:00").getDate() : "—"}</p></div>
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{m.title}</p><p className="truncate text-xs text-muted-foreground">{m.project.title}</p></div>
                      <span className={`chip ${overdue ? "!text-destructive" : soon ? "!text-warning" : "!text-success"}`}>{overdue ? "Overdue" : soon ? "This week" : "On track"}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
        <section className="panel p-6 lg:col-span-2">
          <h2 className="font-semibold">Momentum</h2>
          <p className="mt-1 text-sm text-muted-foreground">{week} small steps this week. Every one counts.</p>
          <div className="mt-6 flex h-32 items-end justify-between gap-2" role="img" aria-label={`Activity over the last 7 days: ${state.activity.join(", ")}`}>
            {state.activity.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className={`w-full rounded-md ${v ? "bg-primary" : "bg-muted"} ${i === 6 ? "glow" : ""}`} style={{ height: `${Math.max(8, (v / max) * 100)}%`, opacity: v ? 0.45 + (v / max) * 0.55 : 1 }} />
                <span className="text-[11px] text-muted-foreground">{i === 6 ? "Today" : DAYS[i]}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="card-v flex items-center gap-4 p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary [&_svg]:h-5 [&_svg]:w-5">{icon}</span>
      <div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>
    </div>
  );
}

