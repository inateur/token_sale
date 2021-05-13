const DappToken = artifacts.require("DappToken");

contract('DappToken', function(accounts)
{
    it('sets the total supply upon deployement', function()
    {
        return DappToken.deployed().then(function(instance)
        {
            return instance.totalSupply();
        }).then(function(totalSupply)
        {
            assert.equal(totalSupply.toNumber(), 10**12, 'sets the total supply to 10^12');
        });
    });
});
