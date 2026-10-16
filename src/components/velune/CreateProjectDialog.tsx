import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { uid, useStore } from "@/lib/velune/store";
import { CATEGORIES, COMMITMENTS, type Category, type Commitment } from "@/lib/velune/types";
import { TagInput } from "./bits";

const SKILLS = ["Python", "Machine learning", "Design", "Writing", "Research", "Data analysis", "Hardware", "Community organizing"];
const blank = { title: "", description: "", category: "" as Category | "", goal: "", skills: [] as string[], targetDate: "", commitment: COMMITMENTS[1] as Commitment };

export function CreateProjectDialog() {
  const { createOpen, setCreateOpen, update, updateProject, bumpActivity } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [f, setF] = useState(blank);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [ms, setMs] = useState({ title: "", date: "" });

  const close = (o: boolean) => {
    setCreateOpen(o);
    if (!o) setTimeout(() => { setStep(0); setF(blank); setErrors({}); setCreatedId(null); setMs({ title: "", date: "" }); }, 200);
  };

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!f.title.trim()) e.title = "Give your project a name.";
      if (!f.description.trim()) e.description = "Add a one-line description.";
      if (!f.category) e.category = "Pick a category.";
    }
    if (s === 1 && !f.goal.trim()) e.goal = "Describe what you want to accomplish.";
    if (s === 2 && !f.targetDate) e.targetDate = "Choose a target date.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const create = () => {
    if (!validate(2)) return;
    const id = uid();
    update((s) => ({
      ...s,
      projects: [{ id, title: f.title.trim(), description: f.description.trim(), category: f.category as Category, goal: f.goal.trim(), skills: f.skills, targetDate: f.targetDate, commitment: f.commitment, memberIds: ["me"], milestones: [], tasks: [], checkins: [] }, ...s.projects],
    }));
    bumpActivity();
    setCreatedId(id);
    toast.success("Project created", { description: `${f.title} is now in your orbit.` });
  };

  const addMilestone = () => {
    if (!createdId || !ms.title.trim()) return toast.error("Give the milestone a name first.");
    updateProject(createdId, (p) => ({ ...p, milestones: [...p.milestones, { id: uid(), title: ms.title.trim(), date: ms.date, done: false }] }));
    toast.success("First milestone added");
    const id = createdId;
    close(false);
    navigate({ to: "/projects/$id", params: { id } });
  };

  const Err = ({ k }: { k: string }) => (errors[k] ? <p className="mt-1.5 text-xs text-destructive" role="alert">{errors[k]}</p> : null);

  return (
    <Dialog open={createOpen} onOpenChange={close}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-border bg-popover sm:max-w-lg sm:rounded-2xl">
        {createdId ? (
          <div className="py-2">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success"><Check /></div>
            <DialogHeader className="text-center sm:text-center">
              <DialogTitle>Your project is live</DialogTitle>
              <DialogDescription>It starts at 0%. A first milestone gives the team something to aim for.</DialogDescription>
            </DialogHeader>
            <div className="mt-6 space-y-3">
              <label className="label-v" htmlFor="ms-title">First milestone</label>
              <input id="ms-title" className="field" placeholder="e.g. Research plan finished" value={ms.title} onChange={(e) => setMs({ ...ms, title: e.target.value })} />
              <input aria-label="Milestone date" type="date" className="field" value={ms.date} onChange={(e) => setMs({ ...ms, date: e.target.value })} />
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button className="btn btn-secondary" onClick={() => { const id = createdId; close(false); navigate({ to: "/projects/$id", params: { id } }); }}>Skip for now</button>
              <button className="btn btn-primary" onClick={addMilestone}>Add milestone</button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Step {step + 1} of 3</p>
              <DialogTitle className="text-xl">{["Name your idea", "Define the goal", "Set the rhythm"][step]}</DialogTitle>
              <DialogDescription>{["Start small. You can refine everything later.", "What does success look like, and who do you need?", "A target date keeps the team honest."][step]}</DialogDescription>
            </DialogHeader>
            <div className="flex gap-1.5" aria-hidden>{[0, 1, 2].map((i) => <span key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />)}</div>

            <div className="mt-2 space-y-5">
              {step === 0 && (
                <>
                  <div><label className="label-v" htmlFor="p-title">Project name *</label><input id="p-title" className="field" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="e.g. Open Lab Notebook" /><Err k="title" /></div>
                  <div><label className="label-v" htmlFor="p-desc">Short description *</label><textarea id="p-desc" rows={2} className="field resize-none" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /><Err k="description" /></div>
                  <fieldset><legend className="label-v">Category *</legend>
                    <div className="flex flex-wrap gap-2">{CATEGORIES.map((c) => <button key={c} type="button" aria-pressed={f.category === c} className="chip chip-toggle !py-1.5" onClick={() => setF({ ...f, category: c })}>{c}</button>)}</div>
                    <Err k="category" />
                  </fieldset>
                </>
              )}
              {step === 1 && (
                <>
                  <div><label className="label-v" htmlFor="p-goal">What the team wants to accomplish *</label><textarea id="p-goal" rows={3} className="field resize-none" value={f.goal} onChange={(e) => setF({ ...f, goal: e.target.value })} placeholder="e.g. Publish a guide that 3 schools adopt" /><Err k="goal" /></div>
                  <TagInput id="p-skills" label="Skills needed" value={f.skills} onChange={(skills) => setF({ ...f, skills })} suggestions={SKILLS} />
                </>
              )}
              {step === 2 && (
                <>
                  <div><label className="label-v" htmlFor="p-date">Target completion date *</label><input id="p-date" type="date" className="field" value={f.targetDate} onChange={(e) => setF({ ...f, targetDate: e.target.value })} /><Err k="targetDate" /></div>
                  <div><label className="label-v" htmlFor="p-commit">Collaboration commitment</label>
                    <select id="p-commit" className="field" value={f.commitment} onChange={(e) => setF({ ...f, commitment: e.target.value as Commitment })}>{COMMITMENTS.map((c) => <option key={c}>{c}</option>)}</select>
                  </div>
                </>
              )}
            </div>
            <div className="mt-4 flex justify-between gap-2">
              <button className="btn btn-ghost" onClick={() => (step === 0 ? close(false) : setStep(step - 1))}>{step === 0 ? "Cancel" : "Back"}</button>
              {step < 2 ? <button className="btn btn-primary" onClick={() => validate(step) && setStep(step + 1)}>Continue</button> : <button className="btn btn-primary" onClick={create}>Create project</button>}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
