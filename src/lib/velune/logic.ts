import type { Peer, Profile, Project } from "./types";

/** Progress = completed tasks / total tasks. A project with no tasks is 0%. */
export function projectProgress(p: Pick<Project, "tasks">): number {
  if (p.tasks.length === 0) return 0;
  return Math.round((p.tasks.filter((t) => t.done).length / p.tasks.length) * 100);
}

/** Completed = has at least one task and every task is done. */
export function isCompleted(p: Pick<Project, "tasks">): boolean {
  return p.tasks.length > 0 && p.tasks.every((t) => t.done);
}

/** Consecutive active days counting back from today (last array entry). */
export function streak(activity: number[]): number {
  let n = 0;
  for (let i = activity.length - 1; i >= 0; i--) {
    if ((activity[i] ?? 0) > 0) n++;
    else break;
  }
  return n;
}

const lc = (a: string[]) => a.map((s) => s.toLowerCase());
const overlap = (a: string[], b: string[]) => {
  const B = lc(b);
  return a.filter((x) => B.includes(x.toLowerCase()));
};

export type MatchLevel = "Strong overlap" | "Good overlap" | "Some overlap" | "Different paths";

export interface Match {
  score: number;
  level: MatchLevel;
  reasons: string[];
}

/** Illustrative overlap score — not a validated measure. */
export function computeMatch(me: Profile, peer: Peer): Match {
  const interests = overlap(me.interests, peer.interests);
  const theyTeach = overlap(me.learn, peer.skills);
  const iTeach = overlap(peer.learn, me.skills);
  const types = overlap(me.projectTypes, peer.projectTypes);
  const sameCommit = me.commitment === peer.commitment;
  const sameStyle = me.style === peer.style || me.style === "Flexible mix" || peer.style === "Flexible mix";

  const score =
    interests.length * 2 + theyTeach.length * 2 + iTeach.length * 2 + types.length + (sameCommit ? 2 : 0) + (sameStyle ? 1 : 0);

  const reasons: string[] = [];
  if (interests.length) reasons.push(`You both care about ${interests.slice(0, 2).join(" & ")}.`);
  if (theyTeach.length) reasons.push(`${peer.name} knows ${theyTeach[0]}, which you want to learn.`);
  if (iTeach.length) reasons.push(`You can help them with ${iTeach[0]}.`);
  if (sameCommit) reasons.push("Similar weekly commitment.");
  if (!reasons.length) reasons.push("Different focus areas — could bring a fresh perspective.");

  const level: MatchLevel = score >= 9 ? "Strong overlap" : score >= 5 ? "Good overlap" : score >= 2 ? "Some overlap" : "Different paths";
  return { score, level, reasons };
}
