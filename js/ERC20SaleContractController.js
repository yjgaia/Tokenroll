Tokenroll.ERC20SaleContractController = OBJECT({

	init : (inner, self) => {
		
		let contract;
		let eventMap = {};
		
		let setContract = self.setContract = (_contract) => {
			contract = _contract;
			
			contract.allEvents((error, info) => {
				
				if (error === TO_DELETE) {
					
					console.log(info.event);
					
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
				if (Tokenroll.WalletManager.checkIsEnable() !== true) {
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
		
		// 토큰 구매 정보를 거래소에 등록합니다.
		let bid = self.bid = func((token, amount, price, callback) => {
			contract.bid(token, amount, {
				value : web3.toWei(price, 'ether')
			}, transactionCallbackWrapper(callback));
		});
		
		// 토큰 구매 정보의 개수를 반환합니다.
		let getBidCount = self.getBidCount = func((callback) => {
			contract.getBidCount(callbackWrapper(callback));
		});
		
		// 토큰 구매 정보를 반환합니다.
		let getBidInfo = self.getBidInfo = func((bidId, callback) => {
			contract.bidInfos(bidId, callbackWrapper(callback));
		});
		
		// 토큰 구매를 취소합니다.
		let cancelBid = self.cancelBid = func((bidId, callback) => {
			contract.cancelBid(bidId, transactionCallbackWrapper(callback));
		});
		
		// 구매 등록된 토큰을 판매합니다.
		let sell = self.sell = func((bidId, amount, callback) => {
			contract.sell(bidId, amount, transactionCallbackWrapper(callback));
		});
		
		// 주어진 토큰에 해당하는 구매 정보 개수를 반환합니다.
		let getBidCountByToken = self.getBidCountByToken = func((token, callback) => {
			contract.getBidCountByToken(token, callbackWrapper(callback));
		});
		
		// 주어진 토큰에 해당하는 구매 정보 ID 목록을 반환합니다.
		let getBidIdsByToken = self.getBidIdsByToken = func((token, callback) => {
			contract.getBidIdsByToken(token, callbackWrapper(callback));
		});
		
		// 토큰 판매 정보를 거래소에 등록합니다.
		let offer = self.offer = func((token, amount, price, callback) => {
			contract.offer(token, amount, web3.toWei(price, 'ether'), transactionCallbackWrapper(callback));
		});
		
		// 토큰 판매 정보의 개수를 반환합니다.
		let getOfferCount = self.getOfferCount = func((callback) => {
			contract.getOfferCount(callbackWrapper(callback));
		});
		
		// 토큰 판매 정보를 반환합니다.
		let getOfferInfo = self.getOfferInfo = func((offerId, callback) => {
			contract.offerInfos(offerId, callbackWrapper(callback));
		});
		
		// 토큰 판매를 취소합니다.
		let cancelOffer = self.cancelOffer = func((offerId, callback) => {
			contract.cancelOffer(offerId, transactionCallbackWrapper(callback));
		});
		
		// 판매 등록된 토큰을 구매합니다.
		let buy = self.buy = func((offerId, amount, price, callback) => {
			contract.buy(offerId, amount, {
				value : web3.toWei(price, 'ether')
			}, transactionCallbackWrapper(callback));
		});
		
		// 주어진 토큰에 해당하는 판매 정보 개수를 반환합니다.
		let getOfferCountByToken = self.getOfferCountByToken = func((token, callback) => {
			contract.getOfferCountByToken(token, callbackWrapper(callback));
		});
		
		// 주어진 토큰에 해당하는 판매 정보 ID 목록을 반환합니다.
		let getOfferIdsByToken = self.getOfferIdsByToken = func((token, callback) => {
			contract.getOfferIdsByToken(token, callbackWrapper(callback));
		});
	}
});
