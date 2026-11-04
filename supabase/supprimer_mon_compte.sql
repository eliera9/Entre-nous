-- Entre nous · « Supprimer mon compte » : efface ton journal en ligne et ton compte e-mail.
-- À coller une seule fois dans Supabase › SQL Editor › New query › Run.
create or replace function public.supprimer_mon_compte()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.coffres where user_id = auth.uid();
  delete from public.abonnements where user_id = auth.uid();
  delete from auth.users where id = auth.uid();
end;
$$;
revoke all on function public.supprimer_mon_compte() from public, anon;
grant execute on function public.supprimer_mon_compte() to authenticated;
