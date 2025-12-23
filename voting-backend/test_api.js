const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';
const ELECTION_ID = 'TEST_ELECTION_' + Date.now();

async function runTests() {
    try {
        console.log('--- Starting Module 1 Integration Tests ---');

        // 1. Admin: Create Election
        console.log(`\n1. Creating Election (${ELECTION_ID})...`);
        const createRes = await axios.post(`${BASE_URL}/elections`, {
            election_id: ELECTION_ID,
            election_name: 'Module 1 Test Election',
            creator_name: 'Admin Tester'
        });
        console.log('✅ Election Created:', createRes.data);

        // 2. Admin: Register User (Generate Token)
        console.log('\n2. Registering User (Generating Token)...');
        const userRes = await axios.post(`${BASE_URL}/tokens/register-user`, {
            election_id: ELECTION_ID,
            full_name: 'Jane Doe'
        });
        console.log('✅ User Registered. Token:', userRes.data.token.token);
        const token = userRes.data.token.token;

        // 3. Admin: Setup Election (Candidates & Timings)
        console.log('\n3. Setting up Election...');
        await axios.post(`${BASE_URL}/elections/setup`, {
            election_id: ELECTION_ID,
            candidates: [
                { candidate_name: 'Alice', symbol_name: 'Eagle' },
                { candidate_name: 'Bob', symbol_name: 'Lion' }
            ],
            start_time: new Date().toISOString(),
            end_time: new Date(Date.now() + 86400000).toISOString(),
            result_time: new Date(Date.now() + 172800000).toISOString()
        });
        console.log('✅ Election Setup Configured');

        // 4. Admin: Complete Setup (Start Timer)
        console.log('\n4. Completing Setup (Registration Starts)...');
        await axios.post(`${BASE_URL}/elections/complete-setup`, {
            election_id: ELECTION_ID
        });
        console.log('✅ Setup Completed. Status should be "registration"');

        // 5. User: Register (ZK Identity)
        console.log('\n5. User Registration (Submitting Commitment)...');
        const commitment = '0x' + Array(64).fill('a').join(''); // Mock commitment

        await axios.post(`${BASE_URL}/register`, {
            election_id: ELECTION_ID,
            token: token,
            commitment: commitment
        });
        console.log(`✅ Voter registered with commitment ${commitment}`);

        // 6. Manual Trigger for Merkle Root (Simulating Timer or Manual Close)
        console.log('\n6. Closing Registration (Generating Merkle Root)...');
        const closeRes = await axios.post(`${BASE_URL}/elections/close-registration`, {
            election_id: ELECTION_ID
        });
        console.log('✅ Registration Closed. Merkle Root:', closeRes.data.merkle_root);
        const merkleRoot = closeRes.data.merkle_root;

        // 7. Verify Merkle Root Helper
        console.log('\n7. Verifying Merkle Root via GET...');
        const rootRes = await axios.get(`${BASE_URL}/elections/${ELECTION_ID}/merkle-root`);
        console.log('✅ Fetched Root:', rootRes.data.merkle_root);

        if (rootRes.data.merkle_root === merkleRoot) {
            console.log('   MATCHED!');
        } else {
            console.error('   MISMATCH!');
        }

        console.log('\n--- Tests Completed Successfully ---');

    } catch (error) {
        console.error('\n❌ TEST FAILED');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

runTests();
