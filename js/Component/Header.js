Tokenroll.Header = CLASS({

	preset : () => {
		return DIV;
	},
	
	params : () => {
		return {
			style : {
				backgroundColor : '#fff',
				color : '#000'
			}
		};
	},

	init : (inner, self) => {
		
		self.append(H1({
			style : {
				fontSize : 30,
				fontWeight : 'bold',
				padding : 10,
				paddingLeft : 20,
				fontFamily : '"Rock Salt", cursive'
			},
			c : 'Tokenroll'
		}));
	}
});
