pragma solidity ^0.4.24;

import "./ERC20.sol";
import "./SafeMath.sol";

// ERC20 토큰을 이더로 거래합니다.
contract ERC20Sale {
	using SafeMath for uint256;

	// 토큰을 매수합니다.
    function bid(address token, uint256 amount, uint256 price) public {
		
	}
	
	// 매수된 토큰을 구매합니다.
    function buy(uint256 bidId, uint256 amount) payable public {
		
	}
	
	// 토큰을 매도합니다.
	function ask(address token, uint256 amount) payable public {
		
	}
	
	// 매도된 토큰을 판매합니다.
    function sell(uint256 askId, uint256 amount) public {
		
	}
}