

/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
        $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
}

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },
    
    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    
    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";
    
    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }
    
    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;
    
    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }
    
    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);
    
    return ($.event.dispatch || $.event.handle).apply(this, args);
}

})(jQuery);


/**
 * @author trixta
 * @version 1.2
 */
(function($){
var mwheelI = {
			pos: [-260, -260]
		},
	minDif 	= 3,
	doc 	= document,
	root 	= doc.documentElement,
	body 	= doc.body,
	longDelay, shortDelay
;

function unsetPos(){
	if(this === mwheelI.elem){
		mwheelI.pos = [-260, -260];
		mwheelI.elem = false;
		minDif = 3;
	}
}

$.event.special.mwheelIntent = {
	setup: function(){
		var jElm = $(this).bind('mousewheel', $.event.special.mwheelIntent.handler);
		if( this !== doc && this !== root && this !== body ){
			jElm.bind('mouseleave', unsetPos);
		}
		jElm = null;
        return true;
    },
	teardown: function(){
        $(this)
			.unbind('mousewheel', $.event.special.mwheelIntent.handler)
			.unbind('mouseleave', unsetPos)
		;
        return true;
    },
    handler: function(e, d){
		var pos = [e.clientX, e.clientY];
		if( this === mwheelI.elem || Math.abs(mwheelI.pos[0] - pos[0]) > minDif || Math.abs(mwheelI.pos[1] - pos[1]) > minDif ){
            mwheelI.elem = this;
			mwheelI.pos = pos;
			minDif = 250;
			
			clearTimeout(shortDelay);
			shortDelay = setTimeout(function(){
				minDif = 10;
			}, 200);
			clearTimeout(longDelay);
			longDelay = setTimeout(function(){
				minDif = 3;
			}, 1500);
			e = $.extend({}, e, {type: 'mwheelIntent'});
            return $.event.handle.apply(this, arguments);
		}
    }
};
$.fn.extend({
	mwheelIntent: function(fn) {
		return fn ? this.bind("mwheelIntent", fn) : this.trigger("mwheelIntent");
	},
	
	unmwheelIntent: function(fn) {
		return this.unbind("mwheelIntent", fn);
	}
});

$(function(){
	body = doc.body;
	//assume that document is always scrollable, doesn't hurt if not
	$(doc).bind('mwheelIntent.mwheelIntentDefault', $.noop);
});
})(jQuery);/*
 * jQuery Color Animations
 * Copyright 2007 John Resig
 * Released under the MIT and GPL licenses.
 */

(function(jQuery){

	// We override the animation for all of these color styles
	jQuery.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'outlineColor'], function(i,attr){
		jQuery.fx.step[attr] = function(fx){
			if ( !fx.colorsComputed ) {
				fx.start = getColor( fx.elem, attr );
				fx.end = getRGB( fx.end );
				fx.colorsComputed = true;
			}

			fx.elem.style[attr] = "rgb(" + [
				Math.max(Math.min( parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0]), 255), 0),
				Math.max(Math.min( parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1]), 255), 0),
				Math.max(Math.min( parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2]), 255), 0)
			].join(",") + ")";
		}
	});

	// Color Conversion functions from highlightFade
	// By Blair Mitchelmore
	// http://jquery.offput.ca/highlightFade/

	// Parse strings looking for color tuples [255,255,255]
	function getRGB(color) {
		var result;

		// Check if we're already dealing with an array of colors
		if ( color && color.constructor == Array && color.length == 3 )
			return color;

		// Look for rgb(num,num,num)
		if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
			return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];

		// Look for rgb(num%,num%,num%)
		if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
			return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];

		// Look for #a0b1c2
		if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
			return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];

		// Look for #fff
		if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
			return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];

		// Otherwise, we're most likely dealing with a named color
		return colors[jQuery.trim(color).toLowerCase()];
	}
	
	function getColor(elem, attr) {
		var color;

		do {
			color = jQuery.curCSS(elem, attr);

			// Keep going until we find an element that has color, or we hit the body
			if ( color != '' && color != 'transparent' || jQuery.nodeName(elem, "body") )
				break; 

			attr = "backgroundColor";
		} while ( elem = elem.parentNode );

		return getRGB(color);
	};
	
	// Some named colors to work with
	// From Interface by Stefan Petre
	// http://interface.eyecon.ro/

	var colors = {
		aqua:[0,255,255],
		azure:[240,255,255],
		beige:[245,245,220],
		black:[0,0,0],
		blue:[0,0,255],
		brown:[165,42,42],
		cyan:[0,255,255],
		darkblue:[0,0,139],
		darkcyan:[0,139,139],
		darkgrey:[169,169,169],
		darkgreen:[0,100,0],
		darkkhaki:[189,183,107],
		darkmagenta:[139,0,139],
		darkolivegreen:[85,107,47],
		darkorange:[255,140,0],
		darkorchid:[153,50,204],
		darkred:[139,0,0],
		darksalmon:[233,150,122],
		darkviolet:[148,0,211],
		fuchsia:[255,0,255],
		gold:[255,215,0],
		green:[0,128,0],
		indigo:[75,0,130],
		khaki:[240,230,140],
		lightblue:[173,216,230],
		lightcyan:[224,255,255],
		lightgreen:[144,238,144],
		lightgrey:[211,211,211],
		lightpink:[255,182,193],
		lightyellow:[255,255,224],
		lime:[0,255,0],
		magenta:[255,0,255],
		maroon:[128,0,0],
		navy:[0,0,128],
		olive:[128,128,0],
		orange:[255,165,0],
		pink:[255,192,203],
		purple:[128,0,128],
		violet:[128,0,128],
		red:[255,0,0],
		silver:[192,192,192],
		white:[255,255,255],
		yellow:[255,255,0]
	};
	
})(jQuery);
/**
 * @author alexander.farkas + philipp.paul
 */
