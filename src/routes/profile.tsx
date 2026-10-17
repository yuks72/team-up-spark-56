import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, PageHeader, TagInput } from "@/components/velune/bits";
import { useStore } from "@/lib/velune/store";
import { CATEGORIES, COMMITMENTS, STYLES, type Category, type CollabStyle, type Commitment, type Profile } from "@/lib/velune/types";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My profile — VELUNE" },
      { name: "description", content: "Edit your VELUNE profile: interests, skills, and how you like to collaborate." },
      { property: "og:title", content: "My profile — VELUNE" },
      { property: "og:description", content: "Tell collaborators what you care about." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

const INTERESTS = ["AI", "Education", "Research", "Climate", "Design", "Psychology", "Robotics", "Mathematics", "Science communication", "Sustainability"];
const SKILLS = ["Writing", "Python", "Project planning", "Design", "Machine learning", "Data analysis", "Research", "Hardware", "Storytelling"];

function ProfilePage() {
  const { state, setProfile, reset } = useStore();
  const [f, setF] = useState<Profile>(state.profile);
  const [err, setErr] = useState("");
  useEffect(() => setF(state.profile), [state.profile]);
  const dirty = JSON.stringify(f) !== JSON.stringify(state.profile);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) return setErr("Display name is required.");
    setErr("");
    setProfile({ ...f, name: f.name.trim() });
    toast.success("Profile saved", { description: "Your matches on Discover have been updated." });
  };

  return (
    <>
      <PageHeader eyebrow="My profile" title="How others see you" text="A fictional demo student is loaded by default — make it yours." />
      <form onSubmit={save} className="grid gap-6 lg:grid-cols-3">
        <div className="panel orbit-bg h-fit p-6 text-center">
          <Avatar name={f.name || "You"} tone={1} size="lg" className="mx-auto !h-20 !w-20 !text-2xl" />
          <p className="mt-4 text-lg font-semibold">{f.name || "Your name"}</p>
          <p className="mt-1 text-sm text-muted-foreground">{f.intro || "Add a short intro."}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">{f.interests.slice(0, 4).map((i) => <span key={i} className="chip">{i}</span>)}</div>
        </div>
        <div className="panel space-y-6 p-6 lg:col-span-2">
          <div><label htmlFor="pf-name" className="label-v">Display name *</label><input id="pf-name" className="field" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} aria-invalid={!!err} />{err && <p role="alert" className="mt-1.5 text-xs text-destructive">{err}</p>}</div>
          <div><label htmlFor="pf-intro" className="label-v">Short introduction</label><textarea id="pf-intro" rows={3} maxLength={240} className="field resize-none" value={f.intro} onChange={(e) => setF({ ...f, intro: e.target.value })} /></div>
          <TagInput id="pf-int" label="Interests" value={f.interests} onChange={(interests) => setF({ ...f, interests })} suggestions={INTERESTS} />
          <TagInput id="pf-skills" label="Skills I can contribute" value={f.skills} onChange={(skills) => setF({ ...f, skills })} suggestions={SKILLS} />
          <TagInput id="pf-learn" label="Skills I want to learn" value={f.learn} onChange={(learn) => setF({ ...f, learn })} suggestions={SKILLS} />
          <fieldset><legend className="label-v">Project interests</legend>
            <div className="flex flex-wrap gap-2">{CATEGORIES.map((c) => { const on = f.projectTypes.includes(c); return <button key={c} type="button" aria-pressed={on} className="chip chip-toggle" onClick={() => setF({ ...f, projectTypes: on ? f.projectTypes.filter((x) => x !== c) : [...f.projectTypes, c as Category] })}>{c}</button>; })}</div>
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="pf-commit" className="label-v">Commitment level</label><select id="pf-commit" className="field" value={f.commitment} onChange={(e) => setF({ ...f, commitment: e.target.value as Commitment })}>{COMMITMENTS.map((c) => <option key={c}>{c}</option>)}</select></div>
            <div><label htmlFor="pf-style" className="label-v">Collaboration style</label><select id="pf-style" className="field" value={f.style} onChange={(e) => setF({ ...f, style: e.target.value as CollabStyle })}>{STYLES.map((c) => <option key={c}>{c}</option>)}</select></div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => { reset(); toast("Demo data restored"); }}>Reset all demo data</button>
            <div className="flex gap-2">
              <button type="button" className="btn btn-secondary" disabled={!dirty} onClick={() => setF(state.profile)}>Discard</button>
              <button type="submit" className="btn btn-primary" disabled={!dirty}>Save profile</button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
