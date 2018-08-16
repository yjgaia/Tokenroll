pragma solidity ^0.4.24;

import "./ERC20.sol";
import "./SafeMath.sol";

// ERC20 토큰을 이더로 거래합니다.
contract ERC20Sale {
	using SafeMath for uint256;
	
	// 이벤트들
    event Bid(uint256 bidId);
    event ChangeBidId(uint256 indexed originBidId, uint256 newBidId);
    event RemoveBid(uint256 indexed bidId);
    event CancelBid(uint256 indexed bidId);
    event Buy(uint256 indexed bidId, uint256 amount);
    
    event Ask(uint256 askId);
    event ChangeAskId(uint256 indexed originAskId, uint256 newAskId);
    event RemoveAsk(uint256 indexed askId);
    event CancelAsk(uint256 indexed askId);
    event Sell(uint256 indexed askId, uint256 amount);
	
	// 매수 정보
	struct BidInfo {
		address bidder;
		address token;
		uint256 amount;
		uint256 price;
	}
	
	// 매도 정보
	struct AskInfo {
		address asker;
		address token;
		uint256 amount;
		uint256 price;
	}
	
	// 정보 저장소
	BidInfo[] public bidInfos;
	AskInfo[] public askInfos;
	
	function getBidCount() view public returns (uint256) {
		return bidInfos.length;
	}
	
	function getAskCount() view public returns (uint256) {
		return askInfos.length;
	}

	// 토큰을 매수합니다.
    function bid(address token, uint256 amount, uint256 price) public {
    	ERC20 erc20 = ERC20(token);
    	
    	// 매수자가 가진 토큰의 양이 매수할 양보다 많아야 합니다.
    	require(erc20.balanceOf(msg.sender) >= amount);
    	
    	// 거래소에 인출을 허락한 토큰의 양이 매수할 양보다 많아야 합니다.
    	require(erc20.allowance(msg.sender, this) >= amount);
    	
		// 매수 정보 생성
		uint256 bidId = bidInfos.push(BidInfo({
			bidder : msg.sender,
			token : token,
			amount : amount,
			price : price
		})).sub(1);
		
		emit Bid(bidId);
	}
	
	// 매수 정보를 삭제합니다.
	function removeBid(uint256 bidId) internal {
		
		for (uint256 i = bidId; i < bidInfos.length - 1; i += 1) {
            bidInfos[i] = bidInfos[i + 1];
            
            emit ChangeBidId(i + 1, i);
        }
        
        delete bidInfos[bidInfos.length - 1];
        bidInfos.length -= 1;
        
        emit RemoveBid(bidId);
	}
	
	// 토큰 매수를 취소합니다.
	function cancelBid(uint256 bidId) public {
		
		// 매수자인지 확인합니다.
		require(bidInfos[bidId].bidder == msg.sender);
		
		// 매수 정보 삭제
		removeBid(bidId);
		
		emit CancelBid(bidId);
	}
	
	// 매수된 토큰을 구매합니다.
    function buy(uint256 bidId, uint256 amount) payable public {
    	
    	BidInfo storage bidInfo = bidInfos[bidId];
    	ERC20 erc20 = ERC20(bidInfo.token);
    	
    	// 매수자가 가진 토큰의 양이 매수할 양보다 많아야 합니다.
    	require(erc20.balanceOf(bidInfo.bidder) >= amount);
    	
    	// 거래소에 인출을 허락한 토큰의 양이 매수할 양보다 많아야 합니다.
    	require(erc20.allowance(bidInfo.bidder, this) >= amount);
		
    	// 매수하는 토큰의 양이 구매할 양보다 많아야 합니다.
    	require(bidInfo.amount >= amount);
    	
		// 토큰 가격이 제시한 가격과 동일해야합니다.
		require(amount.mul(bidInfo.amount).div(bidInfo.price) == msg.value);
		
		// 토큰 구매자에게 토큰을 지급합니다.
		erc20.transferFrom(bidInfo.bidder, msg.sender, amount);
		
		// 매수자에게 이더를 지급합니다.
		bidInfo.bidder.transfer(msg.value);
		
		// 매수 토큰의 양을 줄입니다.
		bidInfo.amount = bidInfo.amount.sub(amount);
		
		// 토큰이 모두 팔렸으면 매수 정보 삭제
		if (bidInfo.amount == 0) {
			removeBid(bidId);
		}
		
		emit Buy(bidId, amount);
	}
	
	// 토큰을 매도합니다.
	function ask(address token, uint256 amount) payable public {
    	
		// 매도 정보 생성
		uint256 askId = askInfos.push(AskInfo({
			asker : msg.sender,
			token : token,
			amount : amount,
			price : msg.value
		})).sub(1);
		
		emit Ask(askId);
	}
	
	// 매도 정보를 삭제합니다.
	function removeAsk(uint256 askId) internal {
		
		for (uint256 i = askId; i < askInfos.length - 1; i += 1) {
            askInfos[i] = askInfos[i + 1];
            
            emit ChangeAskId(i + 1, i);
        }
        
        delete askInfos[askInfos.length - 1];
        askInfos.length -= 1;
        
        emit RemoveAsk(askId);
	}
	
	// 토큰 매도를 취소합니다.
	function cancelAsk(uint256 askId) public {
		
		// 매도자인지 확인합니다.
		require(askInfos[askId].asker == msg.sender);
		
		// 매도 정보 삭제
		removeAsk(askId);
		
		emit CancelAsk(askId);
	}
	
	// 매도된 토큰을 판매합니다.
    function sell(uint256 askId, uint256 amount) public {
		
    	AskInfo storage askInfo = askInfos[askId];
    	ERC20 erc20 = ERC20(askInfo.token);
    	
    	// 판매자가 가진 토큰의 양이 판매할 양보다 많아야 합니다.
    	require(erc20.balanceOf(msg.sender) >= amount);
    	
    	// 거래소에 인출을 허락한 토큰의 양이 판매할 양보다 많아야 합니다.
    	require(erc20.allowance(msg.sender, this) >= amount);
		
    	// 매도하는 토큰의 양이 판매할 양보다 많아야 합니다.
    	require(askInfo.amount >= amount);
		
		// 토큰 매도자에게 토큰을 지급합니다.
		erc20.transferFrom(msg.sender, askInfo.asker, amount);
		
		// 판매자에게 이더를 지급합니다.
		msg.sender.transfer(amount.mul(askInfo.amount).div(askInfo.price));
		
		// 매도 토큰의 양을 줄입니다.
		askInfo.amount = askInfo.amount.sub(amount);
		
		// 토큰이 모두 매도되었으면 매도 정보 삭제
		if (askInfo.amount == 0) {
			removeAsk(askId);
		}
		
		emit Sell(askId, amount);
	}
}