(function($){
	$.widget('ui.scroller', {
		options: {
			//Wrapper Classes:
			hidingWrapper: 'div.rack',
			moveWrapper: 'div.rack-design',
			//Elements Classes
			atoms: 'div.rack-teaser',
			nextLink: 'div.next',
			prevLink: 'div.prev',
			
			activeLinkClass: 'show',
			stickyFirstLast: false,
			
			linkFn: $.noop,
			moveStep: 'atom',
			swipeStep: false,
			direction: 'horizontal',
			
			hidingWidth: false,
			hidingHeight: false,
			dynamicDim: false,
			//animate
			animate: true,
			animateOptions: {
				duration: 600,
				complete: $.noop
			},
			enableMwheel: true,
			
			diashow: false,
			restartDiaShow: true,
			
			addSubPixel: 1,
			addSubPixelPerTeaser: 0.3,
			
			recalcStageOnResize: true,
			recalcTeaserOnResize: false,
			stageTeaser: false,
			updateOnImgLoad: true,
			bindStyle: 'bind',
			
			pagination: false,
			paginationType: 'teaser',
			paginationAtoms: '<li class="pa-$number"><button title="$title"><span>$number</span></button></li>',
			paginationTitleFrom: false,
			activePaginationClass: 'on',
			paginationFn: false,
			defaultSelected: false
		},
		customEvents: ['init', 'create', 'startleft', 'start', 'slide', 'end', 'endreached', 'startreached', 'endleft', 'diashowpaused', 'diashowstopped'],
		_create: function(){
			this._getMarkupOptions();
			var elem = this.element[0],
				o = this.options,
				that = this,
				fn		= o.animateOptions.complete
			;
			
			o.animateOptions.complete = function(){
				if(fn && $.isFunction(fn)){
					fn.call(this, that);
				}
				that.propagate('end');
			};
			
			o.direction = (o.direction == 'vertical') ? {
				scroll: 'scrollTop',
				outerD: 'outerHeight',
				dim: 'height',
				dir: 'Top'
			} : {
				scroll: 'scrollLeft',
				outerD: 'outerWidth',
				dim: 'width',
				dir: 'Left'
			};
			
			this.moveElem = $(o.moveWrapper, elem);
			this.atomElem = $(o.atoms, elem);
			this.hidingWrapper = $(o.hidingWrapper, elem);
			
			this.nextLink = $(o.nextLink, elem);
			this.prevLink = $(o.prevLink, elem);
			
			this.position = 0;
			this.atomPos = 0;
			this.percentage = 0;
			this.oldPosition = 0;
			this.oldAtomPos = 0;
			
			$(this.atomElem[0]).addClass('first-teaser');
			$(this.atomElem[this.atomElem.length - 1]).addClass('last-teaser');
			
			if (o.hidingHeight || o.hidingWidth) {
				var css = (o.hidingHeight) ? {
					height: o.hidingHeight
				} : {};
				if ((o.hidingWidth)) {
					css = $.extend(css, {
						width: o.hidingWidth
					});
				}
				this.hidingWrapper.css(css);
			}
			
			this.selectedFocus = false;
			
			
			if($.fn.setFocus && $.fn.closest){
				var traverse = {};
				if((o.direction.dir === 'Top')){
					traverse[$.ui.keyCode.UP] = 'prev';
					traverse[$.ui.keyCode.DOWN] = 'next';
				} else {
					traverse[$.ui.keyCode.LEFT] = 'prev';
					traverse[$.ui.keyCode.RIGHT] = 'next';
				}
				this.moveElem
					.bind('keyfocus', function(e){
						var atom = $(e.target).closest(o.atoms);
						if(atom[0]){
							that.scrollIntoView(atom);
						}
					})
					.bind('focusin', function(e){
						var atom = $(e.target).closest(o.atoms);
						that.selectedFocus = (atom[0]) ? atom : false;
					})
					.bind('focusout', function(e){
						that.selectedFocus = false;
					})
					.bind('keydown', function(e){
						
						if(that.selectedFocus === false || !traverse[e.keyCode]){return;}
						var selectElement = that.selectedFocus[traverse[e.keyCode]](o.atoms);
						
						if(selectElement && selectElement[0]){
							e.preventDefault();
							selectElement.setFocus();
							that.scrollIntoView(selectElement);
						} else if(that.isSliding){
							e.preventDefault();
						}

					});
			}
			
			this.dims = [0];
			this.hidingWrapper[o.direction.scroll](0);
			this.minPos = 0;
			this.update();
			if(o.stageTeaser){
				o.recalcTeaserOnResize = true;
			}		
			if(o.recalcStageOnResize || o.recalcTeaserOnResize){
				var firstEmChange = true;
				var update = $.Aperto.throttle(function(e){
					if(firstEmChange && e.type == 'emchange'){
						firstEmChange = false;
						return;	
					}
					if(o.recalcTeaserOnResize){
						that.update.call(that, true);
					} else {
						that.stageWidthUpdate.call(that);
					}
					that.updateViewPagination();
				}, 20);
				$(window).bind('resize', update);
				$(document).bind('orientationchange emchange', update);
			}
			
			if(o.updateOnImgLoad){
				this.updateOnImgLoad();
			}
			
			if (o.diashow) {
				this.startDiashow();
				var diashowPause = function(){
					that.pauseDiashow();
				};
				var isPlaying = function(){
					return (!$.prop(this, 'pause') && !$.prop(this, 'ended'));
				};
				var diashowRestart = function(){
					if(o.restartDiaShow && !that.isDiashowStopped && that.isDiashowPaused && !$('video, audio', that.element).filter(isPlaying)[0]) {
						that.startDiashow.call(that);
					}
				};
				
				this.element
					.enterLeave(diashowPause, diashowRestart)
					.bind('play playing', diashowPause)
				;
				
			} else {
				this.stopDiashow();
			}
			
			if (o.enableMwheel && $.fn.mwheelIntent) {
				this.hidingWrapper.mwheelIntent(function(e, d){
					that.stopDiashow.call(that);
					d = (d < 0) ? '-' : '+';
					if((that.position >= that.maxPos && d === '-') || (d === '+' && that.position <= that.minPos)){
						return !that.isSliding;
					}
					
					var moveStep = (o.moveStep) ? o.moveStep : 'atom';
					that.moveTo(d + 'atom1');
					return false;
				});
			}
			o.swipeStep = o.swipeStep || o.moveStep;
			
			if($.fn.swipe){
				var swipe = {
					prev: function(){
						that.pauseDiashow();
						that.moveTo('-'+o.swipeStep);
					},
					next: function(){
						that.pauseDiashow();
						that.moveTo('+'+o.swipeStep);
					}
				};
				this.hidingWrapper.swipe($.extend( {triggerOnTouchEnd: false},
					(o.direction.dir == 'Left') ? 
						{
							swipeLeft: swipe.prev,
							swipeRight: swipe.next
						} :
						{
							swipeUp: swipe.prev,
							swipeDown: swipe.next
						}
				, o.swipeOptions || {}));
			}
			
			$(window).bind('hashchange', function(){
				that.gotoHash();
			});
						
			var handlePrevNext = function(){
				var dir = ($.inArray(this, that.prevLink) !== -1) ?
					'+' :
					'-';
				that.pauseDiashow.call(that);
				that.moveTo(dir + o.moveStep);
				return false;
			};
			
			this.nextLink
				.bind('click.uiscroller', handlePrevNext);
			this.prevLink
				.bind('click.uiscroller', handlePrevNext);
			if($.browser.msie && parseInt($.browser.version, 10) < 7){
				var over = function(){$(this).addClass('over');},
					out = function(){$(this).removeClass('over');}
				;
				this.nextLink
					.hover(over, out);
				this.prevLink
					.hover(over, out);
			}
			
			if(!this.gotoHash(true) && (o.defaultSelected || o.defaultSelected === 0)){
				this.moveTo('goTo'+ o.defaultSelected, false, false, true);
			}
			if($.fn.lazyImgLoader){
				this.element.lazyImgLoader({e: 'scrollerstart', visible: this.atomElem.eq(this.atomPos)});
			}
			this.propagate('init');
		},
		gotoHash: function(_init){
			var hash = location.hash;
			if(!hash){return;}
			var selected;
			try {
				selected = this.atomElem.filter(hash);
			} catch(er){}
			if(!selected || !selected[0]){return;}
			selected = this.atomElem.index(selected[0]);
			if(_init){
				this.moveTo('goTo'+ selected, false, false, true);
			} else {
				this.moveTo('goTo'+ selected);
			}
			return true;
		},
		stageWidthUpdate: function(){
			var newDim1 = this.hidingWrapper[this.options.direction.dim]();
			
			if(newDim1 !== this.dims[1]){
				this.dims[1] = newDim1;
				this.maxPos = (this.dims[0] - this.dims[1]);
				this.updatePosition_Controls();
				if(this.hidingWrapper[this.options.direction.scroll]() > this.maxPos){
					this.moveTo(this.maxPos, false);
				}
				return true;
			}
			return false;
		},
		updateViewPagination: function(){
			var  o = this.options;
			var that = this;
			if(!this.pagination || o.paginationType != 'view' || !this.pagination[0]){return;}
			var content = '<ul>';
			var slides = Math.ceil(this.dims[0] / this.dims[1]);
			if(this.paginationSlides === slides){return;}
			this.paginationSlides = slides;
			for(var i = 0; i < slides; i++){
				content += '<li data-index="'+i+'"><button><span>'+ (i + 1) +'</span></button></li>'; 
			}
			this.pagination.html(content+'</ul>');
			$('> ul', this.pagination).delegate('li', 'click', function(){
				var index = this.getAttribute('data-index');
				if(index){
					that.moveTo.call(that, index * that.dims[1]);
				}
				return false;
			});
		},
		createPagination: function(){
			//paginationType
			var content = '<ul>', that = this, tmpContent, o = this.options;
			this.pagination = $(o.pagination, this.element[0]);
			if(this.pagination[0]){
				if(o.paginationType == 'view'){
					this.updateViewPagination();
					
				} else { // == 'teaser'
					this.atomElem.each(function(i){
						tmpContent = o.paginationAtoms.replace(/\$number/g, i + 1);
						content += (o.paginationTitleFrom) ? tmpContent.replace(/\$title/g, ($(o.paginationTitleFrom, this) || '').text().replace(/"/g, '&quot;')) : tmpContent;
					});
					this.pagination.html(content + '</ul>').find('li').each(function(i){
						$(this).click(function(){
							that.stopDiashow.call(that);
							that.moveTo.call(that, 'goTo' + i);
							return false;
						});
					});
				}
			}
		},
		getIndexNearPos: function(nPos){
			var len = this.dims.length;
			while (len--) {
				if (nPos == this.dims[len]) {
					return len;
				}
				else if(nPos > this.dims[len]) {
					return len+1;
				}
			}
			return false;
		},
		inView: function(atom){
			var dir 		= this.options.direction,
				stageDim 	= this.dims[1],
				atomDim 	= atom[dir.outerD](),
				curPos		= this.hidingWrapper['scroll' + dir.dir](),
				atomPos 	= atom[0]['offset'+ dir.dir]
			;
			if(curPos > atomPos || stageDim < atomDim + atomPos - curPos){
				return atomPos;
			}
			return false;
		},
		scrollIntoView: function(atom){
			var inView = this.inView(atom);
			if(inView !== false){
				this.moveTo(inView);
			}
		},

		_setOption: function(k, v){
			var o = this.options;
			switch(k) {
				case 'enableMwheel' :
					if( !v && o.enableMwheel){
						this.hidingWrapper.unmwheelIntent();
					}
					break;
					
				case 'addSubPixel':
					if(o.addSubPixel !== v) {
						this.dims[0] -= o.addSubPixel;
						o.addSubPixel = v;
						this.dims[0] += o.addSubPixel;
						this.update();
					}
					break;
			}
			$.Widget.prototype._setOption.apply(this, arguments);
		},
		startDiashow: function(){
			var that = this;
			clearInterval(this.diaTimer);
			this.isDiashowStopped = false;
			this.diaTimer = setInterval(function(){
				((that.position === that.maxPos && that.options.type !== 'carousel') ? that.moveTo(0, false) : that.moveTo('-' + that.options.moveStep));
			}, this.options.diashow);
			this.propagate('diashowstarted');
		},
		stopDiashow: function(){
			this.isDiashowStopped = true;
			this.pauseDiashow();
			this.propagate('diashowstopped');
		},

		pauseDiashow: function() {
			clearInterval(this.diaTimer);
			setTimeout(function(){
				clearInterval(this.diaTimer);
			}, 9);	
			this.isDiashowPaused = true;
			this.propagate('diashowpaused');
		},
		updateOnImgLoad: function(){
			var loadingSize = 0;
			var that = this;
			$('img', this.element).each(function(){
				if(!this.complete){
					loadingSize++;
					$(this).one('load', function(){
						loadingSize--;
						if(!loadingSize){
							that.update(true);
						}
					});
				}
			});
		},
		update: function(hard){
			var that = this, jElm, o = this.options;
			var subpixels = 0;
			if (hard) {
				this.dims = [0];
				this.atomElem = $(o.atoms, this.element);
			}
			
			this.dims[1] = this.hidingWrapper.css({
				overflow: 'hidden',
				position: 'relative'
			})[o.direction.dim]();
			
			if(o.stageTeaser) {
				this.atomElem.outerWidth(this.hidingWrapper.width());
			}
			
			var from = this.dims.length - 2;
			
			for(var i = from, len = this.atomElem.length; i < len; i++){
				jElm = $(this.atomElem[i]);
				that.dims.push(that.dims[0]);
				that.dims[0] += jElm[o.direction.outerD](true);
			}
			
			
			this.maxPos = (this.dims[0] - this.dims[1]);
			
			if(o.addSubPixelPerTeaser){
				subpixels = o.addSubPixelPerTeaser * this.atomElem.length;
			}
			var d = this.dims[0] + subpixels + o.addSubPixel;
			if(o.dynamicDim) {
				var newdim = d / $.testEm().emPx;
				if(newdim % 1 > 0) {
					d = parseInt(newdim, 10) +1;
				} else {
					d = newdim;
				}
				d += 'em';
			}
			this.moveElem.css(o.direction.dim, d);
			
			if (o.pagination) {
				this.createPagination(hard);
			}
			if(hard){
				this.moveTo('goTo'+ this.atomPos, false, false);
			}
			this.updatePosition_Controls();
			
		},
		updatePosition_Controls: function(pos){
			//calculate the curent position
			var o = this.options;
			var viewPos;
			pos = (isNaN(pos)) ? parseInt(this.hidingWrapper[o.direction.scroll](), 10) : pos;
			
			function changeState(elem, active){
				var doo = (active) ?{
						style: 'addClass'
					} : {
						style: 'removeClass'
					};
				return elem[doo.style](o.activeLinkClass);
			}
			
			if(pos !== this.position){
				this.percentage = pos / (this.maxPos / 100);
				this.oldPosition = this.position;
				this.oldAtomPos = this.atomPos;
				this.position = pos;
				
				var num = this.getIndexNearPos(this.position);
			   
				num = (num) ? num - 2 : 0;
				this.atomPos = num;
			}
			
			viewPos = this.atomPos;
			
			this.percentage = pos / (this.maxPos / 100);
			
			if (pos <= this.minPos && this.prevLink.hasClass(o.activeLinkClass)) {
				o.linkFn.call(this.prevLink, 'hide', this.ui());
				changeState(this.prevLink);
				this.propagate('startreached');
			} else if (pos > this.minPos && !this.prevLink.hasClass(o.activeLinkClass)) {
				o.linkFn.call(this.prevLink, 'show', this.ui());
				changeState(this.prevLink, true);
				this.propagate('startleft');
			}
			if (pos >= this.maxPos && this.nextLink.hasClass(o.activeLinkClass)) {
				o.linkFn.call(this.nextLink, 'hide', this.ui());
				changeState(this.nextLink);
				this.propagate('endreached');
				
			} else if (pos < this.maxPos && !this.nextLink.hasClass(o.activeLinkClass)) {
				o.linkFn.call(this.nextLink, 'show', this.ui());
				changeState(this.nextLink, true);
				this.propagate('endleft');
			}
			if (this.pagination) {
				var oldActive = this.pagination.find('li')
						.filter('.' + o.activePaginationClass)
						.removeClass(o.activePaginationClass), 
					newActive
				;
				if(o.paginationType == 'view'){
					if(this.maxPos == pos) {
						viewPos = this.paginationSlides - 1;
					} else {
						viewPos = Math.round(pos / this.dims[1]);
					}
				}
				
				newActive = oldActive.end().eq(viewPos).addClass(o.activePaginationClass);
				if ($.isFunction(o.paginationFn)) {
					o.paginationFn.call(oldActive, 'inactive');
					o.paginationFn.call(newActive, 'active');
				}
			}
		},
		getNummericPosition: function(ePos){
			var rel = false, num, lastDim = this.dims[this.dims.length - 1];
			
			// handle Atom Step & goTo
			if (ePos.indexOf('goTo') === 0) {
				num = parseInt(/(\d+)$/.exec(ePos)[0], 10) + 2;
				ePos = this.dims[num];
			}
			else if (ePos.indexOf('centerTo') === 0) {
				num = parseInt(/(\d+)$/.exec(ePos)[0], 10) + 2;
				ePos = this.dims[num] - (this.dims[1] / 2) + (this.atomElem.filter(":eq("+num+")")[this.options.direction.outerD]() / 2);
			} 
			else if (ePos.indexOf('stageWidth') === 1) {
				var that = this;
				rel = ePos.slice(0, 1);
				num = this.dims[1];
				var amount = (function() {
					var i = 2;
					for(i; i < that.dims.length; i++) {
						if(that.dims[i] > that.dims[1]) {
							break;
						}
					}

					return i-3; // minus 1 for the teaser that we are actually too far, and minus 2 for the first entries of dims.. makes 3
				})();
				if(this.atomPos === 0 && rel === '+') { return; }
				ePos = rel === '+' ?  (this.atomPos - amount + 2) < 2 ? 2 : (this.atomPos - amount+2) : (this.atomPos + amount + 2);
				ePos = this.dims[ePos];
			}
			else 
				if (ePos == '-atom' || ePos == '-atom1') {
					num = this.atomPos + 3;
					ePos = (this.dims[num] || this.dims[num] === 0) ? this.dims[num] : lastDim;
				}
				else 
					if (ePos == '+atom' || ePos == '+atom1') {
						ePos = (this.atomPos) ? this.dims[this.atomPos + 1] : 0;
					}
					else 
						if (ePos.indexOf('atom') == 1) {
							num = parseInt(/(\d+)$/.exec(ePos)[0], 10);
							if (ePos.indexOf('-') === 0) {
								num += 2;
								if (this.dims[this.atomPos + num]) {
									ePos = this.dims[this.atomPos + num];
								}
								else {
									ePos = lastDim;
								}
							}
							else {
								num -= 2;
								var aLen = this.atomPos - num;
								if (aLen > 1 && this.dims[this.atomPos - num]) {
									ePos = this.dims[this.atomPos - num];
								}
								else {
									ePos = 0;
								}
							}
						// handle: +/-Number
						}
						else 
							if (ePos.indexOf('+') === 0 || ePos.indexOf('-') === 0) {
								rel = ePos.slice(0, 1);
								ePos = parseInt(ePos.slice(1), 10);
								ePos = (rel == '-') ? this.position + ePos : this.position - ePos;
							}
							else {
								// handle Percentage
								var per = /(\d+)%$/.exec(ePos);
								if (per && per[1]) {
									ePos = this.maxPos / 100 * parseFloat(ePos);
								}
							}
			if(this.options.stickyFirstLast){
				if((ePos - this.maxPos) * -1 < this.atomElem.filter(':last')[this.options.direction.outerD]() && ePos > this.position){
					ePos = this.maxPos;
				} else if(ePos < this.atomElem[this.options.direction.outerD]() && ePos < this.position){
					ePos = 0;
				}
			}
			return ePos;
		},
		readjustPosition: function(hard){
			var scroll = this.options.direction.scroll;
			this.hidingWrapper[scroll](this.position);
			if(hard){
				this.hidingWrapper[scroll == 'scrollTop' ? 'scrollLeft' : 'scrollTop'](0);
			}
		},
		moveTo: function(pos, anim, animOp, _initForce){
			pos = (typeof pos === 'string' || isNaN(pos)) ? this.getNummericPosition(pos) : pos;
			pos = (pos <= 0) ? 0 : (pos >= this.maxPos) ? this.maxPos : pos;
			if (pos === this.position) {
				return false;
			}
			var o = this.options, scroll = o.direction.scroll;
			this.updatePosition_Controls(pos);
			this.propagate('start', this.oldPosition);
			
			anim = (typeof anim == 'undefined') ? o.animate : anim;
			if (anim) {
				//dirty break recursion
				animOp = animOp ||
				{};
				animOp = $.extend({}, o.animateOptions, {
					slide: this
				}, animOp);
				var animCss = (scroll == 'scrollTop') ? 
					{scrollerTop: pos} : 
					{scrollerLeft: pos}
				;
				this.hidingWrapper.stop().animate(animCss, animOp);
			}
			else {
				this.hidingWrapper.stop()[scroll](pos);
				if(_initForce){
					var that = this;
					setTimeout(function(){
						if(that.hidingWrapper[scroll]() != pos){
							that.hidingWrapper[scroll](pos);
						}
					}, 9);
				}
				this.propagate('end');
			}
		},
		ui: function(){
			return {
				instance: this,
				options: this.options,
				pos: this.position,
				percentPos: this.percentage,
				oldIndex: this.oldAtomPos,
				newIndex: this.atomPos,
				size: this.dims.length - 2
			};
		},
		propagate: function(n, pos){
			var fx = {};
			if(n == 'slide'){
				fx = pos;
				pos = fx.now;
			}
			var args = (pos || pos === 0) ? $.extend(this.ui(), {
				'pos': pos,
				'fx': fx,
				percentPos: pos / (this.maxPos / 100)
			}) : this.ui();
			if(n === 'start'){
				this.isSliding = true;
			} else if(n === 'end'){
				this.isSliding = false;
			}
			if(n == 'slide'){
				this.element.triggerHandler("scroller" + n, [args]);
			} else {
				this.element.trigger("scroller" + n, [args]);
			}
			if(this.options[n]){
				this.options[n].call(this.element[0], {type: 'scroller' + n}, args);
			}
		}
	});
	$.each({scrollerLeft: 'scrollLeft', scrollerTop: 'scrollTop'}, function(name, prop){
		$.fx.step[name] = function(fx){
			if (fx.now || fx.now === 0) {
				var scroller = fx.options.slide;
				if (scroller) {
					if(!fx.scrollerInit){
						fx.scrollerInit = true;
						fx.start = scroller.hidingWrapper[prop]();
						fx.now = fx.start;
					}
					scroller.hidingWrapper[prop](fx.now);
				   	scroller.propagate('slide', fx);
				}
			}
		};
	});
})(jQuery);
(function($){
	
	function numsort (a, b) {
	  return a - b;
	}
	var uniqueID = 0;
	/*-
	 * tabtree
	 [ widget (ui) ]
	 
	 * Generates a Tab Control UI or an accordion
	 * Depending on the Options you can create a classic tab Control Interface, 
	 * where you click on a tab to show a panel, or you can create an accordion.
	 
	 # ui.a11y.ext.js
	 
	 > Options
	 - buttonSel (string) <'a'> the selector for the button
	 - panelSel (boolean|string) <false> the selector for the panel. if false, the panel will be identified by href of the button @see buttonSel
	 - focusOnExpand (boolean) <true> states if the panel should be focused on expand
	 - focusSel (boolean|string) <true> a possible selector for the element to be focused @see focusOnExpand
	 - createPanelWrapper (boolean) <false> creates a div around the panel if true
	 - toggleButton (boolean) <false> if false a button can only open a panel, if true it can also close them
	 - multiSelectable (boolean) <false> if true, more than just one panel can be opened at a time
	 - createPanelTabRelation (boolean) <false> if true, the panels are labelled by the corresponding button
	 - selectEvents (string) <'ariaclick'> the event which opens (or closes) a panel
	 - bindStyle (string) <'bind'> ['bind','live'] the way the event should be listened to
	 - bindContext (boolean|string|HTMLNode) <false> the context for the eventBinding (only relevant for live) @see bindStyle	
	 - defaultSelected (number) <0> the index of the default selected panel
	 - slideShow (boolean) <false> if true, the tabs are switched automatically
	 - restartSlideShow (boolean) <true> if true the (possible) slideshow restarts
	 - activeButtonClass (string) <'js-selected'> the class the tab gets if selected
	 - activePanelClass (string) <'js-expanded'> the class the panel gets if selected
	 - handleDisplay (boolean|string) <true> [true,false,'initial'] should the display be handled by the widget, initial means handling it only on init
	 - hideStyle (string) <'display'> ['visibility','display'] the way the panels are hidden and shown
	 - interceptClick (boolean) <true> if true clicks on the tab are being prevented
	 - addAria (boolean) <true> if true aria-attributes are added to the tab and panel
	 
	 > Properties
	 - buttons (jQuery) a jQuery collection of the tabs
	 - panels (jQuery) a jQuery collection of the panels
	 - selectedIndexes (Array) the indices of the open tabs/panels
	 
	 > Events
	 - init (object) @see function-ui
	 
	 - expand (object) @see function-ui
	 -- button (jQuery) the button that gets opened
	 -- panel (jQuery) the panel that gets opened
	 -- collapseElements (object) only exists if not multiSelectable
	 --- button (jQuery) the button that gets closed
	 --- panel (jQuery) the panel that gets closed
	 
	 - expandinit (object) @see function-ui
	 -- button (jQuery) the button that gets opened
	 -- panel (jQuery) the panel that gets opened
	 -- collapseElements (object) only exists if not multiSelectable
	 --- button (jQuery) the button that gets closed
	 --- panel (jQuery) the panel that gets closed
	 
	 - collapse (object) @see function-ui
	 -- button (jQuery) the button that gets closed
	 -- panel (jQuery) the panel that gets closed
	 -- expandElements (object) only exists if not multiSelectable
	 --- button (jQuery) the button that gets opened
	 --- panel (jQuery) the panel that gets opened
	 
	 - collapseinit (object) @see function-ui
	 -- button (jQuery) the button that gets closed
	 -- panel (jQuery) the panel that gets closed
	 -- expandElements (object) only exists if not multiSelectable
	 --- button (jQuery) the button that gets opened
	 --- panel (jQuery) the panel that gets opened
	 
	 - beforeexpand (object) @see function-ui
	 -- button (jQuery) the button that gets opened
	 -- panel (jQuery) the panel that gets opened
	 -- collapseElements (object) only exists if not multiSelectable
	 --- button (jQuery) the button that gets closed
	 --- panel (jQuery) the panel that gets closed
	 
	 > Usage
	 | $(elm).tabtree( options );
	 -*/
	$.widget('ui.tabtree', {
		options: {
			buttonSel: 'a',
			panelSel: false,
			focusOnExpand: true,
			focusSel: true,
			createPanelwrapper: false, 
			toggleButton: false,
			multiSelectable: false,
			createPanelTabRelation: false,
			selectEvents: 'ariaclick',
			bindStyle: 'bind',
			bindContext: false,
			defaultSelected: 0,
			slideShow: false,
			restartSlideShow: true,
			activeButtonClass: 'js-selected',
			activePanelClass: 'js-expanded',
			handleDisplay: true, //initial | true | false
			hideStyle: 'display',
			interceptClick: true,
			addAria: true
		},
		/*-
		 * _createPanelAPI
		 [ function (private) ]
		 * creates the data-objects on the elements
		 * tabtreepanel on the panel and tabtreebutton on the button
		 > Parameter
		 - button (jQuery) a button to create an API on
		 - panel (jQuery) a panel to create an API on
		 -*/
		_createPanelAPI: function(button, panel){
			var that = this;
			if(!panel[0]){
				console.log("kein valider tabtree button", button);
			}
			$.data(panel[0], 'tabtreepanel', {
				instance: this,
				button: button,
				expand: function(e){
					that.expand(button, e);
				},
				collapse: function(e){
					that.collapse(button, e);
				}
			});
			$.data(button[0], 'tabtreebutton', {
				instance: this,
				panel: panel,
				expand: function(e){
					that.expand(button, e);
				},
				collapse: function(e){
					that.collapse(button, e);
				}
			});
		},
		/*-
		 * _create
		 [ function (private) ]
		 * creates the widget
		 -*/
		_create: function(){
			this._getMarkupOptions();
			var that 			= this,
				o 				=  this.options,
				elem 			= this.element,
				isSelectedArray = o.defaultSelected.length,
				isHTMLSelected
			;
			
			this.selectedIndexes = [];			
			this.slideShowtimer = null;
			
			this.buttons = $(o.buttonSel, elem[0]);
			
			this.panels = (o.panelSel) ? 
				$(o.panelSel, this.element[0]).each(function(i){
					var button 	= $(that.buttons[i]),
						panel 	= $(this)
					;
					button.controlsThis(panel);
					if(o.createPanelTabRelation){
						panel.labelWith(button);
					}
					that._createPanelAPI(button, panel);
					
				}) : 
				this.buttons.map(function(){
					var button 	= $(this),
						idRef 	= button.getHrefHash(),
						panel
					;
					if(!idRef || idRef == '#'){
						console.log('kein valider tabtree button: ', button);
					}
					panel 	= $(idRef);
					if(o.createPanelTabRelation){
						panel.labelWith(button);
					}
					
					button.attr({'aria-controls': idRef.replace('#', '')});
					that._createPanelAPI(button, panel);
					return panel[0];
				});
							
			this.panels = $($.unique(this.panels.get()));
						
			if(o.createPanelwrapper){
				this.panels.wrap('<div class="a11y-panelwrapper" />');
			}
			
			//get defaultselected
			isHTMLSelected = !!this.buttons.filter('.'+ o.activeButtonClass)[0];
				
			this.buttons
				.each(function(i){
					var initAction;
					if(isHTMLSelected){
						initAction = ($(this).hasClass(o.activeButtonClass)) ? 'expand' : 'collapse';
					} else if(isSelectedArray){
						initAction = ($.inArray(i, o.defaultSelected) !== -1) ? 'expand' : 'collapse';
					} else {
						initAction = (o.defaultSelected === i) ? 'expand' : 'collapse';
					}
					that[initAction].call(that, this, {type: 'init'});
				})
			;
			
			if(o.addAria){
				this.buttons.attr({role: 'button'});
				if (this.buttons[0] && $.nodeName(this.buttons[0], 'a')) {
					this.buttons.each(function(){
						var jElm = $(this);
						this.setAttribute('data-href', jElm.attr('href'));
						if($.support.waiAria){
							jElm.removeAttr('href');
						}
					});
				}
			}
			
			this.panels.attr({role: 'group'}).addClass('a11y-js-overflow');
			
			uniqueID++;
			if(o.bindStyle === 'live'){
				this.buttons.context = (o.bindContext) ? $(o.bindContext, this.element)[0] : this.element[0];
				this.buttons.selector = '.tabtree-button_'+ uniqueID;
				this.buttons.addClass('tabtree-button_'+ uniqueID);
				if(!this.buttons.context) {
					console.log(o.bindContext +' not found in tab-module');
				}
			}
			
			if(o.selectEvents){
				this.buttons
					[o.bindStyle](o.selectEvents, function(e){
						var action = (o.toggleButton) ?
							'toggle' :
							'expand'
						;
						clearInterval(that.slideShowtimer);
						that[action].call(that, this, e);
						return false;
					})
				;
			}
			
			//focus panels onclick if no click event is added
			if(o.interceptClick && (!o.selectEvents || o.selectEvents.indexOf('click') == -1)){
				this.buttons[o.bindStyle]('click', function(){
					clearInterval(that.slideShowtimer);
					if(o.focusOnExpand){
						that.focusPanel.call(that, $('#'+$(this).attr('aria-controls')), 1);
					}
					return false;
				});
			}
			
			if(o.slideShow && isFinite(o.slideShow)){
				this.slideShowtimer = setInterval(function(){
					that.showPrevNext.call(that, 1);
				}, o.slideShow);
				
				this.element.inOut(
					function(){
						clearInterval(that.slideShowtimer);
					}, function(){
					if(o.restartSlideShow){
						clearInterval(that.slideShowtimer);
						that.slideShowtimer = setInterval(function(){
							that.showPrevNext.call(that, 1);
						}, o.slideShow);
					}
				});
			}
			if($.fn.lazyImgLoader){
				this.element.lazyImgLoader({e: 'tabtreeexpand', visible: this.panels.filter('.'+o.activePanelClass)});
			}
			this._trigger('init', {type: 'init'}, this.ui());
		},
		/*-
		 * getPrevNext
		 [ function (public) ]
		 * gets the next panel and button in the specified direction
		 * reiterates over the array (e.g. selects last if current is first and direction is -1)
		 > Parameter
		 - dir (number) [-1, 1] reflects the change of the index
		 = (object) the button and the panel found
		 == button (jQuery) the button found in the specified direction
		 == panel (jQuery) the panel found in the specified direction
		 -*/
		getPrevNext: function(dir){
			var index = this.buttons
				.index(this.buttons.filter('.'+ this.options.activeButtonClass)[0]) + dir
			;
			if(index < 0){
				index = this.buttons.length - 1;
			} else if(index >= this.buttons.length){
				index = 0;
			}
			return {button: this.buttons.get(index), panel: this.panels.get(index)};
		},
		/*-
		 *showPrevNext
		 [ function (public) ]
		 * shows the next panel and button in the specified direction @see getPrevNext
		 > Parameter
		 - dir (number) [-1, 1] reflects the change of the index
		 = (object) the button and the panel found
		 == button (jQuery) the button found in the specified direction
		 == panel (jQuery) the panel found in the specified direction
		 -*/
		showPrevNext: function(dir){
			var data = this.getPrevNext(dir);
			this.expand(data.button, {type: 'show-'+ dir});
		},
		/*-
		 * toggle
		 [ function (public) ]
		 * toggles the state of the button
		 > Parameter
		 - button (jQuery) the button to toggle
		 - e (Event) the original Event that caused the action
		 -*/
		toggle: function(button, e){
			var action = ($(button).hasClass(this.options.activeButtonClass)) ?
				'collapse' : 'expand';
			this[action](button, e);
		},
		/*-
		 * selectIndexes
		 [ function (public) ]
		 * sets the selectedIndexes to the specified values
		 > Parameter
		 - indexes (number|array) the indices of open tabs
		 - e (Event) the original Event that caused the action
		 -*/
		selectIndexes: function(indexes, e){
			if(!$.isArray(indexes)){
				indexes = [indexes];
			}
			var that = this;
			$.each(indexes, function(i, index){
				var button = that.buttons.get(index);
				if(button){
					that.expand(button, e);
				}
			});
			$.each(this.selectedIndexes, function(i, index){
				if($.inArray(index, indexes) == -1 && $.inArray(''+ index, indexes) == -1){
					var button = that.buttons.get(index);
					if(button){
						that.collapse(button, e);
					}
				}
			});
		},
		/*-
		 * collapse
		 
		 [ function (public) ]
		 
		 * collapses the specified panel
		 
		 > Parameter
		 - button (jQuery) the tab which should be closed
		 - e (Event) the Event that caused the action
		 - _panel* (jQuery) the panel which should be closed
		 - _opener* (object) if not multiSelectable the elements which should be opened
		 -- panel (jQuery) the panel to be opened
		 -- button (jQuery) the button to be opened
		 
		 = (object) the object of closed panels/buttons
		 == button (jQuery) the button that gets closed
		 == panel (jQuery) the panel that gets closed
		 == expandElements (object) only exists if not multiSelectable
		 === button (jQuery) the button that gets opened
		 === panel (jQuery) the panel that gets opened
		 -*/
		collapse: function(button, e, _panel, _opener){
			e = e || {type: 'collapse'};
			button = $(button);
			
			//if button/panel is already inactive
			if(!button.hasClass(this.options.activeButtonClass) && e.type != 'init'){
				return false;
			}
			
			var panel 		= _panel || this.getPanel(button),
				buttons 	= this.getButtons(panel),
				type 		= (e.type == 'init') ? 
								'collapseinit' :
								'collapse',
				that 		= this,
				o 			= this.options,
				uiObj 		= {
								button: buttons,
								panel: panel
							}
			;
			
			if(!o.multiSelectable){
				uiObj.expandElements = _opener || 
					{
						panel: $([]),
						button: $([])
					}
				;
			}
			
			this.removeIndex(panel);
			if(this._trigger(type, e, $.extend({}, this.ui(), uiObj)) === false){
				this.addIndex(panel);
				return undefined;
			}
			
			this.setState(buttons, uiObj.panel, 'inactive');
			
			if(o.handleDisplay === true || (e.type == 'init' && o.handleDisplay)){
				if(o.hideStyle === 'visibility'){
					uiObj.panel
						.parent()
						.css({overflow: 'hidden', height: 0})
						.end()
						.css({visibility: 'hidden'})
					;
				} else {
					uiObj.panel.hide();
				}
			}
			
			uiObj.button = button;
			
			$.ui.SR.update();
			
			return uiObj;
		},
		/*-
		 * addIndex
		 
		 [function (public)]
		 
		 * adds an index to selectIndexes @see selectIndexes
		 
		 > Parameter
		 - index (number) the index to add
		 -*/
		addIndex: function(index){
			if(!isFinite(index) && index.jquery){
				index = this.panels.index(index[0]);
			}
			if($.inArray(index, this.selectedIndexes) === -1){
				this.selectedIndexes.push(index);
				this.selectedIndexes.sort(numsort);
			}
		},
		/*-
		 * removeIndex
		 
		 [function (public)]
		 
		 * removes an index to selectIndexes @see selectIndexes
		 
		 > Parameter
		 - index (number) the index to remove
		 -*/
		removeIndex: function(index){
			if(!isFinite(index) && index.jquery){
				index = this.panels.index(index[0]);
			}
			this.selectedIndexes = $.grep(this.selectedIndexes, function(num, i){
				return (index !== num);
			});
		},
		/*-
		 * expand
		 
		 [ function (public) ]
		 
		 * expands the specified panel
		 
		 > Parameter
		 - button (jQuery) the tab which should be expanded
		 - e (Event) the Event that caused the action
		 
		 -*/
		expand: function(button, e){
			e = e ||
				{type: 'expand'};
			button = $(button);
			
			//if button/panel is already active
			if(e.type != 'init' && button.hasClass(this.options.activeButtonClass)){
				return false;
			}
			
			var type 			= (e.type == 'init') ? 
								'expandinit' :
								'expand',
				that 			= this,
				o 				= this.options,
				uiObj 			= {},
				panel 			= this.getPanel(button),
				buttons			= this.getButtons(panel),
				collapseButton 	= this.buttons.filter('.'+ o.activeButtonClass),
				posStyle,
				panelWrapper
			;
			
			uiObj.button = buttons;
			uiObj.panel = panel;
			
			if(!o.multiSelectable){
				uiObj.collapseElements = {
							button: collapseButton, 
							panel: this.getPanel(collapseButton)
						};
				
			}
			if(e.type != 'init' && this._trigger('beforeexpand', e, $.extend({}, this.ui(), uiObj)) === false){return;}
			this.addIndex(panel);
			//collapse all other panels, if not multiSelectable
			if(e.type != 'init' && !o.multiSelectable){
				collapseButton.each(function(){
					that.collapse.call(that, this, e, false, {button: buttons, panel: panel});
				});
			}
			this.setState(buttons, panel, 'active');
			
			
						
			if(o.handleDisplay === true || (e.type == 'init' && o.handleDisplay == 'initial')){
				if(o.hideStyle === 'visibility'){
					panel
						.parent()
						.css({overflow: '', height: ''})
						.end()
						.css({visibility: ''})
					;
				} else {
					panel.show();
				}
				
			}
			
			$.ui.SR.update();
			
			if(o.addToHistory && e.type !== 'init' && e.type !== 'hashHistoryChange'){
				$.hashHistory.add('tab-'+ panel.getID());
			}
			
			this._trigger(type, e, $.extend({}, this.ui(), uiObj));
			
			if(/click|hashHistoryChange/.test(e.type) && o.focusOnExpand){
				that.focusPanel(panel);
			}
			return undefined;
		},
		/*-
		 * collapseAll
		 
		 [function (public) ]
		 
		 * collapses all open Panels
		 
		 > Parameter
		 - e (Event) the Event that caused the action
		 -*/
		collapseAll: function(e){
			var that = this;
			$.each(this.selectedIndexes, function(i, index){
				that.collapse.call(that, that.buttons[index], e);
			});
		},
		/*-
		 * getButtons
		 
		 [ function (public) ]
		 
		 * gets the button to the specified Panels
		 
		 > Parameter
		 - panel (jQuery) the panel we want the button from
		 
		 = (jQuery) the button found
		 -*/
		getButtons: function(panel){
			return this.buttons.filter('[aria-controls='+ panel.getID() +']');
		},
		/*-
		 * getPanel
		 
		 [ function (public) ]
		 
		 * gets the panel to the specified button
		 
		 > Parameter
		 - button (jQuery) the button we want the panel from
		 
		 = (jQuery) the panel found
		 -*/
		getPanel: function(button){
			return this.panels.filter('#'+ button.attr('aria-controls') );
		},
		/*-
		 * setState
		 
		 [ function (public) ]
		 
		 * sets the button and panel to the specified state
		 
		 > Parameter
		 - button (jQuery) the button to set the state on
		 - panel (jQuery) the panel to set the state on
		 - state (string) ['active', 'inactive'] the state to set
		 
		 -*/
		setState: function(button, panel, state){
			var o	 	= this.options,
				set 	= (state == 'active') ? 
							{
								c: 'addClass',
								index: '-1',
								aria: 'true'
							} :
							{
								c: 'removeClass',
								index: '0',
								aria: 'false'
							}
			;
			if((!o.toggleButton)){
				button.attr({'tabindex': set.index, 'aria-disabled': set.aria})[set.c]('ui-disabled');
			} else {
				button.attr({'tabindex': '0'});
			}
			button[set.c](o.activeButtonClass).attr('aria-expanded', set.aria);
			panel[set.c](o.activePanelClass).attr('aria-expanded', set.aria);
		},
		/*-
		 * focusPanel
		 
		 [ function (public) ]
		 
		 * focuses the specified panel
		 
		 > Parameter
		 - panel (jQuery) the panel to focus
		 
		 -*/
		focusPanel: function(panel){
			var o 			= this.options,
				focusElem 	= (o.focusSel === true || !o.focusSel) ? panel.firstExpOf('focusPoint') : $(o.focusSel, panel)
			;
			focusElem.setFocus({context: (panel[0].parentNode || {}).parentNode});
			return undefined;
		},
		/*-
		 * ui
		 
		 [ function (public) ]
		 
		 * returns the important things of the widget
		 
		 = (object) the UI
		 == instance (object) the instance of this widget
		 == panels (jQuery) a jQuery collection of all panels
		 == buttons (jQuery) a jQuery collection of all buttonSel
		 == selectedIndexes (Array) an Array containing selected Indexes
		 
		 -*/
		ui: function(){
			return {
				instance: this,
				panels: this.panels,
				buttons: this.buttons,
				selectedIndexes: this.selectedIndexes
			};
		}
	});
	
})(jQuery);/**
 * @author alexander.farkas
 */
(function($){
	var uID = new Date().getTime();
	$.fn.embedSWF = function(o){
		
		var ret = [],
			reservedParams = ['width', 'height', 'expressInstall', 'version'];
		o = $.extend(true, {}, $.fn.embedSWF.defaults, o);
		
		function getId(jElem){
			var id = jElem.attr('id');
			if(!id){
				id = 'id-' + String(uID++);
				jElem.attr({id: id});
			}
			return id;
		}
		
		function strToObj(str){
			var obj  = {};
			if(str){
				str = str.replace(/^\?/,'').replace(/&amp;/g, '&').split(/&/);
				$.each(str, function(i, param){
					queryPair = param.split(/\=/);
					obj[decodeURIComponent(queryPair[0])] = (queryPair[1]) ?
						decodeURIComponent(queryPair[1]) :
						'';
				});
			}
			return obj;
		}
		
		this.each(function(){
			
			var jElem = $(this),
				classes = this.className,
				linkSrc = $('a', this).filter('[href*=".swf"], [href*=".flv"]'),
				id =  getId(jElem),
				src = linkSrc.attr('href').split('?'),
				params = strToObj(src[1]),
				width = params.width ||
					jElem.width(),
				height = params.height ||
					jElem.height(),
				version = params.version || 
					o.version,
				expressInstall,
				flash;
			
			if(params.expressInstall == 'false'){
				expressInstall = false;
			} else if(!params.expressInstall){
				expressInstall = o.expressInstall;
			} else {
				expressInstall = params.expressInstall;
			}
			$.each(reservedParams, function(i, reservedParam){
				delete params[reservedParam];
			});
			
			$.extend({}, o.parameters, params);
			swfobject.embedSWF(src[0], id, width, height, version, expressInstall, false, params);
			flash = document.getElementById(id);
			flash.className = classes;
			
			ret.push(flash);
			
		});
		return this.pushStack(ret);
	};
	
	$.fn.embedSWF.defaults = {
		expressInstall: false,
		version: "9.0.124",
		parameters: {}
	};
})(jQuery);
/*!	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/

var swfobject = function() {
	
	var UNDEF = "undefined",
		OBJECT = "object",
		SHOCKWAVE_FLASH = "Shockwave Flash",
		SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
		FLASH_MIME_TYPE = "application/x-shockwave-flash",
		EXPRESS_INSTALL_ID = "SWFObjectExprInst",
		ON_READY_STATE_CHANGE = "onreadystatechange",
		
		win = window,
		doc = document,
		nav = navigator,
		
		plugin = false,
		domLoadFnArr = [main],
		regObjArr = [],
		objIdArr = [],
		listenersArr = [],
		storedAltContent,
		storedAltContentId,
		storedCallbackFn,
		storedCallbackObj,
		isDomLoaded = false,
		isExpressInstallActive = false,
		dynamicStylesheet,
		dynamicStylesheetMedia,
		autoHideShow = true,
	
	/* Centralized function for browser feature detection
		- User agent string detection is only used when no good alternative is possible
		- Is executed directly for optimal performance
	*/	
	ua = function() {
		var w3cdom = typeof doc.getElementById != UNDEF && typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF,
			u = nav.userAgent.toLowerCase(),
			p = nav.platform.toLowerCase(),
			windows = p ? /win/.test(p) : /win/.test(u),
			mac = p ? /mac/.test(p) : /mac/.test(u),
			webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, // returns either the webkit version or false if not webkit
			ie = !+"\v1", // feature detection based on Andrea Giammarchi's solution: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
			playerVersion = [0,0,0],
			d = null;
		if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
			d = nav.plugins[SHOCKWAVE_FLASH].description;
			if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
				plugin = true;
				ie = false; // cascaded feature detection for Internet Explorer
				d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
				playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
				playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
				playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
			}
		}
		else if (typeof win.ActiveXObject != UNDEF) {
			try {
				var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
				if (a) { // a will return null when ActiveX is disabled
					d = a.GetVariable("$version");
					if (d) {
						ie = true; // cascaded feature detection for Internet Explorer
						d = d.split(" ")[1].split(",");
						playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
					}
				}
			}
			catch(e) {}
		}
		return { w3:w3cdom, pv:playerVersion, wk:webkit, ie:ie, win:windows, mac:mac };
	}(),
	
	/* Cross-browser onDomLoad
		- Will fire an event as soon as the DOM of a web page is loaded
		- Internet Explorer workaround based on Diego Perini's solution: http://javascript.nwbox.com/IEContentLoaded/
		- Regular onload serves as fallback
	*/ 
	onDomLoad = function() {
		if (!ua.w3) { return; }
		if ((typeof doc.readyState != UNDEF && doc.readyState == "complete") || (typeof doc.readyState == UNDEF && (doc.getElementsByTagName("body")[0] || doc.body))) { // function is fired after onload, e.g. when script is inserted dynamically 
			callDomLoadFunctions();
		}
		if (!isDomLoaded) {
			if (typeof doc.addEventListener != UNDEF) {
				doc.addEventListener("DOMContentLoaded", callDomLoadFunctions, false);
			}		
			if (ua.ie && ua.win) {
				doc.attachEvent(ON_READY_STATE_CHANGE, function() {
					if (doc.readyState == "complete") {
						doc.detachEvent(ON_READY_STATE_CHANGE, arguments.callee);
						callDomLoadFunctions();
					}
				});
				if (win == top) { // if not inside an iframe
					(function(){
						if (isDomLoaded) { return; }
						try {
							doc.documentElement.doScroll("left");
						}
						catch(e) {
							setTimeout(arguments.callee, 0);
							return;
						}
						callDomLoadFunctions();
					})();
				}
			}
			if (ua.wk) {
				(function(){
					if (isDomLoaded) { return; }
					if (!/loaded|complete/.test(doc.readyState)) {
						setTimeout(arguments.callee, 0);
						return;
					}
					callDomLoadFunctions();
				})();
			}
			addLoadEvent(callDomLoadFunctions);
		}
	}();
	
	function callDomLoadFunctions() {
		if (isDomLoaded) { return; }
		try { // test if we can really add/remove elements to/from the DOM; we don't want to fire it too early
			var t = doc.getElementsByTagName("body")[0].appendChild(createElement("span"));
			t.parentNode.removeChild(t);
		}
		catch (e) { return; }
		isDomLoaded = true;
		var dl = domLoadFnArr.length;
		for (var i = 0; i < dl; i++) {
			domLoadFnArr[i]();
		}
	}
	
	function addDomLoadEvent(fn) {
		if (isDomLoaded) {
			fn();
		}
		else { 
			domLoadFnArr[domLoadFnArr.length] = fn; // Array.push() is only available in IE5.5+
		}
	}
	
	/* Cross-browser onload
		- Based on James Edwards' solution: http://brothercake.com/site/resources/scripts/onload/
		- Will fire an event as soon as a web page including all of its assets are loaded 
	 */
	function addLoadEvent(fn) {
		if (typeof win.addEventListener != UNDEF) {
			win.addEventListener("load", fn, false);
		}
		else if (typeof doc.addEventListener != UNDEF) {
			doc.addEventListener("load", fn, false);
		}
		else if (typeof win.attachEvent != UNDEF) {
			addListener(win, "onload", fn);
		}
		else if (typeof win.onload == "function") {
			var fnOld = win.onload;
			win.onload = function() {
				fnOld();
				fn();
			};
		}
		else {
			win.onload = fn;
		}
	}
	
	/* Main function
		- Will preferably execute onDomLoad, otherwise onload (as a fallback)
	*/
	function main() { 
		if (plugin) {
			testPlayerVersion();
		}
		else {
			matchVersions();
		}
	}
	
	/* Detect the Flash Player version for non-Internet Explorer browsers
		- Detecting the plug-in version via the object element is more precise than using the plugins collection item's description:
		  a. Both release and build numbers can be detected
		  b. Avoid wrong descriptions by corrupt installers provided by Adobe
		  c. Avoid wrong descriptions by multiple Flash Player entries in the plugin Array, caused by incorrect browser imports
		- Disadvantage of this method is that it depends on the availability of the DOM, while the plugins collection is immediately available
	*/
	function testPlayerVersion() {
		var b = doc.getElementsByTagName("body")[0];
		var o = createElement(OBJECT);
		o.setAttribute("type", FLASH_MIME_TYPE);
		var t = b.appendChild(o);
		if (t) {
			var counter = 0;
			(function(){
				if (typeof t.GetVariable != UNDEF) {
					var d = t.GetVariable("$version");
					if (d) {
						d = d.split(" ")[1].split(",");
						ua.pv = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
					}
				}
				else if (counter < 10) {
					counter++;
					setTimeout(arguments.callee, 10);
					return;
				}
				b.removeChild(o);
				t = null;
				matchVersions();
			})();
		}
		else {
			matchVersions();
		}
	}
	
	/* Perform Flash Player and SWF version matching; static publishing only
	*/
	function matchVersions() {
		var rl = regObjArr.length;
		if (rl > 0) {
			for (var i = 0; i < rl; i++) { // for each registered object element
				var id = regObjArr[i].id;
				var cb = regObjArr[i].callbackFn;
				var cbObj = {success:false, id:id};
				if (ua.pv[0] > 0) {
					var obj = getElementById(id);
					if (obj) {
						if (hasPlayerVersion(regObjArr[i].swfVersion) && !(ua.wk && ua.wk < 312)) { // Flash Player version >= published SWF version: Houston, we have a match!
							setVisibility(id, true);
							if (cb) {
								cbObj.success = true;
								cbObj.ref = getObjectById(id);
								cb(cbObj);
							}
						}
						else if (regObjArr[i].expressInstall && canExpressInstall()) { // show the Adobe Express Install dialog if set by the web page author and if supported
							var att = {};
							att.data = regObjArr[i].expressInstall;
							att.width = obj.getAttribute("width") || "0";
							att.height = obj.getAttribute("height") || "0";
							if (obj.getAttribute("class")) { att.styleclass = obj.getAttribute("class"); }
							if (obj.getAttribute("align")) { att.align = obj.getAttribute("align"); }
							// parse HTML object param element's name-value pairs
							var par = {};
							var p = obj.getElementsByTagName("param");
							var pl = p.length;
							for (var j = 0; j < pl; j++) {
								if (p[j].getAttribute("name").toLowerCase() != "movie") {
									par[p[j].getAttribute("name")] = p[j].getAttribute("value");
								}
							}
							showExpressInstall(att, par, id, cb);
						}
						else { // Flash Player and SWF version mismatch or an older Webkit engine that ignores the HTML object element's nested param elements: display alternative content instead of SWF
							displayAltContent(obj);
							if (cb) { cb(cbObj); }
						}
					}
				}
				else {	// if no Flash Player is installed or the fp version cannot be detected we let the HTML object element do its job (either show a SWF or alternative content)
					setVisibility(id, true);
					if (cb) {
						var o = getObjectById(id); // test whether there is an HTML object element or not
						if (o && typeof o.SetVariable != UNDEF) { 
							cbObj.success = true;
							cbObj.ref = o;
						}
						cb(cbObj);
					}
				}
			}
		}
	}
	
	function getObjectById(objectIdStr) {
		var r = null;
		var o = getElementById(objectIdStr);
		if (o && o.nodeName == "OBJECT") {
			if (typeof o.SetVariable != UNDEF) {
				r = o;
			}
			else {
				var n = o.getElementsByTagName(OBJECT)[0];
				if (n) {
					r = n;
				}
			}
		}
		return r;
	}
	
	/* Requirements for Adobe Express Install
		- only one instance can be active at a time
		- fp 6.0.65 or higher
		- Win/Mac OS only
		- no Webkit engines older than version 312
	*/
	function canExpressInstall() {
		return !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac) && !(ua.wk && ua.wk < 312);
	}
	
	/* Show the Adobe Express Install dialog
		- Reference: http://www.adobe.com/cfusion/knowledgebase/index.cfm?id=6a253b75
	*/
	function showExpressInstall(att, par, replaceElemIdStr, callbackFn) {
		isExpressInstallActive = true;
		storedCallbackFn = callbackFn || null;
		storedCallbackObj = {success:false, id:replaceElemIdStr};
		var obj = getElementById(replaceElemIdStr);
		if (obj) {
			if (obj.nodeName == "OBJECT") { // static publishing
				storedAltContent = abstractAltContent(obj);
				storedAltContentId = null;
			}
			else { // dynamic publishing
				storedAltContent = obj;
				storedAltContentId = replaceElemIdStr;
			}
			att.id = EXPRESS_INSTALL_ID;
			if (typeof att.width == UNDEF || (!/%$/.test(att.width) && parseInt(att.width, 10) < 310)) { att.width = "310"; }
			if (typeof att.height == UNDEF || (!/%$/.test(att.height) && parseInt(att.height, 10) < 137)) { att.height = "137"; }
			doc.title = doc.title.slice(0, 47) + " - Flash Player Installation";
			var pt = ua.ie && ua.win ? "ActiveX" : "PlugIn",
				fv = "MMredirectURL=" + win.location.toString().replace(/&/g,"%26") + "&MMplayerType=" + pt + "&MMdoctitle=" + doc.title;
			if (typeof par.flashvars != UNDEF) {
				par.flashvars += "&" + fv;
			}
			else {
				par.flashvars = fv;
			}
			// IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
			// because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
			if (ua.ie && ua.win && obj.readyState != 4) {
				var newObj = createElement("div");
				replaceElemIdStr += "SWFObjectNew";
				newObj.setAttribute("id", replaceElemIdStr);
				obj.parentNode.insertBefore(newObj, obj); // insert placeholder div that will be replaced by the object element that loads expressinstall.swf
				obj.style.display = "none";
				(function(){
					if (obj.readyState == 4) {
						obj.parentNode.removeChild(obj);
					}
					else {
						setTimeout(arguments.callee, 10);
					}
				})();
			}
			createSWF(att, par, replaceElemIdStr);
		}
	}
	
	/* Functions to abstract and display alternative content
	*/
	function displayAltContent(obj) {
		if (ua.ie && ua.win && obj.readyState != 4) {
			// IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
			// because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
			var el = createElement("div");
			obj.parentNode.insertBefore(el, obj); // insert placeholder div that will be replaced by the alternative content
			el.parentNode.replaceChild(abstractAltContent(obj), el);
			obj.style.display = "none";
			(function(){
				if (obj.readyState == 4) {
					obj.parentNode.removeChild(obj);
				}
				else {
					setTimeout(arguments.callee, 10);
				}
			})();
		}
		else {
			obj.parentNode.replaceChild(abstractAltContent(obj), obj);
		}
	} 

	function abstractAltContent(obj) {
		var ac = createElement("div");
		if (ua.win && ua.ie) {
			ac.innerHTML = obj.innerHTML;
		}
		else {
			var nestedObj = obj.getElementsByTagName(OBJECT)[0];
			if (nestedObj) {
				var c = nestedObj.childNodes;
				if (c) {
					var cl = c.length;
					for (var i = 0; i < cl; i++) {
						if (!(c[i].nodeType == 1 && c[i].nodeName == "PARAM") && !(c[i].nodeType == 8)) {
							ac.appendChild(c[i].cloneNode(true));
						}
					}
				}
			}
		}
		return ac;
	}
	
	/* Cross-browser dynamic SWF creation
	*/
	function createSWF(attObj, parObj, id) {
		var r, el = getElementById(id);
		if (ua.wk && ua.wk < 312) { return r; }
		if (el) {
			if (typeof attObj.id == UNDEF) { // if no 'id' is defined for the object element, it will inherit the 'id' from the alternative content
				attObj.id = id;
			}
			if (ua.ie && ua.win) { // Internet Explorer + the HTML object element + W3C DOM methods do not combine: fall back to outerHTML
				var att = "";
				for (var i in attObj) {
					if (attObj[i] != Object.prototype[i]) { // filter out prototype additions from other potential libraries
						if (i.toLowerCase() == "data") {
							parObj.movie = attObj[i];
						}
						else if (i.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
							att += ' class="' + attObj[i] + '"';
						}
						else if (i.toLowerCase() != "classid") {
							att += ' ' + i + '="' + attObj[i] + '"';
						}
					}
				}
				var par = "";
				for (var j in parObj) {
					if (parObj[j] != Object.prototype[j]) { // filter out prototype additions from other potential libraries
						par += '<param name="' + j + '" value="' + parObj[j] + '" />';
					}
				}
				el.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + att + '>' + par + '</object>';
				objIdArr[objIdArr.length] = attObj.id; // stored to fix object 'leaks' on unload (dynamic publishing only)
				r = getElementById(attObj.id);	
			}
			else { // well-behaving browsers
				var o = createElement(OBJECT);
				o.setAttribute("type", FLASH_MIME_TYPE);
				for (var m in attObj) {
					if (attObj[m] != Object.prototype[m]) { // filter out prototype additions from other potential libraries
						if (m.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
							o.setAttribute("class", attObj[m]);
						}
						else if (m.toLowerCase() != "classid") { // filter out IE specific attribute
							o.setAttribute(m, attObj[m]);
						}
					}
				}
				for (var n in parObj) {
					if (parObj[n] != Object.prototype[n] && n.toLowerCase() != "movie") { // filter out prototype additions from other potential libraries and IE specific param element
						createObjParam(o, n, parObj[n]);
					}
				}
				el.parentNode.replaceChild(o, el);
				r = o;
			}
		}
		return r;
	}
	
	function createObjParam(el, pName, pValue) {
		var p = createElement("param");
		p.setAttribute("name", pName);	
		p.setAttribute("value", pValue);
		el.appendChild(p);
	}
	
	/* Cross-browser SWF removal
		- Especially needed to safely and completely remove a SWF in Internet Explorer
	*/
	function removeSWF(id) {
		var obj = getElementById(id);
		if (obj && obj.nodeName == "OBJECT") {
			if (ua.ie && ua.win) {
				obj.style.display = "none";
				(function(){
					if (obj.readyState == 4) {
						removeObjectInIE(id);
					}
					else {
						setTimeout(arguments.callee, 10);
					}
				})();
			}
			else {
				obj.parentNode.removeChild(obj);
			}
		}
	}
	
	function removeObjectInIE(id) {
		var obj = getElementById(id);
		if (obj) {
			for (var i in obj) {
				if (typeof obj[i] == "function") {
					obj[i] = null;
				}
			}
			obj.parentNode.removeChild(obj);
		}
	}
	
	/* Functions to optimize JavaScript compression
	*/
	function getElementById(id) {
		var el = null;
		try {
			el = doc.getElementById(id);
		}
		catch (e) {}
		return el;
	}
	
	function createElement(el) {
		return doc.createElement(el);
	}
	
	/* Updated attachEvent function for Internet Explorer
		- Stores attachEvent information in an Array, so on unload the detachEvent functions can be called to avoid memory leaks
	*/	
	function addListener(target, eventType, fn) {
		target.attachEvent(eventType, fn);
		listenersArr[listenersArr.length] = [target, eventType, fn];
	}
	
	/* Flash Player and SWF content version matching
	*/
	function hasPlayerVersion(rv) {
		var pv = ua.pv, v = rv.split(".");
		v[0] = parseInt(v[0], 10);
		v[1] = parseInt(v[1], 10) || 0; // supports short notation, e.g. "9" instead of "9.0.0"
		v[2] = parseInt(v[2], 10) || 0;
		return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
	}
	
	/* Cross-browser dynamic CSS creation
		- Based on Bobby van der Sluis' solution: http://www.bobbyvandersluis.com/articles/dynamicCSS.php
	*/	
	function createCSS(sel, decl, media, newStyle) {
		if (ua.ie && ua.mac) { return; }
		var h = doc.getElementsByTagName("head")[0];
		if (!h) { return; } // to also support badly authored HTML pages that lack a head element
		var m = (media && typeof media == "string") ? media : "screen";
		if (newStyle) {
			dynamicStylesheet = null;
			dynamicStylesheetMedia = null;
		}
		if (!dynamicStylesheet || dynamicStylesheetMedia != m) { 
			// create dynamic stylesheet + get a global reference to it
			var s = createElement("style");
			s.setAttribute("type", "text/css");
			s.setAttribute("media", m);
			dynamicStylesheet = h.appendChild(s);
			if (ua.ie && ua.win && typeof doc.styleSheets != UNDEF && doc.styleSheets.length > 0) {
				dynamicStylesheet = doc.styleSheets[doc.styleSheets.length - 1];
			}
			dynamicStylesheetMedia = m;
		}
		// add style rule
		if (ua.ie && ua.win) {
			if (dynamicStylesheet && typeof dynamicStylesheet.addRule == OBJECT) {
				dynamicStylesheet.addRule(sel, decl);
			}
		}
		else {
			if (dynamicStylesheet && typeof doc.createTextNode != UNDEF) {
				dynamicStylesheet.appendChild(doc.createTextNode(sel + " {" + decl + "}"));
			}
		}
	}
	
	function setVisibility(id, isVisible) {
		if (!autoHideShow) { return; }
		var v = isVisible ? "visible" : "hidden";
		if (isDomLoaded && getElementById(id)) {
			getElementById(id).style.visibility = v;
		}
		else {
			createCSS("#" + id, "visibility:" + v);
		}
	}

	/* Filter to avoid XSS attacks
	*/
	function urlEncodeIfNecessary(s) {
		var regex = /[\\\"<>\.;]/;
		var hasBadChars = regex.exec(s) != null;
		return hasBadChars && typeof encodeURIComponent != UNDEF ? encodeURIComponent(s) : s;
	}
	
	/* Release memory to avoid memory leaks caused by closures, fix hanging audio/video threads and force open sockets/NetConnections to disconnect (Internet Explorer only)
	*/
	var cleanup = function() {
		if (ua.ie && ua.win) {
			window.attachEvent("onunload", function() {
				// remove listeners to avoid memory leaks
				var ll = listenersArr.length;
				for (var i = 0; i < ll; i++) {
					listenersArr[i][0].detachEvent(listenersArr[i][1], listenersArr[i][2]);
				}
				// cleanup dynamically embedded objects to fix audio/video threads and force open sockets and NetConnections to disconnect
				var il = objIdArr.length;
				for (var j = 0; j < il; j++) {
					removeSWF(objIdArr[j]);
				}
				// cleanup library's main closures to avoid memory leaks
				for (var k in ua) {
					ua[k] = null;
				}
				ua = null;
				for (var l in swfobject) {
					swfobject[l] = null;
				}
				swfobject = null;
			});
		}
	}();
	
	return {
		/* Public API
			- Reference: http://code.google.com/p/swfobject/wiki/documentation
		*/ 
		registerObject: function(objectIdStr, swfVersionStr, xiSwfUrlStr, callbackFn) {
			if (ua.w3 && objectIdStr && swfVersionStr) {
				var regObj = {};
				regObj.id = objectIdStr;
				regObj.swfVersion = swfVersionStr;
				regObj.expressInstall = xiSwfUrlStr;
				regObj.callbackFn = callbackFn;
				regObjArr[regObjArr.length] = regObj;
				setVisibility(objectIdStr, false);
			}
			else if (callbackFn) {
				callbackFn({success:false, id:objectIdStr});
			}
		},
		
		getObjectById: function(objectIdStr) {
			if (ua.w3) {
				return getObjectById(objectIdStr);
			}
		},
		
		embedSWF: function(swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj, callbackFn) {
			var callbackObj = {success:false, id:replaceElemIdStr};
			if (ua.w3 && !(ua.wk && ua.wk < 312) && swfUrlStr && replaceElemIdStr && widthStr && heightStr && swfVersionStr) {
				setVisibility(replaceElemIdStr, false);
				addDomLoadEvent(function() {
					widthStr += ""; // auto-convert to string
					heightStr += "";
					var att = {};
					if (attObj && typeof attObj === OBJECT) {
						for (var i in attObj) { // copy object to avoid the use of references, because web authors often reuse attObj for multiple SWFs
							att[i] = attObj[i];
						}
					}
					att.data = swfUrlStr;
					att.width = widthStr;
					att.height = heightStr;
					var par = {}; 
					if (parObj && typeof parObj === OBJECT) {
						for (var j in parObj) { // copy object to avoid the use of references, because web authors often reuse parObj for multiple SWFs
							par[j] = parObj[j];
						}
					}
					if (flashvarsObj && typeof flashvarsObj === OBJECT) {
						for (var k in flashvarsObj) { // copy object to avoid the use of references, because web authors often reuse flashvarsObj for multiple SWFs
							if (typeof par.flashvars != UNDEF) {
								par.flashvars += "&" + k + "=" + flashvarsObj[k];
							}
							else {
								par.flashvars = k + "=" + flashvarsObj[k];
							}
						}
					}
					if (hasPlayerVersion(swfVersionStr)) { // create SWF
						var obj = createSWF(att, par, replaceElemIdStr);
						if (att.id == replaceElemIdStr) {
							setVisibility(replaceElemIdStr, true);
						}
						callbackObj.success = true;
						callbackObj.ref = obj;
					}
					else if (xiSwfUrlStr && canExpressInstall()) { // show Adobe Express Install
						att.data = xiSwfUrlStr;
						showExpressInstall(att, par, replaceElemIdStr, callbackFn);
						return;
					}
					else { // show alternative content
						setVisibility(replaceElemIdStr, true);
					}
					if (callbackFn) { callbackFn(callbackObj); }
				});
			}
			else if (callbackFn) { callbackFn(callbackObj);	}
		},
		
		switchOffAutoHideShow: function() {
			autoHideShow = false;
		},
		
		ua: ua,
		
		getFlashPlayerVersion: function() {
			return { major:ua.pv[0], minor:ua.pv[1], release:ua.pv[2] };
		},
		
		hasFlashPlayerVersion: hasPlayerVersion,
		
		createSWF: function(attObj, parObj, replaceElemIdStr) {
			if (ua.w3) {
				return createSWF(attObj, parObj, replaceElemIdStr);
			}
			else {
				return undefined;
			}
		},
		
		showExpressInstall: function(att, par, replaceElemIdStr, callbackFn) {
			if (ua.w3 && canExpressInstall()) {
				showExpressInstall(att, par, replaceElemIdStr, callbackFn);
			}
		},
		
		removeSWF: function(objElemIdStr) {
			if (ua.w3) {
				removeSWF(objElemIdStr);
			}
		},
		
		createCSS: function(selStr, declStr, mediaStr, newStyleBoolean) {
			if (ua.w3) {
				createCSS(selStr, declStr, mediaStr, newStyleBoolean);
			}
		},
		
		addDomLoadEvent: addDomLoadEvent,
		
		addLoadEvent: addLoadEvent,
		
		getQueryParamValue: function(param) {
			var q = doc.location.search || doc.location.hash;
			if (q) {
				if (/\?/.test(q)) { q = q.split("?")[1]; } // strip question mark
				if (param == null) {
					return urlEncodeIfNecessary(q);
				}
				var pairs = q.split("&");
				for (var i = 0; i < pairs.length; i++) {
					if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
						return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=") + 1)));
					}
				}
			}
			return "";
		},
		
		// For internal usage only
		expressInstallCallback: function() {
			if (isExpressInstallActive) {
				var obj = getElementById(EXPRESS_INSTALL_ID);
				if (obj && storedAltContent) {
					obj.parentNode.replaceChild(storedAltContent, obj);
					if (storedAltContentId) {
						setVisibility(storedAltContentId, true);
						if (ua.ie && ua.win) { storedAltContent.style.display = "block"; }
					}
					if (storedCallbackFn) { storedCallbackFn(storedCallbackObj); }
				}
				isExpressInstallActive = false;
			} 
		}
	};
}();
// Bookmarks
(function($){
    $.socialbookmark={
		findRelElm: function(elm){
			var jelm = $(elm),
			ref = jelm.attr('href'),
			find = ref.indexOf('#');
			ref = ref.substr(find);
			return ref;
		},
		handler: function(){
			if($.socialbookmark.actElm && !$($.socialbookmark.actElm).is(':hidden')){
				$.socialbookmark.hide();
			} else {
				$.socialbookmark.show.call(this);
			}
			return false;
		},
		hideNotinActElm: function(e){
			var jElm = $(e.target);
			if(jElm.is($.socialbookmark.actElm) || jElm.parents($.socialbookmark.actElm).size()){
				return;
			}
			$.socialbookmark.hide();
		},
		show:function(){
			var ref = $.socialbookmark.findRelElm(this);
			$(ref).animate({height: 'show',opacity: 'show'}, {duration: 400});
			$.socialbookmark.actElm = ref;
			$(document).bind('click', $.socialbookmark.hideNotinActElm);
			return false;
		},
		actElm: null,
		hide: function(){
			$($.socialbookmark.actElm).animate({height: "hide", opacity: "hide"});
			$('body').unbind('click', $.socialbookmark.hideNotinActElm);
		},
		init: function(sel){
			var jElm = $(sel);
			if(jElm.size()){
				var ref = $.socialbookmark.findRelElm(jElm[0]);
				$(ref).css({display: 'none'});
				jElm.click($.socialbookmark.handler);
			}
		}
	};
})(jQuery);
/**
 * @author alexander.farkas
 */
