pragma solidity ^0.4.24;

import "./ERC20.sol";
import "./SafeMath.sol";

// ERC20 토큰을 다른 토큰과 교환합니다.
contract ERC20Trade {
	using SafeMath for uint256;

	// 토큰을 매수합니다.
    function bid(address token, uint256 amount, address wantToken, uint256 wantAmount) public {
		
	}
	
	// 매수된 토큰을 구매합니다.
    function buy(uint256 bidId, uint256 amount) public {
		
	}
	
	// 토큰을 매도합니다.
	function ask(address token, uint256 amount, address giveToken, uint256 giveAmount) public {
		
	}
	
	// 매도된 토큰을 판매합니다.
    function sell(uint256 askId, uint256 amount) public {
		
	}
}