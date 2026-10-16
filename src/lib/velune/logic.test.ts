import { describe, expect, it } from "vitest";
import { computeMatch, isCompleted, projectProgress, streak } from "./logic";
import { PEERS, DEFAULT_PROFILE } from "./seed";

const t = (done: boolean) => ({ id: "x", title: "", notes: "", assigneeId: "me", due: "", done });

describe("progress", () => {
  it("is 0% when a project has no tasks", () => {
    expect(projectProgress({ tasks: [] })).toBe(0);
    expect(isCompleted({ tasks: [] })).toBe(false);
  });
  it("is computed from completed tasks", () => {
    expect(projectProgress({ tasks: [t(true), t(false), t(false), t(true)] })).toBe(50);
    expect(isCompleted({ tasks: [t(true), t(true)] })).toBe(true);
  });
});

describe("streak", () => {
  it("counts trailing active days", () => {
    expect(streak([1, 0, 2, 3, 1])).toBe(3);
    expect(streak([1, 2, 0])).toBe(0);
  });
});

describe("match", () => {
  it("ranks a peer who teaches what I want to learn higher than none", () => {
    const aarav = PEERS.find((p) => p.id === "aarav")!;
    const m = computeMatch(DEFAULT_PROFILE, aarav);
    expect(m.score).toBeGreaterThan(0);
    expect(m.reasons.length).toBeGreaterThan(0);
  });
});
