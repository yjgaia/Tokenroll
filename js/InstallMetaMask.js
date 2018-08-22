RUN(() => {
	
	BODY.append(Tokenroll.Header());
	
	BODY.append(Tokenroll.Content({
		c : [DIV({
			style : {
				padding : 10
			},
			c : [IMG({
				src : 'resource/metamask.png'
			}), P({
				style : {
					marginTop : 10
				},
				c : 'MetaMask를 사용할 수 없습니다. MetaMask를 설치해주시기 바랍니다.'
			}), DIV({
				style : {
					marginTop : 10
				},
				c : A({
					style : {
						color : '#3366CC',
						fontWeight : 'bold'
					},
					target : '_blank',
					href : 'https://medium.com/@youngjaesim/metamask%EB%A1%9C-%EC%9D%B4%EB%8D%94%EB%A6%AC%EC%9B%80-%EC%A7%80%EA%B0%91-%EB%A7%8C%EB%93%A4%EA%B8%B0-84042d14f2f6',
					c : 'MetaMask로 이더리움 지갑 만드는 방법'
				})
			})]
		})]
	}));
	
	BODY.append(Tokenroll.Footer());
});