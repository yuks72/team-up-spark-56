CREATE TABLE public.velune_meetings (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 owner_id uuid NOT NULL DEFAULT auth.uid(),
 title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 120),
 date date NOT NULL,
 start_time time NOT NULL,
 description text NOT NULL DEFAULT '' CHECK (length(description) <= 2000),
 project_id text,
 project_title text,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.velune_meetings TO authenticated;
GRANT ALL ON public.velune_meetings TO service_role;
ALTER TABLE public.velune_meetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners read meetings" ON public.velune_meetings FOR SELECT TO authenticated USING (owner_id = auth.uid());
CREATE POLICY "Owners create meetings" ON public.velune_meetings FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners edit meetings" ON public.velune_meetings FOR UPDATE TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners delete meetings" ON public.velune_meetings FOR DELETE TO authenticated USING (owner_id = auth.uid());
CREATE INDEX velune_meetings_owner_date_idx ON public.velune_meetings(owner_id, date, start_time);