import { z } from "zod";

export const playerSchema = z.object({
  name: z.string().min(3),
  mobile: z.string().min(10),
  village: z.string(),
});
