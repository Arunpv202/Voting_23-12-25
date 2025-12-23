// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IElectionRegistry.sol";

contract ElectionRegistry is IElectionRegistry {
    mapping(string => Election) public elections;
    mapping(string => Authority[]) public electionAuthorities;
    mapping(string => EncryptedVote[]) public encryptedVotes;
    mapping(string => bytes) public encryptedTallies;
    mapping(string => mapping(address => bool)) public authoritySubmitted;
    
    // Internal mapping to track election creators for access control
    mapping(string => address) private _electionCreators;

    modifier onlyElectionCreator(string memory electionId) {
        require(msg.sender == _electionCreators[electionId], "Only election creator");
        _;
    }

    modifier onlyAuthority(string memory electionId) {
        bool isAuth = false;
        Authority[] memory auths = electionAuthorities[electionId];
        for (uint i = 0; i < auths.length; i++) {
            if (auths[i].authorityAddress == msg.sender && auths[i].active) {
                isAuth = true;
                break;
            }
        }
        require(isAuth, "Only registered authority");
        _;
    }

    function createElection(
        string calldata electionId,
        string calldata electionName,
        string[] calldata candidateNames,
        uint256 startTime,
        uint256 endTime,
        uint256 resultTime
    ) external override {
        require(!elections[electionId].initialized, "Election already exists");
        require(startTime < endTime, "Invalid timeline");
        require(endTime < resultTime, "Invalid timeline");

        Election storage newElection = elections[electionId];
        newElection.electionId = electionId;
        newElection.electionName = electionName;
        newElection.electionName = electionName;
        for (uint i = 0; i < candidateNames.length; i++) {
            newElection.candidateNames.push(candidateNames[i]);
        }
        newElection.startTime = startTime;
        newElection.endTime = endTime;
        newElection.resultTime = resultTime;
        newElection.initialized = true;

        _electionCreators[electionId] = msg.sender;

        emit ElectionCreated(electionId, electionName);
    }

    function registerAuthorities(string calldata electionId, address[] calldata authorities) external override onlyElectionCreator(electionId) {
        require(elections[electionId].initialized, "Election not found");
        require(electionAuthorities[electionId].length == 0, "Authorities already registered");

        for (uint i = 0; i < authorities.length; i++) {
            electionAuthorities[electionId].push(Authority({
                authorityAddress: authorities[i],
                publicKey: "", // To be populated if needed or key is just address for simplicity in this context? 
                             // Prompt says "Authority: publicKey (bytes)". Usually specific DKG key.
                             // We might need a separate function to set keys or pass them here. 
                             // The registerAuthorities signature only takes addresses. 
                             // So keys remain empty initially or added later? 
                             // Prompt doesn't have "setAuthorityKey". 
                             // I'll leave it empty as per signature.
                active: true
            }));
        }

        emit AuthoritiesRegistered(electionId, authorities);
    }

    function setElectionPublicKey(string calldata electionId, bytes calldata publicKey) external override onlyElectionCreator(electionId) {
        require(elections[electionId].initialized, "Election not found");
        elections[electionId].electionPublicKey = publicKey;
        emit ElectionPublicKeySet(electionId, publicKey);
    }

    function setMerkleRoot(string calldata electionId, bytes32 merkleRoot) external override onlyElectionCreator(electionId) {
        require(elections[electionId].initialized, "Election not found");
        elections[electionId].merkleRoot = merkleRoot;
        emit MerkleRootSet(electionId, merkleRoot);
    }

    function submitVote(string calldata electionId, bytes calldata ciphertext, bytes32 ciphertextHash) external override {
        require(elections[electionId].initialized, "Election not found");
        require(block.timestamp >= elections[electionId].startTime, "Voting not started");
        require(block.timestamp <= elections[electionId].endTime, "Voting ended");
        
        // In a real system, we'd check Merkle proof here or backend does it. 
        // Prompt says "Contract acts ONLY as a public bulletin board... All heavy cryptography OFF-CHAIN".
        // "NO voter identity stored on-chain" -> so we don't check double voting by address.
        // We just store the vote. Double voting protection is likely off-chain via ZKP (nullifiers) or similar, 
        // but prompt implies "Verification Plan... submitVote...".
        // "Contract must be ... minimal". I will just push.

        encryptedVotes[electionId].push(EncryptedVote({
            ciphertext: ciphertext,
            ciphertextHash: ciphertextHash
        }));

        emit VoteSubmitted(electionId, ciphertextHash);
    }

    function publishEncryptedTally(string calldata electionId, bytes calldata encryptedTally) external override onlyElectionCreator(electionId) {
        require(elections[electionId].initialized, "Election not found");
        require(block.timestamp > elections[electionId].endTime, "Voting not ended");
        
        encryptedTallies[electionId] = encryptedTally;
        elections[electionId].encryptedTallyPublished = true;
        
        emit EncryptedTallyPublished(electionId, encryptedTally);
    }

    function submitPartialDecryption(string calldata electionId, bytes calldata decryption) external override onlyAuthority(electionId) {
        require(elections[electionId].initialized, "Election not found");
        require(elections[electionId].encryptedTallyPublished, "Tally not published");
        require(!authoritySubmitted[electionId][msg.sender], "Already submitted");

        authoritySubmitted[electionId][msg.sender] = true;
        // In a real DKG, we'd store these shares. Prompt doesn't ask for storage of shares in a mapping, 
        // implies "Only commitments... on-chain"? 
        // "submitPartialDecryption" is in "REQUIRED FUNCTIONS".
        // I should probably emit event and maybe store if needed for "Result Registry".
        // But "Authority private shares" are OFF-CHAIN. Partial decryptions are public.
        
        emit PartialDecryptionSubmitted(electionId, msg.sender);
    }

    function publishFinalResult(string calldata electionId, bytes calldata result) external override onlyElectionCreator(electionId) {
        require(elections[electionId].initialized, "Election not found");
        // Check if enough partial decryptions? Prompt doesn't specify threshold logic on-chain (DKG off-chain).
        
        elections[electionId].resultPublished = true;
        emit FinalResultPublished(electionId, result);
    }
}
