		import './YCarousel.less';
	function YCarousel(el, opts) {
		this.init(el, opts);
	}
	YCarousel.prototype = {
		init: function (el, opts) {
			var _ = this;
			_.el = el;
			_.setting = $.extend({
				dots: true,
				arrows: true,
				autoplay: false,
				speed: 400,
				during: 4000,
				preFlag: '&lt;',
				nextFlag: '&gt;',
				activeItemIndex: 0
			}, opts || {});
			_.defaultconfig = {
				items: 0,
				timer: null
			};
			_.updateItems();
			_.getItemLength();
			_.buildArrows();
			_.buildDots();
			_.eventBind();
			_.autoplay();
		},
		updateItems() { // 根据页面初始元素数量初始化items及创建container
			var _ = this;
			var initItems = $(_.el).children().not('.arrows,.dots');
			let html = '';
			for (let i = 0; i < initItems.length; i++) {
				var item = initItems[i];
				$(item).addClass('y-carousel-item');
				html += $(item).prop('outerHTML');
			}
			html = `<div class="y-carousel-container" data-nums=${initItems.length}>${html}</div>`

			$(_.el).children().not('.arrows,.dots').replaceWith(html); // 不知道为什么会重复创建
			$(_.el).find('.y-carousel-container:gt(0)').remove();

			var container = $(_.el).find('.y-carousel-container'),
				items = container.find('.y-carousel-item'),
				first = items.eq(items.length - 1).clone(),
				last = items.eq(0).clone(),
				width = $(_.el).width(),
				left = -(_.setting.activeItemIndex + 1) * $(_.el).width();

			container.prepend(first).append(last).css('left', left + 'px');
			container.width((items.length + 2) * width);

		},
		buildDots() {
			var _ = this,
				setting = _.setting;
			if (!setting.dots) {
				return;
			} else {
				var itemLength = _.defaultconfig.items;
				if (itemLength === 1) {
					_.setting.autoplay = false;
				} else {
					let spanHtml = '',
						span = '',
						html = '';
					for (let i = 0; i < itemLength; i++) {
						span = (i == setting.activeItemIndex) ? '<span class="active"></span>' : '<span></span>';
						spanHtml += span;
					}
					html = `<div class="dots">${spanHtml}</div>`;
					$(_.el).find('.dots').remove();
					$(_.el).append(html);
				}
			}
		},
		changeDots() {
			var _ = this;
			$(_.el).find('.dots').find('span').eq(_.setting.activeItemIndex).addClass('active').siblings().removeClass('active');
		},
		buildArrows() {
			var _ = this,
				setting = _.setting;
			if (!setting.arrows) {
				return;
			} else {
				$(_.el).find('.arrows').remove();
				$(_.el).append(`<div class="arrows"><div class="prev">${setting.preFlag}</div><div class="next">${setting.nextFlag}</div></div>`);
			}
		},
		getItemLength() {
			var _ = this;
			_.defaultconfig.items = $(_.el).find('.y-carousel-container').attr('data-nums');
		},
		animate(aniWidth) {
			// aniWidth 每次变化left的值
			var _ = this,
				container = $(_.el).find('.y-carousel-container'),
				items = container.find('.y-carousel-item'),
				initLeft = container.position().left;
			if (!container.is(":animated")) {
				container.animate({
					'left': initLeft + aniWidth + 'px'
				}, _.setting.speed, function () {
					var left = container.position().left,
						width = $(_.el).width();

					//向左滑，如果是第0张
					aniWidth > 0 && left > -width && container.css('left', -_.defaultconfig.items * width);
					//向右滑，如果是最后一张
					aniWidth < 0 && left < -_.defaultconfig.items * width && container.css('left', -width);

					let index = _.setting.activeItemIndex;

					index = parseInt(-left / width) - 1;
					index = index > _.defaultconfig.items - 1 ? 0 : index;
					index = index < 0 ? _.defaultconfig.items - 1 : index;
					_.setting.activeItemIndex = index;

					_.changeDots();
				});
			}
		},
		eventBind: function () {
			var _ = this,
				prev = $(_.el).find(".arrows .prev"),
				next = $(_.el).find(".arrows .next"),
				span = $(_.el).find(".dots span"),
				parentWidth = $(_.el).width();

			prev.on('click', function () {
				_.animate(parentWidth);
			});
			next.on('click', function () {
				_.animate(-parentWidth);
			});
			span.on('click', function (event) {
				var e = event || window.event;
				var target = e.target || e.srcElement;
				_.animate(-($(target).index() - _.setting.activeItemIndex) * parentWidth);
			});
			$(_.el).hover(function () {
				clearInterval(_.defaultconfig.timer);
			}, function () {
				_.autoplay();
			})
		},
		autoplay() {
			var _ = this;
			if (!_.setting.autoplay) {
				return
			}
			_.defaultconfig.timer = setInterval(function () {
				var parentWidth = $(_.el).width();
				_.animate(-parentWidth);
			}, _.setting.during);
		}
	}
	$.fn.yCarousel = function (opts) {
		new YCarousel(this, opts);
	}