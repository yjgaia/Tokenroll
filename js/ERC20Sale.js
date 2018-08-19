RUN(() => {
	
	let erc20ContractControllers = {};
	
	let getERC20ContractController = (address) => {
		let controller = erc20ContractControllers[address];
		if (controller === undefined) {
			controller = erc20ContractControllers[address] = Tokenroll.ERC20ContractController(address);
		}
		return controller;
	};
	
	BODY.append(Tokenroll.Header('erc20sale'));
	
	let bidList;
	let offerList;
	BODY.append(Tokenroll.Content({
		c : [
		
		// 토큰 매도 등록 폼
		FORM({
			c : [
			UUI.FULL_INPUT({
				style : {
					border : '1px solid #ccc'
				},
				name : 'token',
				placeholder : 'ERC-20 토큰 주소'
			}),
			UUI.FULL_INPUT({
				style : {
					marginTop : 10,
					border : '1px solid #ccc'
				},
				name : 'amount',
				placeholder : '매도 수량'
			}),
			UUI.FULL_INPUT({
				style : {
					marginTop : 10,
					border : '1px solid #ccc'
				},
				name : 'price',
				placeholder : '가격 (이더)'
			}),
			UUI.FULL_SUBMIT({
				style : {
					marginTop : 10
				},
				value : '등록하기'
			})],
			on : {
				submit : (e, form) => {
					
					let info = form.getData();
					
					getERC20ContractController(info.token).decimals((decimals) => {
						
						Tokenroll.ERC20SaleContractController.bid(info.token, info.amount * Math.pow(10, decimals), info.price, () => {
							console.log('done');
						});
					});
				}
			}
		}),
		
		// 매도 목록
		bidList = DIV(),
		
		// 토큰 매수 등록 폼
		FORM({
			c : [
			UUI.FULL_INPUT({
				style : {
					border : '1px solid #ccc'
				},
				name : 'token',
				placeholder : 'ERC-20 토큰 주소'
			}),
			UUI.FULL_INPUT({
				style : {
					marginTop : 10,
					border : '1px solid #ccc'
				},
				name : 'amount',
				placeholder : '매수 수량'
			}),
			UUI.FULL_INPUT({
				style : {
					marginTop : 10,
					border : '1px solid #ccc'
				},
				name : 'price',
				placeholder : '가격 (이더)'
			}),
			UUI.FULL_SUBMIT({
				style : {
					marginTop : 10
				},
				value : '등록하기'
			})],
			on : {
				submit : (e, form) => {
					
					let info = form.getData();
					
					getERC20ContractController(info.token).decimals((decimals) => {
						
						Tokenroll.ERC20SaleContractController.offer(info.token, info.amount * Math.pow(10, decimals), info.price, () => {
							console.log('done');
						});
					});
				}
			}
		}),
		
		// 매수 목록
		offerList = DIV()]
	}));
	
	BODY.append(Tokenroll.Footer());
	
	Tokenroll.ERC20SaleContractController.getBidCount((bidCount) => {
		REPEAT(bidCount, (bidId) => {
			
			Tokenroll.ERC20SaleContractController.getBidInfo(bidId, (bidInfo) => {
				
				let bidder = bidInfo[0];
				let token = bidInfo[1];
				let amount = bidInfo[2];
				let price = bidInfo[3];
				
				getERC20ContractController(token).decimals((decimals) => {
					
					let panel;
					bidList.append(panel = DIV({
						c : [DIV({
							c : '구매 희망자: ' + bidder
						}), DIV({
							c : 'ERC-20 토큰 주소: ' + token
						}), DIV({
							c : '매도 수량: ' + amount / Math.pow(10, decimals)
						}), DIV({
							c : '가격 (이더): ' + web3.fromWei(price)
						})]
					}));
					
					if (bidder === Tokenroll.WalletManager.getWalletAddress()) {
						
						panel.append(UUI.BUTTON({
							style : {
								backgroundColor : '#eee'
							},
							title : '구매 취소',
							on : {
								tap : () => {
									
									Tokenroll.ERC20SaleContractController.cancelBid(bidId, () => {
										console.log('done');
									});
								}
							}
						}));
					}
					
					else {
						
						panel.append(UUI.BUTTON({
							style : {
								backgroundColor : '#eee'
							},
							title : '판매하기',
							on : {
								tap : () => {
									
									Tokenroll.ERC20SaleContractController.sell(bidId, amount, () => {
										console.log('done');
									});
								}
							}
						}));
						
						getERC20ContractController(token).allowance(Tokenroll.WalletManager.getWalletAddress(), Tokenroll.ERC20SaleContractAddress, (allowance) => {
							panel.append(UUI.BUTTON({
								style : {
									backgroundColor : '#eee'
								},
								title : '거래소에 인출 허락하기 (현재 허락된 개수: ' + allowance / Math.pow(10, decimals) + ')',
								on : {
									tap : () => {
										
										UUI.PROMPT({
											style : {
												backgroundColor : '#fff',
												color : '#000',
												padding : 10,
												border : '1px solid #ccc'
											},
											msg : '몇 개를 허락하시겠습니까?'
										}, (value) => {
											
											getERC20ContractController(token).approve(Tokenroll.ERC20SaleContractAddress, REAL(value) * Math.pow(10, decimals), () => {
												console.log('done');
											});
										});
									}
								}
							}));
						});
					}
				});
			});
		});
	});
	
	Tokenroll.ERC20SaleContractController.getOfferCount((offerCount) => {
		REPEAT(offerCount, (offerId) => {
			
			Tokenroll.ERC20SaleContractController.getOfferInfo(offerId, (offerInfo) => {
				
				let offeror = offerInfo[0];
				let token = offerInfo[1];
				let amount = offerInfo[2];
				let price = offerInfo[3];
				
				getERC20ContractController(token).decimals((decimals) => {
					
					let panel;
					offerList.append(panel = DIV({
						c : [DIV({
							c : '판매 희망자: ' + offeror
						}), DIV({
							c : 'ERC-20 토큰 주소: ' + token
						}), DIV({
							c : '매수 수량: ' + amount / Math.pow(10, decimals)
						}), DIV({
							c : '가격 (이더): ' + web3.fromWei(price)
						})]
					}));
					
					if (offeror === Tokenroll.WalletManager.getWalletAddress()) {
						
						panel.append(UUI.BUTTON({
							style : {
								backgroundColor : '#eee'
							},
							title : '판매 취소',
							on : {
								tap : () => {
									
									Tokenroll.ERC20SaleContractController.cancelOffer(offerId, () => {
										console.log('done');
									});
								}
							}
						}));
					}
					
					else {
						
						panel.append(UUI.BUTTON({
							style : {
								backgroundColor : '#eee'
							},
							title : '구매하기',
							on : {
								tap : () => {
									
									Tokenroll.ERC20SaleContractController.buy(offerId, amount, web3.fromWei(price), () => {
										console.log('done');
									});
								}
							}
						}));
					}
				});
			});
		});
	});
});