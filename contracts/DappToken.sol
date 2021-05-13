// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract DappToken
{
    string public name = "Dapp Token";
    string public symbol = "DAPP";
    string public version = "Dapp Token v0.1.0";
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor (uint256 _initialSupply) public
    {
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply; // allocate the initial supply
    }

    function transfer(address _to, uint256 _value) public returns (bool _success)
    {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}