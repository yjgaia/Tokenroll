Tokenroll.ERC20ContractController = CLASS({

	init : (inner, self, address) => {
		
		let contract = web3.eth.contract(Tokenroll.ERC20ContractABI).at(address);
		let eventMap = {};
		
		contract.allEvents((error, info) => {
			
			if (error === TO_DELETE) {
				
				let eventHandlers = eventMap[info.event];
	
				if (eventHandlers !== undefined) {
					EACH(eventHandlers, (eventHandler) => {
						eventHandler(info.args);
					});
				}
			}
		});
		
		let func = (f) => {
			return function() {
				if (Tokenroll.WalletManager.checkIsEnable() !== true) {
					location.href = 'metamask.html';
				} else {
					f.apply(undefined, arguments);
				}
			};
		};
		
		let callbackWrapper = (callbackOrHandlers) => {
			
			let callback;
			let errorHandler;
			
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				callback = callbackOrHandlers.success;
				errorHandler = callbackOrHandlers.error;
			}
			
			return (error, result) => {
				
				// 계약 실행 오류 발생
				if (error !== TO_DELETE) {
					if (errorHandler !== undefined) {
						errorHandler(error.toString());
					} else {
						alert(error.toString());
					}
				}
				
				// 정상 작동
				else if (CHECK_IS_ARRAY(result) === true) {
					EACH(result, (value, i) => {
						if (value.toNumber !== undefined) {
							result[i] = value.toNumber();
						}
					});
					callback(result);
				}
				
				else {
					if (result.toNumber !== undefined) {
						result = result.toNumber();
					}
					callback(result);
				}
			};
		};
		
		let toStringCallbackWrapper = (callbackOrHandlers) => {
			
			let callback;
			let errorHandler;
			
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				callback = callbackOrHandlers.success;
				errorHandler = callbackOrHandlers.error;
			}
			
			return (error, result) => {
				
				// 계약 실행 오류 발생
				if (error !== TO_DELETE) {
					if (errorHandler !== undefined) {
						errorHandler(error.toString());
					} else {
						alert(error.toString());
					}
				}
				
				// 정상 작동
				else if (CHECK_IS_ARRAY(result) === true) {
					EACH(result, (value, i) => {
						if (value.toNumber !== undefined) {
							result[i] = value.toString(10);
						}
					});
					callback(result);
				}
				
				else {
					if (result.toNumber !== undefined) {
						result = result.toString(10);
					}
					callback(result);
				}
			};
		};
		
		let transactionCallbackWrapper = (callbackOrHandlers) => {
			
			let callback;
			let errorHandler;
			
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				callback = callbackOrHandlers.success;
				errorHandler = callbackOrHandlers.error;
			}
			
			return (error, result) => {
				
				// 계약 실행 오류 발생
				if (error !== TO_DELETE) {
					if (errorHandler !== undefined) {
						errorHandler(error.toString());
					} else {
						alert(error.toString());
					}
				}
				
				// 정상 작동
				else {
					
					UUI.ALERT({
						style : {
							backgroundColor : '#fff',
							color : '#000',
							padding : 10,
							border : '1px solid #ccc'
						},
						buttonStyle : {
							marginTop : 10,
							padding : 10,
							border : '1px solid #ccc',
							borderRadius : 5
						},
						msg : [P({
							c : '트랜잭션이 진행중입니다.'
						}), A({
							style : {
								color : '#3366CC',
								fontWeight : 'bold'
							},
							target : '_blank',
							href : 'https://etherscan.io/tx/' + result,
							c : 'EtherScan에서 보기'
						})]
					});
					
					if (callback !== undefined) {
						
						let retry = RAR(() => {
							
							web3.eth.getTransactionReceipt(result, (error, result) => {
								
								// 트랜잭선 오류 발생
								if (error !== TO_DELETE) {
									if (errorHandler !== undefined) {
										errorHandler(error.toString());
									} else {
										alert(error.toString());
									}
								}
								
								// 아무런 값이 없으면 재시도
								else if (result === TO_DELETE) {
									retry();
								}
								
								// 트랜잭션 완료
								else {
									callback();
								}
							});
						});
					}
				}
			};
		};
		
		let on = self.on = (eventName, eventHandler) => {
			//REQUIRED: eventName
			//REQUIRED: eventHandler
			
			if (eventMap[eventName] === undefined) {
				eventMap[eventName] = [];
			}

			eventMap[eventName].push(eventHandler);
		};

		let off = self.off = (eventName, eventHandler) => {
			//REQUIRED: eventName
			//OPTIONAL: eventHandler

			if (eventMap[eventName] !== undefined) {

				if (eventHandler !== undefined) {

					REMOVE({
						array: eventMap[eventName],
						value: eventHandler
					});
				}

				if (eventHandler === undefined || eventMap[eventName].length === 0) {
					delete eventMap[eventName];
				}
			}
		};
		
		let name = self.name = func((callback) => {
			contract.name(callbackWrapper(callback));
		});
		
		let symbol = self.symbol = func((callback) => {
			contract.symbol(callbackWrapper(callback));
		});
		
		let decimals = self.decimals = func((callback) => {
			contract.decimals(callbackWrapper(callback));
		});
		
		let totalSupply = self.totalSupply = func((callback) => {
			contract.totalSupply(callbackWrapper(callback));
		});
		
		let balanceOf = self.balanceOf = func((owner, callback) => {
			contract.balanceOf(owner, callbackWrapper(callback));
		});
		
		let transfer = self.transfer = func((to, value, callback) => {
			contract.transfer(to, value, transactionCallbackWrapper(callback));
		});
		
		let transferFrom = self.transferFrom = func((from, to, value, callback) => {
			contract.transferFrom(from, to, value, transactionCallbackWrapper(callback));
		});
		
		let approve = self.approve = func((spender, value, callback) => {
			contract.approve(spender, value, transactionCallbackWrapper(callback));
		});
		
		let allowance = self.allowance = func((owner, spender, callback) => {
			contract.allowance(owner, spender, callbackWrapper(callback));
		});
	}
});
