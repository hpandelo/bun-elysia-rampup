import { Context, Elysia, ValidationError } from "elysia";
import { openapi, fromTypes } from "@elysiajs/openapi";
import { cors } from "@elysiajs/cors";
import { usersRoutes } from "@/modules";
import { elysiaHelmet } from 'elysiajs-helmet'


export const app = new Elysia({
  prefix: '/api/v1'
});

app
  .onRequest(({ request }) => {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const timestamp = new Date().toLocaleString('sv-SE', { hour12: false });
    console.log(`${timestamp} -> ${request.method} by ${ip} (${userAgent}) to ${request.url}`);
  })
  .derive(({ request }) => ({
    ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
    userAgent: request.headers.get('user-agent') || 'unknown',
    startTime: Date.now()
  }))
  .onAfterResponse(({ request, ip, userAgent, startTime }) => {
    const timestamp = new Date().toLocaleString('sv-SE', { hour12: false });
    console.log(`${timestamp} <- ${request.method} by ${ip || 'elysia'} (${userAgent}) to ${request.url} in ${Date.now() - startTime}ms`);
  });

app.onError(({ error, status }) => {
  if (error instanceof ValidationError) {
    return status(422, error.valueError);
  }

  return status(500, 'Internal Server Error');
})

// Register OpenAPI Generator
app.use(openapi({
  enabled: true, // Can be disabled if isProduction (like DOPPLER_ENV !== 'production' || INFISICAL similar)
  path: '/openapi',
  references: fromTypes(
    process.env.NODE_ENV === 'production'
      ? 'dist/index.d.ts'
      : 'src/index.ts'
  )
}));

// Register Helmet
// https://www.npmjs.com/package/elysiajs-helmet
app.use(elysiaHelmet({}))

// Register CORS
// https://www.npmjs.com/package/@elysiajs/cors
app.use(cors({
    origin: ({}) => true
}));

app.get('/', () => 'Aowwwba Mundão véio sem porteiraa!');

app.use(usersRoutes);
