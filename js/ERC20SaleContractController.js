Tokenroll.ERC20SaleContractController = OBJECT({

	init : (inner, self) => {
		
		let contract;
		let eventMap = {};
		
		let setContract = self.setContract = (_contract) => {
			contract = _contract;
			
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
		};
		
		let func = (f) => {
			return function() {
				if (WalletManager.checkIsEnable() !== true) {
					console.error('메타마스크가 잠겨있습니다.');
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
				else if (callback !== undefined) {
					
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
		
		// 토큰의 이름 반환
		let name = self.name = func((callback) => {
			contract.name(callbackWrapper(callback));
		});
		
		// 토큰의 심볼 반환
		let symbol = self.symbol = func((callback) => {
			contract.symbol(callbackWrapper(callback));
		});
		
		// 토큰의 소수점 반환
		let decimals = self.decimals = func((callback) => {
			contract.decimals(callbackWrapper(callback));
		});
		
		// 전체 토큰 수 반환
		let totalSupply = self.totalSupply = func((callback) => {
			contract.totalSupply(toStringCallbackWrapper(callback));
		});
		
		// 특정 유저의 토큰 수를 반환합니다.
		let balanceOf = self.balanceOf = func((user, callback) => {
			contract.balanceOf(user, toStringCallbackWrapper(callback));
		});
		
		// 특정 유저에게 토큰을 전송합니다.
		let transfer = self.transfer = func((to, amount, callback) => {
			contract.transfer(to, amount, transactionCallbackWrapper(callback));
		});
		
		// spender에 amount만큼의 토큰을 보낼 권리를 부여합니다.
		let approve = self.approve = func((spender, amount, callback) => {
			contract.approve(spender, amount, transactionCallbackWrapper(callback));
		});
		
		// spender에 인출을 허락한 토큰의 양을 반환합니다.
		let allowance = self.allowance = func((user, spender, callback) => {
			contract.allowance(user, spender, callbackWrapper(callback));
		});
		
		// 허락된 spender가 from으로부터 amount만큼의 토큰을 to에게 전송합니다.
		let transferFrom = self.transferFrom = func((from, to, amount, callback) => {
			contract.transferFrom(from, to, amount, transactionCallbackWrapper(callback));
		});
		
		// 토큰을 많이 가진 순서대로 유저의 ID 목록을 가져옵니다.
		let getUsersByBalance = self.getUsersByBalance = func((callback) => {
			contract.getUsersByBalance(callbackWrapper(callback));
		});
		
		// 이름을 지정합니다.
		let setName = self.setName = func((name, callback) => {
			contract.setName(name, transactionCallbackWrapper(callback));
		});
		
		// 메시지를 지정합니다.
		let setMessage = self.setMessage = func((message, callback) => {
			contract.setMessage(message, transactionCallbackWrapper(callback));
		});
		
		// 이름을 가져옵니다.
		let getName = self.getName = func((user, callback) => {
			contract.names(user, callbackWrapper(callback));
		});
		
		// 메시지를 가져옵니다.
		let getMessage = self.getMessage = func((user, callback) => {
			contract.messages(user, callbackWrapper(callback));
		});
	}
});
