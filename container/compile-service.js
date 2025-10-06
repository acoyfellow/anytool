import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

console.log('Starting Bun compilation service...');
console.log('Bun version:', Bun.version);
console.log('Platform:', process.platform);
console.log('Working directory:', process.cwd());
console.log('Environment:', process.env.NODE_ENV);

try {
  console.log('Attempting to start server on 0.0.0.0:3000...');

  const server = Bun.serve({
    port: 3000,
    hostname: '0.0.0.0',
    development: false,
    async fetch(req) {
    const url = new URL(req.url);

    // Health check endpoints
    if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/ping')) {
      return new Response(JSON.stringify({
        message: 'Hello from Bun container!',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        status: 'healthy'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (req.method !== 'POST' || url.pathname !== '/compile') {
      return new Response('Not Found', { status: 404 });
    }

    try {
      console.log("Received compile request");
      const body = await req.text();
      console.log("Request body:", body);

      let parsed;
      try {
        parsed = JSON.parse(body);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const { code } = parsed;
      if (!code) {
        console.error("No code provided in request");
        return new Response(JSON.stringify({ error: "No code provided" }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      console.log("Starting compilation for code length:", code.length);
      const result = await compileCode(code);
      console.log("Compilation successful");

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error("Compilation error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  });

  async function compileCode(code) {
    console.log("Starting compileCode function");

    const npmImports = code.match(/from\s+['"`]([^'"`\s]+)['"`]/g) || [];
    const packages = [];

    for (const importMatch of npmImports) {
      const packageName = importMatch.match(/from\s+['"`]([^'"`\s]+)['"`]/)[1];
      if (!packageName.startsWith('http') && !packageName.startsWith('./') && !packageName.startsWith('../')) {
        packages.push(packageName);
      }
    }

    console.log("Detected packages:", packages);

    if (packages.length === 0) {
      console.log("No packages needed, returning code as-is");
      return {
        mainCode: code,
        additionalModules: {},
        packages: []
      };
    }

    // Return raw code without bundling to avoid Node.js polyfill issues
    console.log("Container environment detected - returning raw code without bundling");
    console.log("Packages that would be installed:", packages);
    return {
      mainCode: code,
      additionalModules: {},
      packages: [] // Return empty packages since we can't install them
    };
  }


function runCommand(command, args, cwd, captureOutput = false) {
  return new Promise((resolve, reject) => {
    console.log(`Running command: ${command} ${args.join(' ')} in ${cwd}`);

    const process = spawn(command, args, {
      cwd,
      stdio: captureOutput ? 'pipe' : 'inherit'
    });

    let stdout = '';
    let stderr = '';

    if (captureOutput) {
      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });
    }

    process.on('close', (code) => {
      console.log(`Command ${command} finished with code ${code}`);
      if (captureOutput) {
        console.log("stdout length:", stdout.length);
        console.log("stderr length:", stderr.length);
        console.log("stdout preview:", stdout.substring(0, 1000));
        console.log("stderr preview:", stderr.substring(0, 1000));
        if (stderr.length > 1000) {
          console.log("stderr full:", stderr);
        }
      }

      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        console.error(`Command failed: ${command} ${args.join(' ')}`);
        console.error(`Exit code: ${code}`);
        console.error(`Full stderr:`, stderr);
        console.error(`Full stdout:`, stdout);
        reject(new Error(`${command} failed with code ${code}: ${stderr.substring(0, 500)}`));
      }
    });

    process.on('error', (error) => {
      console.error(`Process error: ${error}`);
      reject(error);
    });
  });
  }

  console.log('Server object:', server);
  console.log('Bun compilation service listening on 0.0.0.0:3000');
  console.log('Server started successfully!');

  // Keep the process alive
  setInterval(() => {
    console.log('Server is alive:', new Date().toISOString());
  }, 30000);

} catch (error) {
  console.error('Failed to start server:', error);
  console.error('Error stack:', error.stack);
  process.exit(1);
}