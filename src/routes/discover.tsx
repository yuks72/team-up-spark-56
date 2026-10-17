import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Info, Search, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, EmptyState, PageHeader } from "@/components/velune/bits";
import { PEERS } from "@/lib/velune/seed";
import { computeMatch } from "@/lib/velune/logic";
import { uid, useStore } from "@/lib/velune/store";
import { CATEGORIES, COMMITMENTS, STYLES, type Peer } from "@/lib/velune/types";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover collaborators — VELUNE" },
      { name: "description", content: "Browse motivated students by interests, skills, and working style, and invite them to build with you." },
      { property: "og:title", content: "Discover collaborators — VELUNE" },
      { property: "og:description", content: "Find your people on VELUNE." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Discover,
});

const uniq = (k: "interests" | "skills") => Array.from(new Set(PEERS.flatMap((p) => p[k]))).sort();

function Discover() {
  const { state, update } = useStore();
  const [q, setQ] = useState("");
  const [f, setF] = useState({ interest: "", skill: "", category: "", commitment: "", style: "", saved: false });
  const [sort, setSort] = useState("match");
  const [viewing, setViewing] = useState<Peer | null>(null);
  const [inviting, setInviting] = useState<Peer | null>(null);

  const list = useMemo(() => {
    const ql = q.toLowerCase();
    const r = PEERS.map((p) => ({ p, m: computeMatch(state.profile, p) })).filter(({ p }) => {
      const hay = [p.name, p.bio, ...p.interests, ...p.skills, ...p.learn].join(" ").toLowerCase();
      return (!ql || hay.includes(ql)) && (!f.interest || p.interests.includes(f.interest)) && (!f.skill || p.skills.includes(f.skill)) &&
        (!f.category || p.projectTypes.includes(f.category as never)) && (!f.commitment || p.commitment === f.commitment) &&
        (!f.style || p.style === f.style) && (!f.saved || state.saved.includes(p.id));
    });
    return r.sort((a, b) => (sort === "name" ? a.p.name.localeCompare(b.p.name) : sort === "commitment" ? COMMITMENTS.indexOf(b.p.commitment) - COMMITMENTS.indexOf(a.p.commitment) : b.m.score - a.m.score));
  }, [q, f, sort, state.profile, state.saved]);

  const toggleSave = (p: Peer) => {
    const on = state.saved.includes(p.id);
    update((s) => ({ ...s, saved: on ? s.saved.filter((x) => x !== p.id) : [...s.saved, p.id] }));
    toast(on ? `Removed ${p.name} from saved` : `Saved ${p.name}`);
  };
  const invited = (id: string) => state.invites.some((i) => i.peerId === id);
  const active = Object.values(f).some(Boolean) || q;

  const Sel = ({ k, label, opts }: { k: keyof typeof f; label: string; opts: readonly string[] }) => (
    <select aria-label={label} className="field" value={f[k] as string} onChange={(e) => setF({ ...f, [k]: e.target.value })}>
      <option value="">{label}: any</option>
      {opts.map((o) => <option key={o}>{o}</option>)}
    </select>
  );

  return (
    <>
      <PageHeader eyebrow="Discover" title="Find your people." text="Students who share your curiosity — and bring skills you don't have yet." />
      <div className="panel mb-6 space-y-3 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input aria-label="Search collaborators" className="field !pl-9" placeholder="Search by name, interest, or skill" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select aria-label="Sort by" className="field sm:!w-48" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="match">Sort: best overlap</option><option value="name">Sort: name</option><option value="commitment">Sort: most committed</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <Sel k="interest" label="Interest" opts={uniq("interests")} />
          <Sel k="skill" label="Skill" opts={uniq("skills")} />
          <Sel k="category" label="Category" opts={CATEGORIES} />
          <Sel k="commitment" label="Commitment" opts={COMMITMENTS} />
          <Sel k="style" label="Style" opts={STYLES} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button aria-pressed={f.saved} className="chip chip-toggle !py-1.5" onClick={() => setF({ ...f, saved: !f.saved })}><Bookmark className="h-3 w-3" /> Saved only ({state.saved.length})</button>
          {active && <button className="btn btn-ghost btn-sm" onClick={() => { setQ(""); setF({ interest: "", skill: "", category: "", commitment: "", style: "", saved: false }); }}>Clear filters</button>}
        </div>
      </div>
      <p className="mb-4 flex items-start gap-2 text-xs text-muted-foreground"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />Overlap is an illustrative match based on shared interests, skills, goals, and working preferences in your profile — not a scientifically validated score. Profiles are fictional demo students.</p>

      {list.length === 0 ? (
        <EmptyState title="No one matches those filters" text="Try loosening a filter — great collaborators often come from unexpected directions." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map(({ p, m }) => {
            const saved = state.saved.includes(p.id);
            return (
              <article key={p.id} className="card-v card-hover flex flex-col p-5">
                <div className="flex items-start gap-4">
                  <Avatar name={p.name} tone={p.avatar} size="lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold">{p.name} <span className="text-sm font-normal text-muted-foreground">· {p.grade}</span></h3>
                      <button aria-label={saved ? `Unsave ${p.name}` : `Save ${p.name}`} aria-pressed={saved} onClick={() => toggleSave(p)} className="btn btn-ghost btn-sm !px-2">{saved ? <BookmarkCheck className="!text-primary" /> : <Bookmark />}</button>
                    </div>
                    <p className="text-xs text-muted-foreground">{p.commitment} · {p.style}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{p.bio}</p>
                <dl className="mt-4 space-y-2.5 text-sm">
                  <Row label="Interests" items={p.interests} />
                  <Row label="Can contribute" items={p.skills} />
                  <Row label="Wants to learn" items={p.learn} />
                  <Row label="Wants to build" items={p.projectTypes} />
                </dl>
                <div className="mt-4 rounded-xl border border-primary/20 bg-accent/50 p-3">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-lilac"><Sparkles className="h-3.5 w-3.5" aria-hidden />{m.level}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.reasons.slice(0, 2).join(" ")}</p>
                </div>
                <div className="mt-5 flex gap-2">
                  <button className="btn btn-secondary flex-1" onClick={() => setViewing(p)}>View profile</button>
                  <button className="btn btn-primary flex-1" onClick={() => setInviting(p)}><Send />{invited(p.id) ? "Invite again" : "Invite"}</button>
                </div>
                {invited(p.id) && <p className="mt-2 text-center text-xs text-success">Invitation sent</p>}
              </article>
            );
          })}
        </div>
      )}

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="border-border bg-popover sm:rounded-2xl">
          {viewing && (() => { const m = computeMatch(state.profile, viewing); return (
            <>
              <DialogHeader className="flex-row items-center gap-4 space-y-0">
                <Avatar name={viewing.name} tone={viewing.avatar} size="lg" />
                <div><DialogTitle className="text-xl">{viewing.name}</DialogTitle><DialogDescription>{viewing.grade} · {viewing.commitment}</DialogDescription></div>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">{viewing.bio}</p>
              <dl className="space-y-2.5 text-sm">
                <Row label="Interests" items={viewing.interests} /><Row label="Can contribute" items={viewing.skills} />
                <Row label="Wants to learn" items={viewing.learn} /><Row label="Wants to build" items={viewing.projectTypes} />
                <Row label="Working style" items={[viewing.style]} />
              </dl>
              <div className="rounded-xl bg-accent/50 p-4"><p className="text-sm font-semibold text-lilac">{m.level} (illustrative)</p><ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">{m.reasons.map((r) => <li key={r}>{r}</li>)}</ul></div>
              <div className="flex justify-end gap-2">
                <button className="btn btn-secondary" onClick={() => toggleSave(viewing)}>{state.saved.includes(viewing.id) ? "Saved" : "Save profile"}</button>
                <button className="btn btn-primary" onClick={() => { setInviting(viewing); setViewing(null); }}>Invite to collaborate</button>
              </div>
            </>
          ); })()}
        </DialogContent>
      </Dialog>
      <InviteDialog peer={inviting} onClose={() => setInviting(null)} />
    </>
  );
}