/**
* JS-Singelton-Klasse um Objekte (zum Beispiel Bilder) zu skalieren
* @id objScaleModule
* @alias $.objScale
* @alias jQuery.objScale
*/

/**
 * Berechnet die Höhe und Breite von DOM-Objekten
 * 
 * @id getDim
 * @method
 * @alias $.objScale.getDim
 * @param {Object} obj obj erwartet ein DOM-Objekt, ein jQuery-Objekt oder ein Objekt mit den Eigenschaften width und height.
 * @return {Object} gibt ein Objekt mit höhe und Breite zurück. Beispiel. {height: 200, width: 300}
 */
/**
 * Berechnet eine verhältnismäßige Skalierung eines Objekts.<br>
 * siehe auch: $.objScale.scaleHeightTo und $.objScale.scaleWidthTo
 * 
 * @id scaleTo
 * @method
 * @alias $.objScale.scaleTo
 * @see #scaleHeightTo
 * @param {Object} obj obj erwartet ein DOM-Objekt, ein jQuery-Objekt oder ein Objekt welches skaliert werden soll.
 * @param {Number} num num erwartet die neue Grösse, welche das Objekt haben soll (Breite oder Höhe)
 * @param {String} side gibt an welche Seite (Höhe oder Breite) man im 2. Parameter angegeben hat
 * @return {Number} gibt die neue Länge zurück (Wenn man unter num/side 'width' angegeben hat, wird die Höhe zurückgeliefert).
 */
