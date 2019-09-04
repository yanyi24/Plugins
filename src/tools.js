  var tool = new function () {
  	//格式化时间戳
  	//format格式如下：
  	//yyyy-MM-dd hh:mm:ss 年月日时分秒(默认格式)
  	//yyyy-MM-dd 年月日
  	//hh:mm:ss 时分秒
  	this.formatTimeStamp = function (timestamp, format) {
  		if (!timestamp) {
  			return 0;
  		}
  		var formatTime;
  		format = format || 'yyyy-MM-dd hh:mm:ss';
  		var date = new Date(timestamp * 1000);
  		var o = {
  			"M+": date.getMonth() + 1, //月份
  			"d+": date.getDate(), //日
  			"h+": date.getHours(), //小时
  			"m+": date.getMinutes(), //分
  			"s+": date.getSeconds() //秒
  		};
  		if (/(y+)/.test(format)) {
  			formatTime = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  		} else {
  			formatTime = format;
  		}
  		for (var k in o) {
  			if (new RegExp("(" + k + ")").test(formatTime))
  				formatTime = formatTime.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  		}
  		return formatTime;
  	};
  	// 截取字符串
  	// str  maxLen
  	this.splitStr = function (str, maxLen) {
  		if (str && str.length > maxLen) {
  			str = str.substr(0, maxLen) + "...";
  		}
  		return str;
  	}
  	//防止XSS攻击
  	this.xssFilter = function (val) {
  		val = val.toString();
  		val = val.replace(/[<]/g, "&lt;");
  		val = val.replace(/[>]/g, "&gt;");
  		val = val.replace(/"/g, "&quot;");
  		return val;
  	};
  	//将空格和换行符转换成HTML标签
  	this.formatText2Html = function (text) {
  		var html = text;
  		if (html) {
  			html = this.xssFilter(html); //用户昵称或群名称等字段会出现脚本字符串
  			html = html.replace(/ /g, "&nbsp;");
  			html = html.replace(/\n/g, "<br/>");
  		}
  		return html;
  	};
  	//将HTML标签转换成空格和换行符
  	this.formatHtml2Text = function (html) {
  		var text = html;
  		if (text) {
  			text = text.replace(/&nbsp;/g, " ");
  			text = text.replace(/<br\/>/g, "\n");
  		}
  		return text;
  	};
  	//获取字符串(UTF-8编码)所占字节数
  	//参考：http://zh.wikipedia.org/zh-cn/UTF-8
  	this.getStrBytes = function (str) {
  		if (str == null || str === undefined) return 0;
  		if (typeof str != "string") {
  			return 0;
  		}
  		var total = 0,
  			charCode, i, len;
  		for (i = 0, len = str.length; i < len; i++) {
  			charCode = str.charCodeAt(i);
  			if (charCode <= 0x007f) {
  				total += 1; //字符代码在000000 – 00007F之间的，用一个字节编码
  			} else if (charCode <= 0x07ff) {
  				total += 2; //000080 – 0007FF之间的字符用两个字节
  			} else if (charCode <= 0xffff) {
  				total += 3; //000800 – 00D7FF 和 00E000 – 00FFFF之间的用三个字节，注: Unicode在范围 D800-DFFF 中不存在任何字符
  			} else {
  				total += 4; //010000 – 10FFFF之间的用4个字节
  			}
  		}
  		return total;
  	};
  	//去掉头尾空白符
  	this.trimStr = function (str) {
  		if (!str) return '';
  		str = str.toString();
  		return str.replace(/(^\s*)|(\s*$)/g, "");
  	}; //设置cookie
  	//name 名字
  	//value 值
  	//expires 有效期(单位：秒)
  	//path
  	//domain 作用域
  	this.setCookie = function (name, value, expires, path, domain) {
  		var exp = new Date();
  		exp.setTime(exp.getTime() + expires * 1000);
  		document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
  	};
  	//获取cookie
  	this.getCookie = function (name) {
  		var result = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
  		if (result != null) {
  			return unescape(result[2]);
  		}
  		return null;
  	};
  	//删除cookie
  	this.delCookie = function (name) {
  		var exp = new Date();
  		exp.setTime(exp.getTime() - 1);
  		var value = this.getCookie(name);
  		if (value != null)
  			document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
  	};
  	//根据名字获取url参数值
  	this.getQueryString = function (name) {
  		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  		var r = window.location.search.substr(1).match(reg);
  		if (r != null) return unescape(r[2]);
  		return null;
  	};
  	//判断IE版本号，ver表示版本号
  	this.isIE = function (ver) {
  		var b = document.createElement('b')
  		b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
  		return b.getElementsByTagName('i').length === 1;
  	};
  	//判断浏览器版本
  	this.getBrowserInfo = function () {
  		var Sys = {};
  		var ua = navigator.userAgent.toLowerCase();
  		log.info('navigator.userAgent=' + ua);
  		var s;
  		(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1]:
  			(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
  			(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
  			(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
  			(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
  		if (Sys.ie) { //Js判断为IE浏览器
  			//ie10的判断这里有个问题
  			// Mozilla/5.0 (compatible; MSIE 9.0; qdesk 2.5.1277.202; Windows NT 6.1; WOW64; Trident/6.0)
  			// 是IE10 而不是IE9
  			if (ua.match(/trident\/(\d)\./) && ua.match(/trident\/(\d)\./)[1] == 6) {
  				Sys.ie = 10
  			}
  			return {
  				'type': 'ie',
  				'ver': Sys.ie
  			};
  		}
  		if (Sys.firefox) { //Js判断为火狐(firefox)浏览器
  			return {
  				'type': 'firefox',
  				'ver': Sys.firefox
  			};
  		}
  		if (Sys.chrome) { //Js判断为谷歌chrome浏览器
  			return {
  				'type': 'chrome',
  				'ver': Sys.chrome
  			};
  		}
  		if (Sys.opera) { //Js判断为opera浏览器
  			return {
  				'type': 'opera',
  				'ver': Sys.opera
  			};
  		}
  		if (Sys.safari) { //Js判断为苹果safari浏览器
  			return {
  				'type': 'safari',
  				'ver': Sys.safari
  			};
  		}
  		return {
  			'type': 'unknow',
  			'ver': -1
  		};
  	};
  	// 对象转JSON字符串
  	this.replaceObject = function (keyMap, json) {
  		for (var a in json) {
  			if (keyMap[a]) {
  				json[keyMap[a]] = json[a]
  				delete json[a]
  				if (json[keyMap[a]] instanceof Array) {
  					var len = json[keyMap[a]].length
  					for (var i = 0; i < len; i++) {
  						json[keyMap[a]][i] = this.replaceObject(keyMap, json[keyMap[a]][i])
  					}
  				} else if (typeof json[keyMap[a]] === 'object') {
  					json[keyMap[a]] = this.replaceObject(keyMap, json[keyMap[a]])
  				}
  			}
  		}
  		return json;
  	}
  	//产生随机数
  	var createRandom = function () {
  		return Math.round(Math.random() * 4294967296);
  	};
  	//获取ajax请求对象
  	var getXmlHttp = function () {
  		var xmlhttp = null;
  		if (window.XMLHttpRequest) {
  			xmlhttp = new XMLHttpRequest();
  		} else {
  			try {
  				xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  			} catch (e) {
  				try {
  					xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  				} catch (e) {
  					return null;
  				}
  			}
  		}
  		return xmlhttp;
  	}
  	//发起ajax请求
  	var ajaxRequest = function (meth, url, req, timeout, content_type, isLongPolling, cbOk, cbErr) {

  		var xmlHttpObj = getXmlHttp();

  		var error, errInfo;
  		if (!xmlHttpObj) {
  			errInfo = "创建请求失败";
  			var error = tool.getReturnError(errInfo, -1);
  			log.error(errInfo);
  			if (cbErr) cbErr(error);
  			return;
  		}
  		//保存ajax请求对象
  		xmlHttpObjSeq++;
  		xmlHttpObjMap[xmlHttpObjSeq] = xmlHttpObj;

  		xmlHttpObj.open(meth, url, true);
  		xmlHttpObj.onreadystatechange = function () {
  			if (xmlHttpObj.readyState == 4) {
  				xmlHttpObjMap[xmlHttpObjSeq] = null; //清空
  				if (xmlHttpObj.status == 200) {
  					if (cbOk) cbOk(xmlHttpObj.responseText);
  					xmlHttpObj = null;
  					curLongPollingRetErrorCount = curBigGroupLongPollingRetErrorCount = 0;
  				} else {
  					xmlHttpObj = null;
  					//避免刷新的时候，由于abord ajax引起的错误回调
  					setTimeout(function () {
  						var errInfo = "请求服务器失败,请检查你的网络是否正常";
  						var error = tool.getReturnError(errInfo, -2);
  						//if (!isLongPolling && cbErr) cbErr(error);
  						if (isLongPolling && onLongPullingNotify) {
  							onLongPullingNotify(error);
  						}
  						if (cbErr) cbErr(error);
  					}, 16);
  				}
  			}
  		};
  		xmlHttpObj.setRequestHeader('Content-Type', content_type);
  		//设置超时时间
  		if (!timeout) {
  			timeout = ajaxDefaultTimeOut; //设置ajax默认超时时间
  		}
  		if (timeout) {
  			xmlHttpObj.timeout = timeout;
  			xmlHttpObj.ontimeout = function (event) {
  				xmlHttpObj = null;
  				//var errInfo = "请求服务器超时";
  				//var error = tool.getReturnError(errInfo, -3);
  				//if (cbErr) cbErr(error);
  			};
  		}
  		//
  		if (xmlHttpObj.overrideMimeType) {
  			// xmlHttpObj.overrideMimeType("application/json;charset=utf-8");
  		}

  		xmlHttpObj.send(req);
  	}
  	//发起ajax请求（json格式数据）
  	var ajaxRequestJson = function (meth, url, req, timeout, content_type, isLongPolling, cbOk, cbErr) {
  		ajaxRequest(meth, url, JSON.stringify(req), timeout, content_type, isLongPolling, function (resp) {
  			var json = null;
  			if (resp) json = JSON.parse(resp); //将返回的json字符串转换成json对象
  			if (isLongPolling && onLongPullingNotify) {
  				onLongPullingNotify(json);
  			}
  			if (cbOk) cbOk(json);
  		}, cbErr);
  	}
	}
	// 检测是不是身份证号码
	/**
	 * 
	 * @param {num} string
	 */
	function isCardNo(num) {
		num = num.toUpperCase();
		//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。   
		if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
			return false;
		}
		//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
		//下面分别分析出生日期和校验位 
		var len, re;
		len = num.length;
		if (len == 15) {
			re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
			var arrSplit = num.match(re);

			//检查生日日期是否正确 
			var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
			var bCorrectDay;
			bCorrectDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) &&
				(
					dtmBirth.getDate() == Number(arrSplit[4]));
			if (!bCorrectDay) {
				return false;
			} else {
				//将15位身份证转成18位 
				//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
				var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
				var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
				var nTemp = 0,
					i;
				num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
				for (i = 0; i < 17; i++) {
					nTemp += num.substr(i, 1) * arrInt[i];
				}
				num += arrCh[nTemp % 11];
				return true;
			}
		}
		if (len == 18) {
			re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
			var arrSplit = num.match(re);

			//检查生日日期是否正确 
			var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
			var bCorrectDay;
			bCorrectDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) &&
				(dtmBirth.getDate() == Number(arrSplit[4]));
			if (!bCorrectDay) {
				return false;
			} else {
				//检验18位身份证的校验码是否正确。 
				//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
				var valnum;
				var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
				var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
				var nTemp = 0,
					i;
				for (i = 0; i < 17; i++) {
					nTemp += num.substr(i, 1) * arrInt[i];
				}
				valnum = arrCh[nTemp % 11];

				if (valnum != num.substr(17, 1)) {
					return false;
				}
				return true;
			}
		}
		return false;
	}