import { Context } from 'elysia'
import { clerkClient } from './clerk.client'
import { TokenType } from '@clerk/backend/internal'
import type { PendingSessionOptions } from '@clerk/shared/types';
import { SessionAuthObject } from '@clerk/backend'

const HandshakeStatus = 'handshake';
const LocationHeader = 'location';

export const clerkResolver = async ({ request, set }: Context) => {
  const requestState = await clerkClient.authenticateRequest(
    request,
    {
      secretKey: process.env.CLERK_SECRET_KEY,
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
      acceptsToken: TokenType.SessionToken,
    },
  );

  const auth = (options?: PendingSessionOptions) =>
    requestState.toAuth(options) as SessionAuthObject;

  requestState.headers.forEach((value, key) => {
    set.headers[key] = value;
  });

  const locationHeader = requestState.headers.get(LocationHeader);
  if (locationHeader) {
    // Trigger a handshake redirect
    set.status = 307;
    return {
      auth,
    };
  }

  if (requestState.status === HandshakeStatus) {
    throw new Error('Clerk: handshake status without redirect');
  }

  return {
    auth,
  };
};