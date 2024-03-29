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
		uint256 streamId;
		uint128 boughtAmount;
		// gap 128 bits
	}

	struct OfferingConfig {
		IERC20 token;
		IERC20 paymentToken;
		uint256 supply;
		uint128 price;
		uint96 minParticipationAmount;
		uint128 maxParticipationAmount;
		uint40 startTime;
		uint40 endTime;
	}

	struct VestingConfig {
		ISablierV2LockupLinear sablierLockupLinear;
		ISablierV2Batch sablierBatch;
		uint40 cliffDuration;
		uint40 vestingDuration;
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
	ISablierV2LockupLinear public immutable sablierLockupLinear;
	ISablierV2Batch public immutable sablierBatch;

	uint40 public startTime;
	uint40 public endTime;
	uint40 public cliffDuration;
	uint40 public vestingDuration;
	uint96 public minParticipationAmount;

	uint128 public maxParticipationAmount;
	uint128 public offeringPrice;

	mapping(address user => UserInfo) public userInfo;

	constructor(
		OfferingConfig memory offeringConfig,
		VestingConfig memory vestingConfig
	) Ownable(msg.sender) {
		if (offeringConfig.supply == 0) revert SupplyZero();
		if (offeringConfig.price == 0) revert PriceZero();
		if (offeringConfig.endTime < offeringConfig.startTime)
			revert EndSmallerThanStart();
		if (offeringConfig.endTime < block.timestamp)
			revert EndSmallerThanNow();
		if (
			offeringConfig.maxParticipationAmount <
			offeringConfig.minParticipationAmount
		) revert MaxSmallerThanMin();

		offeringToken = offeringConfig.token;
		paymentToken = offeringConfig.paymentToken;
		startTime = offeringConfig.startTime;
		endTime = offeringConfig.endTime;
		offeringSupply = offeringConfig.supply;
		offeringPrice = offeringConfig.price;
		minParticipationAmount = offeringConfig.minParticipationAmount;
		maxParticipationAmount = offeringConfig.maxParticipationAmount;
		sablierLockupLinear = vestingConfig.sablierLockupLinear;
		sablierBatch = vestingConfig.sablierBatch;
		cliffDuration = vestingConfig.cliffDuration;
		vestingDuration = vestingConfig.vestingDuration;

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

		uint256 paymentAmount = (amount * offeringPrice) / 1e18;
		paymentToken.transferFrom(msg.sender, address(this), paymentAmount);
	}

	function claim() external returns (uint256) {
		return claimToUser(msg.sender);
	}

	function claimToUser(
		address userAddress
	) public returns (uint256 streamId) {
		UserInfo memory user = userInfo[userAddress];
		if (block.timestamp < endTime) revert SaleNotEnded();
		if (user.streamId != 0) revert AlreadyClaimed();
		if (user.boughtAmount == 0) revert InvalidAmount();

		uint40 vestStartTime = endTime;
		uint40 cliffTime = vestStartTime + cliffDuration;
		uint40 vestEndTime = vestStartTime + vestingDuration;

		if (block.timestamp >= vestEndTime) {
			offeringToken.transfer(userAddress, user.boughtAmount);
			userInfo[userAddress].streamId = type(uint256).max;
			return type(uint256).max;
		}

		// else create stream
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
					cliff: uint40(cliffTime),
					end: uint40(vestEndTime)
				}),
				broker: Broker({ fee: UD60x18.wrap(0), account: address(0) })
			});

		streamId = sablierLockupLinear.createWithRange(lockup);
		userInfo[userAddress].streamId = streamId;
	}

	function claimToUserBatch(
		address[] calldata users
	) external returns (uint256[] memory) {
		if (block.timestamp < endTime) revert SaleNotEnded();
		if (block.timestamp > endTime + vestingDuration)
			revert EndSmallerThanNow();

		Batch.CreateWithRange[] memory lockups = new Batch.CreateWithRange[](
			users.length
		);

		for (uint256 i = 0; i < users.length; i++) {
			address userAddress = users[i];
			UserInfo memory user = userInfo[userAddress];

			if (user.streamId != 0) continue;
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
		}

		uint256[] memory streamIds = sablierBatch.createWithRange(
			sablierLockupLinear,
			offeringToken,
			lockups
		);

		for (uint256 i = 0; i < users.length; i++) {
			address userAddress = users[i];
			if (userInfo[userAddress].streamId == 0) {
				userInfo[userAddress].streamId = uint128(streamIds[i]);
			}
		}

		return streamIds;
	}

	// toto: open lp or create stream
	function withdrawPaymentToken() external onlyOwner {
		if (block.timestamp < endTime) revert SaleNotEnded();

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

	function setOfferingPrice(uint128 offeringPrice_) external onlyOwner {
		if (offeringPrice_ == 0) revert PriceZero();
		offeringPrice = offeringPrice_;
	}
}
