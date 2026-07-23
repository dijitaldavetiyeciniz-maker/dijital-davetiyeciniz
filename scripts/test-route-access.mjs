import { spawn } from 'child_process';
import http from 'http';

const TEST_PORT = 3010;
const URL = `http://localhost:${TEST_PORT}/admin/template-showcase`;

const scenarios = [
  { env: { NODE_ENV: 'development', ENABLE_TEMPLATE_SHOWCASE: 'true' }, mode: 'dev', expectedStatus: 200 },
  { env: { NODE_ENV: 'development', ENABLE_TEMPLATE_SHOWCASE: 'false' }, mode: 'dev', expectedRedirect: '/giris-yap' },
  { env: { NODE_ENV: 'production', VERCEL_ENV: 'preview', ENABLE_TEMPLATE_SHOWCASE: 'true' }, mode: 'start', expectedRedirect: '/giris-yap' },
  { env: { NODE_ENV: 'production', ENABLE_TEMPLATE_SHOWCASE: 'true' }, mode: 'start', expectedRedirect: '/giris-yap' }
];

async function waitForServer() {
  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${TEST_PORT}`, (res) => resolve(res.statusCode));
        req.on('error', reject);
      });
      return true;
    } catch {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  return false;
}

async function checkRoute() {
  return new Promise((resolve) => {
    http.get(`http://127.0.0.1:${TEST_PORT}/admin/template-showcase`, (res) => {
      resolve({ statusCode: res.statusCode, location: res.headers.location });
    }).on('error', () => resolve({ statusCode: 0 }));
  });
}

async function runScenario(scenario) {
  console.log(`\nTesting: Mode=${scenario.mode}, Env=${JSON.stringify(scenario.env)}`);
  
  const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const args = scenario.mode === 'dev' ? ['run', 'dev', '--', '-p', TEST_PORT.toString()] : ['run', 'start', '--', '-p', TEST_PORT.toString()];
  
  const server = spawn(cmd, args, {
    env: { ...process.env, ...scenario.env },
    shell: true,
    stdio: 'ignore'
  });

  try {
    const isReady = await waitForServer();
    if (!isReady) throw new Error('Server timeout');

    const result = await checkRoute();
    let passed = false;
    
    if (scenario.expectedStatus) {
      passed = result.statusCode === scenario.expectedStatus;
      console.log(`Expected Status ${scenario.expectedStatus}, got ${result.statusCode} -> ${passed ? 'PASS' : 'FAIL'}`);
    } else if (scenario.expectedRedirect) {
      // 307 Temporary Redirect is Next.js default for middleware
      passed = [302, 307, 308].includes(result.statusCode) && result.location.includes(scenario.expectedRedirect);
      console.log(`Expected Redirect to ${scenario.expectedRedirect}, got ${result.statusCode} to ${result.location} -> ${passed ? 'PASS' : 'FAIL'}`);
    }

    if (!passed) process.exitCode = 1;
  } finally {
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', server.pid, '/f', '/t']);
    } else {
      process.kill(-server.pid);
      server.kill();
    }
    await new Promise(r => setTimeout(r, 1000));
  }
}

async function main() {
  // Production test requires build first
  console.log('Building for production test...');
  await new Promise((resolve) => {
    const build = spawn('npm', ['run', 'build'], { shell: true, stdio: 'inherit' });
    build.on('close', resolve);
  });

  for (const s of scenarios) {
    await runScenario(s);
  }
}

main();
