pragma solidity ^0.4.24;

import "./ERC20.sol";
import "./SafeMath.sol";

// ERC20 토큰을 이더로 거래합니다.
contract ERC20Sale {
	using SafeMath for uint;
	
	// 이벤트들
	event Bid(uint bidId);
	event ChangeBidId(uint indexed originBidId, uint newBidId);
	event RemoveBid(uint indexed bidId);
	event CancelBid(uint indexed bidId);
	event Sell(uint indexed bidId, uint amount);
	
	event Offer(uint offerId);
	event ChangeOfferId(uint indexed originOfferId, uint newOfferId);
	event RemoveOffer(uint indexed offerId);
	event CancelOffer(uint indexed offerId);
	event Buy(uint indexed offerId, uint amount);
	
	// 구매 정보
	struct BidInfo {
		address bidder;
		address token;
		uint amount;
		uint price;
	}
	
	// 판매 정보
	struct OfferInfo {
		address offeror;
		address token;
		uint amount;
		uint price;
	}
	
	// 정보 저장소
	BidInfo[] public bidInfos;
	OfferInfo[] public offerInfos;
	
	function getBidCount() view public returns (uint) {
		return bidInfos.length;
	}
	
	function getOfferCount() view public returns (uint) {
		return offerInfos.length;
	}
	
	// 토큰 구매 정보를 거래소에 등록합니다.
	function bid(address token, uint amount) payable public {
		
		// 구매 정보 생성
		uint bidId = bidInfos.push(BidInfo({
			bidder : msg.sender,
			token : token,
			amount : amount,
			price : msg.value
		})).sub(1);
		
		emit Bid(bidId);
	}
	
	// 토큰 구매 정보를 삭제합니다.
	function removeBid(uint bidId) internal {
		
		for (uint i = bidId; i < bidInfos.length - 1; i += 1) {
			bidInfos[i] = bidInfos[i + 1];
			
			emit ChangeBidId(i + 1, i);
		}
		
		delete bidInfos[bidInfos.length - 1];
		bidInfos.length -= 1;
		
		emit RemoveBid(bidId);
	}
	
	// 토큰 구매를 취소합니다.
	function cancelBid(uint bidId) public {
		
		BidInfo memory bidInfo = bidInfos[bidId];
		
		// 구매자인지 확인합니다.
		require(bidInfo.bidder == msg.sender);
		
		// 구매 정보 삭제
		removeBid(bidId);
		
		// 이더를 환불합니다.
		bidInfo.bidder.transfer(bidInfo.price);
		
		emit CancelBid(bidId);
	}
	
	// 구매 등록된 토큰을 판매합니다.
	function sell(uint bidId, uint amount) public {
		
		BidInfo storage bidInfo = bidInfos[bidId];
		ERC20 erc20 = ERC20(bidInfo.token);
		
		// 판매자가 가진 토큰의 양이 판매할 양보다 많아야 합니다.
		require(erc20.balanceOf(msg.sender) >= amount);
		
		// 거래소에 인출을 허락한 토큰의 양이 판매할 양보다 많아야 합니다.
		require(erc20.allowance(msg.sender, this) >= amount);
		
		// 구매하는 토큰의 양이 판매할 양보다 많아야 합니다.
		require(bidInfo.amount >= amount);
		
		uint realPrice = amount.mul(bidInfo.price).div(bidInfo.amount);
		
		// 가격 계산에 문제가 없어야 합니다.
		require(realPrice.mul(bidInfo.amount) == amount.mul(bidInfo.price));
		
		// 토큰 구매자에게 토큰을 지급합니다.
		erc20.transferFrom(msg.sender, bidInfo.bidder, amount);
		
		// 가격을 내립니다.
		bidInfo.price = bidInfo.price.sub(realPrice);
		
		// 구매할 토큰의 양을 줄입니다.
		bidInfo.amount = bidInfo.amount.sub(amount);
		
		// 토큰을 모두 구매하였으면 구매 정보 삭제
		if (bidInfo.amount == 0) {
			removeBid(bidId);
		}
		
		// 판매자에게 이더를 지급합니다.
		msg.sender.transfer(realPrice);
		
		emit Sell(bidId, amount);
	}
	
	// 주어진 토큰에 해당하는 구매 정보 개수를 반환합니다.
	function getBidCountByToken(address token) view public returns (uint) {
		
		uint bidCount = 0;
		
		for (uint i = 0; i < bidInfos.length; i += 1) {
			if (bidInfos[i].token == token) {
				bidCount += 1;
			}
		}
		
		return bidCount;
	}
	
	// 주어진 토큰에 해당하는 구매 정보 ID 목록을 반환합니다.
	function getBidIdsByToken(address token) view public returns (uint[]) {
		
		uint[] memory bidIds = new uint[](getBidCountByToken(token));
		
		for (uint i = 0; i < bidInfos.length; i += 1) {
			if (bidInfos[i].token == token) {
				bidIds[bidIds.length - 1] = i;
			}
		}
		
		return bidIds;
	}

	// 토큰 판매 정보를 거래소에 등록합니다.
	function offer(address token, uint amount, uint price) public {
		ERC20 erc20 = ERC20(token);
		
		// 판매자가 가진 토큰의 양이 판매할 양보다 많아야 합니다.
		require(erc20.balanceOf(msg.sender) >= amount);
		
		// 거래소에 인출을 허락한 토큰의 양이 판매할 양보다 많아야 합니다.
		require(erc20.allowance(msg.sender, this) >= amount);
		
		// 판매 정보 생성
		uint offerId = offerInfos.push(OfferInfo({
			offeror : msg.sender,
			token : token,
			amount : amount,
			price : price
		})).sub(1);
		
		emit Offer(offerId);
	}
	
	// 토큰 판매 정보를 삭제합니다.
	function removeOffer(uint offerId) internal {
		
		for (uint i = offerId; i < offerInfos.length - 1; i += 1) {
			offerInfos[i] = offerInfos[i + 1];
			
			emit ChangeOfferId(i + 1, i);
		}
		
		delete offerInfos[offerInfos.length - 1];
		offerInfos.length -= 1;
		
		emit RemoveOffer(offerId);
	}
	
	// 토큰 판매를 취소합니다.
	function cancelOffer(uint offerId) public {
		
		// 판매자인지 확인합니다.
		require(offerInfos[offerId].offeror == msg.sender);
		
		// 판매 정보 삭제
		removeOffer(offerId);
		
		emit CancelOffer(offerId);
	}
	
	// 판매 등록된 토큰을 구매합니다.
	function buy(uint offerId, uint amount) payable public {
		
		OfferInfo storage offerInfo = offerInfos[offerId];
		ERC20 erc20 = ERC20(offerInfo.token);
		
		// 판매자가 가진 토큰의 양이 판매할 양보다 많아야 합니다.
		require(erc20.balanceOf(offerInfo.offeror) >= amount);
		
		// 거래소에 인출을 허락한 토큰의 양이 판매할 양보다 많아야 합니다.
		require(erc20.allowance(offerInfo.offeror, this) >= amount);
		
		// 판매하는 토큰의 양이 구매할 양보다 많아야 합니다.
		require(offerInfo.amount >= amount);
		
		// 토큰 가격이 제시한 가격과 동일해야합니다.
		require(offerInfo.price.mul(amount) == msg.value.mul(offerInfo.amount));
		
		// 토큰 구매자에게 토큰을 지급합니다.
		erc20.transferFrom(offerInfo.offeror, msg.sender, amount);
		
		// 가격을 내립니다.
		offerInfo.price = offerInfo.price.sub(msg.value);
		
		// 판매 토큰의 양을 줄입니다.
		offerInfo.amount = offerInfo.amount.sub(amount);
		
		// 토큰이 모두 팔렸으면 판매 정보 삭제
		if (offerInfo.amount == 0) {
			removeOffer(offerId);
		}
		
		// 판매자에게 이더를 지급합니다.
		offerInfo.offeror.transfer(msg.value);
		
		emit Buy(offerId, amount);
	}
	
	// 주어진 토큰에 해당하는 판매 정보 개수를 반환합니다.
	function getOfferCountByToken(address token) view public returns (uint) {
		
		uint offerCount = 0;
		
		for (uint i = 0; i < offerInfos.length; i += 1) {
			if (offerInfos[i].token == token) {
				offerCount += 1;
			}
		}
		
		return offerCount;
	}
	
	// 주어진 토큰에 해당하는 판매 정보 ID 목록을 반환합니다.
	function getOfferIdsByToken(address token) view public returns (uint[]) {
		
		uint[] memory offerIds = new uint[](getOfferCountByToken(token));
		
		for (uint i = 0; i < offerInfos.length; i += 1) {
			if (offerInfos[i].token == token) {
				offerIds[offerIds.length - 1] = i;
			}
		}
		
		return offerIds;
	}
}