RUN(() => {
	
	let erc20ContractControllers = {};
	
	let getERC20ContractController = (address) => {
		let controller = erc20ContractControllers[address];
		if (controller === undefined) {
			controller = erc20ContractControllers[address] = Tokenroll.ERC20ContractController(address);
		}
		return controller;
	};
	
	Tokenroll.ERC20SaleContractController.on('Bid', console.log);
	Tokenroll.ERC20SaleContractController.on('ChangeBidId', console.log);
	Tokenroll.ERC20SaleContractController.on('RemoveBid', console.log);
	Tokenroll.ERC20SaleContractController.on('CancelBid', console.log);
	Tokenroll.ERC20SaleContractController.on('Sell', console.log);
	Tokenroll.ERC20SaleContractController.on('Offer', console.log);
	Tokenroll.ERC20SaleContractController.on('ChangeOfferId', console.log);
	Tokenroll.ERC20SaleContractController.on('RemoveOffer', console.log);
	Tokenroll.ERC20SaleContractController.on('CancelOffer', console.log);
	Tokenroll.ERC20SaleContractController.on('Buy', console.log);
	
	BODY.append(Tokenroll.Header('erc20sale'));
	
	let showTokenInfo = (targetPanel, address) => {
		
		targetPanel.empty();
		
		if (address !== '') {
			
			let tokenInfo = Tokenroll.ERC20TokenInfos[address];
			
			if (tokenInfo !== undefined) {
				targetPanel.append(DIV({
					c : [IMG({
						src : 'resource/' + tokenInfo.icon
					}), tokenInfo.name, A({
						target : '_blank',
						href : tokenInfo.site
					})]
				}));
			}
			
			else {
				targetPanel.append(DIV({
					c : ['알려지지 않은 토큰입니다. 토큰 주소를 확인해주시기 바랍니다. 알려진 토큰으로 등록하기 위해서는 ', A({
						target : '_blank',
						href : 'https://github.com/Hanul/Tokenroll/issues',
						c : 'Issues'
					}), '에 토큰 정보를 남겨주시기 바랍니다.']
				}));
			}
		}
	};
	
	let bidList;
	let bidTokenInfoPanel;
	let bidTokenInfoPanel2;
	let offerList;
	let offerTokenInfoPanel;
	let offerAllowancePanel;
	let offerTokenInfoPanel2;
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
				placeholder : 'ERC-20 토큰 주소',
				on : {
					keyup : (e, input) => {
						showTokenInfo(bidTokenInfoPanel, input.getValue());
					}
				}
			}),
			
			// 매도 토큰 정보
			bidTokenInfoPanel = DIV(),
			
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
		
		// 매도 토큰 필터링
		FORM({
			c : [
			UUI.FULL_INPUT({
				style : {
					border : '1px solid #ccc'
				},
				name : 'token',
				placeholder : '필터링할 ERC-20 토큰 주소',
				on : {
					keyup : (e, input) => {
						showTokenInfo(bidTokenInfoPanel2, input.getValue());
					}
				}
			}),
			
			// 매도 토큰 정보
			bidTokenInfoPanel2 = DIV(),
			
			UUI.FULL_SUBMIT({
				style : {
					marginTop : 10
				},
				value : '검색하기'
			})],
			on : {
				submit : (e, form) => {
					loadBids(form.getData().token);
				}
			}
		}),
		
		// 매도 목록
		bidList = DIV(),
		
		// 토큰 매수 등록 폼
		FORM({
			style : {
				marginTop : 10
			},
			c : [
			UUI.FULL_INPUT({
				style : {
					border : '1px solid #ccc'
				},
				name : 'token',
				placeholder : 'ERC-20 토큰 주소',
				on : {
					keyup : (e, input) => {
						
						let token = input.getValue();
						
						showTokenInfo(offerTokenInfoPanel, token);
						
						offerAllowancePanel.empty();
						
						if (token.length !== 42) {
							offerAllowancePanel.empty();
						} else {
							
							getERC20ContractController(token).decimals((decimals) => {
								
								getERC20ContractController(token).allowance(Tokenroll.WalletManager.getWalletAddress(), Tokenroll.ERC20SaleContractAddress, (allowance) => {
									
									offerAllowancePanel.empty();
									
									offerAllowancePanel.append(UUI.BUTTON({
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
							});
						}
					}
				}
			}),
			
			// 매수 토큰 정보
			offerTokenInfoPanel = DIV(),
			
			// 인출 가능 정보
			offerAllowancePanel = DIV(),
			
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
		
		// 매수 토큰 필터링
		FORM({
			c : [
			UUI.FULL_INPUT({
				style : {
					border : '1px solid #ccc'
				},
				name : 'token',
				placeholder : '필터링할 ERC-20 토큰 주소',
				on : {
					keyup : (e, input) => {
						showTokenInfo(offerTokenInfoPanel2, input.getValue());
					}
				}
			}),
			
			// 매수 토큰 정보
			offerTokenInfoPanel2 = DIV(),
			
			UUI.FULL_SUBMIT({
				style : {
					marginTop : 10
				},
				value : '검색하기'
			})],
			on : {
				submit : (e, form) => {
					loadOffers(form.getData().token);
				}
			}
		}),
		
		// 매수 목록
		offerList = DIV()]
	}));
	
	BODY.append(Tokenroll.Footer());
	
	let loadBids = RAR((token) => {
		
		bidList.empty();
		
		let createBidPanel = (bidId, bidInfo) => {
			
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
								
								UUI.PROMPT({
									style : {
										backgroundColor : '#fff',
										color : '#000',
										padding : 10,
										border : '1px solid #ccc'
									},
									msg : '몇 개를 판매하시겠습니까? (최대 ' + amount / Math.pow(10, decimals) + '개)'
								}, (sellAmount) => {
									
									Tokenroll.ERC20SaleContractController.sell(bidId, sellAmount * Math.pow(10, decimals), () => {
										console.log('done');
									});
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
		};
		
		if (VALID.notEmpty(token) === true) {
			
			Tokenroll.ERC20SaleContractController.getBidIdsByToken(token, (bidIds) => {
				EACH(bidIds, (bidId) => {
					Tokenroll.ERC20SaleContractController.getBidInfo(bidId, (bidInfo) => {
						createBidPanel(bidId, bidInfo);
					});
				});
			});
		}
		
		else {
			
			Tokenroll.ERC20SaleContractController.getBidCount((bidCount) => {
				REPEAT(bidCount, (bidId) => {
					Tokenroll.ERC20SaleContractController.getBidInfo(bidId, (bidInfo) => {
						createBidPanel(bidId, bidInfo);
					});
				});
			});
		}
	});
	
	let loadOffers = RAR((token) => {
		
		offerList.empty();
		
		let createOfferPanel = (offerId, offerInfo) => {
			
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
					
					console.log(price);
					
					panel.append(UUI.BUTTON({
						style : {
							backgroundColor : '#eee'
						},
						title : '구매하기',
						on : {
							tap : () => {
								
								UUI.PROMPT({
									style : {
										backgroundColor : '#fff',
										color : '#000',
										padding : 10,
										border : '1px solid #ccc'
									},
									msg : '몇 개를 구매하시겠습니까? (최대 ' + amount / Math.pow(10, decimals) + '개)'
								}, (buyAmount) => {
									
									Tokenroll.ERC20SaleContractController.buy(offerId, buyAmount * Math.pow(10, decimals), web3.fromWei(price / amount * buyAmount * Math.pow(10, decimals)), () => {
										console.log('done');
									});
								});
							}
						}
					}));
				}
			});
		};
		
		if (VALID.notEmpty(token) === true) {
			
			Tokenroll.ERC20SaleContractController.getOfferIdsByToken(token, (offerIds) => {
				EACH(offerIds, (offerId) => {
					Tokenroll.ERC20SaleContractController.getOfferInfo(offerId, (offerInfo) => {
						createOfferPanel(offerId, offerInfo);
					});
				});
			});
		}
		
		else {
			
			Tokenroll.ERC20SaleContractController.getOfferCount((offerCount) => {
				REPEAT(offerCount, (offerId) => {
					Tokenroll.ERC20SaleContractController.getOfferInfo(offerId, (offerInfo) => {
						createOfferPanel(offerId, offerInfo);
					});
				});
			});
		}
	});
});