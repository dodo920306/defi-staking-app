const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("DecentralBank", (accounts) => {
    let tether, rwd, decentralBank;

    const tokens = (number) => {
        return web3.utils.toWei(number);
    };

    before(async () => {
        tether = await Tether.new();
        rwd = await RWD.new();
        decentralBank = await DecentralBank.new(rwd.address, tether.address);

        await rwd.transfer(decentralBank.address, tokens("1000000"));
        await tether.transfer(accounts[1], tokens("100"), { from: accounts[0] });
    });

    describe("Mock Tether Deployment", async () => {
        it("matches name successfully", async () => {
        const name = await tether.name();
        assert.equal(name, "Mock Tether Token");
        });
    });

    describe("Reward Token Deployment", async () => {
        it("matches name successfully", async () => {
        const name = await rwd.name();
        assert.equal(name, "Reward Token");
        });
    });

    describe("Decentral Bank Deployment", async () => {
        it("matches name successfully", async () => {
        const name = await decentralBank.name();
        assert.equal(name, "Decentral Bank");
        });

        it("contract has tokens", async () => {
        let balance = await rwd.balanceOf(decentralBank.address);
        assert.equal(balance, tokens("1000000"));
        });
    });

    describe("Yield Farming", async () => {
        it("reward tokens for staking", async () => {
        let result = await tether.balanceOf(accounts[1]);
        assert.equal(
            result.toString(),
            tokens("100"),
            "customer mock wallet balance before staking."
        );

        await tether.approve(decentralBank.address, tokens("100"), {
            from: accounts[1],
        });
        await decentralBank.depositTokens(tokens("100"), { from: accounts[1] });

        result = await tether.balanceOf(accounts[1]);
        assert.equal(
            result.toString(),
            tokens("0"),
            "customer mock wallet balance after staking."
        );

        result = await tether.balanceOf(decentralBank.address);
        assert.equal(
            result.toString(),
            tokens("100"),
            "decentral bank wallet balance after staking."
        );

        result = await decentralBank.isStaking(accounts[1]);
        assert.equal(
            result.toString(),
            "true",
            "customer staking status after staking."
        );

        await decentralBank.issueTokens({ from: accounts[0] });
        await decentralBank.issueTokens({ from: accounts[1] }).should.be.rejected;
        
        await decentralBank.unstakeTokens({from:accounts[1]});

        result = await tether.balanceOf(accounts[1]);
        assert.equal(
            result.toString(),
            tokens("100"),
            "customer mock wallet balance after unstaking."
        );

        result = await tether.balanceOf(decentralBank.address);
        assert.equal(
            result.toString(),
            tokens("0"),
            "decentral bank wallet balance after unstaking."
        );

        result = await decentralBank.isStaking(accounts[1]);
        assert.equal(
            result.toString(),
            "false",
            "customer staking status after unstaking."
        );
    });
  });
});
