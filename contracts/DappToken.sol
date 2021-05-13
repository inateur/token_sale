// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract DappToken
{
    // Constructor
    // Set the total number of tokens
    // Read the total number of tokens
    uint256 public totalSupply;

    constructor () public
    {
        totalSupply = 10**12;
    }
}