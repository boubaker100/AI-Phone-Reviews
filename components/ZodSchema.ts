import { z } from "zod";

export const PhoneQuerySchema = z.object({
  query: z
    .string()
    .min(2, "Phone name is too short")
    .max(50, "Phone name is too long")
.regex(/^[a-zA-Z0-9\s\+\-\_\.\(\)\/\#&]+$/, "Phone name contains invalid characters")
});
