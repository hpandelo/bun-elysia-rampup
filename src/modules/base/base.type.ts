import { z } from "zod";

export const baseItemSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable(),
})

export type BaseItem = z.infer<typeof baseItemSchema>