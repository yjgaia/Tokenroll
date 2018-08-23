window.addEventListener('load', () => {
	
	BODY.append(Tokenroll.Header());
	
	BODY.append(Tokenroll.Content({
		c : [DIV({
			style : {
				padding : 10
			},
			c : [P({
				c : '수수료도 없고 중앙관리자도 없는 탈중앙화 토큰 거래소'
			})]
		})]
	}));
	
	BODY.append(Tokenroll.Footer());
});