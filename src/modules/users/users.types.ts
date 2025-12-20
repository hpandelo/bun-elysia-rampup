import { z } from 'zod'
import { baseItemSchema } from '../base/base.type'

export const httpParamsSchema = z.object({
  id: baseItemSchema.shape.id,
})

const userProperties = z.object({
  name: z.string()
    .min(2, "Don't you know how to type? =P")
    .max(50)
    .describe('User name (at least 2 characters and at most 50 characters)'),
})

export const userSchema = baseItemSchema.merge(userProperties)

export const createUserSchema = z.object({
  name: userProperties.shape.name,
})

export const httpBodySchema = createUserSchema;

export type UsersHttpParams = { params: z.infer<typeof httpParamsSchema> };
export type UsersHttpBody = { body: z.infer<typeof createUserSchema> };

export type User = z.infer<typeof userSchema>

export type CreateUser = z.infer<typeof createUserSchema>
