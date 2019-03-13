// import './countdown_flex.less';
// import './countdown_IE.less';
import CookieUtil from './component/CookieUtil';

function delay_script(A) {
	var B = document.createElement("script")
		, C = "src"
		, D = "text/javascript";
	B.setAttribute(C, A);
	B.setAttribute("type", D);
	document.body.appendChild(B);
	return B
}
function hasJQ(){
	if (typeof jQuery != 'undefined') {
		return true;
	} else {
		delay_script("https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min.js");
		return true;
	}
}
class yCountdown{
	constructor(options){
		this.config = $.extend({
			el: $('.y-countdown'),
			hasDay : false,
			hasMonth : false,
			hasYear : false,
			flag: true,
			end: 24,
			loop: true,
			callback: null,
			endStampName: 'endStamp',
			hrsTenthEle:  '[data-yCountdown="hrsTenth"]',
			hrsEle:       '[data-yCountdown="hrs"]',
			minsTenthEle: '[data-yCountdown="minsTenth"]',
			minsEle:      '[data-yCountdown="mins"]',
			secsTenthEle: '[data-yCountdown="secsTenth"]',
			secsEle:      '[data-yCountdown="secs"]',
			daysTenthEle: '[data-yCountdown="daysTenth"]',
			daysEle:      '[data-yCountdown="days"]',
			flagTxt: {
				d: 'DAY',
				h: 'HRS',
				min: 'MINS',
				s: 'SECS'
			},
			template: `
			<div class="countdown" data-ycountdown="yCountdown">
				<div class="d">
					<div>
						<span data-ycountdown="daysTenth">0</span><span data-ycountdown="days">0</span>
					</div>
					<p class="txt"></p>
				</div>
				<i class="d">:</i>
				<div class="h">
					<div>
						<span data-ycountdown="hrsTenth">0</span><span data-ycountdown="hrs">0</span>
					</div>
					<p class="txt"></p>
				</div>
				<i>:</i>
				<div class="min">
					<div>
						<span data-ycountdown="minsTenth">0</span><span data-ycountdown="mins">0</span>
					</div>
				<p class="txt"></p>
				</div>
				<i>:</i>
				<div class="s">
					<div>	
						<span data-ycountdown="secsTenth">0</span><span data-ycountdown="secs">0</span>
					</div>
					<p class="txt"></p>
				</div>
			</div>
			`,
			style: `<style type="text/css" class="yconutdownstyle">.countdown{text-align:center;width:auto;height:auto;background-color:#fd8a2e;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:relative}.countdown>div{display:inline-block;vertical-align:top;height:auto}.countdown>div span{display:inline-block;width:30px;height:30px;text-align:center;line-height:30px;font-size:24px;color:#fd8a2e;background-color:#fff;-webkit-border-radius:2px;-moz-border-radius:2px;border-radius:2px;margin:0 2px}.countdown>div p{text-align:center;font-size:14px;color:#000;width:100%;margin:0;padding:0}.countdown>i{display:inline-block;height:30px;font-size:22px;color:#fff;line-height:30px;vertical-align:top;font-style:normal}</style>`
		}, options || {});
		this.hours = 0;
		this.now = 0;
		
		this.timer = null;
		
	}
	calcEnding(){
		const end = this.config.end;
		if (typeof end == 'number') {
			this.hours = end;
			this.endStamp = new Date().getTime() + new Date(this.hours * 60 * 60 * 1000).getTime();
		}else if(typeof end == 'string' && (end.indexOf('/') > -1 || end.indexOf(',') > -1) && end.length === 10){
			this.endStamp = new Date(end).getTime();
			this.hours = (this.endStamp - new Date().getTime()) / (60*60*1000);
			this.config.loop = false;
		}
		if(this.hours > 24 && this.config.hasDay) this.config.hasDay = true;
	}
	setStorage(k,v){
		if (window.localStorage) {
			window.localStorage.setItem(k,v);
		} else {
			CookieUtil.set(k,v);
		}
	}
	getStorage(k){
		if (window.localStorage) {
			return window.localStorage.getItem(k) ? window.localStorage.getItem(k) : false;
		} else {
			CookieUtil.get(k);
		}
	}
	removeStorage(k){
		if (window.localStorage) {
			localStorage.removeItem(k);
		}else{
			CookieUtil.unset(k);
		}
	}
	calcTimes(timeStamp){
		let times = {};
		times.years = parseInt(timeStamp / (1000*60*60*24*30*12));
		times.months = parseInt(timeStamp / (1000*60*60*24*30) % 12);
		times.days = parseInt(timeStamp / (1000*60*60*24) % 365 % 30);
		if (this.config.hasDay) {
			times.hours = parseInt(timeStamp / (1000*60*60) % 24);
		}else{
			times.hours = parseInt(timeStamp / (1000*60*60));
		}
		times.mins = parseInt(timeStamp / (1000*60) % 60);
		times.secs = parseInt(timeStamp / 1000 % 60 % 60);
		return times;
	}
	countdown() {
		this.now = new Date().getTime();
		const {
			years,
			months,
			days,
			hours,
			mins,
			secs
		} = this.calcTimes(this.endStamp - this.now);
		const cfg = this.config;
		const el = cfg.el;
		el.find(cfg.hrsTenthEle).text(hours >= 10 ? parseInt(hours / 10) : '0');
		el.find(cfg.hrsEle).text(hours % 10);
		el.find(cfg.minsTenthEle).text(mins >= 10 ? parseInt(mins / 10) : '0');
		el.find(cfg.minsEle).text(mins % 10);
		el.find(cfg.secsTenthEle).text(secs >= 10 ? parseInt(secs / 10) : '0');
		el.find(cfg.secsEle).text(secs % 10);
		if (cfg.hasDay) {
			el.find(cfg.daysTenthEle).text(days >= 10 ? parseInt(days / 10) : '0');
			el.find(cfg.daysEle).text(days % 10);
		}
		this.updateEndStamp();
	}
	updateEndStamp(){
		const cfg = this.config;
		const el = cfg.el;
		if (!this.getStorage(cfg.endStampName) && this.timer !== null) { //没有cookie时
			this.setStorage(cfg.endStampName, this.endStamp);
		}else{
			this.endStamp = parseInt(this.getStorage(cfg.endStampName) );
			
			if(this.now >= this.endStamp ){ //当前时间超过cookie设置值
				if (cfg.loop) {
					const overTime = this.now - this.endStamp;
					const overHrs = overTime / (1000*60*60);
					let needToAddTime = 0;
					if(overHrs < this.hours){
						needToAddTime = this.hours *60*60*1000;
					}else {
						needToAddTime = (parseInt(overHrs/this.hours) + 1) * this.hours *60*60*1000;
					}
					this.endStamp += needToAddTime; 
					this.setStorage(cfg.endStampName, this.endStamp);
				}else if (!cfg.loop) {
					clearInterval(this.timer);
					this.timer = null;

					el.find(cfg.hrsTenthEle).text('0');
					el.find(cfg.hrsEle).text('0');
					el.find(cfg.minsTenthEle).text('0');
					el.find(cfg.minsEle).text('0');
					el.find(cfg.secsTenthEle).text('0');
					el.find(cfg.secsEle).text('0');
					if (cfg.hasDay) {
					el.find(cfg.daysTenthEle).text('0');
						el.find(cfg.daysEle).text('0');
					}
					if(typeof cfg.callback === 'function' && cfg.callback !== undefined){
						cfg.callback();
					}
				}
			}
		}
	}
	handleHtml(){
		const config = this.config;
		const {d,h,min,s} = config.flagTxt;
		if (config.el) {
			$('.yconutdownstyle').length === 0 && $('head').append(config.style);
			config.el.append(config.template);
			if (config.flag) {
				config.el.find('.d .txt').text(d);
				config.el.find('.h .txt').text(h);
				config.el.find('.min .txt').text(min);
				config.el.find('.s .txt').text(s);
			}
			!config.hasDay && config.el.find('.d').remove();
		}
	}
	init(){
		this.calcEnding();
		this.handleHtml();
		this.timer = setInterval(function() {
			this.countdown();
		}.bind(this), 1000);
	}
}
module.exports = yCountdown;