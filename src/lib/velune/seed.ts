import type { AppState, Peer, Profile, Project } from "./types";

export const DEFAULT_PROFILE: Profile = {
  name: "Nova Rivera",
  intro: "Curious about how technology can make learning feel less lonely. Looking for people who like to ship.",
  interests: ["AI", "Education", "Research", "Climate"],
  skills: ["Writing", "Python", "Project planning"],
  learn: ["Machine learning", "Design", "Data analysis"],
  projectTypes: ["AI & Technology", "Research", "Social Impact"],
  commitment: "Steady (3–5 hrs/week)",
  style: "Flexible mix",
};

export const PEERS: Peer[] = [
  {
    id: "aarav", name: "Aarav", grade: "Grade 11", avatar: 1,
    bio: "Builds small AI tools after school. Currently obsessed with retrieval and how models explain themselves.",
    interests: ["AI", "Research", "Education"],
    skills: ["Python", "Machine learning", "Research"],
    learn: ["Writing", "Public speaking"],
    projectTypes: ["AI & Technology", "Research"],
    commitment: "Steady (3–5 hrs/week)", style: "Pair-building",
  },
  {
    id: "mira", name: "Mira", grade: "Grade 12", avatar: 3,
    bio: "Runs a neighborhood compost drive and writes a small newsletter about local climate action.",
    interests: ["Climate", "Sustainability", "Community"],
    skills: ["Writing", "Community organizing", "Project planning"],
    learn: ["Data analysis", "Design"],
    projectTypes: ["Social Impact", "Creative"],
    commitment: "Deep (6+ hrs/week)", style: "Regular sync calls",
  },
  {
    id: "zoya", name: "Zoya", grade: "Grade 10", avatar: 5,
    bio: "Designer who reads psychology papers for fun. Wants to tell stories that make research feel human.",
    interests: ["Design", "Psychology", "Storytelling", "Education"],
    skills: ["Design", "Illustration", "Storytelling"],
    learn: ["Research", "Python"],
    projectTypes: ["Creative", "Research"],
    commitment: "Light (1–2 hrs/week)", style: "Async & independent",
  },
  {
    id: "rohan", name: "Rohan", grade: "Grade 11", avatar: 4,
    bio: "Robotics team lead. Likes taking ideas off the whiteboard and turning them into things you can hold.",
    interests: ["Robotics", "Hardware", "Product"],
    skills: ["Hardware", "CAD", "Product building"],
    learn: ["Machine learning", "Business"],
    projectTypes: ["AI & Technology", "Business"],
    commitment: "Deep (6+ hrs/week)", style: "Pair-building",
  },
  {
    id: "sam", name: "Sam", grade: "Grade 12", avatar: 2,
    bio: "Turns datasets into explainers. Believes good science communication is a form of social impact.",
    interests: ["Science communication", "Climate", "Education"],
    skills: ["Data analysis", "Writing", "Video editing"],
    learn: ["Design", "Machine learning"],
    projectTypes: ["Social Impact", "Research"],
    commitment: "Steady (3–5 hrs/week)", style: "Flexible mix",
  },
  {
    id: "anaya", name: "Anaya", grade: "Grade 11", avatar: 1,
    bio: "Math olympiad alum exploring ML research. Happiest when proofs and experiments agree.",
    interests: ["AI", "Mathematics", "Research"],
    skills: ["Machine learning", "Mathematics", "Research"],
    learn: ["Writing", "Storytelling"],
    projectTypes: ["Research", "AI & Technology"],
    commitment: "Steady (3–5 hrs/week)", style: "Async & independent",
  },
];

const tasks = (prefix: string, list: [string, string, string, boolean][]) =>
  list.map(([title, assigneeId, due, done], i) => ({ id: `${prefix}t${i}`, title, notes: "", assigneeId, due, done }));

