const db = require('../models');
const RegistrationToken = db.RegistrationToken;
const crypto = require('crypto');

exports.generateTokenForUser = async (req, res) => {
    try {
        console.log("Receive register-user request:", req.body);
        const { election_id, full_name, voter_id } = req.body;

        if (!election_id) {
            return res.status(400).json({ message: "Election ID is required" });
        }

        const tokenString = crypto.randomBytes(16).toString('hex');

        const token = await RegistrationToken.create({
            token: tokenString,
            election_id,
            full_name,
            voter_id,
            status: 'unused'
        });

        res.status(201).json({ message: 'Token generated', token: token });
    } catch (error) {
        console.error("Error in generateTokenForUser:", error);
        if (error.name === 'SequelizeForeignKeyConstraintError' || error?.original?.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ message: `Election ID '${req.body.election_id}' does not exist. Please create a new election.` });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.generateTokens = async (req, res) => {
    // Keep bulk gen for backward compat or testing if needed, but mapped to new schema
    try {
        const { election_id, count } = req.body;
        const tokens = [];

        for (let i = 0; i < count; i++) {
            const tokenString = crypto.randomBytes(16).toString('hex');
            tokens.push({
                token: tokenString,
                election_id,
                status: 'unused'
            });
        }

        await RegistrationToken.bulkCreate(tokens);
        res.status(201).json({ message: `${count} tokens generated`, tokens });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.registerVoter = async (req, res) => {
    try {
        const { election_id, token, commitment } = req.body;

        const registration = await RegistrationToken.findOne({
            where: { token, election_id }
        });

        if (!registration) {
            return res.status(404).json({ message: 'Invalid token' });
        }

        if (registration.status === 'used') {
            return res.status(400).json({ message: 'Token already used' });
        }

        // Update token
        registration.commitment = commitment;
        registration.status = 'used';
        registration.used_at = new Date();
        await registration.save();

        res.json({ message: 'Voter registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