/**
 * Skaliert die Höhe eines Objekts und gibt die verhältnismäßige Breite zurück.<br> 
 * (Shorthand für $.objScale.scaleTo(obj, num, 'height');)
 * 
 * @id scaleHeightTo
 * @method
 * @alias $.objScale.scaleHeightTo
 * @param {Object} obj obj erwartet ein DOM-Objekt, ein jQuery-Objekt oder ein Objekt welches skaliert werden soll.
 * @param {Number} num num erwartet die neue Höhe, welche das Objekt haben soll
 * @return {Number} gibt die neue Breite zurück
 */
/**
 * Skaliert die Breite eines Objekts und gibt die verhältnismäßige Höhe zurück.<br> 
 * (Shorthand für $.objScale.scaleTo(obj, num, 'width');)
 * 
 * @id scaleWidthTo
 * @method
 * @alias $.objScale.scaleWidthTo
 * @param {Object} obj obj erwartet ein DOM-Objekt, ein jQuery-Objekt oder ein Objekt welches skaliert werden soll.
 * @param {Number} num num erwartet die neue Breite, welche das Objekt haben soll
 * @return {Number} gibt die neue Höhe zurück
 */

/**
 * Skaliert die Breite eines Objekts und gibt die verhältnismäßige Höhe zurück.<br> 
 * (Shorthand für $.objScale.scaleTo(obj, num, 'width');)
 * 
 * @id scaleWidthTo
 * @method
 * @alias $.objScale.scaleWidthTo
 * @param {Object} obj obj erwartet ein DOM-Objekt, ein jQuery-Objekt oder ein Objekt welches skaliert werden soll.
 * @param {Number} num num erwartet die neue Breite, welche das Objekt haben soll
 * @return {Number} gibt die neue Höhe zurück
 */
