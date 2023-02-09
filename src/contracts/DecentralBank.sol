//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./RWD.sol";
import "./Tether.sol";

contract DecentralBank {
    string public name = "Decentral Bank";
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(RWD _rwd, Tether _tether) {
        owner = msg.sender;
        rwd = _rwd;
        tether = _tether;
    }

    function depositTokens(uint256 _amount) public {
        require(_amount > 0, "The amount can't be 0.");
        tether.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount;
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    function issueTokens() public {
        // require(msg.sender == owner, "caller must be the owner.");

        // for (uint256 index = 0; index < stakers.length; index++) {
        //     address recipient = stakers[index];
        //     uint256 balance = stakingBalance[recipient] / 9;
        //     if (balance > 0) rwd.transfer(recipient, balance);
        // }
        uint256 balance = stakingBalance[msg.sender] / 9;
        if (balance > 0) rwd.transfer(msg.sender, balance);
    }

    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, 'staking balance cannot be less than zero.');
        tether.transfer(msg.sender, balance);
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }
}
