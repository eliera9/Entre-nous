// Entre nous · rappels (Supabase Edge Function « rappels »)
// Envoie les notifications prévues par l'app. Les textes ne contiennent jamais le contenu du journal.
// Aucune dépendance externe : chiffrement Web Push (RFC 8291) et signature VAPID (RFC 8292) faits avec WebCrypto.

const URL_DB = Deno.env.get("SUPABASE_URL")!;
const CLE_SERVEUR = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SUJET = "https://eliera9.github.io/Entre-nous/";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-cle",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
const json = (o: unknown, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { ...cors, "Content-Type": "application/json" } });

// ---------- base de données (PostgREST, côté serveur) ----------
async function db(method: string, path: string, body?: unknown) {
  const r = await fetch(`${URL_DB}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: CLE_SERVEUR,
      Authorization: `Bearer ${CLE_SERVEUR}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const txt = await r.text();
  return { ok: r.ok, status: r.status, data: txt ? JSON.parse(txt) : null };
}

// ---------- petits outils ----------
const enc = new TextEncoder();
const b64u = (b: Uint8Array) =>
  btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64u = (s: string) => {
  const t = s.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(t + "===".slice((t.length + 3) % 4)), (c) => c.charCodeAt(0));
};
const concat = (...a: Uint8Array[]) => {
  const out = new Uint8Array(a.reduce((n, x) => n + x.length, 0));
  let i = 0;
  for (const x of a) { out.set(x, i); i += x.length; }
  return out;
};
async function hkdf(salt: Uint8Array, ikm: Uint8Array, info: Uint8Array, len: number) {
  const k = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, k, len * 8));
}

// ---------- clés VAPID : créées toutes seules au premier appel, gardées dans une table privée ----------
type Secrets = { id: number; vapid_pub: string; vapid_priv: string; cle: string };
async function secrets(): Promise<Secrets | null> {
  const lire = await db("GET", "rappels_secrets?select=*&id=eq.1");
  if (!lire.ok) return null;
  if (lire.data?.length) return lire.data[0];
  const kp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const pub = new Uint8Array(await crypto.subtle.exportKey("raw", kp.publicKey));
  const jwk = await crypto.subtle.exportKey("jwk", kp.privateKey);
  const row = { id: 1, vapid_pub: b64u(pub), vapid_priv: jwk.d!, cle: crypto.randomUUID() };
  const w = await db("POST", "rappels_secrets", row);
  if (!w.ok) {
    const again = await db("GET", "rappels_secrets?select=*&id=eq.1");
    return again.data?.[0] ?? null;
  }
  return row;
}

async function cleSignature(s: Secrets) {
  const pub = unb64u(s.vapid_pub);
  return crypto.subtle.importKey(
    "jwk",
    { kty: "EC", crv: "P-256", x: b64u(pub.slice(1, 33)), y: b64u(pub.slice(33, 65)), d: s.vapid_priv, ext: true },
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
}

async function vapid(endpoint: string, s: Secrets, cle: CryptoKey) {
  const aud = new URL(endpoint).origin;
  const h = b64u(enc.encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const c = b64u(enc.encode(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: SUJET })));
  const sig = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, cle, enc.encode(`${h}.${c}`)));
  return `vapid t=${h}.${c}.${b64u(sig)}, k=${s.vapid_pub}`;
}

// Chiffrement aes128gcm du message pour un téléphone (RFC 8291).
async function chiffrer(texte: string, p256dh: string, auth: string) {
  const clientPub = unb64u(p256dh);
  const secretAuth = unb64u(auth);
  const eph = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const serveurPub = new Uint8Array(await crypto.subtle.exportKey("raw", eph.publicKey));
  const clientCle = await crypto.subtle.importKey("raw", clientPub, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const partage = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: clientCle }, eph.privateKey, 256));
  const ikm = await hkdf(secretAuth, partage, concat(enc.encode("WebPush: info\0"), clientPub, serveurPub), 32);
  const sel = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(sel, ikm, enc.encode("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdf(sel, ikm, enc.encode("Content-Encoding: nonce\0"), 12);
  const k = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  const clair = concat(enc.encode(texte), new Uint8Array([2]));
  const chiffre = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, k, clair));
  const rs = new Uint8Array([0, 0, 16, 0]); // 4096
  return concat(sel, rs, new Uint8Array([serveurPub.length]), serveurPub, chiffre);
}

async function envoyer(sub: { endpoint: string; keys: { p256dh: string; auth: string } }, texte: string, s: Secrets, cle: CryptoKey) {
  const corps = await chiffrer(texte, sub.keys.p256dh, sub.keys.auth);
  const r = await fetch(sub.endpoint, {
    method: "POST",
    headers: {
      Authorization: await vapid(sub.endpoint, s, cle),
      TTL: "3600",
      Urgency: "normal",
      "Content-Encoding": "aes128gcm",
      "Content-Type": "application/octet-stream",
    },
    body: corps,
  });
  await r.body?.cancel();
  return r.status;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const s = await secrets();
    if (!s) return json({ erreur: "table rappels_secrets introuvable : colle d'abord rappels.sql" }, 500);
    const url = new URL(req.url);
    // L'app demande la clé publique pour s'abonner.
    if (url.searchParams.has("cle")) return json({ cle: s.vapid_pub });
    // Le minuteur (pg_cron) appelle toutes les 5 minutes avec la clé secrète.
    if (req.headers.get("x-cle") !== s.cle) return json({ erreur: "non autorisé" }, 401);
    const cle = await cleSignature(s);
    const now = Date.now();
    const { data: subs } = await db("GET", "abonnements?select=*");
    let envoyes = 0;
    for (const a of subs ?? []) {
      const plan: { at: number; t: string; b: string; k?: string; u?: string }[] = a.rappels?.plan ?? [];
      const due = plan.filter((x) => x.at <= now && x.at > now - 20 * 60000);
      const reste = plan.filter((x) => x.at > now);
      let parti = false;
      for (const x of due) {
        try {
          const st = await envoyer(a.cles, JSON.stringify({ t: x.t, b: x.b, k: x.k, u: x.u || "./" }), s, cle);
          if (st === 404 || st === 410) {
            await db("DELETE", `abonnements?endpoint=eq.${encodeURIComponent(a.endpoint)}`);
            parti = true;
            break;
          }
          if (st < 300) envoyes++;
        } catch (_) { /* un téléphone injoignable ne bloque pas les autres */ }
      }
      if (!parti && reste.length !== plan.length) {
        await db("PATCH", `abonnements?endpoint=eq.${encodeURIComponent(a.endpoint)}`, { rappels: { ...a.rappels, plan: reste } });
      }
    }
    return json({ envoyes });
  } catch (e) {
    return json({ erreur: String((e as Error)?.message ?? e) }, 500);
  }
});
