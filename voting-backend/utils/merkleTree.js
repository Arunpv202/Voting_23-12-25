const { MerkleTree } = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');

class MerkleTreeService {
    constructor(commitments = []) {
        // Commitments should be hashed buffers or hex strings
        // We assume incoming commitments are hex strings starting with '0x' or plain
        this.leaves = commitments.map(c => SHA256(c));
        this.tree = new MerkleTree(this.leaves, SHA256);
    }

    getRoot() {
        return this.tree.getHexRoot();
    }

    getProof(commitment) {
        const leaf = SHA256(commitment);
        return this.tree.getHexProof(leaf);
    }
}

module.exports = MerkleTreeService;
