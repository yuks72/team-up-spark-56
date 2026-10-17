import { addDays, endOfMonth, format, startOfMonth, startOfWeek, eachDayOfInterval, isValid, parseISO } from "date-fns";

export interface MeetingDraft {
  title: string;
  date: string;
  start_time: string;
  description: string;
  project_id: string | null;
  project_title: string | null;
}
export interface Meeting extends MeetingDraft { id: string; owner_id: string; }

export function calendarDays(anchor: Date, view: "month" | "week") {
  const start = startOfWeek(view === "month" ? startOfMonth(anchor) : anchor, { weekStartsOn: 1 });
  const end = view === "month" ? addDays(startOfWeek(endOfMonth(anchor), { weekStartsOn: 1 }), 6) : addDays(start, 6);
  return eachDayOfInterval({ start, end });
}

export function validateMeeting(draft: MeetingDraft) {
  const errors: Partial<Record<keyof MeetingDraft, string>> = {};
  if (!draft.title.trim() || draft.title.trim().length > 120) errors.title = "Enter a title between 1 and 120 characters.";
  const date = parseISO(draft.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date) || !isValid(date) || format(date, "yyyy-MM-dd") !== draft.date) errors.date = "Choose a valid meeting date.";
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(draft.start_time)) errors.start_time = "Choose a valid start time.";
  if (draft.description.length > 2000) errors.description = "Keep the description within 2,000 characters.";
  return errors;
}

export function upcomingMeetings(meetings: Meeting[], now: Date) {
  return meetings.filter(m => new Date(`${m.date}T${m.start_time}`).getTime() >= now.getTime())
    .sort((a, b) => `${a.date}T${a.start_time}`.localeCompare(`${b.date}T${b.start_time}`));
}