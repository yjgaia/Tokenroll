pragma solidity ^0.4.24;

// 숫자 계산 시 오버플로우 문제를 방지하기 위한 라이브러리
library SafeMath {
	
	function add(uint a, uint b) pure internal returns (uint c) {
		c = a + b;
		assert(c >= a);
		return c;
	}
	
	function sub(uint a, uint b) pure internal returns (uint c) {
		assert(b <= a);
		return a - b;
	}
	
	function mul(uint a, uint b) pure internal returns (uint c) {
		if (a == 0) {
			return 0;
		}
		c = a * b;
		assert(c / a == b);
		return c;
	}
	
	function div(uint a, uint b) pure internal returns (uint c) {
		return a / b;
	}
}