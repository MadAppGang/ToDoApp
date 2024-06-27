import app from './src/server.ts'

Bun.serve({
  fetch: app.fetch,
})


