// Proxy mínimo para que la app "Diseña conmigo" hable con Grok (xAI) sin exponer la clave.
// Despliega en Cloudflare Workers (gratis). Guarda tu clave como secreto:  GROQ_KEY
// Luego, en la app, pon la URL del Worker en Ajustes -> "URL del proxy".
export default {
  async fetch(req, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });
    const body = await req.text();
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + env.GROQ_KEY },
      body,
    });
    const text = await r.text();
    return new Response(text, { status: r.status, headers: { ...cors, "Content-Type": "application/json" } });
  }
};
