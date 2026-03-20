import { z } from "zod";

export const exampleSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export type ExampleFormValues = z.infer<typeof exampleSchema>;
