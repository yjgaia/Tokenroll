window.addEventListener('load', () => {
	
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
					style : {
						marginTop : 10,
						marginBottom : 10,
						padding : 5,
						color : '#155724',
						backgroundColor : '#d4edda',
						border : '1px solid #c3e6cb',
						fontSize : 14
					},
					c : [UUI.BUTTON_H({
						icon : tokenInfo.icon === undefined ? '' : IMG({
							src : 'resource/' + tokenInfo.icon
						}),
						spacing : 10,
						title : tokenInfo.name
					}), tokenInfo.site === undefined ? '' : DIV({
						style : {
							marginTop : 5
						},
						c : A({
							target : '_blank',
							href : tokenInfo.site
						})
					})]
				}));
			}
			
			else {
				targetPanel.append(DIV({
					style : {
						marginTop : 10,
						marginBottom : 10,
						padding : 5,
						color : '#856404',
						backgroundColor : '#fff3cd',
						border : '1px solid #ffeeba',
						fontSize : 14
					},
					c : ['알려지지 않은 토큰입니다. 알려진 토큰으로 등록하기 위해서는 ', A({
						style : {
							color : '#3366CC',
							fontWeight : 'bold'
						},
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
		
		UUI.PANEL({
			style : {
				onDisplayResize : (width, height) => {
					if (width < 1024) {
						return {
							width : '100%',
							flt : 'none'
						};
					} else {
						return {
							width : '50%',
							flt : 'left'
						};
					}
				}
			},
			contentStyle : {
				padding : 10
			},
			c : DIV({
				style : {
					border : '1px solid #ccc',
					borderRadius : 5
				},
				c : [
				DIV({
					style : {
						textAlign : 'center',
						color : 'rgb(230, 5, 10)',
						padding : 10,
						borderBottom : '1px solid #ccc'
					},
					c : [H3({
						c : '토큰 구매하기'
					}), P({
						c : '토큰 구매 정보를 등록하면, 토큰 보유자가 구매 정보를 보고 판매하게 됩니다.'
					})]
				}),
				
				// 토큰 구매 정보 등록 폼
				FORM({
					style : {
						padding : 10,
						borderBottom : '1px solid #ccc'
					},
					c : [
					UUI.FULL_INPUT({
						style : {
							border : '1px solid #ccc',
							borderRadius : 5
						},
						name : 'token',
						placeholder : 'ERC-20 토큰 주소',
						on : {
							keyup : (e, input) => {
								showTokenInfo(bidTokenInfoPanel, input.getValue());
							}
						}
					}),
					
					// 토큰 정보
					bidTokenInfoPanel = DIV(),
					
					UUI.FULL_INPUT({
						style : {
							marginTop : 10,
							border : '1px solid #ccc',
							borderRadius : 5
						},
						name : 'amount',
						placeholder : '구매 수량'
					}),
					UUI.FULL_INPUT({
						style : {
							marginTop : 10,
							border : '1px solid #ccc',
							borderRadius : 5
						},
						name : 'price',
						placeholder : '가격 (이더)'
					}),
					UUI.FULL_SUBMIT({
						style : {
							marginTop : 10,
							borderRadius : 5
						},
						value : '토큰 구매정보 등록하기'
					})],
					on : {
						submit : (e, form) => {
							
							WalletManager.checkIsLocked((isLocked) => {
								
								if (isLocked === true) {
									
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
										msg : [IMG({
											src : 'resource/metamask.png'
										}), P({
											c : 'MetaMask가 잠겨있습니다.\nMetaMask에 로그인해주시기 바랍니다.'
										})]
									});
								}
								
								else {
									
									let info = form.getData();
									form.setData({});
									
									bidTokenInfoPanel.empty();
									
									getERC20ContractController(info.token).decimals((decimals) => {
										
										Tokenroll.ERC20SaleContractController.bid(info.token, info.amount * Math.pow(10, decimals), info.price, () => {
											console.log('done');
										});
									});
								}
							});
						}
					}
				}),
				
				// 토큰 필터링
				FORM({
					style : {
						padding : 10,
						borderBottom : '1px solid #ccc'
					},
					c : [
					UUI.FULL_INPUT({
						style : {
							border : '1px solid #ccc',
							borderRadius : 5
						},
						name : 'token',
						placeholder : '검색할 ERC-20 토큰 주소',
						on : {
							keyup : (e, input) => {
								showTokenInfo(bidTokenInfoPanel2, input.getValue());
							}
						}
					}),
					
					// 토큰 정보
					bidTokenInfoPanel2 = DIV(),
					
					UUI.FULL_SUBMIT({
						style : {
							marginTop : 10,
							borderRadius : 5
						},
						value : '토큰 구매정보 검색하기'
					})],
					on : {
						submit : (e, form) => {
							loadBids(form.getData().token);
						}
					}
				}),
				
				// 구매 정보 목록
				bidList = DIV({
					style : {
						padding : 10
					}
				})]
			})
		}),
		
		UUI.PANEL({
			style : {
				onDisplayResize : (width, height) => {
					if (width < 1024) {
						return {
							width : '100%',
							flt : 'none'
						};
					} else {
						return {
							width : '50%',
							flt : 'left'
						};
					}
				}
			},
			contentStyle : {
				padding : 10
			},
			c : DIV({
				style : {
					border : '1px solid #ccc',
					borderRadius : 5
				},
				c : [
				DIV({
					style : {
						textAlign : 'center',
						color : 'rgb(13, 70, 200)',
						borderBottom : '1px solid #ccc',
						padding : 10
					},
					c : [H3({
						c : '토큰 판매하기'
					}), P({
						c : '토큰 판매 정보를 등록하면, 토큰 구매 희망자가 판매 정보를 보고 구매하게 됩니다.'
					})]
				}),
				
				// 토큰 판매 정보 등록 폼
				FORM({
					style : {
						padding : 10,
						borderBottom : '1px solid #ccc'
					},
					c : [
					UUI.FULL_INPUT({
						style : {
							border : '1px solid #ccc',
							borderRadius : 5
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
										
										WalletManager.getWalletAddress((walletAddress) => {
											
											getERC20ContractController(token).allowance(walletAddress, Tokenroll.ERC20SaleContractAddress, (allowance) => {
												
												offerAllowancePanel.empty();
												
												offerAllowancePanel.append(UUI.BUTTON({
													style : {
														marginTop : 10,
														backgroundColor : '#ddd',
														padding : 10,
														borderRadius : 5
													},
													title : 'Tokenroll에 인출 허락하기 (현재 허락된 개수: ' + allowance / Math.pow(10, decimals) + ')',
													on : {
														tap : () => {
															
															UUI.PROMPT({
																style : {
																	backgroundColor : '#fff',
																	color : '#000',
																	padding : 10,
																	border : '1px solid #ccc'
																},
																inputStyle : {
																	marginTop : 10,
																	border : '1px solid #ccc',
																	borderRadius : 5
																},
																okButtonStyle : {
																	marginTop : 10,
																	padding : 10,
																	border : '1px solid #ccc',
																	borderRadius : 5
																},
																cancelButtonStyle : {
																	marginTop : 10,
																	padding : 10,
																	border : '1px solid #ccc',
																	borderRadius : 5
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
									});
								}
							}
						}
					}),
					
					// 토큰 정보
					offerTokenInfoPanel = DIV(),
					
					// 인출 가능 정보
					offerAllowancePanel = DIV(),
					
					UUI.FULL_INPUT({
						style : {
							marginTop : 10,
							border : '1px solid #ccc',
							borderRadius : 5
						},
						name : 'amount',
						placeholder : '판매 수량'
					}),
					UUI.FULL_INPUT({
						style : {
							marginTop : 10,
							border : '1px solid #ccc',
							borderRadius : 5
						},
						name : 'price',
						placeholder : '가격 (이더)'
					}),
					UUI.FULL_SUBMIT({
						style : {
							marginTop : 10,
							borderRadius : 5
						},
						value : '토큰 판매정보 등록하기'
					})],
					on : {
						submit : (e, form) => {
							
							WalletManager.checkIsLocked((isLocked) => {
								
								if (isLocked === true) {
									
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
										msg : [IMG({
											src : 'resource/metamask.png'
										}), P({
											c : 'MetaMask가 잠겨있습니다.\nMetaMask에 로그인해주시기 바랍니다.'
										})]
									});
								}
								
								else {
									
									let info = form.getData();
									form.setData({});
									
									offerTokenInfoPanel.empty();
									offerAllowancePanel.empty();
									
									getERC20ContractController(info.token).decimals((decimals) => {
										
										Tokenroll.ERC20SaleContractController.offer(info.token, info.amount * Math.pow(10, decimals), info.price, () => {
											console.log('done');
										});
									});
								}
							});
						}
					}
				}),
				
				// 토큰 필터링
				FORM({
					style : {
						padding : 10,
						borderBottom : '1px solid #ccc'
					},
					c : [
					UUI.FULL_INPUT({
						style : {
							border : '1px solid #ccc',
							borderRadius : 5
						},
						name : 'token',
						placeholder : '검색할 ERC-20 토큰 주소',
						on : {
							keyup : (e, input) => {
								showTokenInfo(offerTokenInfoPanel2, input.getValue());
							}
						}
					}),
					
					// 토큰 정보
					offerTokenInfoPanel2 = DIV(),
					
					UUI.FULL_SUBMIT({
						style : {
							marginTop : 10,
							borderRadius : 5
						},
						value : '토큰 판매정보 검색하기'
					})],
					on : {
						submit : (e, form) => {
							loadOffers(form.getData().token);
						}
					}
				}),
				
				// 토큰 판매 정보 목록
				offerList = DIV({
					style : {
						padding : 10
					}
				})]
			})
		}),
		
		CLEAR_BOTH()]
	}));
	
	BODY.append(Tokenroll.Footer());
	
	let loadBids = RAR((token) => {
		
		let createBidPanel = (bidId, bidInfo) => {
			
			let bidder = bidInfo[0];
			let token = bidInfo[1];
			let amount = bidInfo[2];
			let price = bidInfo[3];
			
			getERC20ContractController(token).decimals((decimals) => {
				
				let panel;
				let tokenInfoPanel;
				bidList.append(panel = DIV({
					style : bidList.getChildren().length === 0 ? undefined : {
						marginTop : 10,
						borderTop : '1px solid #eee',
						paddingTop : 10
					},
					c : [DIV({
						c : ['구매 희망자: ', A({
							target : 'blank',
							href : 'http://etherscan.io/address/' + bidder,
							c : bidder
						})]
					}), DIV({
						c : ['ERC-20 토큰 주소: ', A({
							target : 'blank',
							href : 'http://etherscan.io/token/' + token,
							c : token
						})]
					}), tokenInfoPanel = DIV(), DIV({
						c : '구매 수량: ' + amount / Math.pow(10, decimals)
					}), DIV({
						c : '가격: ' + web3.fromWei(price) + ' 이더'
					})]
				}));
				
				showTokenInfo(tokenInfoPanel, token);
				
				WalletManager.getWalletAddress((walletAddress) => {
					
					if (bidder === walletAddress) {
						
						panel.append(UUI.BUTTON({
							style : {
								marginTop : 10,
								backgroundColor : '#ddd',
								padding : 10,
								borderRadius : 5
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
								marginTop : 10,
								backgroundColor : '#ddd',
								padding : 10,
								borderRadius : 5
							},
							title : '판매하기',
							on : {
								tap : () => {
									
									UUI.PROMPT({
										style : {
											backgroundColor : '#fff',
											color : '#000',
											padding : 10,
											border : '1px solid #ccc',
											width : 300
										},
										inputStyle : {
											marginTop : 10,
											border : '1px solid #ccc',
											borderRadius : 5
										},
										okButtonStyle : {
											marginTop : 10,
											padding : 10,
											border : '1px solid #ccc',
											borderRadius : 5
										},
										cancelButtonStyle : {
											marginTop : 10,
											padding : 10,
											border : '1px solid #ccc',
											borderRadius : 5
										},
										msg : [P({
											c : '몇 개를 판매하시겠습니까? (최대 ' + amount / Math.pow(10, decimals) + '개)'
										}), P({
											style : {
												marginTop : 10,
												fontSize : 14,
												color : '#666'
											},
											c : '판매하기 전에, Tokenroll에 허락된 인출량을 확인해주세요. Tokenroll에 인출 허락하기 버튼으로 인출량을 지정해줄 수 있습니다.'
										})]
									}, (sellAmount) => {
										
										Tokenroll.ERC20SaleContractController.sell(bidId, sellAmount * Math.pow(10, decimals), () => {
											console.log('done');
										});
									});
								}
							}
						}));
						
						WalletManager.checkIsLocked((isLocked) => {
							
							if (isLocked !== true) {
								
								WalletManager.getWalletAddress((walletAddress) => {
									
									getERC20ContractController(token).allowance(walletAddress, Tokenroll.ERC20SaleContractAddress, (allowance) => {
										
										panel.append(UUI.BUTTON({
											style : {
												marginTop : 10,
												backgroundColor : '#ddd',
												padding : 10,
												borderRadius : 5
											},
											title : 'Tokenroll에 인출 허락하기 (현재 허락된 개수: ' + allowance / Math.pow(10, decimals) + ')',
											on : {
												tap : () => {
													
													UUI.PROMPT({
														style : {
															backgroundColor : '#fff',
															color : '#000',
															padding : 10,
															border : '1px solid #ccc'
														},
														inputStyle : {
															marginTop : 10,
															border : '1px solid #ccc',
															borderRadius : 5
														},
														okButtonStyle : {
															marginTop : 10,
															padding : 10,
															border : '1px solid #ccc',
															borderRadius : 5
														},
														cancelButtonStyle : {
															marginTop : 10,
															padding : 10,
															border : '1px solid #ccc',
															borderRadius : 5
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
						});
					}
				});
			});
		};
		
		bidList.empty();
		bidList.append(IMG({
			src : 'resource/loading.gif'
		}));
		
		if (VALID.notEmpty(token) === true) {
			
			Tokenroll.ERC20SaleContractController.getBidIdsByToken(token, (bidIds) => {
				bidList.empty();
				
				if (bidIds.length === 0) {
					bidList.append('구매 정보가 없습니다.');
				} else {
					EACH(bidIds, (bidId) => {
						Tokenroll.ERC20SaleContractController.getBidInfo(bidId, (bidInfo) => {
							createBidPanel(bidId, bidInfo);
						});
					});
				}
			});
		}
		
		else {
			
			Tokenroll.ERC20SaleContractController.getBidCount((bidCount) => {
				bidList.empty();
				
				if (bidCount === 0) {
					bidList.append('구매 정보가 없습니다.');
				} else {
					REPEAT(bidCount, (bidId) => {
						Tokenroll.ERC20SaleContractController.getBidInfo(bidId, (bidInfo) => {
							createBidPanel(bidId, bidInfo);
						});
					});
				}
			});
		}
	});
	
	let loadOffers = RAR((token) => {
		
		let createOfferPanel = (offerId, offerInfo) => {
			
			let offeror = offerInfo[0];
			let token = offerInfo[1];
			let amount = offerInfo[2];
			let price = offerInfo[3];
			
			getERC20ContractController(token).decimals((decimals) => {
				
				let panel;
				let tokenInfoPanel;
				offerList.append(panel = DIV({
					style : offerList.getChildren().length === 0 ? undefined : {
						marginTop : 10,
						borderTop : '1px solid #eee',
						paddingTop : 10
					},
					c : [DIV({
						c : ['판매 희망자: ', A({
							target : 'blank',
							href : 'http://etherscan.io/address/' + offeror,
							c : offeror
						})]
					}), DIV({
						c : ['ERC-20 토큰 주소: ', A({
							target : 'blank',
							href : 'http://etherscan.io/token/' + token,
							c : token
						})]
					}), tokenInfoPanel = DIV(), DIV({
						c : '판매 수량: ' + amount / Math.pow(10, decimals)
					}), DIV({
						c : '가격: ' + web3.fromWei(price) + ' 이더'
					})]
				}));
				
				showTokenInfo(tokenInfoPanel, token);
				
				WalletManager.getWalletAddress((walletAddress) => {
					
					if (offeror === walletAddress) {
						
						panel.append(UUI.BUTTON({
							style : {
								marginTop : 10,
								backgroundColor : '#ddd',
								padding : 10,
								borderRadius : 5
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
								marginTop : 10,
								backgroundColor : '#ddd',
								padding : 10,
								borderRadius : 5
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
										inputStyle : {
											marginTop : 10,
											border : '1px solid #ccc',
											borderRadius : 5
										},
										okButtonStyle : {
											marginTop : 10,
											padding : 10,
											border : '1px solid #ccc',
											borderRadius : 5
										},
										cancelButtonStyle : {
											marginTop : 10,
											padding : 10,
											border : '1px solid #ccc',
											borderRadius : 5
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
			});
		};
		
		offerList.empty();
		offerList.append(IMG({
			src : 'resource/loading.gif'
		}));
		
		if (VALID.notEmpty(token) === true) {
			
			Tokenroll.ERC20SaleContractController.getOfferIdsByToken(token, (offerIds) => {
				offerList.empty();
				
				if (offerIds.length === 0) {
					offerList.append('판매 정보가 없습니다.');
				} else {
					EACH(offerIds, (offerId) => {
						Tokenroll.ERC20SaleContractController.getOfferInfo(offerId, (offerInfo) => {
							createOfferPanel(offerId, offerInfo);
						});
					});
				}
			});
		}
		
		else {
			
			Tokenroll.ERC20SaleContractController.getOfferCount((offerCount) => {
				offerList.empty();
				
				if (offerCount === 0) {
					offerList.append('판매 정보가 없습니다.');
				} else {
					REPEAT(offerCount, (offerId) => {
						Tokenroll.ERC20SaleContractController.getOfferInfo(offerId, (offerInfo) => {
							createOfferPanel(offerId, offerInfo);
						});
					});
				}
			});
		}
	});
});