// import './floor_flex.less';
//函数节流

class Floor{
	constructor(options){
		this.config = $.extend({
			positionEl: '.y-floor-content-position',
			title: ['1F', '2F', '3F'],
			positionPercent: 0.1, // 滑动距屏幕顶端20%时，切换
			animateDuring: 0.4, // 0.4s
			positionElTop: [],
		}, options || {});
	}
	matchContent2title(){ // 确保配置的title跟content数量匹配 
		const cfg = this.config;
		let contents = $(cfg.positionEl);
		contents.length = cfg.title.length > contents.length ? contents.length : cfg.title.length;
		cfg.title.length = contents.length;
	}
	prependFloor(){
		const title = this.config.title;
		let html = '';
		title.forEach((v, i) => {
			html += `<div class="y-floor-item"><span class="y-floor-item-title">${v}</span></div>`;
		});
		html = `<div class="y-floor">
							${html}
						</div>`;
		$('body').prepend(html);
	}
	calcContentPosition(){
		const cfg = this.config;
		const contents = $(cfg.positionEl);
		Array.prototype.forEach.call(contents,(v,i)=>{
			cfg.positionElTop.push(parseInt($(v).offset().top + $(window).height() * cfg.positionPercent));
		});
		cfg.positionElTop.push(parseInt($(contents[contents.length - 1]).height()) + cfg.positionElTop[cfg.positionElTop.length - 1])
	}
	getWindowInitScrollTop(){
		this.windowInitScrollTop = parseInt($(window).scrollTop());
	}
	calcCurrentPosition(currentWindowScrollTop){
		const cfg = this.config;
		
		cfg.positionElTop.push(currentWindowScrollTop);
		
		cfg.positionElTop.sort((a, b) => {return a-b});
		
		console.log(currentWindowScrollTop);
		console.log(cfg.positionElTop);
		let i = cfg.positionElTop.indexOf(currentWindowScrollTop) - 1;
		console.log(i);
		
		i >= 0 && $('.y-floor').find('.y-floor-item').eq(i).addClass('active').siblings().removeClass('active');
	}
	init(){
		this.matchContent2title();
		this.prependFloor();
		this.getWindowInitScrollTop();
		this.calcContentPosition();

		this.calcCurrentPosition(this.windowInitScrollTop)
	}
}