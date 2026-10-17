import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { addMonths, addWeeks, format, isSameMonth } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MeetingDialog } from "@/components/velune/MeetingDialog";
import { useMeetings } from "@/hooks/use-meetings";
import { calendarDays, upcomingMeetings, type Meeting } from "@/lib/velune/meetings";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import "@lovable.dev/cloud-auth-js/styles.css";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [
    { title: "Meet Calendar — VELUNE" },
    { name: "description", content: "Plan VELUNE project meetings with month and week calendars and upcoming meeting details." },
    { property: "og:title", content: "Meet Calendar — VELUNE" },
    { property: "og:description", content: "Make time to build together. Your VELUNE meeting calendar." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: MeetCalendar,
});

function MeetCalendar() {
  const { owner, checking, authError, query, save, remove } = useMeetings();
  const [anchor, setAnchor] = useState(new Date(2026, 9, 1));
  const [now, setNow] = useState<Date | null>(null);
  const [view, setView] = useState<"month" | "week">("month");
  const [selected, setSelected] = useState("");
  const [editor, setEditor] = useState<{ meeting: Meeting | null; date: string } | null>(null);
  const [detail, setDetail] = useState<Meeting | null>(null);
  const [deleting, setDeleting] = useState<Meeting | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  useEffect(() => { const date = new Date(); setAnchor(date); setNow(date); setSelected(format(date, "yyyy-MM-dd")); const timer = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(timer); }, []);
  useEffect(() => { if (!owner) { setEditor(null); setDetail(null); setDeleting(null); } }, [owner]);
  const meetings = owner ? query.data ?? [] : [];
  const days = calendarDays(anchor, view);
  const weekStart = days[0] ?? anchor;
  const weekEnd = days[6] ?? anchor;
  const upcoming = now ? upcomingMeetings(meetings, now) : [];
  const daily = meetings.filter(m => m.date === selected);
  const newMeeting = (date = selected) => { if (owner) setEditor({ meeting: null, date: date || format(anchor, "yyyy-MM-dd") }); };
  const move = (direction: number) => setAnchor(view === "month" ? addMonths(anchor, direction) : addWeeks(anchor, direction));
  const login = async (provider: "google" | "lovable") => {
    setSigningIn(true);
    try { const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: `${window.location.origin}/calendar` }); if (result.error) toast.error("Sign-in didn't finish. Please try again."); }
    catch { toast.error("Sign-in didn't finish. Please try again."); }
    finally { setSigningIn(false); }
  };
  return <>
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div><p className="label-v text-primary">Meet</p><h1 className="text-3xl font-extrabold">Meet Calendar</h1></div>
      <div className="flex gap-2">{owner && <Button variant="ghost" size="icon" title="Sign out of Calendar" aria-label="Sign out of Calendar" onClick={async () => { const { error } = await supabase.auth.signOut(); if (error) toast.error("Couldn't sign out. Please try again."); }}><LogOut /></Button>}<Button className="btn btn-primary" disabled={!owner || checking} onClick={() => newMeeting()}><Plus /> New meeting</Button></div>
    </header>
    {(authError || query.isError) && <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/40 p-4 text-sm"><p>{authError || "Your meetings couldn't be loaded."}</p><Button variant="outline" onClick={() => authError ? window.location.reload() : query.refetch()}>Try again</Button></div>}
    {!owner && !checking && <section className="mb-6 border-y border-border py-5">
      <h2 className="font-semibold">Your private meeting calendar</h2><p className="mt-1 text-sm text-muted-foreground">Sign in to save meetings across devices. Existing projects and profiles remain on this browser.</p>
      <div className="mt-4 flex flex-wrap gap-3"><Button variant="outline" disabled={signingIn} onClick={() => login("google")}>Continue with Google</Button><Button className="lovable-auth-button" disabled={signingIn} onClick={() => login("lovable")}>Continue with Lovable</Button></div>
    </section>}
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2"><Button variant="ghost" size="icon" aria-label={`Previous ${view}`} title={`Previous ${view}`} onClick={() => move(-1)}><ChevronLeft /></Button><h2 className="min-w-40 text-center font-semibold">{view === "month" ? format(anchor, "MMMM yyyy") : `${format(weekStart, "MMM d")} – ${format(weekEnd, "MMM d, yyyy")}`}</h2><Button variant="ghost" size="icon" aria-label={`Next ${view}`} title={`Next ${view}`} onClick={() => move(1)}><ChevronRight /></Button></div>
      <div className="flex items-center gap-3"><Button variant="outline" size="sm" onClick={() => { const date = new Date(); setAnchor(date); setSelected(format(date, "yyyy-MM-dd")); }}>Today</Button><div className="flex rounded-lg border border-border bg-surface p-1" aria-label="Calendar view">{(["month", "week"] as const).map(v => <Button key={v} size="sm" variant={view === v ? "secondary" : "ghost"} aria-pressed={view === v} onClick={() => setView(v)}>{v === "month" ? "Month" : "Week"}</Button>)}</div></div>
    </div>
    <p className="mb-3 flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> Local time{checking || (owner && query.isPending) ? " · Loading meetings…" : ""}</p>
    <section aria-label={`${view} calendar`} className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="grid grid-cols-7 border-b border-border">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => <p key={day} className="py-3 text-center text-xs font-semibold text-muted-foreground">{day}</p>)}</div>
      <div className="grid grid-cols-7">{days.map(day => {
        const key = format(day, "yyyy-MM-dd"); const events = meetings.filter(m => m.date === key); const today = now && key === format(now, "yyyy-MM-dd");
        return <div key={key} className={`min-w-0 border-b border-r border-border p-1 sm:p-2 ${view === "week" ? "min-h-40 sm:min-h-64" : "min-h-24 sm:min-h-32"} ${selected === key ? "bg-accent/40" : ""}`}>
          <Button variant="ghost" aria-label={format(day, "EEEE, MMMM d, yyyy")} aria-pressed={selected === key} className={`mb-1 h-7 w-7 p-0 text-xs ${today ? "bg-primary text-primary-foreground hover:bg-lilac" : !isSameMonth(day, anchor) && view === "month" ? "text-muted-foreground" : ""}`} onClick={() => setSelected(key)}>{format(day, "d")}</Button>
          <div className="space-y-1">{events.slice(0, view === "week" ? 8 : 2).map(m => <Button key={m.id} variant="ghost" className="h-auto w-full min-w-0 justify-start rounded-md bg-primary/10 px-1 py-1 text-left text-primary sm:px-2" onClick={() => setDetail(m)} title={`${m.start_time.slice(0, 5)} ${m.title}`}><span className="min-w-0"><span className="block text-[10px]">{m.start_time.slice(0, 5)}</span><span className="hidden truncate text-xs sm:block">{m.title}</span><span className="sr-only sm:hidden">{m.title}</span></span></Button>)}{events.length > (view === "week" ? 8 : 2) && <p className="text-[10px] text-muted-foreground">+{events.length - (view === "week" ? 8 : 2)} more</p>}</div>
        </div>;
      })}</div>
    </section>
    <div className="mt-8 grid gap-8 lg:grid-cols-2">
      <section aria-label="Selected day meetings"><div className="mb-3 flex items-center justify-between gap-2"><h2 className="font-semibold">{selected ? format(new Date(`${selected}T00:00:00`), "EEEE, MMMM d") : "Selected day"}</h2><Button variant="ghost" size="icon" aria-label="Add meeting on selected day" title="Add meeting on selected day" disabled={!owner} onClick={() => newMeeting()}><Plus /></Button></div>{daily.length ? <MeetingList meetings={daily} onSelect={setDetail} /> : <p className="border-t border-border py-5 text-sm text-muted-foreground">No meetings scheduled for this day.</p>}</section>
      <section aria-label="Upcoming meetings"><h2 className="mb-3 font-semibold">Upcoming meetings <span className="ml-1 text-sm font-normal text-muted-foreground">{upcoming.length}</span></h2>{upcoming.length ? <MeetingList meetings={upcoming.slice(0, 8)} onSelect={setDetail} /> : <div className="flex items-center gap-3 border-t border-border py-5 text-muted-foreground"><CalendarDays className="h-5 w-5 shrink-0" /><p className="text-sm">{owner ? "No upcoming meetings. Make time for your next idea." : "Your upcoming meetings will appear after sign-in."}</p></div>}</section>
    </div>
    {editor && <MeetingDialog meeting={editor.meeting} date={editor.date} busy={save.isPending} onClose={() => setEditor(null)} onSave={async draft => { await save.mutateAsync({ id: editor.meeting?.id, draft }); setAnchor(new Date(`${draft.date}T00:00:00`)); setSelected(draft.date); setEditor(null); toast.success(editor.meeting ? "Meeting updated" : "Meeting created"); }} />}
    {detail && <Dialog open onOpenChange={open => { if (!open) setDetail(null); }}><DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto bg-popover sm:rounded-2xl"><DialogHeader><DialogTitle className="break-words pr-5">{detail.title}</DialogTitle><DialogDescription>{format(new Date(`${detail.date}T00:00:00`), "EEEE, MMMM d, yyyy")} · {detail.start_time.slice(0, 5)} local time</DialogDescription></DialogHeader>{detail.project_title && <p className="text-sm text-primary">{detail.project_title}</p>}{detail.description && <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">{detail.description}</p>}<div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => { setDeleting(detail); setDetail(null); }}><Trash2 /> Delete</Button><Button onClick={() => { setEditor({ meeting: detail, date: detail.date }); setDetail(null); }}><Pencil /> Edit meeting</Button></div></DialogContent></Dialog>}
    {deleting && <Dialog open onOpenChange={open => { if (!open && !remove.isPending) setDeleting(null); }}><DialogContent className="w-[calc(100%-2rem)] bg-popover"><DialogHeader><DialogTitle>Delete meeting?</DialogTitle><DialogDescription className="break-words">“{deleting.title}” will be permanently removed.</DialogDescription></DialogHeader><div className="flex justify-end gap-2"><Button variant="outline" disabled={remove.isPending} onClick={() => setDeleting(null)}>Cancel</Button><Button variant="destructive" disabled={remove.isPending} onClick={async () => { try { await remove.mutateAsync(deleting.id); setDeleting(null); toast.success("Meeting deleted"); } catch { toast.error("Meeting wasn't deleted. Please try again."); } }}>{remove.isPending ? "Deleting…" : "Delete meeting"}</Button></div></DialogContent></Dialog>}
  </>;
}

function MeetingList({ meetings, onSelect }: { meetings: Meeting[]; onSelect: (meeting: Meeting) => void }) {
  return <ul className="divide-y divide-border border-t border-border">{meetings.map(m => <li key={m.id}><Button variant="ghost" className="h-auto w-full justify-start gap-4 px-2 py-4 text-left" onClick={() => onSelect(m)}><span className="w-12 shrink-0 text-center"><span className="block text-[10px] uppercase text-muted-foreground">{format(new Date(`${m.date}T00:00:00`), "MMM")}</span><span className="text-xl font-bold text-lilac">{format(new Date(`${m.date}T00:00:00`), "d")}</span></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{m.title}</span><span className="block truncate text-xs text-muted-foreground">{m.start_time.slice(0, 5)}{m.project_title ? ` · ${m.project_title}` : ""}</span></span></Button></li>)}</ul>;
}