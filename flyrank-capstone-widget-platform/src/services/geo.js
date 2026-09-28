async function fetchJson(url, timeoutMs = 2500) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`Geo HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(t);
  }
}

async function providerA(ip) {
  if (process.env.GEO_PROVIDER_A_DISABLED === "true") throw new Error("Provider A disabled");
  const data = await fetchJson(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,city`);
  if (data.status !== "success") throw new Error("Provider A failed");
  return { country: data.country || null, city: data.city || null, provider: "ip-api" };
}

async function providerB(ip) {
  if (process.env.GEO_PROVIDER_B_DISABLED === "true") throw new Error("Provider B disabled");
  const data = await fetchJson(`https://ipapi.co/${encodeURIComponent(ip)}/json/`);
  if (data.error) throw new Error("Provider B failed");
  return { country: data.country_name || null, city: data.city || null, provider: "ipapi.co" };
}

async function enrichIp(ip) {
  for (const provider of [providerA, providerB]) {
    try { return await provider(ip); } catch (_) {}
  }
  return { country: null, city: null, provider: null };
}
module.exports = { enrichIp };