/**
 * Zentriert ein kleineres Objekt in einem Grösseren.<br> 
 * siehe auch: $.objScale.constrainObjTo();
 * 
 * @id centerObjTo
 * @method
 * @alias $.objScale.centerObjTo
 * @param {Object} obj obj erwartet ein DOM-Objekt, ein jQuery-Objekt oder ein anderes Objekt mit Höhen und Breiten-Eigenschaften,  welches zentriert werden soll.
 * @param {Object} container erwartet ein DOM-Objekt, ein jQuery-Objekt oder ein anderes Objekt mit Höhen und Breiten-Eigenschaften,  in welches das andere Objekt zentriert werden soll
 * @param {Object, Options} opts stellt Optionen bereit so kann angegeben werden, ob es einen Mindest nach oben bzw. links geben soll (margin: [10, false]) und, ob vertical und / oder horizontal zentriert werden soll<br><br>
 * Beispiel:<br>
 * $.objScale.centerObjTo(img, container, {margin: [10, 0], horizontal: false};<br>
 * Es soll nur vertical und nicht horizontal zentriert werden, ausserdem soll der Mindestabstand nach oben 10 Einheiten betragen<br><br>
 * $.objScale.centerObjTo(img, container, {margin: [false, 0]};<br>
 * Es soll vertical und horizontal zentriert werden, ausserdem soll der Mindestabstand nach links 0 Einheiten betragen und nach oben existiert keine Mindestbeschränkung (Es können negative Werte auftreten).<br><br>
 * defaults: {margin: [0, 0], vertical: true, horizontal: true}
 * @return {Object} gibt ein Objekt mit top und left Eigenschaften zurück
 */
/**
 * Zentriert ein Objekt in einem anderen Objekt. Ist das zu skalierende Objekt grösser, wird es zusätzlich verkleinert.<br> 
 * siehe auch: $.objScale.centerObjTo(); und $.objScale.scaleObjTo();
 * @id constrainObjTo
 * @method
 * @alias $.objScale.constrainObjTo
 * @param {Object} obj obj erwartet ein DOM-Objekt, ein jQuery-Objekt oder ein anderes Objekt mit Höhen und Breiten-Eigenschaften,  welches angepasst und zentriert werden soll.
 * @param {Object} container erwartet ein DOM-Objekt, ein jQuery-Objekt oder ein anderes Objekt mit Höhen und Breiten-Eigenschaften,  in welches das andere Objekt zentriert werden soll
 * @param {Object, Options} opts stellt Optionen bereit so kann angegeben werden, ob es einen Mindestabstand nach oben bzw. links geben soll (margin: [10, false], padding: [10, 0]) und ob vertical und / oder horizontal zentriert werden soll<br><br>
 * Unterschied zwischen padding und margin: Die margin- und padding-Angaben werden für die evtl. Verkleinerung des Objekts berücksichtigt. Bei einer möglichen Zentrierung wird dagegen ausschließlich der margin-Wert berücksichtigt. Das padding-Array darf daher nur Zahlen enthalten, das margin-Array darf daneben noch den booleschen Wert false enthalten.
 * Beispiel:<br>
 * $.objScale.constrainObjTo(img, container, {margin: [10, 0], horizontal: false};<br>
 * Es soll nur vertical und nicht horizontal zentriert werden, ausserdem soll der Mindestabstand nach oben 10 Einheiten betragen<br><br>
 * defaults: {margin: [0, 0], padding: [0, 0], vertical: true, horizontal: true}
 * @return {Object} gibt ein Objekt mit width, height, top und left Eigenschaften zurück
 */
/**
 * Skaliert ein Objekt, so dass es perfekt in ein anderes Objekt passt und zentriert es. (Ist es kleiner, wird es vergrössert bzw. ist grösser, wird es verkleinert).<br> 
 * siehe auch: $.objScale.centerObjTo(); und $.objScale.constrainObjTo();
 * @id scaleObjTo
 * @method
 * @alias $.objScale.scaleObjTo
 * @param {Object} obj obj erwartet ein DOM-Objekt, ein jQuery-Objekt oder ein anderes Objekt mit Höhen und Breiten-Eigenschaften,  welches skaliert und zentriert werden soll.
 * @param {Object} container erwartet ein DOM-Objekt, ein jQuery-Objekt oder ein anderes Objekt mit Höhen und Breiten-Eigenschaften,  in welches das andere Objekt zentriert/skaliert werden soll
 * @param {Object, Options} opts stellt Optionen bereit so kann angegeben werden, ob es einen Mindestabstand nach oben bzw. links geben soll (margin: [10, false], padding: [10, 0]), ob vertical und / oder horizontal zentriert werden soll. Die scaleToFit-Eigenschaft gibt an, ob bei unterschiedlichen Seitenverhältnissen das innere Objekt vollständig zu sehen sein soll oder ob es das äußere Objekt vollständig ausfüllen soll<br><br>
 * Unterschied zwischen padding und margin: Die margin- und padding-Angaben werden für die evtl. Skalierung des Objekts berücksichtigt. Bei einer möglichen Zentrierung wird dagegen ausschließlich der margin-Wert berücksichtigt. Das padding-Array darf daher nur Zahlen enthalten, das margin-Array darf daneben noch den booleschen Wert false enthalten.
 * Beispiel:<br>
 * $.objScale.scaleObjTo(img, container, {margin: [10, 0], horizontal: false};<br>
 * Es soll nur vertical und nicht horizontal zentriert werden, ausserdem soll der Mindestabstand nach oben 10 Einheiten betragen<br><br>
 * defaults: {margin: [false, false], padding: [0, 0], scaleToFit: false, vertical: true, horizontal: true}
 * @return {Object} gibt ein Objekt mit width, height, top und left Eigenschaften zurück
 */
(function($){
	/**
	 * @id objScaleModule
	 */
	$.objScale = (function(){
	
	/**
	 * @id getDim
	 */
		function getDim(obj){
			var ret;
			if(obj.nodeName){
				obj = $(obj);
			} else if(isFinite(obj.width) && isFinite(obj.height)){
				ret = {width: obj.width, height: obj.height};
			}
			if(!ret){
				if(obj.is('object')){
					ret = {
						height: parseInt(obj[0].height, 10),
						width: parseInt(obj[0].width, 10)
					};
				} else {
					ret = {
						height: obj.height(),
						width: obj.width()
					};
					if(!ret.height && !ret.width && 'naturlaWidth' in obj[0]){
						ret = {
							height: obj[0].naturlaHeight,
							width: obj[0].naturlaWidth
						};
					}
				}
			}
			
			return ret; 
		}
		
		/**
		 * @id scaleTo
		 */
		function scaleTo(obj, num, side){
			var cur = getDim(obj),
				percentage,
				reverseSide = (side == 'height') ?
					'width' :
					'height';
			
			percentage = cur[side] / num;
			return cur[reverseSide] / percentage;
		}
		
		/**
		 * @id scaleHeightTo
		 */
		function scaleHeightTo(obj, height){
			return scaleTo(obj, height, 'height');
		}
		
		/**
		 * @id scaleWidthTo
		 */
		function scaleWidthTo(obj, width){
			return scaleTo(obj, width, 'width');
		}
		
		/**
		 * @id constrainObjTo
		 */
		function constrainObjTo(obj, container, opts){
			opts = $.extend({
				margin: [0, 0],
				padding: [0, 0],
				cleanCSS: true
			}, opts);
			var cur = getDim(obj),
				con = getDim(container),
				maxWidth = con.width - opts.padding[1],
				maxHeight = con.height - opts.padding[0],
				estimatetPer = con.height / con.width,
				curPer = cur.height / cur.width,
				ret = $.extend({},cur);
			
			if(opts.margin[1]){
				maxWidth -=  opts.margin[1] * 2;
			}
			if(opts.margin[0]){
				maxHeight -=  opts.margin[0] * 2;
			}
			if(opts.minWidth){
				maxWidth = Math.max(opts.minWidth, maxWidth);
			}
			if(opts.minHeight){
				maxHeight = Math.max(opts.minHeight, maxHeight);
			}
			if(estimatetPer < curPer && maxHeight < cur.height){
				ret.width = scaleTo(obj, maxHeight, 'height'); 
				ret.height = maxHeight;
			} else if(maxWidth < cur.width){
				ret.width = maxWidth; 
				ret.height = scaleTo(obj, maxWidth, 'width');
			}
			if(!opts.cleanCSS){
				ret.widthSubtraction = ret.width - cur.width;
				ret.heightSubtraction = ret.height - cur.height;
			}
			$.extend(ret, centerObjTo(ret, con, opts));
			return ret;
		}
		
		/**
		 * @id centerObjTo
		 */
		function centerObjTo(obj, container, opts){
			opts = $.extend({
				margin: [0, 0],
				vertical: true,
				horizontal: true
			}, opts);
			var cur = getDim(obj),
				con = getDim(container),
				ret = {};
				
			if(opts.vertical){
				ret.top = (con.height - cur.height) / 2;
				if (isFinite(opts.margin[0])) {
					ret.top = Math.max(ret.top, opts.margin[0]);
				}
			}
			
			if(opts.horizontal){
				ret.left =  (con.width - cur.width) / 2;
				if(isFinite(opts.margin[1])){
					ret.left = Math.max(ret.left, opts.margin[1]);
				}
			}
			return ret;
		}
		
		/**
		 * @id scaleObjTo
		 */
		function scaleObjTo(obj, container, opts){
			opts = $.extend({
				margin: [false, false],
				padding: [0, 0],
				scaleToFit: false
			}, opts);
			
			var cur = getDim(obj),
				con = getDim(container),
				curPer = cur.height / cur.width,
				ret = {};
			
			con.maxHeight = con.height - opts.padding[0];
			con.maxWidth = con.width - opts.padding[1];
			
			if(opts.margin[0]){
				con.maxHeight -= opts.margin[0];
			}
			if(opts.margin[1]){
				con.maxWidth -= opts.margin[1];
			}
			
			var	estimatetPer = con.maxHeight / con.maxWidth;
				
			if(opts.scaleToFit !== estimatetPer > curPer){
				ret.width = con.maxWidth; 
				ret.height = scaleTo(obj, con.maxWidth, 'width');
			} else {
				ret.width = scaleTo(obj, con.maxHeight, 'height'); 
				ret.height = con.maxHeight;
			}
			
			$.extend(ret, centerObjTo(ret, con, opts));
			return ret;
		}
		
		return {
			scaleWidthTo: scaleWidthTo,
			scaleHeightTo: scaleHeightTo,
			scaleSidesIn: scaleObjTo, /* dep */
			scaleObjTo: scaleObjTo,
			constrainObjTo: constrainObjTo,
			getDim: getDim,
			centerObjTo: centerObjTo
		};
	})();
})(jQuery);
/**
 * @author alexander.farkas
 * 
 * Usage Example:
 * 
 * 

$('#photo-index a').each(function(){
	$.imgPreLoad.add($(this).attr('href'));
});

 */
(function($){
	$.imgPreLoad = (function(){
		var srcList 	= [], 
			ready 		= false, 
			started 	= false,
			loaded 		= false,
			errorDelay 	= 5000,
			errorTimer
		;
		
		function createImg(){
			return (window.Image) ? new Image() : document.createElement('img');
		}
			
		function loadImg(src, callback){
			var img = createImg(),
				fn = function(e){
					var that = this, args = arguments;
					clearTimeout(errorTimer);
					$(this).unbind('load error');
					src[1].apply(that, args);
					callback.apply(that, args);
				};
			
			img.src = src[0];
			
			if(!img.complete){
				clearTimeout(errorTimer);
				errorTimer = setTimeout(function(){
					fn.call(img, {type: 'timeouterror'});
				}, errorDelay);
				$(img)
					.bind('load error', fn);
			} else {
				fn.call(img, {type: 'cacheLoad'});
			}
		}
		
		function loadNextImg(){
			if(srcList.length && ready){
				started = true;
				var src = srcList.shift();
				loadImg(src, loadNextImg);
			} else {
				started = false;
			}
		}
		
		function pause(){
			started = false;
			ready = false;
		}
		
		function restart(){
			if(loaded) {
				ready = true;
				loadNextImg();
			}
		}
		
		function loadNow(src, callback){
			pause();
			callback = callback || function(){};
			loadImg([src, callback], restart);
		}
		
		return {
			add: function(src, 	fn, priority){
				fn = fn || function(){};
				src = [src, fn];
				if(priority){
					srcList.unshift(src);
				} else {
					srcList.push(src);
				}
				if(ready && !started){
					loadNextImg();
				}
			},
			loadNow: loadNow,
			ready: function(){
				loaded = true;
				ready = true;
				loadNextImg();
			}
		};
	})();
	if($.windowLoaded){
		$.imgPreLoad.ready();
	} else {
		$(window).bind('load', $.imgPreLoad.ready);
	}
})(jQuery);

/**
 * @author trixta
 */
