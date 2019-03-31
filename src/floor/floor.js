import './floor_flex.less';
//函数节流
function throttle(method, context){
	clearTimeout(method.timer);
	method.timer = setTimeout(function () {  
		method.call(context);
	}, 200);
}
class Floor {
	constructor(options) {
		this.config = $.extend({
			positionEl: '.y-floor-content-position',
			floorBarPosition: 'ver-r',
			title: ['1F', '2F', '3F'],
			positionPercent: 0, // 滑动距屏幕顶端10%时，切换
			animateDuring: 500, // 500ms
			positionElTop: [],
		}, options || {});
	}
	matchContent2title() { // 确保配置的title跟content数量匹配 
		const cfg = this.config;
		let contents = $(cfg.positionEl);
		contents.length = cfg.title.length > contents.length ? contents.length : cfg.title.length;
		cfg.title.length = contents.length;
	}
	prependFloor() {
		const title = this.config.title;
		let html = '';
		title.forEach((v, i) => {
			html += `<div class="y-floor-item"><span class="y-floor-item-title">${v}</span></div>`;
		});
		html = `<div class="y-floor ${this.config.floorBarPosition}">
							${html}
						</div>`;
		$('body').prepend(html);
	}
	calcContentPosition() {
		const cfg = this.config;
		const contents = $(cfg.positionEl);
		Array.prototype.forEach.call(contents, (v, i) => {
			if (cfg.positionPercent !== 0) {
				cfg.positionElTop.push(parseInt($(v).offset().top - $(window).height() * cfg.positionPercent));
			} else {
				cfg.positionElTop.push(parseInt($(v).offset().top));
			}
		});
		cfg.positionElTop.push(parseInt($(contents[contents.length - 1]).height()) + cfg.positionElTop[cfg.positionElTop.length - 1])
	}
	getWindowInitScrollTop() {
		// this.windowInitScrollTop = parseInt($(window).scrollTop());
		return parseInt($(window).scrollTop());
	}
	calcCurrentPosition(currentWindowScrollTop) {
		const cfg = this.config;
		let newArr = cfg.positionElTop.slice(0);
		// if (cfg.positionElTop.indexOf(currentWindowScrollTop) > -1) {
		// 	currentWindowScrollTop += 1;
		// }
		newArr.push(currentWindowScrollTop);
		newArr.sort((a, b) => {
			return a - b
		});
		let i = newArr.lastIndexOf(currentWindowScrollTop) - 1;
		newArr.splice(i + 1, 1);

		if (i < 0 || i >= cfg.title.length) {
			$('.y-floor').find('.y-floor-item').removeClass('active');
		} else {
			$('.y-floor').find('.y-floor-item').eq(i).addClass('active').siblings().removeClass('active');
		}
	}
	scrollFunc() {
		const windowScrollTop = $(window).scrollTop();
		this.calcCurrentPosition(windowScrollTop);
	}
	clickAnimate() {
		const topArr = this.config.positionElTop;
		const during = this.config.animateDuring;
		$('.y-floor').on('click', '.y-floor-item', function () {
			const i = $(this).index();
			$("body,html").stop().animate({
				scrollTop: topArr[i]
			}, during);
		});
	}
	init() {
		this.matchContent2title();
		this.prependFloor();
		// this.getWindowInitScrollTop();
		this.calcContentPosition();
		this.calcCurrentPosition(this.getWindowInitScrollTop());
		this.clickAnimate();
		$(window).scroll(() => {
			throttle(this.scrollFunc, this);
		});
	}
}
module.exports = Floor;