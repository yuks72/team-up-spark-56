import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const AV = ["bg-avatar-1", "bg-avatar-2", "bg-avatar-3", "bg-avatar-4", "bg-avatar-5"];

export function Avatar({ name, tone = 1, size = "md", className }: { name: string; tone?: number; size?: "sm" | "md" | "lg"; className?: string }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const s = size === "sm" ? "h-7 w-7 text-[10px]" : size === "lg" ? "h-14 w-14 text-lg" : "h-9 w-9 text-xs";
  return (
    <span
      aria-hidden
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-bold text-foreground ring-2 ring-card", AV[(tone - 1) % 5], s, className)}
    >
      {initials}
    </span>
  );
}

export function AvatarStack({ people }: { people: { name: string; avatar: number }[] }) {
  return (
    <div className="flex -space-x-2" aria-label={`Team: ${people.map((p) => p.name).join(", ")}`}>
      {people.map((p) => (
        <Avatar key={p.name} name={p.name} tone={p.avatar} size="sm" />
      ))}
    </div>
  );
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? "Progress"} className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${value}%` }} />
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="panel starfield flex flex-col items-center px-6 py-12 text-center">
      <OrbitMark className="mb-4 h-12 w-12 text-primary" />
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function OrbitMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <ellipse cx="24" cy="24" rx="20" ry="8" stroke="currentColor" strokeOpacity=".45" transform="rotate(-20 24 24)" />
      <circle cx="24" cy="24" r="6" fill="currentColor" />
      <circle cx="42" cy="17" r="2" fill="currentColor" fillOpacity=".8" />
    </svg>
  );
}

export function PageHeader({ eyebrow, title, text, action }: { eyebrow?: string; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {text && <p className="mt-2 max-w-xl text-muted-foreground">{text}</p>}
      </div>
      {action}
    </div>
  );
}

export function TagInput({ value, onChange, suggestions, label, id }: { value: string[]; onChange: (v: string[]) => void; suggestions: string[]; label: string; id: string }) {
  const all = Array.from(new Set([...suggestions, ...value]));
  return (
    <fieldset>
      <legend className="label-v">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {all.map((s) => {
          const on = value.includes(s);
          return (
            <button type="button" key={s} aria-pressed={on} className="chip chip-toggle" onClick={() => onChange(on ? value.filter((v) => v !== s) : [...value, s])}>
              {s}
            </button>
          );
        })}
        <input
          id={id}
          aria-label={`Add custom ${label.toLowerCase()}`}
          placeholder="+ Add your own"
          className="field !w-36 !rounded-full !py-1 !text-xs"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const v = e.currentTarget.value.trim();
              if (v && !value.includes(v)) onChange([...value, v]);
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
    </fieldset>
  );
}