function Row({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline">
      <dt className="w-32 shrink-0 text-xs text-muted-foreground">{label}</dt>
      <dd className="flex flex-wrap gap-1.5">{items.map((i) => <span key={i} className="chip">{i}</span>)}</dd>
    </div>
  );
}

function InviteDialog({ peer, onClose }: { peer: Peer | null; onClose: () => void }) {
  const { state, update, updateProject, bumpActivity } = useStore();
  const [projectId, setProjectId] = useState("");
  const [note, setNote] = useState("");
  const send = () => {
    if (!peer) return;
    update((s) => ({ ...s, invites: [...s.invites, { id: uid(), peerId: peer.id, projectId: projectId || null, note, date: new Date().toISOString() }] }));
    if (projectId) updateProject(projectId, (p) => (p.memberIds.includes(peer.id) ? p : { ...p, memberIds: [...p.memberIds, peer.id] }));
    bumpActivity();
    const proj = state.projects.find((p) => p.id === projectId);
    toast.success(`Invitation sent to ${peer.name}`, { description: proj ? `${peer.name} was added to ${proj.title} (demo).` : "Saved as a local demo invitation." });
    setNote(""); setProjectId(""); onClose();
  };
  return (
    <Dialog open={!!peer} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="border-border bg-popover sm:rounded-2xl">
        <DialogHeader><DialogTitle>Invite {peer?.name} to collaborate</DialogTitle><DialogDescription>This is a demo invitation — nothing is sent outside VELUNE.</DialogDescription></DialogHeader>
        <div><label className="label-v" htmlFor="inv-proj">Project</label>
          <select id="inv-proj" className="field" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="">Just connect for now</option>
            {state.projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
        <div><label className="label-v" htmlFor="inv-note">A short note (optional)</label><textarea id="inv-note" rows={3} className="field resize-none" value={note} onChange={(e) => setNote(e.target.value)} placeholder="I loved your idea about…" /></div>
        <div className="flex justify-end gap-2"><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={send}><Send /> Send invite</button></div>
      </DialogContent>
    </Dialog>
  );
}
