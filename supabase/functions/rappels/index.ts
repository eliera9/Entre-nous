// Entre nous · rappels (Supabase Edge Function « rappels »)
// Envoie les notifications prévues par l'app. Les textes ne contiennent jamais le contenu du journal.
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-cle",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
const json = (o: unknown, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { ...cors, "Content-Type": "application/json" } });

// Les clés d'envoi sont créées toutes seules au premier appel et restent dans une table privée.
async function secrets() {
  const { data } = await sb.from("rappels_secrets").select("*").eq("id", 1).maybeSingle();
  if (data) return data;
  const k = webpush.generateVAPIDKeys();
  const row = { id: 1, vapid_pub: k.publicKey, vapid_priv: k.privateKey, cle: crypto.randomUUID() };
  const { error } = await sb.from("rappels_secrets").insert(row);
  if (error) {
    const again = await sb.from("rappels_secrets").select("*").eq("id", 1).single();
    return again.data;
  }
  return row;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const s = await secrets();
  if (!s) return json({ erreur: "table rappels_secrets introuvable : colle d'abord rappels.sql" }, 500);
  const url = new URL(req.url);
  // L'app demande la clé publique pour s'abonner.
  if (url.searchParams.has("cle")) return json({ cle: s.vapid_pub });
  // Le minuteur (pg_cron) appelle toutes les 5 minutes avec la clé secrète.
  if (req.headers.get("x-cle") !== s.cle) return json({ erreur: "non autorisé" }, 401);
  webpush.setVapidDetails("mailto:rappels@entre-nous.app", s.vapid_pub, s.vapid_priv);
  const now = Date.now();
  const { data: subs } = await sb.from("abonnements").select("*");
  let envoyes = 0;
  for (const a of subs ?? []) {
    const plan: { at: number; t: string; b: string; k?: string; u?: string }[] = a.rappels?.plan ?? [];
    const due = plan.filter((x) => x.at <= now && x.at > now - 20 * 60000);
    const reste = plan.filter((x) => x.at > now);
    let parti = false;
    for (const x of due) {
      try {
        await webpush.sendNotification(a.cles, JSON.stringify({ t: x.t, b: x.b, k: x.k, u: x.u || "./" }), { TTL: 3600 });
        envoyes++;
      } catch (e) {
        const code = (e as { statusCode?: number }).statusCode;
        if (code === 404 || code === 410) {
          await sb.from("abonnements").delete().eq("id", a.id);
          parti = true;
          break;
        }
      }
    }
    if (!parti && reste.length !== plan.length) {
      await sb.from("abonnements").update({ rappels: { ...a.rappels, plan: reste } }).eq("id", a.id);
    }
  }
  return json({ envoyes });
});
