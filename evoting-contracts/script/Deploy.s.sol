// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/Faucet.sol";
import "../src/ElectionRegistry.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();

        Faucet faucet = new Faucet();
        ElectionRegistry registry = new ElectionRegistry();

        console.log("Faucet deployed at:", address(faucet));
        console.log("ElectionRegistry deployed at:", address(registry));

        vm.stopBroadcast();
    }
}
