Tokenroll.Footer = CLASS({

	preset : () => {
		return DIV;
	},
	
	params : () => {
		return {
			style : {
				padding : 20,
				backgroundColor : '#999',
				color : '#000'
			}
		};
	},

	init : (inner, self) => {
		
		self.append(DIV({
			c : ['제작: ', A({
				href : 'https://github.com/Hanul/Tokenroll',
				c : '심영재'
			})]
		}));
	}
});
