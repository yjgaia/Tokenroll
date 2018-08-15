pragma solidity ^0.4.24;

import "./ERC20.sol";
import "./ERC721.sol";
import "./SafeMath.sol";

// ERC20 토큰을 ERC721 토큰으로 교환합니다.
contract ERC20ERC721Trade {
	using SafeMath for uint256;
	
	// 토큰을 매수합니다.
    function bid(address token, uint256 amount, address wantToken, uint256 wantTokenId) public {
		
	}
	
	// 매수된 토큰을 구매합니다.
    function buy(uint256 bidId) public {
		
	}
	
	// 토큰을 매도합니다.
	function ask(address token, uint256 tokenId, address giveToken, uint256 giveAmount) public {
		
	}
	
	// 매도된 토큰을 판매합니다.
    function sell(uint256 askId) public {
		
	}
}