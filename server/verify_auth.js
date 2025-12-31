const http = require('http');
const fs = require('fs');

const logFile = 'verification_result_2.txt';
// Check which log file exists
const serverLog = 'server_log_verify_2.txt';

function log(message) {
    fs.appendFileSync(logFile, message + '\n');
    console.log(message);
}

// Clear log file
fs.writeFileSync(logFile, 'Starting Verification 2...\n');

// Read server log
try {
    if (fs.existsSync(serverLog)) {
        const content = fs.readFileSync(serverLog);
        log(`--- ${serverLog} Dump ---`);
        // Try to decode manually if it looks like utf16
        // But readFileSync returns buffer.
        // If it starts with FF FE, it's utf16le.
        if (content.length > 2 && content[0] === 0xFF && content[1] === 0xFE) {
            log(content.toString('utf16le'));
        } else {
            log(content.toString('utf8'));
        }
        log('-----------------------');
    } else {
        log('Server log file not found.');
    }
} catch (e) {
    log('Error reading server log: ' + e.message);
}

function makeRequest(path, method, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data ? Buffer.byteLength(data) : 0
            },
            timeout: 5000 // 5s timeout
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, body }));
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request Timeout'));
        });

        req.on('error', (e) => reject(e));
        if (data) req.write(data);
        req.end();
    });
}

async function verify() {
    try {
        const user = {
            username: 'verifyuser_' + Date.now(),
            email: 'verify_' + Date.now() + '@example.com',
            password: 'password123'
        };

        log(`Registering user: ${user.username}`);
        try {
            const regRes = await makeRequest('/api/auth/register', 'POST', JSON.stringify(user));
            log(`Register Status: ${regRes.statusCode}`);
            log(`Register Body: ${regRes.body}`);

            if (regRes.statusCode !== 200) {
                log('Registration failed. Aborting login test.');
                return;
            }

            log('Logging in...');
            const loginRes = await makeRequest('/api/auth/login', 'POST', JSON.stringify({
                email: user.email,
                password: user.password
            }));
            log(`Login Status: ${loginRes.statusCode}`);
            log(`Login Body: ${loginRes.body}`);
        } catch (e) {
            log('Request Error: ' + e.message);
        }

    } catch (err) {
        log('Verification Error: ' + err.message);
    }
}

verify();