const SEED_PROJECTS: Project[] = [
  {
    id: "ai-learning",
    title: "AI for Everyday Learning",
    description: "A study companion that turns class notes into gentle, spaced practice questions.",
    category: "AI & Technology",
    goal: "Ship a working prototype that 20 classmates use for two weeks.",
    skills: ["Python", "Machine learning", "Design"],
    targetDate: "2026-12-12",
    commitment: "Steady (3–5 hrs/week)",
    memberIds: ["me", "aarav", "anaya"],
    milestones: [
      { id: "m1", title: "Collect sample notes", date: "2026-10-05", done: true },
      { id: "m2", title: "Question generator v1", date: "2026-10-24", done: false },
      { id: "m3", title: "Pilot with classmates", date: "2026-11-20", done: false },
    ],
    tasks: tasks("a", [
      ["Survey 15 students on study habits", "me", "2026-09-28", true],
      ["Gather anonymized note samples", "aarav", "2026-10-02", true],
      ["Prototype prompt templates", "anaya", "2026-10-08", true],
      ["Write evaluation rubric", "me", "2026-10-12", true],
      ["Build note upload flow", "aarav", "2026-10-15", true],
      ["Spaced-repetition scheduler", "anaya", "2026-10-22", false],
      ["Design practice screen", "me", "2026-10-26", false],
      ["Recruit pilot testers", "me", "2026-11-05", false],
    ]),
    checkins: [
      { id: "c1", date: "2026-10-11", completed: "Finished the evaluation rubric.", next: "Start the practice screen layout.", help: "Feedback on whether questions feel too easy." },
    ],
  },
  {
    id: "climate-lab",
    title: "Youth Climate Action Lab",
    description: "A monthly toolkit helping students run small, measurable climate projects at school.",
    category: "Social Impact",
    goal: "Publish three toolkits and help two schools run a pilot action.",
    skills: ["Writing", "Community organizing", "Data analysis"],
    targetDate: "2027-01-30",
    commitment: "Light (1–2 hrs/week)",
    memberIds: ["me", "mira", "sam"],
    milestones: [
      { id: "m1", title: "First toolkit draft", date: "2026-10-30", done: false },
      { id: "m2", title: "Partner school confirmed", date: "2026-11-14", done: false },
    ],
    tasks: tasks("c", [
      ["Map existing school initiatives", "mira", "2026-10-01", true],
      ["Draft energy-audit worksheet", "me", "2026-10-09", true],
      ["Find baseline data sources", "sam", "2026-10-20", false],
      ["Write toolkit intro", "me", "2026-10-25", false],
      ["Email two partner schools", "mira", "2026-10-28", false],
      ["Design toolkit cover", "me", "2026-11-02", false],
    ]),
    checkins: [],
  },
  {
    id: "research-collective",
    title: "The Student Research Collective",
    description: "A shared space for students to publish short, peer-reviewed research briefs.",
    category: "Research",
    goal: "Publish an issue of five reviewed briefs by spring.",
    skills: ["Research", "Writing", "Design"],
    targetDate: "2027-03-15",
    commitment: "Steady (3–5 hrs/week)",
    memberIds: ["me", "zoya", "sam"],
    milestones: [
      { id: "m1", title: "Submission guidelines", date: "2026-11-06", done: false },
    ],
    tasks: tasks("r", [
      ["Define review process", "me", "2026-10-10", true],
      ["Draft submission guidelines", "me", "2026-10-30", false],
      ["Brand & layout system", "zoya", "2026-11-04", false],
      ["Reach out to 10 student writers", "sam", "2026-11-10", false],
      ["Set up shared review doc", "me", "2026-11-12", false],
    ]),
    checkins: [],
  },
];

export function makeSeed(): AppState {
  return {
    profile: { ...DEFAULT_PROFILE },
    projects: structuredClone(SEED_PROJECTS),
    saved: ["anaya"],
    invites: [],
    activity: [2, 0, 3, 1, 2, 4, 1],
  };
}
