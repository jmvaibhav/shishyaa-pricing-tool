export async function onRequestPost(context) {
  try {
    const { env, request } = context;
    const body = await request.json();

    const { respondent_name, pricing_data, summary } = body;

    if (!respondent_name || !pricing_data) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const timestamp = new Date().toISOString();
    const submissionId = `submission:${timestamp}:${Math.random().toString(36).slice(2, 8)}`;

    const record = {
      respondent_name,
      timestamp,
      pricing_data,
      summary
    };

    await env.SHISHYAA_PRICING.put(submissionId, JSON.stringify(record));

    const indexRaw = await env.SHISHYAA_PRICING.get("__index__");
    const index = indexRaw ? JSON.parse(indexRaw) : [];
    index.push(submissionId);
    await env.SHISHYAA_PRICING.put("__index__", JSON.stringify(index));

    return new Response(JSON.stringify({ success: true, id: submissionId }), {
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
