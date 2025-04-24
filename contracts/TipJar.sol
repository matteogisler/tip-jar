// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract TipJar {
    address payable public owner;
    mapping(address => uint) public tipsReceived;

    event Tip(address indexed from, uint amount);
    event Withdraw(uint256 amount);

    constructor(){
        owner = payable(msg.sender);
    }

    function tip() external payable {
        require(msg.value > 0, "Please donate more than 0");
        tipsReceived[msg.sender] += msg.value;
        emit Tip(msg.sender, msg.value);
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "Only Owner");
        _;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        owner.transfer(balance);
        emit Withdraw(balance);
    }

    function getTotalTips() external view returns (uint256) {
        return address(this).balance;
    }
}
