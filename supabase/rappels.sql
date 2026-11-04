-- Entre nous · rappels : à coller une fois dans SQL Editor › New query › Run (après avoir créé la fonction « rappels »)
create table if not exists public.rappels_secrets (
  id int primary key,
  vapid_pub text not null,
  vapid_priv text not null,
  cle text not null
);
alter table public.rappels_secrets enable row level security;  -- aucune règle : personne ne la lit, sauf le serveur

-- chaque téléphone n'a qu'un abonnement, et chacune ne touche qu'aux siens
create unique index if not exists abonnements_endpoint_unique on public.abonnements (endpoint);
alter table public.abonnements enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'abonnements' and policyname = 'abonnements_les_miens') then
    create policy abonnements_les_miens on public.abonnements for all to authenticated
      using (user_id::text = auth.uid()::text) with check (user_id::text = auth.uid()::text);
  end if;
end $$;

create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.unschedule('rappels-entre-nous') where exists (select 1 from cron.job where jobname = 'rappels-entre-nous');
select cron.schedule('rappels-entre-nous', '*/5 * * * *', $$
  select net.http_post(
    url := 'https://aoafqsipzymeehcswzto.supabase.co/functions/v1/rappels',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-cle', (select cle from public.rappels_secrets where id = 1)),
    body := '{}'::jsonb
  );
$$);
