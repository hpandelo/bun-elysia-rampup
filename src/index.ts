import { app } from './app';

app.listen(3000); // Returns this (app)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
