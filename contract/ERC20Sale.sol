pragma solidity ^0.4.24;

import "./ERC20.sol";
import "./SafeMath.sol";

// ERC20 토큰을 이더로 거래합니다.
contract ERC20Sale {
	using SafeMath for uint256;
	
	// 이벤트들
	event Offer(uint256 offerId);
	event ChangeOfferId(uint256 indexed originOfferId, uint256 newOfferId);
	event RemoveOffer(uint256 indexed offerId);
	event CancelOffer(uint256 indexed offerId);
	event Buy(uint256 indexed offerId, uint256 amount);
	
	event Bid(uint256 bidId);
	event ChangeBidId(uint256 indexed originBidId, uint256 newBidId);
	event RemoveBid(uint256 indexed bidId);
	event CancelBid(uint256 indexed bidId);
	event Sell(uint256 indexed bidId, uint256 amount);
	
	// 판매 정보
	struct OfferInfo {
		address offeror;
		address token;
		uint256 amount;
		uint256 price;
	}
	
	// 구매 정보
	struct BidInfo {
		address bidder;
		address token;
		uint256 amount;
		uint256 price;
	}
	
	// 정보 저장소
	OfferInfo[] public offerInfos;
	BidInfo[] public bidInfos;
	
	function getOfferCount() view public returns (uint256) {
		return offerInfos.length;
	}
	
	function getBidCount() view public returns (uint256) {
		return bidInfos.length;
	}

	// 토큰 판매 정보를 거래소에 등록합니다.
	function offer(address token, uint256 amount, uint256 price) public {
		ERC20 erc20 = ERC20(token);
		
		// 판매자가 가진 토큰의 양이 판매할 양보다 많아야 합니다.
		require(erc20.balanceOf(msg.sender) >= amount);
		
		// 거래소에 인출을 허락한 토큰의 양이 판매할 양보다 많아야 합니다.
		require(erc20.allowance(msg.sender, this) >= amount);
		
		// 판매 정보 생성
		uint256 offerId = offerInfos.push(OfferInfo({
			offeror : msg.sender,
			token : token,
			amount : amount,
			price : price
		})).sub(1);
		
		emit Offer(offerId);
	}
	
	// 토큰 판매 정보를 삭제합니다.
	function removeOffer(uint256 offerId) internal {
		
		for (uint256 i = offerId; i < offerInfos.length - 1; i += 1) {
			offerInfos[i] = offerInfos[i + 1];
			
			emit ChangeOfferId(i + 1, i);
		}
		
		delete offerInfos[offerInfos.length - 1];
		offerInfos.length -= 1;
		
		emit RemoveOffer(offerId);
	}
	
	// 토큰 판매를 취소합니다.
	function cancelOffer(uint256 offerId) public {
		
		// 매수자인지 확인합니다.
		require(offerInfos[offerId].offeror == msg.sender);
		
		// 판매 정보 삭제
		removeOffer(offerId);
		
		emit CancelOffer(offerId);
	}
	
	// 판매 등록된 토큰을 구매합니다.
	function buy(uint256 offerId, uint256 amount) payable public {
		
		OfferInfo storage offerInfo = offerInfos[offerId];
		ERC20 erc20 = ERC20(offerInfo.token);
		
		// 판매자가 가진 토큰의 양이 판매할 양보다 많아야 합니다.
		require(erc20.balanceOf(offerInfo.offeror) >= amount);
		
		// 거래소에 인출을 허락한 토큰의 양이 판매할 양보다 많아야 합니다.
		require(erc20.allowance(offerInfo.offeror, this) >= amount);
		
		// 판매하는 토큰의 양이 구매할 양보다 많아야 합니다.
		require(offerInfo.amount >= amount);
		
		// 토큰 가격이 제시한 가격과 동일해야합니다.
		require(amount.mul(offerInfo.amount).div(offerInfo.price) == msg.value);
		
		// 토큰 구매자에게 토큰을 지급합니다.
		erc20.transferFrom(offerInfo.offeror, msg.sender, amount);
		
		// 매수 토큰의 양을 줄입니다.
		offerInfo.amount = offerInfo.amount.sub(amount);
		
		// 토큰이 모두 팔렸으면 매수 정보 삭제
		if (offerInfo.amount == 0) {
			removeOffer(offerId);
		}
		
		// 매수자에게 이더를 지급합니다.
		offerInfo.offeror.transfer(msg.value);
		
		emit Buy(offerId, amount);
	}
	
	// 토큰 구매 정보를 거래소에 등록합니다.
	function bid(address token, uint256 amount) payable public {
		
		// 구매 정보 생성
		uint256 bidId = bidInfos.push(BidInfo({
			bidder : msg.sender,
			token : token,
			amount : amount,
			price : msg.value
		})).sub(1);
		
		emit Bid(bidId);
	}
	
	// 토큰 구매 정보를 삭제합니다.
	function removeBid(uint256 bidId) internal {
		
		for (uint256 i = bidId; i < bidInfos.length - 1; i += 1) {
			bidInfos[i] = bidInfos[i + 1];
			
			emit ChangeBidId(i + 1, i);
		}
		
		delete bidInfos[bidInfos.length - 1];
		bidInfos.length -= 1;
		
		emit RemoveBid(bidId);
	}
	
	// 토큰 구매를 취소합니다.
	function cancelBid(uint256 bidId) public {
		
		// 구매자인지 확인합니다.
		require(bidInfos[bidId].bidder == msg.sender);
		
		// 구매 정보 삭제
		removeBid(bidId);
		
		emit CancelBid(bidId);
	}
	
	// 구매 등록된 토큰을 판매합니다.
	function sell(uint256 bidId, uint256 amount) public {
		
		BidInfo storage bidInfo = bidInfos[bidId];
		ERC20 erc20 = ERC20(bidInfo.token);
		
		// 판매자가 가진 토큰의 양이 판매할 양보다 많아야 합니다.
		require(erc20.balanceOf(msg.sender) >= amount);
		
		// 거래소에 인출을 허락한 토큰의 양이 판매할 양보다 많아야 합니다.
		require(erc20.allowance(msg.sender, this) >= amount);
		
		// 구매하는 토큰의 양이 판매할 양보다 많아야 합니다.
		require(bidInfo.amount >= amount);
		
		// 토큰 구매자에게 토큰을 지급합니다.
		erc20.transferFrom(msg.sender, bidInfo.bidder, amount);
		
		// 구매할 토큰의 양을 줄입니다.
		bidInfo.amount = bidInfo.amount.sub(amount);
		
		// 토큰을 모두 구매하였으면 구매 정보 삭제
		if (bidInfo.amount == 0) {
			removeBid(bidId);
		}
		
		// 판매자에게 이더를 지급합니다.
		msg.sender.transfer(amount.mul(bidInfo.amount).div(bidInfo.price));
		
		emit Sell(bidId, amount);
	}
}