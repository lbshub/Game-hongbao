/**
 * LBS hongbao game
 * Date: 2015-12-1
 **/
;(function(window, document) {
	'use strict';
	var HongBao = function(opts) {
		opts = opts || {};
		this.time = opts.time || 10; //游戏持续时间
		this.timeBox = opts.timeBox; //计时容器 
		this.progressBox = opts.progressBox; //进度条容器
		this.statusBox = opts.statusBox; //滑动状态
		this.start = opts.start || function() {}; //游戏开始执行函数
		this.move = opts.move || function() {}; //游戏进行中执行函数 (满足滑动一定距离时才有效) 
		this.end = opts.end || function() {}; //游戏结束执行函数
		this.count = 0; //计数 
		this.pass = true;
		this.point = '';
		this.touch = {};
		this.init();
	};
	HongBao.prototype = {
		init: function() {
			var d = document,
				doc = d.documentElement;
			this.body = d.querySelector('body');
			this.width = doc.clientWidth;
			this.height = doc.clientHeight;
			this.on(this.body, ['touchmove', 'pointermove', 'MSPointerMove'], function(e) {
				e.preventDefault();
			});
		},
		timeing: function() {
			var _this = this,
				start = +new Date(),
				end = this.time * 1000,
				time = this.time;
			!function timeing() {
				_this.setTimeHtml(time--);
				if (+new Date() - start >= end) {
					_this.pass = false;
					_this.stop();
					return;
				} else {
					setTimeout(timeing, 1000);
				}
			}();
		},
		setTimeHtml: function(time) {
			this.timeBox.innerHTML = time + '秒';
		},
		setProgressHtml: function(count) {
			this.progressBox.style.width = count + '%';
		},
		setStatus: function(s) {
			this.statusBox.style.cssText = (s === 'show' ? 'position:relative;z-index:1;' : '');
		},
		createCanvas: function() {
			var canvas = document.createElement('canvas');
			canvas.style.cssText = 'width:' + this.width + 'px;height:' + this.height + 'px;opacity:0; position:absolute;left:0;top:0;z-index:88;';
			this.body.appendChild(canvas);
			return canvas;
		},
		touchStart: function(e) {
			if (!this.pass) return;
			this.point = e.type.indexOf('down') < 0 ? 'touch' : 'pointer';
			if (this.point === 'touch') {
				this.touch.x1 = e.touches[0].pageX;
				this.touch.y1 = e.touches[0].pageY;
			} else {
				this.touch.x1 = e.pageX;
				this.touch.y1 = e.pageY;
			}
			this.touch.x2 = this.touch.x1;
			this.touch.y2 = this.touch.y1;
			this.setStatus('show');
		},
		touchMove: function(e) {
			if (!this.pass) return;
			e.preventDefault();
			e.stopPropagation();
			if (this.point === 'touch') {
				this.touch.x2 = e.touches[0].pageX;
				this.touch.y2 = e.touches[0].pageY;
			} else {
				this.touch.x2 = e.pageX;
				this.touch.y2 = e.pageY;
			}
		},
		touchEnd: function(e) {
			if (!this.pass) return;
			var deltaX = this.touch.x2 - this.touch.x1,
				deltaY = this.touch.y2 - this.touch.y1,
				dis = Math.sqrt(Math.pow(Math.abs(deltaX), 2) + Math.pow(Math.abs(deltaY), 2));
			if (dis > 60 && deltaY < 0) {
				this.count++;
				this.setProgressHtml(this.count);
				this.animate();
			}
			this.setStatus('hide');
		},
		bind: function() {
			var _this = this;
			this.on(this.box, ['touchstart', 'pointerdown', 'MSPointerDown'], function(e) {
				_this.touchStart(e);
			});
			this.on(this.box, ['touchmove', 'pointermove', 'MSPointerMove'], function(e) {
				_this.touchMove(e);
			});
			this.on(this.box, ['touchend', 'touchcancel', 'pointerup', 'pointercancel', 'MSPointerUp', 'MSPointerCancel'], function(e) {
				_this.touchEnd(e);
			});
		},
		on: function(el, types, handler) {
			for (var i = 0, l = types.length; i < l; i++) el.addEventListener(types[i], handler, false);
		},
		animate: function() {
			this.move && this.move();
		},
		replay: function() {
			this.pass = true;
			this.count = 0;
			this.setTimeHtml(this.time);
			this.setProgressHtml(0);
			this.play();
		},
		play: function() {
			if (!this.box) {
				this.box = this.createCanvas();
				this.bind();
			}
			this.timeing();
			this.start && this.start();
		},
		stop: function() {
			this.end && this.end();
		}
	};
	window.HongBao = HongBao;
}(window, document));