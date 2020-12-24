/**
 * @author alexander.farkas
 */

jQuery.noConflict();
(function($){
	var themePath = (window.magnoliaFrontendData ? magnoliaFrontendData.themePath : '') || '';

	$.webshims.setOptions({
		waitReady: false,
		extendNative: false,
		basePath: themePath + "js/shims/",
		'forms': {
			customMessages: true,
			replaceValidationUI: true
		},
		mediaelement: {
			player: 'jaris'
		}
	});

	$.webshims.polyfill('forms forms-ext');

	function callOnDomReady(){
		
		$('audio, video').media2Flowplayer({
			playerName: 'flowplayer-3-2-15.swf',
			path: themePath + 'js/mediaplayer/',
			controlsName: 'flowplayer.controls-3-2-14.swf'
		});

		addPrintLink();

		//wait for the swfobject DOM-Ready, so we can return a proper reference to flash object
		swfobject.addDomLoadEvent(function(){
			$('div.flash').embedSWF();
		});



		//different tabs
		$('ol.text-box-toc, ol.toc-box-toc').tabtree();
		createSuperAccordion();

		//Teaser-Switchers

		$('div.teaser-wrapper:not(.tw-paging,.tw-slider)')
			.each(function(){
				$('div.pager', this).append('<div class="prev"><span /></div><div class="next"><span /></div>');
				$(this).scroller();
			})
		;

		pagingTeaserSwitcher();
		slidingTeaserSwitcher();

		createShowBox();

		slidingTabs();


		$.socialbookmark.init('li.social-b a');

	}


	function createShowBox(){
		var showboxCFG = {
				setInitialContent: {
					'showbox-title': $('h1').html(),
					prev: 'previous',
					next: 'next',
					'close-button': 'close',
					'play-pause': 'play'
				},
				getTextContent: 'dl'
			};

		$('div.tw-images').each(function(){

			$('a[rel=showbox]', this)
				.addClass('showboxed')
				.showbox($.extend({}, showboxCFG, {
					setInitialContent: {
						'showbox-title': $(':header', this).html(),
						prev: 'previous',
						next: 'next',
						'close-button': 'close',
						'play-pause': 'play'
					}
				}));
		});
		$('a[rel=showbox]:not(.showboxed)').showbox(showboxCFG);
	}



	function slidingTabs(){
		$.fn.mySlide = function(fn){
			fn = fn || function(){};
			return this.animate({
				height: 'toggle',
				opacity: 'toggle'
			}, {
				duration: 500,
				complete: fn,
				deque: true
			});
		};

		$('ol.superpromos-toc')
			.each(function(){
				$(this)
					.bind('tabtreecollapse', function(e, ui){
						ui.panel
							.stop(true, true)
							.animate({
								height: 'hide',
								opacity: 0
							}, {duration: 500});
					})
					.bind('tabtreeexpand', function(e, ui){
						ui.panel
							.stop(true, true)
							.animate({
								height: 'show',
								opacity: 1
							}, {duration: 500});
					})
					.tabtree(
						{activeButtonClass: 'on',
						selectEvents: 'mouseenter focus',
						handleDisplay: 'initial'
					})
					.find('a')
					.bind('click', function(e){

						if(e.pageX !== 0 && e.pageY !== 0){
							var url = $($(this).attr('href'))
								.find('a:first')
								.attr('href');
							if(url){
								location = url;
							}
						}
					});
			});


	}

	function pagingTeaserSwitcher(){
		function myPag(status){
			if(status == 'inactive'){
				$('button',this).animate({opacity: 0.5},{duration: 500});
			} else {
				$('button',this).animate({opacity: 1},{duration: 500});
			}
		}
		function myLink(status){
			if(status == 'show'){
				this.animate({opacity: 1},{duration: 500});
			} else {
				this.animate({opacity: 0},{duration: 500});
			}
		}
		$('div.teaser-wrapper.tw-paging').scroller({
			pagination: 'div.pagination',
			paginationFn: myPag,
			linkFn: myLink,
			paginationTitleFrom: 'h2'
//			,paginationAtoms: '<li class="pa-$number" title="$title"><a href="#">$number</a></li>'
		});
	}

	function slidingTeaserSwitcher(){

		var linkSliderScroller = function(){

			var teaserScroller = $(this),
				slider = $('div.slider', this)
			;

			slider
				.css({display: 'block'})
				.wrap('<div class="slider-bar" />')
			;

			$('div.slider-bar', this).append('<span class="prev" /> <span class="next" />');

			teaserScroller.scroller({
				prevLink: 'div.slider-bar span.prev',
				nextLink: 'div.slider-bar span.next',
				slide: function(e, data){
					slider.slider('value', data.percentPos);
                }
            });

           slider.slider({
				slide: function (e, data){
					teaserScroller.scroller('moveTo', data.value + '%', false);
				}
			});
		};
		$('div.teaser-wrapper.tw-slider').each(linkSliderScroller);
	}


	function addPrintLink(){

		function print(){
			window.print();
			return false;
		}

		$('<li class="print"><a href="#">Print</a></li>')
			.prependTo('ul#text-features')
			.find('a')
			.click(print);
	}

	var createSuperAccordion = function() {
		var hash 		= location.hash,
			tabWidgets	= $('div.super-list'),
			tabs 		= $('h3 a', tabWidgets)
		;

		if(hash){
			tabs.filter('[href='+hash+']').addClass('js-selected');
		}

		tabWidgets
			.bind('tabtreecollapse', function(e, ui){
				ui.panel.stop(true, true).slideParentUp();
			})
			.bind('tabtreeexpand', function(e, ui){
				ui.panel.stop(true, true).slideParentDown();
			})
			.tabtree({
				buttonSel: tabs,
				toggleButton: true,
				multiSelectable: true,
				handleDisplay: 'initial'
			})
		;
		tabs = tabWidgets = null;

	};



	$(callOnDomReady);
})(jQuery);
