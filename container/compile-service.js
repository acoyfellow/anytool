import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

console.log('Starting Bun compilation service...');
console.log('Bun version:', Bun.version);
console.log('Platform:', process.platform);
console.log('Working directory:', process.cwd());
console.log('Environment:', process.env.NODE_ENV);
console.log('Process argv:', process.argv);
console.log('Available commands check...');

// Check if required commands are available
try {
  console.log('Testing bun install...');
  const proc = Bun.spawn(['bun', '--version'], { stdout: 'pipe' });
  const testResult = await new Response(proc.stdout).text();
  console.log('Bun test result:', testResult);
} catch (error) {
  console.error('Bun test failed:', error);
}

try {
  console.log('Testing mkdir...');
  const proc = Bun.spawn(['mkdir', '--help'], { stdout: 'pipe' });
  await new Response(proc.stdout).text();
  console.log('mkdir available');
} catch (error) {
  console.error('mkdir test failed:', error);
}

// Skip network connectivity test in production to avoid startup issues

try {
  console.log('Attempting to start server on 0.0.0.0:8080...');

  const server = Bun.serve({
    port: 8080,
    hostname: "0.0.0.0",
    development: false,
    async fetch(req) {
    const url = new URL(req.url);

    // Health check endpoints
    if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/ping' || url.pathname === '/_health')) {
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
      console.log("Environment check:", {
        platform: process.platform,
        cwd: process.cwd(),
        tmpDir: '/tmp',
        bunVersion: Bun.version
      });

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
      console.error("Error stack:", error.stack);
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        cause: error.cause
      });
      return new Response(JSON.stringify({
        error: error.message,
        stack: error.stack,
        details: error.toString()
      }), {
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

    // Use bun to install packages and bundle code
    console.log("Installing packages and bundling code with bun");

    // Create temporary directory for this compilation
    const tempDir = `/tmp/compile-${Date.now()}`;
    await runCommand('mkdir', ['-p', tempDir], process.cwd());

    try {
      // Write the code to a file
      await fs.writeFile(`${tempDir}/index.js`, code);

      // Create package.json with the required packages
      const packageJson = {
        name: "temp-tool",
        version: "1.0.0",
        type: "module",
        dependencies: {}
      };

      // Add packages as dependencies with specific versions to avoid resolution issues
      const packageVersions = {
        'uuid': '^9.0.0',
        'marked': '^5.0.0',
        'qrcode-generator': '^1.4.4',
        'jsonwebtoken': '^9.0.0',
        'zxcvbn': '^4.4.2',
        'faker': '^7.6.0',
        'slugify': '^1.6.6',
        'bcryptjs': '^2.4.3',
        'chroma-js': '^2.4.2',
        'ajv': '^8.12.0',
        'sentiment': '^5.0.2'
      };

      for (const pkg of packages) {
        packageJson.dependencies[pkg] = packageVersions[pkg] || "^1.0.0";
      }

      await fs.writeFile(`${tempDir}/package.json`, JSON.stringify(packageJson, null, 2));

      // Install packages with bun
      console.log("Installing packages:", packages);
      try {
        await runCommand('bun', ['install', '--no-verify'], tempDir);
        console.log("Bun install completed successfully");
      } catch (installError) {
        console.error("Bun install failed:", installError);
        console.error("Install error details:", installError.message);
        throw new Error(`Package installation failed: ${installError.message}`);
      }

      // Bundle with bun
      console.log("Bundling code...");
      const { stdout } = await runCommand('bun', ['build', 'index.js', '--outdir', '.', '--target', 'browser'], tempDir, true);

      // Read the bundled output
      const bundledCode = await fs.readFile(`${tempDir}/index.js`, 'utf8');

      console.log("Bundling successful, output size:", bundledCode.length);

      return {
        mainCode: bundledCode,
        additionalModules: {},
        packages: packages
      };

    } finally {
      // Clean up temp directory
      try {
        await runCommand('rm', ['-rf', tempDir], process.cwd());
      } catch (cleanupError) {
        console.warn("Failed to clean up temp directory:", cleanupError);
      }
    }
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
  console.log('Bun compilation service listening on 0.0.0.0:8080');
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