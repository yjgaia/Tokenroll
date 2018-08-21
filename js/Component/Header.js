Tokenroll.Header = CLASS({

	preset : () => {
		return DIV;
	},
	
	params : () => {
		return {
			style : {
				backgroundColor : '#eee',
				color : '#000',
				borderBottom : '1px solid #ccc'
			}
		};
	},

	init : (inner, self) => {
		
		self.append(DIV({
			c : [
			
			H1({
				style : {
					flt : 'left',
					fontSize : 30,
					fontWeight : 'bold',
					padding : 10,
					paddingLeft : 30,
					fontFamily : '"Rock Salt", cursive'
				},
				c : A({
					href : 'index.html',
					c : 'Tokenroll'
				})
			}),
			
			A({
				style : {
					marginLeft : 15,
					marginTop : 35,
					flt : 'left'
				},
				href : 'erc20sale.html',
				c : ['ERC-20 ', FontAwesome.GetIcon('arrows-alt-h'), ' 이더']
			}),
			
			CLEAR_BOTH()]
		}));
	}
});
