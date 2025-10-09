#!/usr/bin/env node

const https = require('https');
const http = require('http');

function testEndpoint(url, name) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      console.log(`✅ ${name}: ${res.statusCode} ${res.statusMessage}`);
      resolve(true);
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${name}: ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log(`⏰ ${name}: Timeout`);
      req.destroy();
      resolve(false);
    });
  });
}

async function testApplication() {
  console.log('🧪 Testing T-Rex Application...\n');
  
  const tests = [
    ['http://localhost:8080/actuator/health', 'Backend Health'],
    ['http://localhost:3000/', 'Host Application'],
    ['http://localhost:3001/buying-flow.js', 'Buying Flow Bundle'],
    ['https://unpkg.com/single-spa@5.9.5/lib/system/single-spa.min.js', 'Single-SPA CDN']
  ];
  
  let passed = 0;
  for (const [url, name] of tests) {
    const result = await testEndpoint(url, name);
    if (result) passed++;
  }
  
  console.log(`\n📊 Results: ${passed}/${tests.length} tests passed`);
  
  if (passed === tests.length) {
    console.log('🎉 All systems operational! Open http://localhost:3000 in your browser.');
  } else {
    console.log('⚠️  Some services are not responding. Check the logs above.');
  }
}

testApplication().catch(console.error);
