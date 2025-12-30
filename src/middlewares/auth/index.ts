

import { ClerkClient } from '@clerk/backend'
import Elysia, { Context } from 'elysia'

type AuthValidationContext = Context & {
  clerk: ClerkClient
}


const authValidationMiddleware = async ({ clerk, set, request }: AuthValidationContext) => {
  const auth = await clerk.authenticateRequest(request)

  const { userId } = auth.toAuth()

  /**
    * Access the auth state in the context.
    * See the AuthObject here https://clerk.com/docs/references/nextjs/auth-object#auth-object
    */
  if (!userId) {
    set.status = 401
    return 'Unauthorized'
  }

  /**
    * For other resource operations, you can use the clerk client from the context.
    * See what other utilities Clerk exposes here https://clerk.com/docs/references/backend/overview
    */
  const user = await clerk.users.getUser(userId)

  return { user }
}