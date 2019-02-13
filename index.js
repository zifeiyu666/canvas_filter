function tabBtn(){
	var btns = document.querySelectorAll("#mode>div");
	var sliderWraps = document.querySelectorAll("#sliders>div");
	var defaultSelIndex = 0;
	for( var i = 0;i<btns.length;i++ ){
		btns[i].index = i;
		if( i<sliderWraps.length ){
			i !== defaultSelIndex && sliderWraps[i].classList.add( "hide" );
			i === defaultSelIndex && btns[i].classList.add( "sel" );
		}
		btns[i].addEventListener("touchstart",function(){
			if( this.index <= 2 ){
				for( var j = 0;j<sliderWraps.length;j++ ){
					btns[j].classList[ j===this.index?"add":"remove" ]("sel");
					sliderWraps[j].classList[ j===this.index ? "remove":"add"]( "hide" );
				}
			}
		})
	}
}


function calcImg(stateObj, oriData){
	let gPercent = stateObj.g / 100
	let lPercent = stateObj.l / 100
	let sPercent = stateObj.s / 100
	for( let i=0, len = oriData.length; i<len; i+=4) {
		var r = oriData[i],
				g = oriData[i+1],
				b = oriData[i+2],
				avg = ( r + g + b ) /3;

		// 处理灰度
		r += (avg - r) * gPercent
		g += (avg - g) * gPercent
		b += (avg - b) * gPercent
		// 处理亮度和饱和度
		var [h, s, l] = rgbToHsl(r, g, b);
		l += lPercent
		s += sPercent
		var result = hslToRgb(h, s, l)

		var [r, g, b] = result;

		rectData.data[i] = r
		rectData.data[i+1] = g
		rectData.data[i+2] = b
	}
	ctx.putImageData(rectData, rect.l, rect.t, 0, 0, c.width, c.height);
	
}

