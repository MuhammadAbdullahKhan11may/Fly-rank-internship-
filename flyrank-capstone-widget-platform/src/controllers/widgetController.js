const prisma = require("../config/prisma");
const { widgetSchema } = require("../validators/schemas");

function publicBase(req) {
  return `${req.protocol}://${req.get("host")}`;
}

async function list(req, res) {
  const widgets = await prisma.widget.findMany({ where: { ownerId: req.user.sub }, orderBy: { createdAt: "desc" } });
  res.json(widgets);
}
async function create(req, res) {
  const parsed = widgetSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid widget", details: parsed.error.flatten() });
  const widget = await prisma.widget.create({ data: { ...parsed.data, ownerId: req.user.sub } });
  res.status(201).json({ ...widget, embed: `<script src="${publicBase(req)}/widget.v1.js?id=${widget.id}"></script>` });
}
async function getOne(req, res) {
  const widget = await prisma.widget.findFirst({ where: { id: req.params.id, ownerId: req.user.sub } });
  if (!widget) return res.status(404).json({ error: "Widget not found" });
  res.json(widget);
}
async function update(req, res) {
  const parsed = widgetSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid widget", details: parsed.error.flatten() });
  const owned = await prisma.widget.findFirst({ where: { id: req.params.id, ownerId: req.user.sub } });
  if (!owned) return res.status(404).json({ error: "Widget not found" });
  res.json(await prisma.widget.update({ where: { id: owned.id }, data: parsed.data }));
}
async function remove(req, res) {
  const owned = await prisma.widget.findFirst({ where: { id: req.params.id, ownerId: req.user.sub } });
  if (!owned) return res.status(404).json({ error: "Widget not found" });
  await prisma.widget.delete({ where: { id: owned.id } });
  res.status(204).send();
}
async function config(req, res) {
  const widget = await prisma.widget.findUnique({ where: { id: req.params.id } });
  if (!widget) return res.status(404).json({ error: "Widget not found" });
  res.set("Cache-Control", "public, max-age=60");
  res.json({
    id: widget.id, type: widget.type, title: widget.title, description: widget.description,
    buttonText: widget.buttonText, fields: widget.fields
  });
}
module.exports = { list, create, getOne, update, remove, config };
