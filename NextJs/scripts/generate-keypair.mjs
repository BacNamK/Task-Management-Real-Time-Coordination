import { generateKeyPairSync } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const keysDirectory = join(projectRoot, 'keys');
const privateKeyPath = join(keysDirectory, 'private.pem');
const publicKeyPath = join(keysDirectory, 'public.pem');

if (existsSync(privateKeyPath) || existsSync(publicKeyPath)) {
    throw new Error('A key file already exists in the keys directory; refusing to overwrite it.');
}

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
    },
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
    },
});

mkdirSync(keysDirectory, { recursive: true, mode: 0o700 });
writeFileSync(privateKeyPath, privateKey, {
    encoding: 'utf8',
    flag: 'wx',
    mode: 0o600,
});
writeFileSync(publicKeyPath, publicKey, {
    encoding: 'utf8',
    flag: 'wx',
    mode: 0o644,
});

console.log(`Generated RSA key pair in ${keysDirectory}`);
