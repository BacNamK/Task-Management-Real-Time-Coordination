import { generateKeyPairSync } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
    },
});

const keysFolder = join(process.cwd(), 'keys');

writeFileSync(join(keysFolder, 'private.pem'), privateKey);
writeFileSync(join(keysFolder, 'public.pem'), publicKey);
