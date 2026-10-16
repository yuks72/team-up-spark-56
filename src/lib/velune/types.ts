export const CATEGORIES = [
  "Research",
  "AI & Technology",
  "Social Impact",
  "Creative",
  "Business",
  "Other",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const COMMITMENTS = ["Light (1–2 hrs/week)", "Steady (3–5 hrs/week)", "Deep (6+ hrs/week)"] as const;
export type Commitment = (typeof COMMITMENTS)[number];

export const STYLES = ["Async & independent", "Regular sync calls", "Pair-building", "Flexible mix"] as const;
export type CollabStyle = (typeof STYLES)[number];

export interface Peer {
  id: string;
  name: string;
  grade: string;
  avatar: number;
  bio: string;
  interests: string[];
  skills: string[];
  learn: string[];
  projectTypes: Category[];
  commitment: Commitment;
  style: CollabStyle;
}

export interface Profile {
  name: string;
  intro: string;
  interests: string[];
  skills: string[];
  learn: string[];
  projectTypes: Category[];
  commitment: Commitment;
  style: CollabStyle;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  done: boolean;
}
export interface Task {
  id: string;
  title: string;
  notes: string;
  assigneeId: string;
  due: string;
  done: boolean;
}
export interface CheckIn {
  id: string;
  date: string;
  completed: string;
  next: string;
  help: string;
}
export interface Project {
  id: string;
  title: string;
  description: string;
  category: Category;
  goal: string;
  skills: string[];
  targetDate: string;
  commitment: Commitment;
  memberIds: string[];
  milestones: Milestone[];
  tasks: Task[];
  checkins: CheckIn[];
}
export interface Invite {
  id: string;
  peerId: string;
  projectId: string | null;
  note: string;
  date: string;
}
export interface AppState {
  profile: Profile;
  projects: Project[];
  saved: string[];
  invites: Invite[];
  activity: number[]; // last 7 days, oldest first
}
