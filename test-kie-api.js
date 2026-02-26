const fs = require('fs');
const path = require('path');

async function verifyKieIntegration() {
    console.log('--- KIE.ai Integration Verification ---');

    // 1. Check environment variable
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        if (envContent.includes('KIE_API_KEY=')) {
            console.log('✅ KIE_API_KEY found in .env.local');
        } else {
            console.log('❌ KIE_API_KEY missing in .env.local');
        }
    } else {
        console.log('⚠️ .env.local not found, checking process.env...');
        if (process.env.KIE_API_KEY) {
            console.log('✅ KIE_API_KEY found in environment');
        } else {
            console.log('❌ KIE_API_KEY not found');
        }
    }

    // 2. Validate Client Implementation
    const clientPath = path.join(process.cwd(), 'lib/ai/kie-client.ts');
    const clientContent = fs.readFileSync(clientPath, 'utf8');

    const requiredParams = [
        'customMode',
        'instrumental',
        'model',
        'callBackUrl',
        'https://api.kie.ai/api/v1/generate'
    ];

    let allParamsFound = true;
    requiredParams.forEach(param => {
        if (clientContent.includes(param)) {
            console.log(`✅ Client contains: ${param}`);
        } else {
            console.log(`❌ Client missing: ${param}`);
            allParamsFound = false;
        }
    });

    // 3. Validate Internal Route
    const routePath = path.join(process.cwd(), 'app/api/ai/generate/route.ts');
    const routeContent = fs.readFileSync(routePath, 'utf8');
    if (routeContent.includes('kieClient.generate(body)')) {
        console.log('✅ Internal route simplified as proxy');
    } else {
        console.log('❌ Internal route not using simplified client');
    }

    console.log('--- Verification Complete ---');
}

verifyKieIntegration();
