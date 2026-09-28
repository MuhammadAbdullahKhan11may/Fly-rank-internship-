require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("../src/config/prisma");

async function main() {
  const passwordHash = await bcrypt.hash("DemoPass123!", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: { email: "demo@example.com", passwordHash }
  });
  const count = await prisma.widget.count({ where: { ownerId: user.id } });
  if (!count) {
    await prisma.widget.create({
      data: {
        ownerId: user.id,
        type: "CONTACT",
        title: "Contact our team",
        description: "Leave your details and we will get back to you.",
        buttonText: "Send",
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "message", label: "Message", type: "textarea", required: false }
        ]
      }
    });
  }
  console.log("Seed complete. Demo login: demo@example.com / DemoPass123!");
}
main().finally(() => prisma.$disconnect());
