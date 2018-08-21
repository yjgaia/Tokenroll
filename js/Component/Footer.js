Tokenroll.Footer = CLASS({

	preset : () => {
		return DIV;
	},
	
	params : () => {
		return {
			style : {
				borderTop : '1px solid #aaa',
				padding : 20,
				backgroundColor : '#ccc',
				color : '#333'
			}
		};
	},

	init : (inner, self) => {
		
		self.append(DIV({
			c : [
			DIV({
				style : {
					flt : 'left'
				},
				c : [SPAN({
					c : ['제작: ', A({
						href : 'https://github.com/Hanul/Tokenroll',
						c : '심영재'
					})]
				}),
				
				A({
					style : {
						marginLeft : 20
					},
					target : '_blank',
					href : 'https://github.com/Hanul/Tokenroll',
					c : '소스코드'
				})]
			}),
			
			DIV({
				style : {
					marginTop : -5,
					marginBottom : -5,
					flt : 'right'
				},
				c : A({
					style : {
						fontSize : 20
					},
					c : FontAwesome.GetIcon('envelope'),
					href : 'mailto:hanul@hanul.me'
				})
			}),
			
			CLEAR_BOTH()]
		}));
	}
});
