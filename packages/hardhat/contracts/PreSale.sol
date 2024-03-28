/// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import { ISablierV2LockupLinear } from "@sablier/v2-core/src/interfaces/ISablierV2LockupLinear.sol";
import { Broker, LockupLinear, UD60x18 } from "@sablier/v2-core/src/types/DataTypes.sol";
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
		uint96 maxParticipationAmount_,
		ISablierV2LockupLinear sablierLockupLinear_,
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
		cliffDuration = cliffDuration_;
		vestingDuration = vestingDuration_;

		// pre-approve from deployer required
		offeringToken.transferFrom(msg.sender, address(this), offeringSupply);
		offeringToken.approve(address(sablierLockupLinear), offeringSupply);
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

	function claimToUser(address user) public {
		UserInfo memory userInfo = userInfo[user];
		if (block.timestamp < endTime) revert SaleNotEnded();
		if (userInfo.claimed) revert AlreadyClaimed();
		if (userInfo.boughtAmount == 0) revert InvalidAmount();

		userInfo.claimed = true;
		uint40 vestStartTime = endTime;
		LockupLinear.CreateWithRange memory lockup = LockupLinear
			.CreateWithRange({
				sender: address(this),
				recipient: user,
				totalAmount: userInfo.boughtAmount,
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
