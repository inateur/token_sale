// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract DappToken
{
    string public name = "Dapp Token";
    string public symbol = "DAPP";
    string public version = "Dapp Token v0.1.0";
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    constructor (uint256 _initialSupply)
    {
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply; // allocate the initial supply
    }

    function transfer(address payable _to, uint256 _value) public returns (bool _success)
    {
        require(_value <= balanceOf[msg.sender]);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool _success)
    {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address payable _to, uint256 _value) public returns (bool _success)
    {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;
        
        emit Transfer(_from, _to, _value);
        return true;
    }
}