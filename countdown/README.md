	const cd = new yCountdown({
		el: $('#anynode'), //放置的位置 jq对象
		end: 24, //结束时间 三种形式'2018/12/30'(String)、'2018,12,30'(String)、36(Number)    
		loop: true, //倒计时结束后是否循环倒计时 默认true
		flag: true, //倒计时时间标志，默认值true
		endStampName: 'endStamp', //(String) 存储cookie或localStorage的名字
		flagTxt: {
		 	d: 'DAY',
		 	h: 'HRS',
		 	min: 'MINS',
		 	s: 'SECS'
		 },  //(Object) 
		hasDay: false, //默认是不显示天数的倒计时，不论是否超过24小时，当值为true时，且倒计时时长超过24小时，显示天数
		callback: null, //(Function)倒计时结束后的回调，此时loop应该为false  默认值null
	});
	cd.init();