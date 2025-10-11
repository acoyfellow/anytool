// Minimal test server based on Go example
console.log('=== SIMPLE TEST SERVER STARTING ===');

const server = Bun.serve({
  port: 8080,
  hostname: '0.0.0.0',
  async fetch(req) {
    const url = new URL(req.url);
    console.log('=== SIMPLE TEST REQUEST:', url.pathname);

    if (url.pathname === '/_health') {
      return new Response('ok');
    }

    return new Response('Hello from SIMPLE TEST container!');
  }
});

console.log('=== SIMPLE TEST SERVER listening on 0.0.0.0:8080 ===');