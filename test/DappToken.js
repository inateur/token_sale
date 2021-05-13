const DappToken = artifacts.require("DappToken");

contract('DappToken', function(accounts)
{
    it('initializes the contract with the correct values', function()
    {
        return DappToken.deployed().then(function(instance)
        {
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name)
        {
            assert.equal(name, 'Dapp Token', 'has the correct name');
            return tokenInstance.symbol();
        }).then(function(symbol)
        {
            assert.equal(symbol, 'DAPP', 'has the correct symbol');
            return tokenInstance.version();
        }).then(function(version)
        {
            assert.equal(version, 'Dapp Token v0.1.0');
        });
    });

    it('sets and allocates the total supply upon deployement', function()
    {
        return DappToken.deployed().then(function(instance)
        {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply)
        {
            assert.equal(totalSupply.toNumber(), 10**12, 'sets the total supply to 10^12');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance)
        {
            assert.equal(adminBalance.toNumber(), 10**12, 'allocates the initial supply to the admin account');
        });
    });

    it('transfers tokens to other account', function()
    {
        return DappToken.deployed().then(function(instance)
        {
            return tokenInstance.transfer.call(accounts[1], 10**13);
        }).then(assert.fail).catch(function(error)
        {
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
            return tokenInstance.transfer.call(accounts[1], 250000000000, { from: accounts[0] });
        }).then(function(success)
        {
            assert.equal(success, true, 'it returns true');
            return tokenInstance.transfer(accounts[1], 250000000000, { from: accounts[0] });
        }).then(function(receipt)
        {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'event is named "Transfer"');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value, 25*10**10, 'logs the transfer ammount');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance)
        {
            assert.equal(balance.toNumber(), 75*10**10, 'adds the ammount to the receiving account');
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance)
        {
            assert.equal(balance.toNumber(), 25*10**10, 'substracts the ammount from the sending account');
        });
    });
});
