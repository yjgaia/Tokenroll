RUN(() => {
	
	BODY.append(Tokenroll.Header());
	
	BODY.append(Tokenroll.Content({
		c : P({
			style : {
				padding : 10
			},
			c : ['수수료도 없고 중앙관리자도 없는 완전-탈중앙화 토큰 거래소', A({
				style : {
					marginLeft : 5,
					color : '#3366CC',
					fontWeight : 'bold'
				},
				href : 'https://github.com/Hanul/Tokenroll',
				c : '소스코드'
			})]
		})
	}));
	
	BODY.append(Tokenroll.Footer());
});