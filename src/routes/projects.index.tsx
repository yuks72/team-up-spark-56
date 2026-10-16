import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useStore } from "@/lib/velune/store";
import { isCompleted } from "@/lib/velune/logic";
import { EmptyState, PageHeader } from "@/components/velune/bits";
import { ProjectCard } from "@/components/velune/ProjectCard";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — VELUNE" },
      { name: "description", content: "All your VELUNE projects, milestones and progress in one place." },
      { property: "og:title", content: "Projects — VELUNE" },
      { property: "og:description", content: "Track what you're building together." },
    ],
  }),
  component: Projects,
});

const TABS = ["All projects", "In progress", "Completed"] as const;

function Projects() {
  const { state, setCreateOpen } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]>("All projects");
  const list = state.projects.filter((p) => (tab === "All projects" ? true : tab === "Completed" ? isCompleted(p) : !isCompleted(p)));
  return (
    <>
      <PageHeader eyebrow="Projects" title="What you're building" text="Progress is calculated from completed tasks." action={<button className="btn btn-primary" onClick={() => setCreateOpen(true)}><Plus /> Start a project</button>} />
      <div role="tablist" aria-label="Filter projects" className="mb-6 inline-flex rounded-xl border border-border bg-surface p-1">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === t ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>
      {list.length === 0 ? (
        <EmptyState title={tab === "Completed" ? "Nothing completed yet" : "No projects here"} text={tab === "Completed" ? "Finish every task in a project and it will land here. You're closer than you think." : "Start a project to give your ideas a home."} action={tab !== "Completed" ? <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>Start a project</button> : undefined} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <ProjectCard key={p.id} project={p} />)}</div>
      )}
    </>
  );
}
