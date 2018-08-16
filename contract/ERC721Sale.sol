pragma solidity ^0.4.24;

import "./ERC721.sol";
import "./SafeMath.sol";

// ERC721 토큰을 이더로 거래합니다.
contract ERC721Sale {
	using SafeMath for uint256;

	// 토큰을 매수합니다.
    function bid(address token, uint256 tokenId, uint256 price) public {
		
	}
	
	// 토큰 매수를 취소합니다.
	function cancelBid(uint256 bidId) public {
		
	}
	
	// 매수된 토큰을 구매합니다.
    function buy(uint256 bidId) payable public {
		
	}
	
	// 토큰을 매도합니다.
	function ask(address token, uint256 tokenId) payable public {
		
	}
	
	// 토큰 매도를 취소합니다.
	function cancelAsk(uint256 askId) public {
		
	}
	
	// 매도된 토큰을 판매합니다.
    function sell(uint256 askId) public {
		
	}
}