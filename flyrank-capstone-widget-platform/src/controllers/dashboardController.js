const prisma = require("../config/prisma");

async function submissions(req, res) {
  const rows = await prisma.submission.findMany({
    where: { ownerId: req.user.sub },
    include: { widget: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
    take: 100
  });
  res.json(rows);
}

async function stats(req, res) {
  const ownerId = req.user.sub;
  const total = await prisma.submission.count({ where: { ownerId } });
  const byWidget = await prisma.submission.groupBy({ by: ["widgetId"], where: { ownerId }, _count: { _all: true } });
  const byCountry = await prisma.submission.groupBy({ by: ["country"], where: { ownerId }, _count: { _all: true } });
  res.json({ total, byWidget, byCountry });
}
module.exports = { submissions, stats };
