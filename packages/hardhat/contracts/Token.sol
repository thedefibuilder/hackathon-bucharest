/// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Capped } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract Token is ERC20Capped, ERC20Burnable, Ownable {
	bool public immutable isBurnable;

	constructor(
		string memory name,
		string memory symbol,
		uint256 maxSupply,
		uint256 premintAmount,
		bool isBurnable_
	) ERC20(name, symbol) ERC20Capped(maxSupply) Ownable(msg.sender) {
		_mint(msg.sender, premintAmount);
		isBurnable = isBurnable_;
	}

	function burn(uint256 value) public override {
		require(isBurnable, "DISABLED");
		super.burn(value);
	}

	function burnFrom(address account, uint256 value) public override {
		require(isBurnable, "DISABLED");
		super.burnFrom(account, value);
	}

	function mint(address to, uint256 value) public onlyOwner {
		_mint(to, value);
	}

	function _update(
		address from,
		address to,
		uint256 value
	) internal override(ERC20, ERC20Capped) {
		super._update(from, to, value);
	}
}
