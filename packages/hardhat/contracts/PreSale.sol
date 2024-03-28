/// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import { ISablierV2LockupLinear } from "@sablier/v2-core/src/interfaces/ISablierV2LockupLinear.sol";
import { Broker, LockupLinear, UD60x18 } from "@sablier/v2-core/src/types/DataTypes.sol";
import { ISablierV2Batch } from "@sablier/v2-periphery/src/interfaces/ISablierV2Batch.sol";
import { Batch } from "@sablier/v2-periphery/src/types/DataTypes.sol";
import { EnumerableSet } from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/interfaces/IERC20.sol";

contract PreSale is Ownable {
	struct UserInfo {
		uint128 boughtAmount;
		bool claimed;
		// gap 120 bits
	}

	error EndSmallerThanStart();
	error EndSmallerThanNow();
	error SupplyZero();
	error PriceZero();
	error MaxSmallerThanMin();
	error SaleNotActive();
	error SaleNotEnded();
	error InvalidAmount();
	error MaxAmountReached();
	error MinAmountRequired();
	error AlreadyClaimed();

	IERC20 public immutable offeringToken;
	IERC20 public immutable paymentToken;
	uint256 public immutable offeringSupply;
	uint256 public immutable offeringPrice;
	ISablierV2LockupLinear public immutable sablierLockupLinear;
	ISablierV2Batch public immutable sablierBatch;

	uint40 public startTime;
	uint40 public endTime;
	uint40 public cliffDuration;
	uint40 public vestingDuration;
	uint96 public minParticipationAmount;

	uint128 public maxParticipationAmount;
	// gap 128 bits

	mapping(address user => UserInfo) public userInfo;

	constructor(
		IERC20 offeringToken_,
		IERC20 paymentToken_,
		uint40 startTime_,
		uint40 endTime_,
		uint256 offeringSupply_,
		uint256 offeringPrice_,
		uint96 minParticipationAmount_,
		uint128 maxParticipationAmount_,
		ISablierV2LockupLinear sablierLockupLinear_,
		ISablierV2Batch sablierBatch_,
		uint40 cliffDuration_,
		uint40 vestingDuration_
	) Ownable(msg.sender) {
		if (endTime_ < startTime_) revert EndSmallerThanStart();
		if (endTime_ < block.timestamp) revert EndSmallerThanNow();
		if (offeringSupply_ == 0) revert SupplyZero();
		if (offeringPrice_ == 0) revert PriceZero();
		if (maxParticipationAmount_ < minParticipationAmount_)
			revert MaxSmallerThanMin();

		offeringToken = offeringToken_;
		paymentToken = paymentToken_;
		startTime = startTime_;
		endTime = endTime_;
		offeringSupply = offeringSupply_;
		offeringPrice = offeringPrice_;
		minParticipationAmount = minParticipationAmount_;
		maxParticipationAmount = maxParticipationAmount_;
		sablierLockupLinear = sablierLockupLinear_;
		sablierBatch = sablierBatch_;
		cliffDuration = cliffDuration_;
		vestingDuration = vestingDuration_;

		// pre-approve from deployer required
		offeringToken.transferFrom(msg.sender, address(this), offeringSupply);
		offeringToken.approve(address(sablierLockupLinear), offeringSupply);
		offeringToken.approve(address(sablierBatch), offeringSupply);
	}

	function buy(uint128 amount) external {
		if (block.timestamp < startTime || block.timestamp > endTime)
			revert SaleNotActive();
		UserInfo storage user = userInfo[msg.sender];
		if (user.boughtAmount + amount > maxParticipationAmount)
			revert MaxAmountReached();
		if (user.boughtAmount + amount < minParticipationAmount)
			revert MinAmountRequired();

		userInfo[msg.sender].boughtAmount = user.boughtAmount + amount;

		uint256 paymentAmount = amount * offeringPrice;
		paymentToken.transferFrom(msg.sender, address(this), paymentAmount);
	}

	function claim() external {
		claimToUser(msg.sender);
	}

	function claimToUser(address userAddress) public {
		UserInfo memory user = userInfo[userAddress];
		if (block.timestamp < endTime) revert SaleNotEnded();
		if (user.claimed) revert AlreadyClaimed();
		if (user.boughtAmount == 0) revert InvalidAmount();

		user.claimed = true;
		uint40 vestStartTime = endTime;
		LockupLinear.CreateWithRange memory lockup = LockupLinear
			.CreateWithRange({
				sender: address(this),
				recipient: userAddress,
				totalAmount: user.boughtAmount,
				asset: offeringToken,
				cancelable: false,
				transferable: true,
				range: LockupLinear.Range({
					start: uint40(vestStartTime),
					cliff: uint40(vestStartTime + cliffDuration),
					end: uint40(vestStartTime + vestingDuration)
				}),
				broker: Broker({ fee: UD60x18.wrap(0), account: address(0) })
			});

		sablierLockupLinear.createWithRange(lockup);
	}

	function claimToUserBatch(address[] calldata users) external {
		if (block.timestamp < endTime) revert SaleNotEnded();

		Batch.CreateWithRange[] memory lockups = new Batch.CreateWithRange[](
			users.length
		);

		for (uint256 i = 0; i < users.length; i++) {
			address userAddress = users[i];
			UserInfo memory user = userInfo[userAddress];

			if (user.claimed) continue;
			if (user.boughtAmount == 0) continue;

			lockups[i] = Batch.CreateWithRange({
				sender: address(this),
				recipient: userAddress,
				totalAmount: userInfo[userAddress].boughtAmount,
				cancelable: false,
				transferable: true,
				range: LockupLinear.Range({
					start: uint40(endTime),
					cliff: uint40(endTime + cliffDuration),
					end: uint40(endTime + vestingDuration)
				}),
				broker: Broker({ fee: UD60x18.wrap(0), account: address(0) })
			});

			userInfo[userAddress].claimed = true;
		}

		sablierBatch.createWithRange(
			sablierLockupLinear,
			offeringToken,
			lockups
		);
	}

	// toto: open lp or create stream
	function withdrawPaymentToken() external onlyOwner {
		paymentToken.transfer(
			msg.sender,
			paymentToken.balanceOf(address(this))
		);
	}

	function setSalePeriod(
		uint32 startTime_,
		uint32 endTime_
	) external onlyOwner {
		if (endTime_ < startTime_) revert EndSmallerThanStart();
		if (endTime_ < block.timestamp) revert EndSmallerThanNow();
		startTime = startTime_;
		endTime = endTime_;
	}

	function setParticipationAmounts(
		uint96 minParticipationAmount_,
		uint96 maxParticipationAmount_
	) external onlyOwner {
		if (maxParticipationAmount_ < minParticipationAmount_)
			revert MaxSmallerThanMin();
		minParticipationAmount = minParticipationAmount_;
		maxParticipationAmount = maxParticipationAmount_;
	}
}
