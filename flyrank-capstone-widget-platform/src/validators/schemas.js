const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().email().max(160),
  password: z.string().min(8).max(100)
});

const widgetSchema = z.object({
  type: z.enum(["SIGNUP", "CONTACT", "CTA", "POPOVER"]).default("CONTACT"),
  title: z.string().min(1).max(100),
  description: z.string().max(300).optional().default(""),
  buttonText: z.string().min(1).max(50).default("Submit"),
  fields: z.array(z.object({
    name: z.string().regex(/^[a-zA-Z][a-zA-Z0-9_]*$/).max(50),
    label: z.string().min(1).max(80),
    type: z.enum(["text", "email", "tel", "textarea"]),
    required: z.boolean().default(false)
  })).min(1).max(10)
});

const submissionSchema = z.object({
  data: z.record(z.string(), z.union([z.string().max(1000), z.number(), z.boolean()])),
  website: z.string().max(200).optional().default("")
}).strict();

module.exports = { registerSchema, widgetSchema, submissionSchema };
