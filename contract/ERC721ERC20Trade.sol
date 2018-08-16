pragma solidity ^0.4.24;

import "./ERC721.sol";
import "./ERC20.sol";
import "./SafeMath.sol";

// ERC721 토큰을 ERC20 토큰으로 교환합니다.
contract ERC721ERC20Trade {
	using SafeMath for uint256;

	// 토큰을 매수합니다.
    function bid(address token, uint256 tokenId, address wantToken, uint256 wantAmount) public {
		
	}
	
	// 토큰 매수를 취소합니다.
	function cancelBid(uint256 bidId) public {
		
	}
	
	// 매수된 토큰을 구매합니다.
    function buy(uint256 bidId) public {
		
	}
	
	// 토큰을 매도합니다.
	function ask(address token, uint256 amount, address giveToken, uint256 giveTokenId) public {
		
	}
	
	// 토큰 매도를 취소합니다.
	function cancelAsk(uint256 askId) public {
		
	}
	
	// 매도된 토큰을 판매합니다.
    function sell(uint256 askId) public {
		
	}
}