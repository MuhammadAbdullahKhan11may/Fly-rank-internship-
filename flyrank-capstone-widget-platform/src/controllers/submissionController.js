const prisma = require("../config/prisma");
const { submissionSchema } = require("../validators/schemas");
const { enrichIp } = require("../services/geo");
const { sendLeadNotification } = require("../services/sideEffect");

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  return (typeof forwarded === "string" ? forwarded.split(",")[0] : req.ip || "").replace("::ffff:", "").trim();
}

async function submit(req, res) {
  const widget = await prisma.widget.findUnique({ where: { id: req.params.widgetId } });
  if (!widget) return res.status(404).json({ error: "Widget not found" });

  // Honeypot: bots often fill hidden "website"; humans leave it empty.
  if (req.body && req.body.website) return res.status(202).json({ ok: true });

  const parsed = submissionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid submission", details: parsed.error.flatten() });

  const allowed = new Map(widget.fields.map(f => [f.name, f]));
  for (const field of widget.fields) {
    if (field.required && (parsed.data.data[field.name] === undefined || parsed.data.data[field.name] === "")) {
      return res.status(400).json({ error: `Missing required field: ${field.name}` });
    }
  }
  for (const key of Object.keys(parsed.data.data)) {
    if (!allowed.has(key)) return res.status(400).json({ error: `Unknown field: ${key}` });
  }

  const ip = clientIp(req);
  const geo = await enrichIp(ip);
  const submission = await prisma.submission.create({
    data: {
      widgetId: widget.id, ownerId: widget.ownerId, payload: parsed.data.data,
      ipAddress: ip || null, country: geo.country, city: geo.city, geoProvider: geo.provider
    }
  });

  // Side effect deliberately cannot make the main operation fail.
  setImmediate(async () => {
    try { await sendLeadNotification(submission); }
    catch (err) { console.error("[side-effect failed]", err.message); }
  });

  res.status(201).json({ ok: true, submissionId: submission.id });
}

module.exports = { submit };
