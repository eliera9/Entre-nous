-- Entre nous · rappels : à coller une fois dans SQL Editor › New query › Run (après avoir créé la fonction « rappels »)
create table if not exists public.rappels_secrets (
  id int primary key,
  vapid_pub text not null,
  vapid_priv text not null,
  cle text not null
);
alter table public.rappels_secrets enable row level security;  -- aucune règle : personne ne la lit, sauf le serveur

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
