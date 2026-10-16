import { Link } from "@tanstack/react-router";
import { Flag } from "lucide-react";
import type { Project } from "@/lib/velune/types";
import { projectProgress } from "@/lib/velune/logic";
import { fmtDate, useMembers } from "@/lib/velune/store";
import { AvatarStack, ProgressBar } from "./bits";

export function ProjectCard({ project }: { project: Project }) {
  const members = useMembers();
  const pct = projectProgress(project);
  const done = project.tasks.filter((t) => t.done).length;
  const next = project.milestones.filter((m) => !m.done).sort((a, b) => a.date.localeCompare(b.date))[0];
  return (
    <Link to="/projects/$id" params={{ id: project.id }} className="card-v card-hover group flex flex-col p-5 hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <span className="chip">{project.category}</span>
        <AvatarStack people={project.memberIds.map((id) => members[id]).filter(Boolean)} />
      </div>
      <h3 className="mt-4 font-semibold leading-snug group-hover:text-lilac">{project.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
      <div className="mt-auto pt-5">
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-muted-foreground">{done}/{project.tasks.length} tasks</span>
          <span className="font-semibold text-lilac">{pct}%</span>
        </div>
        <ProgressBar value={pct} label={`${project.title} progress`} />
        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Flag className="h-3.5 w-3.5 text-primary" aria-hidden />
          {next ? <>Next: <span className="text-foreground">{next.title}</span> · {fmtDate(next.date)}</> : "No upcoming milestone"}
        </p>
      </div>
    </Link>
  );
}
