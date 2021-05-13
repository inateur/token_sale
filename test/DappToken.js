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

    it('approves tokens for delegated transfer', function()
    {
        return DappToken.deployed().then(function(instance)
        {
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 100);
        }).then(function(success)
        {
            assert.equal(success, true, 'returns success status');
            return tokenInstance.approve(accounts[1], 100);
        }).then(function(receipt)
        {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'event is named "Approval"');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer ammount');
            return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function(allowance)
        {
            assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer');
        });
    });

    it('handles delegated transfers', function()
    {
        return DappToken.deployed().then(function(instance)
        {
            tokenInstance = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            return tokenInstance.transfer(fromAccount, 1000, { from: accounts[0] });
        }).then(function(receipt)
        {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].args._value, 1000, 'logs the transfer ammount');
            return tokenInstance.approve(spendingAccount, 100, { from: fromAccount });
        }).then(function(receipt)
        {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].args._value, 100, 'value should be 100');
            return tokenInstance.transferFrom(fromAccount, toAccount, 2000, { from: spendingAccount });
        }).then(assert.fail).catch(function(error)
        {
            assert(error.message.indexOf('revert') >= 0, 'error.message.toString()');
            return tokenInstance.transferFrom(fromAccount, toAccount, 200, { from: spendingAccount });
        }).then(assert.fail).catch(function(error)
        {
            assert(error.message.indexOf('revert') >= 0, 'error.toString()');
            return tokenInstance.transferFrom.call(fromAccount, toAccount, 100, { from: spendingAccount });
        }).then(function(success)
        {
            assert.equal(success, true, 'it should return true');
            return tokenInstance.transferFrom(fromAccount, toAccount, 100, { from: spendingAccount });
        }).then(function(receipt)
        {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'names the event');
            assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer ammount');
            return tokenInstance.balanceOf(fromAccount);
        }).then(function(balance)
        {
            assert.equal(balance.toNumber(), 900, 'deducts the ammount from the sending account');
            return tokenInstance.balanceOf(toAccount);
        }).then(function(balance)
        {
            assert.equal(balance.toNumber(), 100, 'adds the ammount to the receiving account');
            return tokenInstance.allowance(fromAccount, spendingAccount);
        }).then(function(allowance)
        {
            assert.equal(allowance.toNumber(), 0, 'deducts the ammount from the spending account allowance')
        });
    });
});
