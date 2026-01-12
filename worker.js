export default {
  async fetch(request) {
    const url = new URL(request.url);
    const ids = (url.searchParams.get("ids") || "").trim();

    if (!ids) {
      return new Response(JSON.stringify({ error: "Missing ids" }), {
        status: 400,
        headers: corsJsonHeaders(),
      });
    }

    // Forward to AviationWeather.gov METAR endpoint
    // (We keep it raw text because your UI already parses raw METAR nicely.)
    const upstream = `https://aviationweather.gov/api/data/metar?ids=${encodeURIComponent(ids)}&format=raw&mostRecent=true`;

    const resp = await fetch(upstream);
    const text = await resp.text();

    return new Response(JSON.stringify({ ids, metar: text.trim() }), {
      status: 200,
      headers: corsJsonHeaders(),
    });
  },
};

function corsJsonHeaders() {
  return {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, OPTIONS",
    "access-control-allow-headers": "content-type",
  };
}
