import { describe, expect, it } from "vitest";
import { calendarDays, upcomingMeetings, validateMeeting, type MeetingDraft, type Meeting } from "./meetings";

const draft: MeetingDraft = { title: "Team sync", date: "2026-10-19", start_time: "16:30", description: "", project_id: null, project_title: null };
describe("Meet Calendar rules", () => {
  it("requires a meeting title", () => expect(validateMeeting({ ...draft, title: " " }).title).toBeDefined());
  it("requires a valid date", () => expect(validateMeeting({ ...draft, date: "2026-02-30" }).date).toBeDefined());
  it("requires a valid start time", () => expect(validateMeeting({ ...draft, start_time: "24:00" }).start_time).toBeDefined());
  it("accepts an optional description and project", () => expect(validateMeeting(draft)).toEqual({}));
  it("shows a full Monday-to-Sunday week", () => { const days = calendarDays(new Date(2026, 9, 17), "week"); expect(days).toHaveLength(7); expect(days[0].getDate()).toBe(12); expect(days[6].getDate()).toBe(18); });
  it("covers the full month", () => { const days = calendarDays(new Date(2026, 1, 15), "month"); expect(days[0].getDate()).toBe(26); expect(days.at(-1)?.getDate()).toBe(1); expect(days.filter(d => d.getMonth() === 1)).toHaveLength(28); });
  it("excludes past meetings and sorts upcoming meetings by date and time", () => {
    const rows = ["17:00", "15:00", "16:00"].map((time, i): Meeting => ({ ...draft, id: String(i), owner_id: "owner", start_time: time }));
    expect(upcomingMeetings(rows, new Date(2026, 9, 19, 15, 30)).map(m => m.start_time)).toEqual(["16:00", "17:00"]);
  });
});