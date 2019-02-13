function tlog( str ){
	var tip = document.getElementById("tip");
	tip.innerHTML = str;
}

function slider( params ){
	var {wrap,max,min,val,inputFn,extend=true} = params;
	if( val < min ){
		val = min;
	}else if( val > max ){
		val = max;
	}
	wrap.style.padding = "15px";
	var sliderLine = document.createElement("div");
		sliderLine.style.cssText = `width:${getComputedStyle(wrap).width};height:1px;background-color:#ccc;`;
	var sliderDot = document.createElement("div");
	sliderDot.style.cssText = `width:20px;height:20px;border:1px solid #999;border-radius:50%;background-color:#fff;transform:translate(-50%,-50%);opacity:1.0;margin-bottom:-20px;position:relative;top:0;left:0;`;
	if( extend ){
		var sliderDotExtend = document.createElement("div");
		sliderDotExtend.style.cssText = `width:40px;height:40px;transform:translate(-10px,-10px);position:absolute;top:0;left:0;`;
		sliderDot.appendChild(sliderDotExtend);
	}
	wrap.appendChild(sliderLine);
	wrap.appendChild(sliderDot);
	
	var maxLeft = sliderLine.offsetWidth
	var scale = (max-min)/maxLeft;
	var nowLeft = ((val-min)/(max-min))*maxLeft;
	var oriX,nowX;
	sliderDot.val = val;
	sliderDot.style.left = `${nowLeft}px`;
	let touchStart = ()=>{
		({clientX:oriX} = event.changedTouches[0]);
		event.preventDefault();
	};
	let touchMove = ()=>{
		({clientX:nowX} = event.changedTouches[0]);
		var temp = nowX-oriX + nowLeft;
		if( temp < 0 ){
			temp = 0;
		} else if( temp > maxLeft ){
			temp = maxLeft;
		}
		sliderDot.style.left = `${temp}px`;
		sliderDot.val = temp/maxLeft*(max-min)+min;
		(typeof inputFn === "function") && inputFn(sliderDot.val);
		event.preventDefault();
	};
	let touchEnd = ()=>{
		nowLeft = parseFloat(getComputedStyle(sliderDot).left);
	};
	sliderDot.addEventListener( "touchstart",touchStart );
	sliderDot.addEventListener( "touchmove",touchMove );
	sliderDot.addEventListener( "touchend",touchEnd );
	return {
		resetVal: function(val) {
			console.log('reset')
			nowLeft = ((val-min)/(max-min))*maxLeft;
			sliderDot.val = val;
			sliderDot.style.left = `${nowLeft}px`;
		}
	}
}
	
function dealWith( fn,delay,mastExec ){
	var timer;
	var lastTime = new Date();
	return function(arg){
		var now = new Date();
		clearTimeout( timer );
		if( now-lastTime < mastExec ){
			timer = setTimeout( ()=>{
				fn(arg);
				lastTime = now;
			},delay );
		}else{
			fn(arg);
			lastTime = now;
		}
	}
}

function hslToRgb(h, s, l) {
    var r, g, b;
    if(s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
		}
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min){ 
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

function drawRect(param){
	var {c,rect,innerLine=true,mask=true} = param;
	var ctx = c.getContext("2d");
	var {l,t,r,b} = rect;
	ctx.clearRect( 0,0,c.width,c.height );
	ctx.save();
	
	if( mask ){
		ctx.fillStyle = "rgba(0,0,0,0.2)";
		ctx.fillRect( 0,0,c.width,c.height );
	}
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba( 255,255,255,0.8 )";
	ctx.clearRect( parseInt(l)+0.5,parseInt(t)+0.5,r-l,b-t );
	ctx.strokeRect( parseInt(l)+0.5,parseInt(t)+0.5,r-l,b-t );
	if( innerLine ){
		var wStep = (r-l)/3;
		var hStep = (b-t)/3;
		ctx.save();
		ctx.strokeStyle = "rgba( 255,255,255,0.3 )";
		ctx.setLineDash([]);
		ctx.translate(l,t);
		for( var i = 1;i < 3; i++ ){
			ctx.beginPath();
			ctx.moveTo( 0.5,parseInt(i*hStep)+0.5 );
			ctx.lineTo( parseInt(r-l)+0.5,parseInt(i*hStep)+0.5 );
			ctx.closePath();
			ctx.stroke();
		}
		for( var i = 1;i < 3; i++ ){
			ctx.beginPath();
			ctx.moveTo( parseInt(i*wStep)+0.5,0.5 );
			ctx.lineTo( parseInt(i*wStep)+0.5,parseInt(b-t)+0.5 );
			ctx.closePath();
			ctx.stroke();
		}
		ctx.restore();
	}
	ctx.save();
	ctx.lineWidth = 5;
	var solidArea = minArea/2; 
	var emptyW = r-l-2*solidArea;
	var emptyH = b-t-2*solidArea;
	ctx.setLineDash( [ solidArea,emptyW,solidArea*2,emptyH,2*solidArea,emptyW,2*solidArea,emptyH,solidArea ] );
	ctx.strokeRect( parseInt(l)+0.5,parseInt(t)+0.5,r-l,b-t );
	ctx.restore();
}
