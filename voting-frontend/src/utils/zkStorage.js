import { openDB } from 'idb';
import CryptoJS from 'crypto-js';

const DB_NAME = 'ZkVotingDB';
const STORE_NAME = 'secrets';

export async function initDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'election_id' });
            }
        },
    });
}

// Encrypt data using a key derived from signature
export function encryptData(data, key) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
}

export function decryptData(ciphertext, key) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

export async function storeSecrets(election_id, secrets, encryptionKey) {
    const db = await initDB();
    const encryptedData = encryptData(secrets, encryptionKey);
    await db.put(STORE_NAME, {
        election_id,
        data: encryptedData,
        created_at: new Date().toISOString()
    });
}

export async function getSecrets(election_id, encryptionKey) {
    const db = await initDB();
    const record = await db.get(STORE_NAME, election_id);
    if (!record) return null;
    return decryptData(record.data, encryptionKey);
}