(function($){
	
	/* Mask */
	
	var maskID = new Date().getTime();
	
	$.widget('ui.overlayProto', {
		hideElementsOnShow: function(){
			var o 		= this.options,
				that 	= this
			;
			
			this.hiddenElements = $([]);
			
			if(o.hideWindowedFlash){
				this.hiddenElements = $('object, embed').filter(function(){
						return !(
								((this.getAttribute('classid') || '').toLowerCase() === 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' || this.getAttribute('type') === 'application/x-shockwave-flash') && //isFlash
										(this.getAttribute('transparent') !== 'transparent' &&
										(/<param\s+(?:[^>]*(?:name=["'?]\bwmode["'?][\s\/>]|\bvalue=["'?](?:opaque|transparent)["'?][\s\/>])[^>]*){2}/i.test(this.innerHTML)))
							);
					});
			}
			
			if(o.hideWhileShown){
				this.hiddenElements = this.hiddenElements.add(o.hideWhileShown);
			}
			
			this.hiddenElements = this.hiddenElements
				.filter(function(){
					
					return ($.css(this, 'visibility') !== 'hidden' && !$.contains( that.element[0], this ));
				})
				.filter(o.hideFilter)
				.css({visibility: 'hidden'});
		}
	});
	
    $.widget('ui.mask', $.ui.overlayProto, {
		options: {
			extraClass: false,
			closeOnClick: true,
			closeOnEsc: true,
			hideFilter: function(){return true;},
			handleDisplay: true,
			fadeInTime: 0,
			fadeOutTime: 0,
			opacity: 0.8,
			bgIframe: false
		},
		_create: function(){
			var o  		= this.options,
				that 	= this,
				css
			;
			maskID++;
			this.id = maskID;
			this.maskedElement = this.element.parent();
			
			if(this.maskedElement.is('body')){
				this.dimensionElement = $(document);
				this.calcMethod = {
					height: 'height',
					width: 'width'
				};
			} else {
				this.dimensionElement = this.maskedElement.css({position: 'relative'});
				this.calcMethod = {
					height: 'innerHeight',
					width: 'innerWidth'
				};
			}
			if($.browser.lteIE6){
				css = {
					top: '0',
					left: '0'
				};
				this.calcSize = true;
			} else {
				css = {
					top: 0,
					left: 0,
					right: 0,
					bottom: 0
				};
				
				this.calcSize = false;
			}
			css.display = 'none';
			css.position = 'absolute';
			
			if(this.maskedElement.is('body') && !$.browser.lteIE6){
				css.position = 'fixed';
			}
			
			this.element.css(css);
			this.isVisible = false;
			if(o.closeOnClick){
				this.element.click(function(e){
					that.hide.call(that, e, this);
				});
			}
			if(o.extraClass){
				this.element.addClass(o.extraClass);
			}
		},
		ui: function(){
			return {
				instance: this
			};
		},
		hide: function(e, elem){
			
			if(!this.isVisible){return;}
			var result 	= this._trigger('close', e, this.ui()),
				o 		= this.options,
				that 	= this
			;
			if(result === false){return;}
			this.isVisible = false;
			
			if(o.handleDisplay){
				if(o.fadeOutTime){
					this.element.fadeOut(o.fadeOutTime, function(){
						that.unexpose.call(that);
					});
				} else {
					this.element.hide();
					this.unexpose();
				}
			}
			this.element.queue(function(){
				if(that.hiddenElements && that.hiddenElements.css){
					that.hiddenElements.css({visibility: 'visible'});
				}
				that.maskedElement.removeClass('mask-visible');
				that.element.dequeue();
			});
			$(document).unbind('.mask'+ this.id);
			$(window).unbind('.mask'+ this.id);
		},
		resize: function(set){
			var ret = {
				'height': this.dimensionElement[this.calcMethod.height]()
			};
			if(!this.options.cssWidth){
				ret.width = this.dimensionElement[this.calcMethod.width]();
			}
			if(set && this.calcSize){
				this.element.css(ret);
			}
			return ret;
		},
		show: function(e, o){
			
			if(this.isVisible){return;}
			o = (o) ? $.extend(true, {}, this.options, o) : this.options;
			var that 	= this,
				resize 	= function(e){
						that.resize.call(that, true);
					}
			;
			if(o.expose){
				this.expose(o.expose);
			}
			
			this._trigger('show', e, $.extend(true, {} , this.ui(), o));
			this.isVisible = true;
			this.maskedElement.addClass('mask-visible');
			this.hideElementsOnShow();
			if(o.handleDisplay){
				if(this.calcSize){
					this.resize(true);
				}
				if(o.fadeInTime){
					this.element.fadeInTo(o.fadeInTime, o.opacity);
				} else {
					this.element.css({opacity: o.opacity, display: 'block'});
				}
			}
			
			if(o.closeOnEsc){
				$(document).bind('keydown.mask'+ this.id, function(e){
					if(e.keyCode === $.ui.keyCode.ESCAPE){
						that.hide.call(that, e, this);
					}
				});
			}
			if (that.calcSize) {
				$(document).bind('resize.mask'+ this.id +' emchange.mask'+ this.id, resize);
				$(window).bind('resize.mask'+ this.id, resize);
			}
		},
		unexpose: function(elem){
			if(!elem && !this.exposed){return;}
			var exposed = elem || this.exposed;
			exposed.each(function(){
				$(this).css({
					position: '',
					zIndex: ''
				});
			});
			if(!elem){
				this.exposed = false;
			}
		},
		expose: function(jElm){
			var zIndex =  parseInt(this.maskedElement.css('z-index'), 10) || 9;
			jElm = this.maskedElement.find(jElm);
			jElm.each(function(){
				var jExpose = $(this);
				if(jExpose.css('position') === 'static'){
					jExpose.css({position: 'relative'});
				}
				zIndex++;
				jExpose.css({
					zIndex: zIndex
				});
			});
			this.exposed = jElm;
		}
	});
		
	/* END: Mask */
	
	/* Content-Overlay */
	
	var currentFocus,
		id 		= new Date().getTime()
	;
		
	$(document).bind('focusin', function(e){
		if(e.target.nodeType == 1){
			currentFocus = e.target;
		}
	});
	
	if(!$.fn.mask){
		$.fn.mask = function(){return this;};
	}
	
	$.widget('ui.cOverlay', $.ui.overlayProto, {
		options: {
			//
			mask: false, //Soll die Seite zusätzlich maskiert werden
			maskOpts: {}, //Optionen für die Maskierung, siehe mask-Plugin im Overlay-Ordner
			hideStyle: 'visibility',
			bgIframe: false, //IE6 bugfix für select-zIndex-Bug
			hideWindowedFlash: 'auto', // Sollen Flashelemente versteckt werden, die kein wmode haben
			hideWhileShown: false, // Selektor von Elementen, DOM-Objekte die während der Anzeige versteckt werden sollen
			hideFilter: function(){return true;}, // funktion zum herausfiltern von Objekten die versteckt werden sollen
			
			extraClass: false, // Zusatzklasse für Overlay-Element
			attrs: {}, //zusätzliche Attribute, für das Overlay-Element
			bodyShowClass: 'overlay-visible', //body-Klasse die gesetzt ist solange das Overlay angezeigt wird (gut für Print-Stylesheets)
			
			positionType: 'centerInsideView', // Name der Funktion im Namespace  $.ui.cOverlay.posMethods bzw die Funktion selbst, welche die Position berechnet 
			positionOpts: {}, //optionen der positions-Funktion
			//mögliche weitere Positionierungs-Optionen
			followMouse: false,
			
			restoreFocus: 'auto', // Ob der Focus beim Schliessen auf das Element gesetzt werden soll, welches vor dem öffnen fokusiert war, bei auto ist dies true, sofern focusOnShow gesetzt wurde
			focusOnShow: false, // Ob das Overlay fokusiert werden soll, wenn es geöffnet wird. Wird ein Selektor angegeben, dann wird dieses Element fokusiert
			
			closeOnEsc: true,
			closeBtnSel: 'a.close-button',
			
			animShow: function(jElm, data){ //Show-Animation (ui.posCSS enthält die berechnete Positionierung und muss gesetzt werden) 
				var showStyle = (data.instance.options.hideStyle == 'visibility') ? {visibility: 'visible'} : {display: 'block'};
				jElm.css(data.posCSS).css(showStyle);
			},
			animHide: function(jElm, data){//Hide-Animation 
				var hiddenStyle = (data.instance.options.hideStyle == 'visibility') ? {visibility: 'hidden'} : {display: 'none'};
				jElm.css(hiddenStyle);
			},
			
			addRole: false, // nonfocussyle: tooltip || alert || focusstyle: alertdialog || dialog 
			createA11yWrapper: 'auto',
			labelledbySel: false,
			describedbySel: false,
			
			//Opener
			openerSel: false, // Elemente (Selektor:String, jQuery:Object, DOM:Object), welche das Overlay öffnen
			openerContext: document, // Kontext (DOM:Object, jQuery:Object) in dem nach openerSel gesucht wird
			bindStyle: 'bind', // Art des Event-Bindings (bind|live)
			
			//opencloseEvents werden durch a11ymode erweitert
			openEvent: 'ariaclick', // mouseenter || click
			closeEvent: false,
			openDelay: 1, //Zeit die vergehen soll bis das overlay geöffnet wird
			closeDelay: 1,
			setInitialContent: false,
			handleElementEnterLeave: false
		},
		customEvents: ['init', 'create', 'beforeshow', 'show', 'beforehide', 'hide'],
		_create: function(){
			this._getMarkupOptions();
			var o 		= this.options,
				that 	= this,
				close 	= function(e){
					var elem = this;
					
					that.timer.clear('openTimer');
					
					that.timer.setDelay('closeTimer', function(){
						that.hide(e, {closer: elem});
					}, o.closeDelay);
					return false;
				},
				show 	= function(e){
					var elem = this;
					if(that.closeTimer !== undefined && (!that.currentOpener || that.currentOpener[0] === elem || elem === that.element[0])){
						that.timer.clear('closeTimer');
					}
					that.timer.setDelay('openTimer', function(){
						that.show(e, {opener: elem});
					}, o.openDelay);
					return false;
				}
			;
			var hideCss = (o.hideStyle === 'visibility') ? {visibility: 'hidden'} : {display: 'none'};
			this.element
				.css(hideCss)
				.attr(o.attrs)
				.attr({'aria-hidden': 'true'})
			;
			
			
			
			if(o.openDelay < 1){
				o.openDelay	= 1;
			}
			this.timer = $.createTimer(this);
			this.mask = $([]);
			
			if(o.mask && o.hideWindowedFlash === 'auto'){
				o.maskOpts = o.maskOpts || {};
				o.hideWindowedFlash = true;
			} else {
				o.hideWindowedFlash = false;
			}
			
			if(o.maskOpts){
				o.maskOpts.hideWindowedFlash = false;
			}
			if(o.extraClass){
				this.element.addClass(o.extraClass);
			}
			
			
			if(o.restoreFocus === 'auto'){
				o.restoreFocus = !!(o.focusOnShow);
			}
			
			id++;
			this.id = 'overlay-'+ id;
			this.isVisible = false;
			this.hiddenElements = $([]);
			this.openers = $([]);
			
			if(o.handleElementEnterLeave){
				this.element.enterLeave(
					function(){
						that.timer.clear('closeTimer');
					},
					close, typeof o.handleElementEnterLeave == 'object' ? o.handleElementEnterLeave : {});
			}
				
			if(o.openerSel){
				this.openers = $(o.openerSel, o.openerContext);
				if(o.openEvent){
					this.openers[o.bindStyle](o.openEvent, show);
				}
				if(o.closeEvent){
					this.openers[o.bindStyle](o.closeEvent, close);
				}
			}
			
			this._trigger('init', {
				type: 'init'
			}, this.ui());
		},
		_lazyAddDocument: function(){
			if(this.isFullInitialized){return;}
			this.isFullInitialized = true;
			var o = this.options;
			
			var that = this;
			
			
			if(o.setInitialContent){
				this.fillContent(this.element, o.setInitialContent);
			}
			
			this.clonedOverlay = this.element.clone().attr({role: 'presentation'}).addClass('cloned-overlay');
			
			this.closeBtn = $(o.closeBtnSel, this.element)
				.bind('ariaclick', function(e){
					that.timer.clear('openTimer');
					that.hide(e, {closer: this});
					return false;
				})
			;
			
			
			if($.support.waiAria){
				if(this.closeBtn[0] && $.nodeName(this.closeBtn[0], 'a')){
					this.closeBtn.removeAttr('href').attr({tabindex: '0', role: 'button'});
				}
				
				if(o.labelledbySel){
					this.element.labelWith($(o.labelledbySel, this.element));
				} 
				
				if(o.describedbySel){
					this.element.describeWith($(o.describedbySel, this.element));
				}
				if(o.addRole){
					this.element.attr('role', o.addRole);
				}
			}
			if(!this.element.parent()[0]){
				this.element.appendTo('body');
			}
			if(o.mask){
				this.mask = $('<div class="mask" />')
					.insertBefore(this.element)
					.mask(
						$.extend(o.maskOpts, 
							{
								close: function(e, ui){
									that.timer.clear('openTimer');
									return that.hide(e, ui);
								}
							}
						)
					);
			}
			if(o.createA11yWrapper === true || (o.createA11yWrapper && this.element.parent().is('body'))){
				var a11yWrapper = this.element.siblings('.a11y-wrapper');
				if(a11yWrapper[0]){
					this.element.appendTo(a11yWrapper[0]);
				} else {
					this.element.wrap('<div class="a11y-wrapper" />');
				}
			}
			if(o.bgIframe && $.fn.bgIframe && parseInt($.browser.version, 10) < 7){
				this.element.bgIframe();
			}
		},
		fillContent: function(element, content, isClone){
			var o = this.options;
			
			element = element || this.element;
			content = content || this.content || {};
			$.each(content, function(name, html){
				if($.isFunction(html)){
					html(name, element, content, isClone);
				} else {
					$('.'+ name, element).html(html);
				}
			});
			if(o.addRole === 'tooltip' || o.addRole === 'alert'){
				$('*', this.element).attr({role: 'presentation'});
			}
		},
		ui: function(){
			var obj = {
						instance: this,
						isVisible: this.isVisible,
						openers: this.openers,
						id: this.id,
						element: this.element
					},
				arg = arguments
			;
			
			for(var i = 0, len = arg.length; i < len; i++){
				if(arg[i]){
					$.extend(obj, arg[i]);
				}
			}
			return obj;
		},
		show: function(e, extras){
			this._lazyAddDocument();
			this.timer.clear('closeTimer');
			this.currentOpener = (extras && extras.opener) ? $(extras.opener) : (e && e.currentTarget) ? $(e.currentTarget) : $(currentFocus);
			extras = extras || {};
			extras.opener = this.currentOpener;
			
			if(this.isVisible || this._trigger('beforeShow', e, this.ui({extras: extras})) === false || this.stopShow){return;}
			this.isVisible = true;
			var o 				= this.options,
				that 			= this,
				posCSS,
				ui
			;
			this.hideElementsOnShow();
			if(o.addRole === 'tooltip' && this.currentOpener){
				this.currentOpener.attr({
					'aria-describedby': this.element.getID()
				});
			}
			
			posCSS = this.setPosition(e, extras);
			
			ui = this.ui({extras: extras, posCSS: posCSS});
			this.mask.mask('show');
			
			o.animShow(this.element.stop(), ui);
			
			this.element.attr({'aria-hidden': 'false'});
			
				
			this.restoreFocus = currentFocus;
			if( o.focusOnShow ){
				if( o.focusOnShow === true ){
					this.element.firstExpOf('focusPoint').setFocus({context: (this.element[0].parentNode || {}).parentNode});
				} else {
					$(o.focusOnShow, this.element).setFocus({context: (this.element[0].parentNode || {}).parentNode});
				}
			}
				
			$('body').addClass(o.bodyShowClass);
			
			if(o.closeOnEsc){
				$(document).bind('keydown.'+ this.id, function(e){
					if(e.keyCode === $.ui.keyCode.ESCAPE){
						that.hide.call(that, e, {closer: this});
					}
				});
			}
						
			this.mask.mask('resize', true);
			this._trigger('show', e, ui);
		},
		hide: function(e, extras){
			if(!this.isVisible){return;}
			var o 		= this.options,
				ui 		= this.ui({extras: extras})
			;
			if(this._trigger('beforeHide', e, ui) === false){return false;}
			
			this.isVisible = false;
			
			if(o.addRole === 'tooltip' && this.currentOpener){
				this.currentOpener.removeAttr('aria-describedby');
			}
			
			
			this.mask.mask('hide');
			
			$(document).unbind('.'+ this.id);
			$(window).unbind('.'+ this.id);
			if (o.restoreFocus && this.restoreFocus) {
				$(this.restoreFocus).setFocus({fast: true});
			}
			
			o.animHide(this.element, ui);
			if(this.removeFlashContent){
				this.removeFlashContent();
			}
			this.element.attr({'aria-hidden': 'true'});
			
			this.hiddenElements.css({visibility: 'visible'});
			this._trigger('hide', e, ui);
			$('body').removeClass(o.bodyShowClass);
			this.restoreFocus = false;
		},
		setPosition: function(e, extras, elem){
			
			elem = elem || this.element;
			var o 	= this.options,
				pos = {};
			e = (e && e.type) ? e : {type: 'unknown'};
			extras = extras || {};
			if(!extras.opener){
				extras.opener = this.currentOpener;
			}
			
			if(typeof o.positionType === 'string' && $.ui.cOverlay.posMethods[o.positionType]){
				
				pos = $.ui.cOverlay.posMethods[o.positionType](elem, e, extras, this);
			} else if($.isFunction(o.positionType)){
				pos = o.positionType(elem, e, extras, this);
			}
			return pos;
		}
	});
	
	$.ui.cOverlay.posMethods = {};
	$.ui.cOverlay.posMethods.position = function(overlay, e, extra, ui){
		var o 	= ui.options,
			target,
			pos
		;
		if(o.followMouse && e.type.indexOf('mouse') != -1){
			target = e;
			$(document).bind('mousemove.'+ ui.id, function(evt){
				var delta = {
						top: e.pageY - evt.pageY,
						left: e.pageX - evt.pageX
					},
					posDelta = {
						top: pos.top - delta.top,
						left: pos.left - delta.left
					}
				;
				overlay.css({
						top: pos.top - delta.top,
						left: pos.left - delta.left
					});
			});
		} else if(o.positionOpts.posTarget || extra.opener){
			target = o.positionOpts.posTarget || ui.currentOpener || extra.opener;
		}
		overlay.position($.extend({}, o.positionOpts, {
			of: target,
			using: function(tmpPos){pos = tmpPos;}
		}));
		return pos;
	};
	$.ui.cOverlay.posMethods.around = function(overlay, e, extra, ui){
		var o 	= ui.options,
			pos
		;
		
		if(!$.posAround){
			setTimeout(function(){
				throw('please install the posAround plugin');
			},0);
			return {};
		}
		
		if(o.followMouse && e.type.indexOf('mouse') != -1){
			pos = $.posAround(overlay, e, o.positionOpts);
			$(document).bind('mousemove.'+ ui.id, function(evt){
				var delta = {
						top: e.pageY - evt.pageY,
						left: e.pageX - evt.pageX
					},
					posDelta = {
						top: pos.top - delta.top,
						left: pos.left - delta.left
					}
				;
				overlay.css({
						top: pos.top - delta.top,
						left: pos.left - delta.left
					});
			});
		} else if(o.positionOpts.posTarget || extra.opener){
			pos = $.posAround(overlay, o.positionOpts.posTarget || extra.opener, o.positionOpts);
		}
		return pos;
	};
	
	$.ui.cOverlay.posMethods.centerInsideView = function(overlay, e, extra, ui){
		var o 	= ui.options,
			doc = $(document),
			pos
		;
		
		if(!$.objScale){
			setTimeout(function(){
				throw('please install the objScale plugin');
			},0);
			return {};
		}
		
		pos = $.objScale.centerObjTo(overlay, $(window), o.positionOpts);
		pos.top += doc.scrollTop();
		pos.left += doc.scrollLeft();
		return pos;
	};
	

	var addFollowScroll = function(overlay, ui){
		var o 	= ui.options,
			timer,
			fn
		;
		if(o.followScroll){
			fn = overlay.data('followScrollFn');
			if(fn){
				$(window).unbind('scroll.'+ ui.id +' resize.'+ ui.id, fn);
			}
			fn = function(e){
				var overlayHeight = overlay.outerHeight(true);
				var viewportHeight = $(window).height();
				if(overlayHeight > viewportHeight - 20){return;}
				var scrolltop = $.SCROLLROOT.scrollTop();
				var overlayTop = overlay.offset().top;
				clearTimeout(timer);
				if(scrolltop > overlayTop - 10 || scrolltop - 10 < overlayTop + overlayHeight){
					timer = setTimeout(function(){
						overlay.animate({top: $.SCROLLROOT.scrollTop()});
					}, 400);
					
				}
			};
			overlay.data('followScrollFn', fn);
			$(window).bind('scroll.'+ ui.id +' resize.'+ ui.id, fn);
		}
	};
	
		
	$.ui.cOverlay.posMethods.centerHorizontalView = function(overlay, e, extra, ui){
		var o 	= ui.options,
			doc = $(document),
			pos
		;
		
		if(!$.objScale){
			setTimeout(function(){
				throw('please install the objScale plugin');
			},0);
			return {};
		}
		
		pos = $.objScale.centerObjTo(overlay, $(window), o.positionOpts);
		pos.top = doc.scrollTop();
		
		if(isFinite(o.marginTop)){
			pos.top += o.marginTop;
		}
		
		pos.left += doc.scrollLeft();
		addFollowScroll(overlay, ui);
		return pos;
	};
	
	$.ui.cOverlay.posMethods.centerHorizontalView.addFollowScroll = addFollowScroll;
	
	
})(jQuery);/**
 * @author alexander.farkas
 */
(function($){
	// helper für createUrlIndex
	var controlState = {};
	$.each({disable: ['-1', 'true', 'addClass'], enable: ['0', 'false', 'removeClass']}, function(name, sets){
		controlState[name] = function(){
			var jElm = $(this);
			if(!jElm.is('span, div')){
				jElm.attr({tabindex: sets[0], 'aria-disabled': sets[1]});
			}
			jElm[sets[2]]('ui-disabled');
		};
	});
		
	$.createUrlIndex = function(anchors, obj){
		var o = obj.options;
		if(!o.nextImgBtn){
			o.nextImgBtn = '.next';
		}
		if(!o.prevImgBtn){
			o.prevImgBtn = '.prev';
		}
		o.srcAttribute = o.srcAttribute || 'href';
		obj.uniqueUrls = [];
		obj.uniqueOpeners = [];
		anchors.each(function(){
			var url = $(this).attr(o.srcAttribute);
			
			// if an opener has not the attribute "o.srcAttribute"
			if(url && $.inArray(url, obj.uniqueUrls) === -1){
				obj.uniqueUrls.push(url);
				obj.uniqueOpeners.push(this);
			}
			
		});
		
		obj.nextBtn = $(o.nextImgBtn, obj.element);
		obj.prevBtn = $(o.prevImgBtn, obj.element);
		obj.playPauseBtn = $('.play-pause', obj.element);
		if ($.support.waiAria) {
			obj.nextBtn.add(obj.prevBtn).add(obj.playPauseBtn)
				.each(function(){
					if($.nodeName(this, 'a')){
						$(this)
							.removeAttr('href')
							.attr({tabindex: '0'});
					}
				})
			;
		}
		obj.currentIndexDisplay = $('.current-index', obj.element).html('1');
		obj.lengthDisplay = $('.item-length', obj.element).html(obj.uniqueUrls.length);
		
		obj.play = function(delay, playAgain){
			if(obj.isPlaying){return;}
			obj.isPlaying = true;
			obj.playPauseBtn.addClass('ui-isplaying').html(o.pauseText);
			if(o.pauseTitle){
				obj.playPauseBtn.attr({
					title: o.pauseTitle
				});
			}
			slideShowLoad((delay) ? o.slideshowDelay : 0, (playAgain !== undefined) ? playAgain : true);
		};
		
		obj.pause = function(){
			if(!obj.isPlaying){return;}
			obj.isPlaying = false;
			obj.playPauseBtn.addClass('ui-isplaying').html(o.playText);
			if(o.playTitle){
				obj.playPauseBtn.attr({
					title: o.playTitle
				});
			} 
			clearTimeout(obj.slideshowTimer);
		};
		
		obj.playPauseToggle = function(time, playAgain){
			obj[(obj.isPlaying) ? 'pause' : 'play'](time, playAgain);
			return false;
		};
		
		
		
		obj.isPlaying = false;
		
		if(obj.uniqueUrls.length > 1){
			
			obj.nextBtn.bind('ariaclick', function(e){
				obj.loadNext(e);
				return false;
			});
			
			obj.prevBtn.bind('ariaclick', function(e){
				obj.loadPrev(e);
				return false;
			});
			
			obj.playPauseBtn.bind('ariaclick', function(){
				obj.playPauseToggle(undefined, true);
				return false;
			});
			
			if(o.addKeyNav){
				obj.element.bind('keydown', function(e){
					var prevent; 
					
					switch(e.keyCode) {
						case $.ui.keyCode.LEFT:
							prevent = obj.loadPrev(e);
							break;
						case $.ui.keyCode.RIGHT:
							prevent = obj.loadNext(e);
							break;
						case $.ui.keyCode.SPACE:
							obj.playPauseToggle();
							break;
					}
					return prevent;
				});
			}
			
		} else {
			if(o.controlsWrapper){
				$(o.controlsWrapper, obj.element).addClass('ui-disabled');
			}
			obj.playPauseBtn.each(controlState.disable);
		}
		
		function slideShowLoad(time, playAgain){
			clearTimeout(obj.slideshowTimer);
			obj.slideshowTimer = setTimeout(function(){
				if(!obj.loadNext({type: 'slideshow'})){
					if(o.carousel || playAgain){
						obj.loadIndex(0, {type: 'slideshow'});
					} else {
						obj.pause();
					}
				}
			}, time || 0);
		}
		
		
		obj.uniqueOpeners = $(obj.uniqueOpeners);
		
		obj.updateIndex = function(url){
			var extendUI = {
				disable: $([]),
				enable: $([])
			};
			
			obj.currentUrl = url;
			obj.currentIndex = $.inArray(url, obj.uniqueUrls);
			obj.currentAnchor = obj.uniqueOpeners.filter(':eq('+ obj.currentIndex +')');
			
			obj.currentIndexDisplay.html(String( obj.currentIndex + 1 ));
			
			
			
			if(obj.currentIndex === 0){
				if(!o.carousel){
					extendUI.disable = obj.prevBtn.each(controlState.disable);
				}
				obj._trigger('indexStartEndReachedChange', {type: 'indexStartReached'}, obj.ui(extendUI));
			} else if(obj.prevBtn.hasClass('ui-disabled')){
				extendUI.enable = obj.prevBtn.each(controlState.enable);
				obj._trigger('indexStartEndReachedChange', {type: 'indexStartReachedChanged'}, obj.ui(extendUI));
			}
			if(obj.uniqueUrls.length <= obj.currentIndex + 1){
				if(!o.carousel){
					obj.pause();
					extendUI.disable = obj.nextBtn.each(controlState.disable);
				}
				obj._trigger('indexStartEndReachedChange', {type: 'indexEndReached'}, obj.ui(extendUI));
			} else if(obj.nextBtn.hasClass('ui-disabled')){
				extendUI.enable = obj.nextBtn.each(controlState.enable);
				obj._trigger('indexStartEndReachedChange', {type: 'indexEndReachedChanged'}, obj.ui(extendUI));
			}
		};
		
		obj.loadIndex = function(index, e){
			if(typeof index === 'string' && index * 1 !== index){
				index = $.inArray(index, obj.uniqueUrls);
			}
			if(index === obj.currentIndex || index === -1){return false;}
			var nextAnchor 	= obj.uniqueOpeners.filter(':eq('+ index+ ')'),
				oldAnchor 	= obj.currentAnchor,
				url, urlPart, type
			;
			
			if(nextAnchor[0]){
				url = nextAnchor.attr(o.srcAttribute);
				urlPart = url.split('?')[0];
				type = nextAnchor.attr('type') || '';
				type = [type, type.split('/')];
				e = e || {type: 'loadIndex'};
				obj.updateIndex(url);
				obj.element.addClass('loading');
				if(obj.mask){
					obj.mask.addClass('loading-mask');
				}
				o.hideContentAnim(obj, e, {oldAnchor: oldAnchor, index: index, opener: nextAnchor, content: obj.content});
				
				if(o.addLiveRegion){
					$('div.content-box', obj.element).attr({
						'aria-busy': 'true'
					});
				}
				
				$.each($.createUrlIndex.mmContent.types, function(name, mmHandler){
					if(mmHandler.filter(url, nextAnchor, urlPart, type)){
						mmHandler.load(url, nextAnchor, obj, function(url, width){
							var uiEvent = {oldAnchor: oldAnchor, index: index, opener: nextAnchor, instance: obj};
							uiEvent.content = obj.content;
							obj.options.getTextContent(nextAnchor, obj.content, obj);
							o.showContentAnim(obj, obj.content['multimedia-box'], e, uiEvent);
							obj._trigger('indexchange', e, uiEvent);
							obj.element.queue(function(){
								obj.element.removeClass('loading');
								if(obj.mask) {
									obj.mask.removeClass('loading-mask');
								}
								obj.element.dequeue();
							});
							if(obj.isPlaying){
								slideShowLoad(o.slideshowDelay);
							}
							if(o.addLiveRegion){
								$('div.content-box', obj.element).attr({'aria-live': 'polite', 'aria-busy': 'false'});
							}
						});
						return false;
					}
					return undefined;
				});
				return true;
			}
			return false;
		};
		
		obj.loadNext = function(e){
			var retVal = obj.loadIndex(obj.currentIndex + 1, e);
			if(retVal === false && o.carousel){
				retVal = obj.loadIndex(0, e);
			}
			return retVal;
		};
		
		obj.loadPrev = function(e){
			var retVal = obj.loadIndex(obj.currentIndex - 1, e);
			if(retVal === false && o.carousel){
				retVal = obj.loadIndex(obj.uniqueOpeners.length - 1, e);
			}
			return retVal;
		};
	};
	
	$.createUrlIndex.mmContent = {
		types: {},
		add: function(name, obj){
			this.types[name] = obj;
		}
	};
	
	var imgReg = /\.jpg$|\.jpeg$|\.gif$|\.png$/i;
	
	$.createUrlIndex.mmContent.add('img', {
		filter: function(url, opener, urlPart, type){
			if(type[1][0] === 'image' || opener.is('.img, .image, .picture')){
				return true;
			}
			return (imgReg.test(urlPart));
		},
		load: function(url, opener, ui, fn){
			var inst = ui.instance || ui;
			$.imgPreLoad.loadNow(url, 
				function loadImg(e){
					var imgWidth 	= this.width,
						jElm 		= $(this)
					;
					
					if(ui.extras){
						ui.extras.mm = jElm;
					}
					inst.content = {
						'multimedia-box': jElm
					};
					fn(url, imgWidth);
					
				}
			);
		}
	});
})(jQuery);
/**
 * @author alexander.farkas
 */
(function($){
	$.addOuterDimensions = function(jElm, dim, dir){
		var adds = (dir === 'height') ? ['Top', 'Bottom'] : ['Left', 'Right'];
		$.each(['padding', 'border', 'margin'], function(i, css){
			if(css !== 'border'){
				dim += parseInt( jElm.css(css + adds[0]), 10) || 0;
				dim += parseInt( jElm.css(css + adds[1]), 10) || 0;
			} else {
				dim += parseInt( jElm.css(css + adds[0] +'Width'), 10) || 0;
				dim += parseInt( jElm.css(css + adds[1] +'Width'), 10) || 0;
			}
		});
		return dim;
	};
	
	$.fn.showbox = function(opts){
		opts = $.extend(true, {}, $.fn.showbox.defaults, opts);
		opts.openerSel = this;
		
		var init = false;
		var scrollerUpdateTimer;
		if(typeof opts.getTextContent == 'string'){
			if(!$.fn.showbox.getContentMethods[opts.getTextContent]){
				console.log('could not find opts.getTextContent: '+ opts.getTextContent);
				opts.getTextContent = $.fn.showbox.getContentMethods.standard;
			} else {
				opts.getTextContent = $.fn.showbox.getContentMethods[opts.getTextContent];
			}
		}
		
		var lightbox = $(opts.structure)
			.bind('coverlayinit', function(e, ui){
				
				var inst 	= ui.instance,
					o 		= inst.options
				;
				
				$.createUrlIndex(inst.openers, inst);
				
				inst.widthElement = (inst.element.is(o.widthElementSel)) ? inst.element : $(inst.options.widthElementSel, inst.element);
				
				inst.calcWidth = function(img, initialWidth){
					var width 	= initialWidth || img[0].width,
						elem 	= img
					;
					if(width == 'auto'){
						return width;
					}
					if (!width) {
						return false;
					}
					if(!elem.is || !elem.parent){
						if(inst.clonedOverlay.parent()[0]){
							elem = $('div.multimedia-box', inst.clonedOverlay);
						} else {
							elem = $('div.multimedia-box', inst.element);
						}
					}
					while(!elem.is(o.widthElementSel) && elem[0]){
						width = $.addOuterDimensions(elem, width, 'width');
						elem = elem.parent();
					}
					return width;
				};
				
			})
			.bind('coverlayindexchange', function(e, ui){
				var media = $('audio, video', ui.instance.element);
				if(media && media.pause){
					media.pause();
				}
				if(ui.instance.scroller){
					var i = 0;
					ui.instance.scroller.atomElem.removeClass('active-showbox-item');
					$(ui.instance.scroller.atomElem.eq(ui.index)).addClass('active-showbox-item');
					
					ui.instance.scroller.stageWidthUpdate();
					clearInterval(scrollerUpdateTimer);
					scrollerUpdateTimer = setInterval(function(){
						
						if(!ui.instance.scroller.stageWidthUpdate()){
							ui.instance.scroller.moveTo('centerTo'+ui.index);
							if(i < 5){
								clearInterval(scrollerUpdateTimer);
								setTimeout(function(){
									if(ui.instance.scroller.stageWidthUpdate()){
										ui.instance.scroller.moveTo('centerTo'+ui.index);
									}
								}, 400);
							}
						}
						if(i > 30){
							clearInterval(scrollerUpdateTimer);
						}
						i++;
					}, 90);
				}
			})
			.bind('coverlaybeforeshow', function(e, ui){
				if(!init){
					init = true;
					
					$('span.overlay-control', ui.instance.element)
						.inOut(
							function(){
								$(this).addClass('over-control');
							},
							function(){
								$(this).removeClass('over-control');
							}, 
							{mouseDelay: 200}
						)
					;
					
					if(opts.generateScroller){
						var teaser = opts.getScrollerTeaser(ui.instance);
						ui.instance.scroller = $(opts.scrollerTemplate)
							.find('div.pg-rack-design')
							.html(teaser)
							.end()
							.appendTo($('div.content-box', this))
							.scroller($.extend(opts.scrollerOpts, {atoms: teaser}))
							.data('scroller')
						;
						teaser.bind('click', function(e){
							ui.instance.loadIndex(teaser.index(this, e));
							return false;
						});
						ui.instance.scroller.element.clone().appendTo($('div.content-box', ui.instance.clonedOverlay));
					}
					
					
				}
				if(!ui.extras.mm){
					var inst 	= ui.instance, 
						url 	= ui.extras.opener.attr('href'),
						urlPart = url.split('?')[0],
						type 	= ui.extras.opener.attr('type') || ''
					;
					type = [type, type.split('/')];
					inst.mask.addClass('loading-mask').mask('show');
					
					$.each($.createUrlIndex.mmContent.types, function(name, mmHanlder){
						if(mmHanlder.filter(url, inst.currentOpener, urlPart, type)){
							mmHanlder.load(url, inst.currentOpener, ui, function(url, width){
								
								inst.options.getTextContent(inst.currentOpener, inst.content, inst);
								
								inst.fillContent();
								
								width = inst.calcWidth(ui.extras.mm, width);
								if(width){
									inst.widthElement.css({
										width: width
									});
								}
								
								inst.stopShow = false;
								inst.updateIndex(url);
								
								inst.show(e, ui.extras);
								
								inst._trigger('indexchange', e, {oldAnchor: null, index: inst.currentIndex, opener: inst.currentOpener, content: inst.content, instance: inst});
								inst.mask.removeClass('loading-mask');
							});
							return false;
						}
						return undefined;
					});
					
					inst.stopShow = true;
				}
			})
			.bind('coverlayshow', function(e, ui){
				var inst = ui.instance;
				if(inst.options.slideShowAutostart){
					inst.play(true);
				}
			})
			.bind('coverlayhide', function(e, ui){
				ui.instance.pause();
				$('div.content-box', ui.element).removeAttr('aria-live').removeAttr('aria-busy');
			})
			.cOverlay(opts);
		
		return (opts.returnOverlay) ? lightbox : this;
	};
	
	$.fn.showbox.defaults = {
		returnOverlay: false,
		mask: true,
		maskOpts: {
			fadeInTime: 600
		},
		focusOnShow: 'h1.showbox-title',
		addRole: 'dialog',
		positionType: 'centerHorizontalView',
		followScroll: true,
		widthElementSel: '.content-box',
		structure: '<div class="showbox">' +
			'<div class="showbox-box">'+
				'<div class="showbox-head">'+
					'<h1 class="showbox-title"></h1>'+
					'<span class="showbox-toolbar">'+ 
						'<a role="button" class="prev prev-btn" href="#" /> <a role="button" class="next next-btn" href="#" />'+
						' <a class="play-pause" role="button" href="#" />'+ 
						' <span class="current-index" /> / <span class="item-length" />'+
					'</span>'+
				'</div>'+
				'<div class="content-box"><div class="multimedia-box-wrapper"><span class="prev overlay-control"><span /></span> <span class="next overlay-control"><span /></span><div class="multimedia-box"></div></div><div class="text-content"></div></div>'+
				' <a role="button" class="close-button" href="#"></a>'+
			'</div>'+
		'</div>',
		getTextContent: 'standard',
		addKeyNav: true,
		addLiveRegion: true,
		showContentAnim: function(ui, img, e, extras){
			var contentBox 	= $('div.content-box', ui.element);
			
			contentBox
				.queue(function(){
					ui.fillContent();
					
					ui.widthElement.css({width: ui.calcWidth(img)});
					
					contentBox.fadeTo(300, 1);
					contentBox.dequeue();
				});
		},
		hideContentAnim: function(ui){
			var contentBox = $('div.content-box', ui.element);
			contentBox.fadeTo(300, 0);
		},
		animHide: function(jElm, data){//Hide-Animation 
			var hiddenStyle = (data.instance.options.hideStyle == 'visibility') ? {visibility: 'hidden'} : {display: 'none'};
			jElm.css(hiddenStyle);
			
			var mm = $('div.multimedia-box', jElm);
			if(window.swfobject && $('object', mm)[0]){
				swfobject.removeSWF($('object', mm).getID());
			} else {
				mm.empty();
			}
		},
		controlsWrapper: '.showbox-toolbar', // versteckt toolar wenn nur ein Bild - optionen: false 
		slideShowAutostart: false,
		slideshowDelay: 4000,
		playTitle: '',  // title text play button 
		playText: 'play',
		pauseText: 'pause',
		pauseTitle: '', // title text Pause button 
		generateScroller: false,
		scrollerOpts: {
			prevLink: 'div.pg-prev span', 
			nextLink: 'div.pg-next span',
			hidingWrapper: 'div.pg-rack',
			moveWrapper: 'div.pg-rack-design'
		},
		getScrollerTeaser: function(inst){
			return inst.uniqueOpeners.closest('dl').clone();
		},
		scrollerTemplate: '<div class="photogroup-wrapper"><div class="pg-pager"><div class="pg-prev"><span> </span></div><div class="pg-next"><span> </span></div></div><div class="pg-rack"><div class="pg-rack-design"></div></div></div>'
	};
	
	$.fn.showbox.getContentMethods = {
		standard: function(opener, content, ui){
			content['text-content'] = opener.prop('title') || "";
		},
		dl: function(opener, content, ui){
			// Um Text aus einer dl-Structure zu holen (Magnolia-Style)
			
			var dl 				= opener.closest('dl'), //hole das nächst höhere dl
				dds				= $('dd', dl), // hole die dd
				img 			= $('img', dl), // hole das img 
				extraContent	= ''
			;
			
			//content objekt dient zur befüllung der lightbox mit weiterem content
			//die eigenschaftsnamen stimmen mit den Klassen-Namen überein
			
			//content['multimedia-box'] ist bereits mit dem grossen Bild vorbelegt
			//und wird nun mit dem alt Attribut des kleinen Bildes versehen
			if(content['multimedia-box'] && content['multimedia-box'].attr){
				content['multimedia-box'].attr('alt', img.attr('alt'));
			}
			
			content['text-content'] = ''; // String in dem wir unser gesamt content zusammefügen
			
			dds.each(function(){
				var dd 		= $(this),
					html 	= dd.html()
				;
				if(dd.is('.caption')){
					content['text-content'] += '<h2 class="caption">'+ html +'</h2>';
					content['showbox-title'] = html;
				} else if(dd.is('.longdesc')){
					content['text-content'] += '<p class="longdesc">'+ html +'</p>';
				} else if(!dd.is('.zoom')) {
					extraContent += '<li class="'+ this.className +'">'+ html +'</li>';
				}
			});
			
			if(extraContent){
				content['text-content'] += '<ul class="sb-extra">'+ extraContent +'</ul>';
			}
		}
	};
	
	$.ui.cOverlay.posMethods.constrainInsideView = function(overlay, e, extra, ui){
		var o 			= ui.options,
			doc 		= $(document),
			pos
		;
		
		if(!$.objScale){
			setTimeout(function(){
				throw('please install the objScale plugin');
			},0);
			return {};
		}
		
		$.swap(overlay[0], { position: "absolute", visibility: "hidden", display:"block" }, function(){
			var imgDim		= {},
				dim 		= {};
			o.positionOpts.cleanCSS = false;
			pos = $.objScale.constrainObjTo(overlay, $(window), o.positionOpts);
			if(extra.mm.css && extra.mm.attr && extra.mm[0]){
				imgDim = $.objScale.getDim(extra.mm);
				
				imgDim = $.objScale.constrainObjTo(imgDim, {
					width: imgDim.width + pos.widthSubtraction,
					height: imgDim.height + pos.heightSubtraction
				});
			
				dim.width = imgDim.width;
				dim.height = imgDim.height;
				extra.mm.css(dim).attr(dim);
				overlay.css('width', ui.calcWidth(extra.mm, dim.width));
				pos = $.objScale.constrainObjTo(overlay, $(window), o.positionOpts);
				extra.mm.css({width: 'auto', margin: 'auto', display: 'block'});
			}
			
		});
		
		
		
		pos.top += doc.scrollTop();
		pos.left += doc.scrollLeft();
		
		delete pos.widthSubtraction;
		delete pos.heightSubtraction;
		$.ui.cOverlay.posMethods.centerHorizontalView.addFollowScroll(ui.element, ui);
		return pos;
	};
	
	$.ui.cOverlay.posMethods.constrainHorizontalView = function(overlay, e, extra, ui){
		var o 	= ui.options,
			pos = $.ui.cOverlay.posMethods.constrainInsideView(overlay, e, extra, ui)
		;
		pos.top = $(document).scrollTop();
		return pos;
	};
	
})(jQuery);/**
 * @author   Christian Ringele christian.ringele [at] magnolia-cms.com
 * @version  1.0 2010-01-20
 * 
 * 
 * jquery.gatracker.js - Monitor events with Google Analytics ga.js tracking code
 * 
 * Requires jQuery 1.2.x or higher (for cross-domain $.getScript)
 * 
 * Used some elements of qGoogleAnalytics of David Simpson  david.simpson [at] nottingham.ac.uk
 * (http://davidsimpson.me/2008/06/18/jgoogleanalytics-google-analytics-integration-for-jquery/) 
 * who built upon gaTracker (c)2007 Jason Huck/Core Five Creative 
 * (http://devblog.jasonhuck.com/2007/11/19/google-analytics-integration-with-jquery/)
 *    http://plugins.jquery.com/files/jquery.gatracker.js_0.txt  
 * 
 * Implemented features by David Simpsons qGoogleAnalytics;
 * - clicks events
 * - form submit events
 * - cross subdomain
 * - cross domain (e.g. for eCommerce payment gateways hosted externally)
 * - new organic search engines
 * - all the features of Jason Hucks GA jQuery integration
 *      
 * Changes and added features to David Simpsons version of qGoogleAnalytics:
 * - tracking of anchor links on pages (href starting with #) 
 * - enabling/disabling possibilities of all link tracking options (external-, maitlo-, anchor- & download-links)
 * - standardizing the default values (null where no booelan is expected, null=not tracked)
 *  
 * @param {String} trackerCode
 * @param {Object} options see setings below
 *    
 * usage: 
 *	 $.qGoogleAnalytics( 'UA-XXXXXX-X');
 *	 $.qGoogleAnalytics( 'UA-XXXXXX-X', {trackLinksEnabled: true, pageViewsEnabled: false} );
 * 
 */

(function($) { // make available to jQuery only

	$.mgnlGoogleAnalytics = function (trackerCode, options)
	{
		
		settings = $.extend({
			//events tracking
			clickEvents:         null,          // e.g. {'.popup': '/popup/nasty'}
			evalClickEvents:     null,          // e.g. {'#menu li a': "'/tabs/'+ $(this).text()"}
			submitEvents:        null,          // e.g. {'#personUK': '/personsearch/uk'}
			evalSubmitEvents:    null,          // e.g. {'#menu li a': "'/tabs/'+ $(this).text()"}

			//link tracking
			trackLinksEnabled:   false,         // enables the link tracking (external-, maitlo-, anchor- & download-links)			
			externalPrefix:	     null,          // prefix to add to external links e.g. '/external/'
			mailtoPrefix:		 null,          // prefix to add to email addresses e.g. '/mailtos/'
			anchorPrefix:	     null,          // prefix to add to anchors (href starting with #) e.g. '/anchors/'
			downloadPrefix:	     null,          // prefix to add to downloads e.g. '/downloads/'
			downloadExtensions:  [              
					               'pdf','doc','xls','ppt','docx','xlsx','pptx',
					               'odt','odp','ods','csv','txt','jpg','jpeg','jpx',
					               'gif','png','bmp','swf','zip','gz','tar','rar',
					               'dmg','xml','js','mp3','wav','mov','mpg','mpeg','avi'
			                     ],	           // tracked files extensions of downloads
			                     
			//domain tracking                 
			crossDomainSelector: null,          // e.g. 'a.crossDomain'
			domainName:          null,          // e.g. 'nottingham.ac.uk'
			
			//misc tracking options
			organicSearch:       null,		    // e.g. {'search-engine': 'query-term', 'google.nottingham.ac.uk': 'q'}
			pageViewsEnabled:    true,          // can be disabled e.g. if only tracking click events
			sampleRate:          null           // e.g. 50 - set the sample rate at 50%
		});
		
		if (options)
		{
			$.extend(settings, options);
		} 
		
		init();
		



		/****** methods *******/
				
		/**
		 * Initialise the tracking code and add any optional functionality
		 */
		function setupTracking()
		{
			// Get the tracking code
			var pageTracker = _gat._getTracker(trackerCode);
				
			// Track visitor across subdomain
			if (settings.topLevelDomain)
			{
				pageTracker._setDomainName(settings.topLevelDomain);
			}
			
			// Set the sample rate - for very busy sites
			if (settings.sampleRate)
			{
				pageTracker._setSampleRate(settings.sampleRate);
			}
			
			// Track visitor across domains		
			if (settings.crossDomainSelector)
			{
				// ignore domain names
				pageTracker._setDomainName('none');
				pageTracker._setAllowLinker(true);
				
				// Add submit event to form selector e.g. form.crossDomain
				$('form' + settings.crossDomainSelector).submit(
					function()
					{
						pageTracker._linkByPost(this);
						// console.debug('crossDomain ._linkByPost');
					}
				);
				// Add a click event to anchor selector e.g. a.crossDomain
				$('a' + settings.crossDomainSelector).click(
					function()
					{
						pageTracker._link( $(this).attr('href') );
						// console.debug('crossDomain ._link: ' + $(this).attr('href'));
					}
				);				
				// Add click event to link
			}
			
			// Add organic search engines as required
			if (settings.organicSearch)
			{
				$.each(
					settings.organicSearch, 
					function(key, val)
					{
						pageTracker._addOrganic(key, val);
						// console.debug('_addOrganic: ' + key);
					}
				);
			}
			
			// check that this is the correct place
			pageTracker._initData();
			// console.debug('_initData');
			
			addTracking(pageTracker);		
		}
		
		/**
		 * 
		 */
		function addTracking(pageTracker)
		{		
			// 1. Track event triggered 'views'
					
			// loop thru each link on the page
			if (settings.trackLinksEnabled)
			{
				// From: http://plugins.jquery.com/files/jquery.gatracker.js_0.txt
				$('a').each(function(){
					var u = $(this).attr('href');
					
					if(typeof(u) != 'undefined'){
						var newLink = decorateLink(u);
	
						// if it needs to be tracked manually,
						// bind a click event to call GA with
						// the decorated/prefixed link
						if (newLink.length)
						{
							$(this).click(
								function()
								{
									pageTracker._trackPageview(newLink);
									//console.debug('linkClick: ' + newLink);
								}
							);
						}
					}				
				});
			}
			
			// loop thru the clickEvents object
			if (settings.clickEvents)
			{
				$.each(settings.clickEvents, function(key, val){
					$(key).click(function(){
						pageTracker._trackPageview(val);
						// console.debug('clickEvents: ' + val);

					})
				});
			}

			// loop thru the evalClickEvents object
			if (settings.evalClickEvents)
			{
				$.each(settings.evalClickEvents, function(key, val){
					$(key).click(function(){
						evalVal = eval(val)
						if (evalVal != '')
						{
							pageTracker._trackPageview(evalVal);
							// console.debug('evalClickEvents: ' + evalVal);
						}
					})
				});			
			}
			
			// loop thru the evalSubmitEvents object
			if (settings.evalSubmitEvents)
			{
				$.each(settings.evalSubmitEvents, function(key, val){
					$(key).submit(function(){
						evalVal = eval(val)
						if (evalVal != '')
						{
							pageTracker._trackPageview(evalVal);
							// console.debug('evalSubmitEvents: ' + evalVal);
						}						
					})
				});
			}
			
			// loop thru the submitEvents object
			if (settings.submitEvents)
			{
				$.each(settings.submitEvents, function(key, val){
					$(key).submit(function(){
						pageTracker._trackPageview(val);
						// console.debug('submitEvents: ' + val);
					})
				});
			}

			// 2. Track normal page views
			if (settings.pageViewsEnabled)
			{
				pageTracker._trackPageview();	
				// console.debug('pageViewsEnabled');
			}
			else
			{
				// console.debug('pageViewsDisabled');		
			}
		}

		// From: http://plugins.jquery.com/files/jquery.gatracker.js_0.txt
		// Returns the given URL prefixed if it is:
		//		a) a link to an external site
		//		b) a mailto link
		//		c) a downloadable file
		//      d) a anchor link (starting with # in href)
		// ...otherwise returns an empty string.
		function decorateLink(uri)
		{
			var trackingUri = '';
			
			// check if internal link
			if (uri.indexOf('://') == -1 && uri.indexOf('mailto:') != 0)
			{
				// check if download links shall be tracked
				if(settings.downloadPrefix){
				
					// no protocol or mailto - internal link - check extension
					var ext = uri.split('.')[uri.split('.').length - 1];			
					var exts = settings.downloadExtensions;
					
					for(i=0; i < exts.length; i++)
					{
						if(ext == exts[i])
						{
							// external link - decorate
							trackingUri = settings.downloadPrefix + uri;
							break;
						}
					}		
				}
				
				//Check if anchors on page shall be tracked
				if(settings.anchorPrefix){
					if(uri.indexOf('#') == 0 && uri.length>1){
						//anchor link - decorate
						var pageUrl = window.location.pathname;
						var indexHtml = pageUrl.indexOf('.html');
						pageUrl = pageUrl.substring(0, indexHtml);
						trackingUri = settings.anchorPrefix+ pageUrl+'.'+ uri.substring(1);
					}
				}
			} 
			else // is not internal link -> mail or external link
			{
				// check if mailto link
				if (uri.indexOf('mailto:') == 0) 
				{
					//Check if mailto links shall be tracked
					if(settings.mailtoPrefix){
						// mailto link - decorate
						trackingUri = settings.mailtoPrefix + uri.substring(7);	
					}
				} 
				else // is external link
				{
					// check if external links shall be tracked
					if(settings.externalPrefix){
						// complete URL - check domain
						var regex     = /([^:\/]+)*(?::\/\/)*([^:\/]+)(:[0-9]+)*\/?/i;
						var linkparts = regex.exec(uri);
						var urlparts  = regex.exec(location.href);
											
						if (linkparts[2] != urlparts[2])
						{
							// external link - decorate
							trackingUri = settings.externalPrefix + uri;
						}
					}
				}
			}
			
			return trackingUri;			
		}
		
		/**
		 * load ga.js and add the tracking code
		 */		
		function init()
		{
			
			try
			{
				// determine whether to include the normal or SSL version
				var gaUrl = (location.href.indexOf('https') == 0 ? 'https://' : 'http://');
				gaUrl += 'stats.g.doubleclick.net/dc.js';
				
				// load ga.js with caching
				return $.ajax({
					type: 'GET',
					url: gaUrl,  // Store the tracking JS locally & update weekkly (??)
					dataType: 'script',
					cache: true,
					success: function() {  
						// console.debug('ga.js loaded!'); 
						setupTracking(); 
					},
					error: function() { 
						// console.error('ajax GET failed'); 
					}
				});	
			} 
			catch(err) 
			{
				// log any failure
				// console.error('Failed to load Google Analytics:' + err);
			}	
			
			return false;		
		}	
	} 
	
	
})(jQuery);	
/*ends*/




            jQuery.noConflict();
            (function($){
            	$(document).ready(function(){
                    $.mgnlGoogleAnalytics(
                         'UA-53370595-2',
                         {
                        	 
                            //events tracking
             				clickEvents:         null,                // e.g. {'.popup': '/popup/nasty'}
             				evalClickEvents:     null,            // e.g. {'#menu li a': "'/tabs/'+ $(this).text()"}
             				submitEvents:        null,               // e.g. {'#personUK': '/personsearch/uk'}
             				evalSubmitEvents:    null,           // e.g. {'#menu li a': "'/tabs/'+ $(this).text()"}
             				
             				//link tracking
             				trackLinksEnabled:   false,      // default=false, enables the link tracking (external-, maitlo-, anchor- & download-links)
             				externalPrefix:      null,       // prefix to add to external links e.g. '/external/'
             				mailtoPrefix:        null,         // prefix to add to email addresses e.g. '/mailtos/'
             				anchorPrefix:        null,         // prefix to add to anchors (href starting with #) e.g. '/anchors/'
             				downloadPrefix:      null,       // prefix to add to downloads e.g. '/downloads/'
             				downloadExtensions: [
             				             	     	'pdf','docx','xls','xlsx','ppt','pptx','odt','odp','ods','pages','key','numbers','csv','txt','jpg','jpeg','jpx','gif','png','bmp','tiff','swf','zip','gz','tar','rar','dmg','xml','js','mp3','wav','mov','mpg','mpeg','avi'      // tracked files extensions of downloads e.g. 'pdf','doc','xls'   
             				             	     ],                                       
             				
             				//domain tracking
             				crossDomainSelector: null,  // e.g. 'a.crossDomain'
             				domainName:          null,           // e.g. 'nottingham.ac.uk'  
             				
             				//misc tracking options
                 			organicSearch:       null,		       // e.g. {'search-engine': 'query-term', 'google.nottingham.ac.uk': 'q'}
                 			pageViewsEnabled:    true,        // default=true, can be disabled e.g. if only tracking click events
                 			sampleRate:          null                                // e.g. 50 - set the sample rate at 50%
                         }
                     );
            	});
            })(jQuery);




