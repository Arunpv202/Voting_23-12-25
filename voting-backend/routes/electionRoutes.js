const express = require('express');
const router = express.Router();
const electionController = require('../controllers/electionController');

router.post('/', electionController.createElection);
router.post('/setup', electionController.setupElection);
router.post('/complete-setup', electionController.completeSetup); // Triggers timer
router.post('/start-registration', electionController.startRegistration);
router.post('/close-registration', electionController.closeRegistration);
router.get('/:election_id/merkle-root', electionController.getMerkleRoot);
// Merkle Witness API is under /api/merkle/witness usually, but can be here or separate
// The prompt lists "Get Merkle Witness" as API #7 POST /api/merkle/witness
// So we might need a separate route file or handle it in index. 
// For now, let's put it here if the prefix matches or create a new route file.
// Let's create a separate merkle route or just keep it simple.

module.exports = router;
