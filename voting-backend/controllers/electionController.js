const db = require('../models');
const Election = db.Election;
const RegistrationToken = db.RegistrationToken;
const Candidate = db.Candidate;
const MerkleTreeService = require('../utils/merkleTree');

// Helper for Auto Merkle Root Generation
const generateMerkleRoot = async (election_id) => {
    console.log(`Starting Merkle Root generation for ${election_id}`);
    try {
        const election = await Election.findByPk(election_id);
        if (!election) return;

        // Fetch used tokens with commitments
        const tokens = await RegistrationToken.findAll({
            where: {
                election_id,
                status: 'used'
            }
        });

        const commitments = tokens.map(t => t.commitment).filter(c => c);
        let root = null;

        if (commitments.length > 0) {
            const merkleService = new MerkleTreeService(commitments);
            root = merkleService.getRoot();
        } else {
            root = '0x0000000000000000000000000000000000000000000000000000000000000000';
        }

        election.merkle_root = root;
        election.status = 'setup_completed'; // Or 'voting'? Prompt says 'setup_completed' after merkle root.
        // Wait, prompt says: "Update status -> 'setup_completed'".
        await election.save();
        console.log(`Merkle Root generated for ${election_id}: ${root}`);
    } catch (error) {
        console.error(`Error generating Merkle Root for ${election_id}:`, error);
    }
};

exports.createElection = async (req, res) => {
    try {
        const { election_id, election_name, creator_name } = req.body;
        const election = await Election.create({
            election_id,
            election_name,
            creator_name,
            status: 'created'
        });
        res.status(201).json(election);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.setupElection = async (req, res) => {
    try {
        const { election_id, candidates, start_time, end_time, result_time } = req.body;

        const election = await Election.findByPk(election_id);
        if (!election) return res.status(404).json({ message: 'Election not found' });

        // Update election details
        election.start_time = start_time;
        election.end_time = end_time;
        election.result_time = result_time;
        await election.save();

        // Add candidates
        if (candidates && candidates.length > 0) {
            const candidateData = candidates.map(c => ({
                election_id,
                candidate_name: c.candidate_name,
                symbol_name: c.symbol_name
            }));
            await Candidate.bulkCreate(candidateData);
        }

        res.json({ message: 'Election setup updated', election });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.completeSetup = async (req, res) => {
    try {
        const { election_id } = req.body;
        const election = await Election.findByPk(election_id);
        if (!election) return res.status(404).json({ message: 'Election not found' });

        election.status = 'registration';
        await election.save();

        // Start 2-minute timer for Merkle Root generation
        // In production, use a job queue (Bull/Redis). Here, `setTimeout` is okay for demo.
        const TWO_MINUTES = 2 * 60 * 1000;
        setTimeout(() => generateMerkleRoot(election_id), TWO_MINUTES);

        res.json({ message: 'Registration started. Merkle Root will be generated in 2 minutes.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.startRegistration = async (req, res) => {
    // This might be redundant if completeSetup starts registration.
    // Keeping it for backward compatibility or direct calls if needed.
    try {
        const { election_id } = req.body; // Changed from election_code
        const election = await Election.findByPk(election_id);
        if (!election) return res.status(404).json({ message: 'Election not found' });

        election.status = 'registration';
        await election.save();
        res.json({ message: 'Registration started', election });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.closeRegistration = async (req, res) => {
    // Can be manually called if needed, but completeSetup schedules it automaticallly.
    // We'll leave it but update to use new function logic if desired.
    // Or just call the generator immediately.
    try {
        const { election_id } = req.body;
        await generateMerkleRoot(election_id);
        res.json({ message: 'Registration closed manually' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMerkleRoot = async (req, res) => {
    try {
        const { election_id } = req.params; // Changed param name
        const election = await Election.findByPk(election_id);
        if (!election) return res.status(404).json({ message: 'Election not found' });

        res.json({ merkle_root: election.merkle_root });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMerkleWitness = async (req, res) => {
    try {
        const { election_id, commitment } = req.body;

        const tokens = await RegistrationToken.findAll({
            where: {
                election_id,
                status: 'used'
            }
        });

        const commitments = tokens.map(t => t.commitment).filter(c => c);
        const merkleService = new MerkleTreeService(commitments);

        const proof = merkleService.getProof(commitment);

        res.json({ proof });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
