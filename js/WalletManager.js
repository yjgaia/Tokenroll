Tokenroll.WalletManager = OBJECT({

	init : (inner, self) => {
		
		let isEnable;
		
		// Web3 체크
		if (typeof global.web3 !== 'undefined') {
			global.web3 = new Web3(global.web3.currentProvider);
			isEnable = true;
			
			// 계약 생성
			Tokenroll.ERC20SaleContractController.setContract(web3.eth.contract(Tokenroll.ERC20SaleContractABI).at(Tokenroll.ERC20SaleContractAddress));
		}
		
		// 지갑을 사용할 수 있는지 확인
		let checkIsEnable = self.checkIsEnable = () => {
			return isEnable;
		};
		
		// 지갑이 잠금 상태인지 확인
		let checkIsLocked = self.checkIsLocked = (callback) => {
			if (checkIsEnable() !== true) {
				console.error('지갑을 사용할 수 없습니다.');
			} else {
				web3.eth.getAccounts((error, accounts) => {
					callback(accounts.length === 0);
				});
			}
		};
		
		// 지갑 주소를 가져옵니다.
		let getWalletAddress = self.getWalletAddress = () => {
			if (checkIsEnable() !== true) {
				console.error('지갑을 사용할 수 없습니다.');
			} else {
				web3.eth.getAccounts((error, accounts) => {
					callback(accounts[0]);
				});
			}
		};
	}
});
