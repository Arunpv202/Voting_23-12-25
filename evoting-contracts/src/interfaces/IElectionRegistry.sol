// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IElectionRegistry {
    struct Election {
        string electionId;
        string electionName;
        string[] candidateNames;
        uint256 startTime;
        uint256 endTime;
        uint256 resultTime;
        bytes32 merkleRoot;
        bytes electionPublicKey;
        bool initialized;
        bool encryptedTallyPublished;
        bool resultPublished;
    }

    struct Authority {
        address authorityAddress;
        bytes publicKey;
        bool active;
    }

    struct EncryptedVote {
        bytes ciphertext;
        bytes32 ciphertextHash;
    }

    event ElectionCreated(string electionId, string electionName);
    event AuthoritiesRegistered(string electionId, address[] authorities);
    event ElectionPublicKeySet(string electionId, bytes publicKey);
    event MerkleRootSet(string electionId, bytes32 merkleRoot);
    event VoteSubmitted(string electionId, bytes32 ciphertextHash);
    event EncryptedTallyPublished(string electionId, bytes encryptedTally);
    event PartialDecryptionSubmitted(string electionId, address authority);
    event FinalResultPublished(string electionId, bytes result);

    function createElection(
        string calldata electionId,
        string calldata electionName,
        string[] calldata candidateNames,
        uint256 startTime,
        uint256 endTime,
        uint256 resultTime
    ) external;

    function registerAuthorities(string calldata electionId, address[] calldata authorities) external;
    
    function setElectionPublicKey(string calldata electionId, bytes calldata publicKey) external;
    
    function setMerkleRoot(string calldata electionId, bytes32 merkleRoot) external;
    
    function submitVote(string calldata electionId, bytes calldata ciphertext, bytes32 ciphertextHash) external;
    
    function publishEncryptedTally(string calldata electionId, bytes calldata encryptedTally) external;
    
    function submitPartialDecryption(string calldata electionId, bytes calldata decryption) external;
    
    function publishFinalResult(string calldata electionId, bytes calldata result) external;
}
