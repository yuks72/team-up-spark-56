import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { MeetingDraft } from "@/lib/velune/meetings";

export function useMeetings() {
  const [owner, setOwner] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [authError, setAuthError] = useState("");
  const queryClient = useQueryClient();
  useEffect(() => {
    let alive = true;
    supabase.auth.getUser().then(({ data, error }) => {
      if (!alive) return;
      setOwner(data.user?.id ?? null);
      if (error && error.name !== "AuthSessionMissingError") setAuthError("We couldn't check your sign-in. Please refresh and try again.");
      setChecking(false);
    }).catch(() => { if (alive) { setAuthError("We couldn't check your sign-in. Please refresh and try again."); setChecking(false); } });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setOwner(session?.user.id ?? null); setChecking(false); setAuthError("");
        queryClient.removeQueries({ queryKey: ["velune-meetings"] });
      }
    });
    return () => { alive = false; subscription.unsubscribe(); };
  }, [queryClient]);
  const key = ["velune-meetings", owner];
  const query = useQuery({
    queryKey: key,
    enabled: !!owner,
    queryFn: async () => {
      if (!owner) return [];
      const { data, error } = await supabase.from("velune_meetings").select("*").eq("owner_id", owner).order("date").order("start_time");
      if (error) throw error;
      return data;
    },
  });
  const save = useMutation({
    mutationFn: async ({ id, draft }: { id: string | undefined; draft: MeetingDraft }) => {
      if (!owner) throw new Error("Sign in to save meetings.");
      const payload = { ...draft, owner_id: owner };
      const result = id
        ? await supabase.from("velune_meetings").update(payload).eq("id", id).eq("owner_id", owner).select().single()
        : await supabase.from("velune_meetings").insert(payload).select().single();
      if (result.error) throw result.error;
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      if (!owner) throw new Error("Sign in to delete meetings.");
      const { data, error } = await supabase.from("velune_meetings").delete().eq("id", id).eq("owner_id", owner).select("id").single();
      if (error || !data) throw error ?? new Error("Meeting not found.");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });
  return { owner, checking, authError, query, save, remove };
}