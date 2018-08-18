RUN(() => {
	
	BODY.append(Tokenroll.Header('erc20sale'));
	
	let showBidPanel = () => {
		
		panelWrapper.empty();
		
		panelWrapper.append('주문 수량');
	};
	
	let showOfferPanel = () => {
		
		panelWrapper.empty();
	};
	
	let panelWrapper;
	BODY.append(Tokenroll.Content({
		c : [DIV({
			style : {
				flt : 'left'
			},
			c : P({
				style : {
					padding : 10
				},
				c : 'test'
			})
		}), DIV({
			style : {
				marginLeft : 10,
				width : 500,
				flt : 'left',
				border : '1px solid #eee'
			},
			c : [A({
				c : '매수',
				on : {
					tap : () => {
						showBidPanel();
					}
				}
			}), A({
				c : '매도',
				on : {
					tap : () => {
						showOfferPanel();
					}
				}
			}), panelWrapper = DIV()]
		}), CLEAR_BOTH()]
	}));
	
	BODY.append(Tokenroll.Footer());
	
	showBidPanel();
});