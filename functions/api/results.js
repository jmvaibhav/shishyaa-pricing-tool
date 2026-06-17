export async function onRequestGet(context) {
  try {
    const { env, request } = context;
    const url = new URL(request.url);
    const key = url.searchParams.get("key");

    const ADMIN_KEY = env.ADMIN_VIEW_KEY || "shishyaa2026";
    if (key !== ADMIN_KEY) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const indexRaw = await env.SHISHYAA_PRICING.get("__index__");
    const index = indexRaw ? JSON.parse(indexRaw) : [];

    const submissions = [];
    for (const id of index) {
      const raw = await env.SHISHYAA_PRICING.get(id);
      if (raw) submissions.push(JSON.parse(raw));
    }

    submissions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return new Response(JSON.stringify({ submissions }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
