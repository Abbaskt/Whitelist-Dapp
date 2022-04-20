// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Whitelist {

    uint8 public maxWhitelistedAddress;

    uint8 public numAddressesWhitelisted;

    mapping(address => bool) public whitelistedAddress;

    constructor(uint8 _maxWhitelistedAddress) {
        maxWhitelistedAddress = _maxWhitelistedAddress;
    }

    function addAddressToWhitelist() public {
        require(!whitelistedAddress[msg.sender], "Sender is already present in whitelist");
        require(numAddressesWhitelisted < maxWhitelistedAddress, "Max limit reached");
        whitelistedAddress[msg.sender] = true;
        numAddressesWhitelisted += 1;
    }
}