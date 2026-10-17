import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Calendar, Check, Pencil, Plus, RotateCcw, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar, EmptyState, ProgressBar } from "@/components/velune/bits";
import { fmtDate, uid, useMembers, useStore } from "@/lib/velune/store";
import { projectProgress } from "@/lib/velune/logic";
import type { Milestone, Project, Task } from "@/lib/velune/types";

export const Route = createFileRoute("/projects/$id")({
  head: () => ({
    meta: [
      { title: "Project — VELUNE" },
      { name: "description", content: "Milestones, tasks, and weekly check-ins for a VELUNE project." },
      { property: "og:title", content: "Project — VELUNE" },
      { property: "og:description", content: "Build it together, one milestone at a time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { id } = Route.useParams();
  const { state, updateProject, update } = useStore();
  const members = useMembers();
  const p = state.projects.find((x) => x.id === id);
  if (!p) return <EmptyState title="Project not found" text="It may have been deleted, or the demo data was reset." action={<Link to="/projects" className="btn btn-primary">Back to projects</Link>} />;
  const pct = projectProgress(p);
  const set = (fn: (p: Project) => Project) => updateProject(p.id, fn);

  return (
    <>
      <Link to="/projects" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> All projects</Link>
      <section className="panel orbit-bg mb-6 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <span className="chip">{p.category}</span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{p.title}</h1>
            <p className="mt-2 text-muted-foreground">{p.description}</p>
            {p.goal && <p className="mt-3 text-sm"><span className="text-muted-foreground">Goal: </span>{p.goal}</p>}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => { if (confirmDelete(p.title)) { update((s) => ({ ...s, projects: s.projects.filter((x) => x.id !== p.id) })); toast("Project deleted"); history.back(); } }}><Trash2 /> Delete</button>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div><p className="label-v">Progress</p><p className="mb-2 text-2xl font-bold text-lilac">{pct}%</p><ProgressBar value={pct} /><p className="mt-2 text-xs text-muted-foreground">{p.tasks.length ? `${p.tasks.filter((t) => t.done).length} of ${p.tasks.length} tasks done` : "Add tasks to start tracking progress"}</p></div>
          <div><p className="label-v">Target date</p><p className="flex items-center gap-2 font-semibold"><Calendar className="h-4 w-4 text-primary" /> {fmtDate(p.targetDate)}</p><p className="mt-1 text-xs text-muted-foreground">{p.commitment}</p></div>
          <div><p className="label-v">Team</p><ul className="flex flex-wrap gap-2">{p.memberIds.map((m) => members[m] && <li key={m} className="flex items-center gap-2 rounded-full bg-muted py-1 pl-1 pr-3 text-xs"><Avatar name={members[m]!.name} tone={members[m]!.avatar} size="sm" />{m === "me" ? "You" : members[m]!.name}</li>)}</ul>
            {p.memberIds.length === 1 && <Link to="/discover" className="mt-2 inline-block text-xs text-primary hover:text-lilac">Invite collaborators →</Link>}</div>
        </div>
        {p.skills.length > 0 && <div className="mt-5 flex flex-wrap gap-1.5">{p.skills.map((s) => <span key={s} className="chip !bg-transparent !text-muted-foreground ring-1 ring-border">{s}</span>)}</div>}
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Tasks p={p} set={set} />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <Milestones p={p} set={set} />
          <CheckIns p={p} set={set} />
        </div>
      </div>
    </>
  );
}

function confirmDelete(t: string) {
  return window.confirm(`Delete "${t}"? This can't be undone.`);
}

function Milestones({ p, set }: { p: Project; set: (fn: (p: Project) => Project) => void }) {
  const [draft, setDraft] = useState({ title: "", date: "" });
  const [edit, setEdit] = useState<Milestone | null>(null);
  const [err, setErr] = useState("");
  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim()) return setErr("Name the milestone.");
    set((x) => ({ ...x, milestones: [...x.milestones, { id: uid(), title: draft.title.trim(), date: draft.date, done: false }] }));
    setDraft({ title: "", date: "" }); setErr(""); toast.success("Milestone added");
  };
  const sorted = [...p.milestones].sort((a, b) => (a.date || "9").localeCompare(b.date || "9"));
  return (
    <section className="panel p-6">
      <h2 className="mb-4 font-semibold">Milestones</h2>
      {sorted.length === 0 && <p className="mb-4 text-sm text-muted-foreground">No milestones yet. What's the first checkpoint worth celebrating?</p>}
      <ol className="relative mb-5 space-y-3 border-l border-border pl-5">
        {sorted.map((m) => edit?.id === m.id ? (
          <li key={m.id} className="space-y-2">
            <input aria-label="Milestone title" className="field" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} />
            <input aria-label="Milestone date" type="date" className="field" value={edit.date} onChange={(e) => setEdit({ ...edit, date: e.target.value })} />
            <div className="flex gap-2"><button className="btn btn-primary btn-sm" onClick={() => { if (!edit.title.trim()) { toast.error("Title cannot be empty"); return; } set((x) => ({ ...x, milestones: x.milestones.map((y) => (y.id === m.id ? edit : y)) })); setEdit(null); }}>Save</button><button className="btn btn-ghost btn-sm" onClick={() => setEdit(null)}>Cancel</button></div>
          </li>
        ) : (
          <li key={m.id} className="group relative flex items-start gap-3">
            <span className={`absolute -left-[26px] top-1 h-3 w-3 rounded-full border-2 ${m.done ? "border-success bg-success" : "border-primary bg-background"}`} aria-hidden />
            <div className="min-w-0 flex-1"><p className={`text-sm font-medium ${m.done ? "text-muted-foreground line-through" : ""}`}>{m.title}</p><p className="text-xs text-muted-foreground">{fmtDate(m.date)}</p></div>
            <div className="flex">
              <IconBtn label={m.done ? "Reopen milestone" : "Complete milestone"} onClick={() => set((x) => ({ ...x, milestones: x.milestones.map((y) => (y.id === m.id ? { ...y, done: !y.done } : y)) }))}>{m.done ? <RotateCcw /> : <Check />}</IconBtn>
              <IconBtn label="Edit milestone" onClick={() => setEdit(m)}><Pencil /></IconBtn>
              <IconBtn label="Delete milestone" onClick={() => { set((x) => ({ ...x, milestones: x.milestones.filter((y) => y.id !== m.id) })); toast("Milestone deleted"); }}><Trash2 /></IconBtn>
            </div>
          </li>
        ))}
      </ol>
      <form onSubmit={add} className="space-y-2">
        <div className="flex gap-2"><input aria-label="New milestone title" className="field" placeholder="New milestone" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /><input aria-label="New milestone date" type="date" className="field !w-40" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} /></div>
        {err && <p role="alert" className="text-xs text-destructive">{err}</p>}
        <button className="btn btn-secondary btn-sm"><Plus /> Add milestone</button>
      </form>
    </section>
  );
}

function Tasks({ p, set }: { p: Project; set: (fn: (p: Project) => Project) => void }) {
  const members = useMembers();
  const { bumpActivity } = useStore();
  const blank = { title: "", assigneeId: "me", due: "" };
  const [draft, setDraft] = useState(blank);
  const [edit, setEdit] = useState<Task | null>(null);
  const [err, setErr] = useState("");
  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim()) return setErr("Describe the task.");
    set((x) => ({ ...x, tasks: [...x.tasks, { id: uid(), title: draft.title.trim(), notes: "", assigneeId: draft.assigneeId, due: draft.due, done: false }] }));
    setDraft(blank); setErr(""); toast.success("Task added");
  };
  const toggle = (t: Task) => {
    set((x) => ({ ...x, tasks: x.tasks.map((y) => (y.id === t.id ? { ...y, done: !y.done } : y)) }));
    if (!t.done) { bumpActivity(); toast.success("Nice — task complete"); }
  };
  const open = p.tasks.filter((t) => !t.done);
  const done = p.tasks.filter((t) => t.done);
  const Assignee = ({ value, onChange, id }: { value: string; onChange: (v: string) => void; id: string }) => (
    <select id={id} aria-label="Assign to" className="field" value={value} onChange={(e) => onChange(e.target.value)}>{p.memberIds.map((m) => <option key={m} value={m}>{m === "me" ? "You" : members[m]?.name}</option>)}</select>
  );

  const row = (t: Task) => edit?.id === t.id ? (
    <li key={t.id} className="card-v space-y-2 p-4">
      <input aria-label="Task title" className="field" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} />
      <textarea aria-label="Task details" rows={2} className="field resize-none" placeholder="Details" value={edit.notes} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} />
      <div className="grid grid-cols-2 gap-2"><Assignee id={`as-${t.id}`} value={edit.assigneeId} onChange={(v) => setEdit({ ...edit, assigneeId: v })} /><input aria-label="Due date" type="date" className="field" value={edit.due} onChange={(e) => setEdit({ ...edit, due: e.target.value })} /></div>
      <div className="flex gap-2"><button className="btn btn-primary btn-sm" onClick={() => { if (!edit.title.trim()) { toast.error("Title cannot be empty"); return; } set((x) => ({ ...x, tasks: x.tasks.map((y) => (y.id === t.id ? edit : y)) })); setEdit(null); toast.success("Task updated"); }}>Save</button><button className="btn btn-ghost btn-sm" onClick={() => setEdit(null)}>Cancel</button></div>
    </li>
  ) : (
    <li key={t.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/50">
      <button aria-label={t.done ? `Reopen ${t.title}` : `Complete ${t.title}`} onClick={() => toggle(t)} className={`flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-colors ${t.done ? "border-success bg-success text-primary-foreground" : "border-input hover:border-primary"}`}>{t.done && <Check className="h-3 w-3" />}</button>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm ${t.done ? "text-muted-foreground line-through" : ""}`}>{t.title}</p>
        {t.notes && <p className="truncate text-xs text-muted-foreground">{t.notes}</p>}
      </div>
      <span className="hidden text-xs text-muted-foreground sm:inline">{t.due ? fmtDate(t.due) : ""}</span>
      {members[t.assigneeId] && <Avatar name={members[t.assigneeId]!.name} tone={members[t.assigneeId]!.avatar} size="sm" />}
      <IconBtn label="Edit task" onClick={() => setEdit(t)}><Pencil /></IconBtn>
      <IconBtn label="Delete task" onClick={() => { set((x) => ({ ...x, tasks: x.tasks.filter((y) => y.id !== t.id) })); toast("Task deleted"); }}><X /></IconBtn>
    </li>
  );

  return (
    <section className="panel p-6">
      <h2 className="mb-4 font-semibold">Tasks <span className="text-sm font-normal text-muted-foreground">· {open.length} open</span></h2>
      <form onSubmit={add} className="mb-5 space-y-2">
        <input aria-label="New task" className="field" placeholder="What needs doing?" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        <div className="flex flex-col gap-2 sm:flex-row"><Assignee id="new-assignee" value={draft.assigneeId} onChange={(v) => setDraft({ ...draft, assigneeId: v })} /><input aria-label="Due date" type="date" className="field" value={draft.due} onChange={(e) => setDraft({ ...draft, due: e.target.value })} /><button className="btn btn-primary shrink-0"><Plus /> Add task</button></div>
        {err && <p role="alert" className="text-xs text-destructive">{err}</p>}
      </form>
      {p.tasks.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">No tasks yet — progress stays at 0% until you add one. Break the goal into small steps.</p> : (
        <>
          <ul className="space-y-1">{open.map(row)}</ul>
          {done.length > 0 && <><p className="label-v mt-6">Completed · {done.length}</p><ul className="space-y-1">{done.map(row)}</ul></>}
        </>
      )}
    </section>
  );
}

function CheckIns({ p, set }: { p: Project; set: (fn: (p: Project) => Project) => void }) {
  const { bumpActivity } = useStore();
  const [f, setF] = useState({ completed: "", next: "", help: "" });
  const [err, setErr] = useState("");
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.completed.trim() && !f.next.trim()) return setErr("Share at least what you completed or what's next.");
    set((x) => ({ ...x, checkins: [{ id: uid(), date: new Date().toISOString().slice(0, 10), ...f }, ...x.checkins] }));
    bumpActivity(); setF({ completed: "", next: "", help: "" }); setErr(""); toast.success("Check-in saved", { description: "Showing up counts." });
  };
  return (
    <section className="panel p-6">
      <h2 className="font-semibold">Weekly check-in</h2>
      <p className="mb-4 mt-1 text-sm text-muted-foreground">A small ritual that keeps the team in sync.</p>
      <form onSubmit={save} className="space-y-3">
        {([["completed", "What I completed"], ["next", "What I'll work on next"], ["help", "Where I need help"]] as const).map(([k, l]) => (
          <div key={k}><label htmlFor={`ci-${k}`} className="label-v">{l}</label><textarea id={`ci-${k}`} rows={2} className="field resize-none" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></div>
        ))}
        {err && <p role="alert" className="text-xs text-destructive">{err}</p>}
        <button className="btn btn-primary w-full">Save check-in</button>
      </form>
      {p.checkins.length > 0 && (
        <ul className="mt-6 space-y-3">
          {p.checkins.map((c) => (
            <li key={c.id} className="card-v p-4 text-sm">
              <p className="mb-2 text-xs font-semibold text-primary">{fmtDate(c.date)}</p>
              {c.completed && <p><span className="text-muted-foreground">Done: </span>{c.completed}</p>}
              {c.next && <p className="mt-1"><span className="text-muted-foreground">Next: </span>{c.next}</p>}
              {c.help && <p className="mt-1"><span className="text-muted-foreground">Help: </span>{c.help}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-label={label} title={label} onClick={onClick} className="btn btn-ghost btn-sm !h-7 !px-1.5 [&_svg]:!h-3.5 [&_svg]:!w-3.5">{children}</button>;
}
