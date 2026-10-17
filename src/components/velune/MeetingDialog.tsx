import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useStore } from "@/lib/velune/store";
import { validateMeeting, type Meeting, type MeetingDraft } from "@/lib/velune/meetings";

export function MeetingDialog({ meeting, date, busy, onClose, onSave }: {
  meeting: Meeting | null; date: string; busy: boolean; onClose: () => void;
  onSave: (draft: MeetingDraft) => Promise<void>;
}) {
  const { state } = useStore();
  const [draft, setDraft] = useState<MeetingDraft>(meeting ? { ...meeting, start_time: meeting.start_time.slice(0, 5) } : {
    title: "", date, start_time: "16:00", description: "", project_id: null, project_title: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const field = (key: keyof MeetingDraft) => ({
    "aria-invalid": !!errors[key], "aria-describedby": errors[key] ? `meeting-error-${key}` : undefined,
  });
  const error = (key: string) => errors[key] && <p id={`meeting-error-${key}`} role="alert" className="mt-1 text-xs text-destructive">{errors[key]}</p>;
  return <Dialog open onOpenChange={open => { if (!open && !busy) onClose(); }}>
    <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto bg-popover sm:rounded-2xl">
      <DialogHeader><DialogTitle>{meeting ? "Edit meeting" : "New meeting"}</DialogTitle><DialogDescription>Meeting times are in your local time.</DialogDescription></DialogHeader>
      <form noValidate className="space-y-4" onSubmit={async e => {
        e.preventDefault(); const nextErrors = validateMeeting(draft); setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;
        try { await onSave({ title: draft.title.trim(), date: draft.date, start_time: draft.start_time, description: draft.description.trim(), project_id: draft.project_id, project_title: draft.project_title }); }
        catch { toast.error("Meeting wasn't saved. Please try again."); }
      }}>
        <div><label className="label-v" htmlFor="meeting-title">Title *</label><input autoFocus id="meeting-title" className="field" maxLength={120} value={draft.title} {...field("title")} onChange={e => setDraft({ ...draft, title: e.target.value })} />{error("title")}</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="min-w-0"><label className="label-v" htmlFor="meeting-date">Date *</label><input id="meeting-date" type="date" className="field min-w-0" value={draft.date} {...field("date")} onChange={e => setDraft({ ...draft, date: e.target.value })} />{error("date")}</div>
          <div className="min-w-0"><label className="label-v" htmlFor="meeting-time">Start time *</label><input id="meeting-time" type="time" className="field min-w-0" value={draft.start_time} {...field("start_time")} onChange={e => setDraft({ ...draft, start_time: e.target.value })} />{error("start_time")}</div>
        </div>
        <div><label className="label-v" htmlFor="meeting-project">Project</label><select id="meeting-project" className="field" value={draft.project_id ?? ""} onChange={e => { const project = state.projects.find(p => p.id === e.target.value); setDraft({ ...draft, project_id: project?.id ?? null, project_title: project?.title ?? null }); }}>
          <option value="">No project</option>
          {draft.project_id && !state.projects.some(p => p.id === draft.project_id) && <option value={draft.project_id}>{draft.project_title ?? "Unavailable project"}</option>}
          {state.projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select></div>
        <div><label className="label-v" htmlFor="meeting-description">Description <span className="normal-case">(optional)</span></label><textarea id="meeting-description" rows={3} maxLength={2000} className="field resize-none" value={draft.description} {...field("description")} onChange={e => setDraft({ ...draft, description: e.target.value })} />{error("description")}</div>
        <div className="flex justify-end gap-2"><Button variant="outline" type="button" disabled={busy} onClick={onClose}>Cancel</Button><Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save meeting"}</Button></div>
      </form>
    </DialogContent>
  </Dialog>;
}