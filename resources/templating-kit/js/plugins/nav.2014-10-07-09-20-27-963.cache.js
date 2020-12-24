jQuery( function() { 

    var isios=(/(ipod|iphone|ipad)/i).test(navigator.userAgent);//ios
    var android=(/(Android)/i).test(navigator.userAgent);//ios
    var device_width=jQuery(window).width(); 
	var device_height=jQuery(window).height(); 
	var device_size=(device_width+device_height)/96;

	
    if(isios||android){
		if(device_size<12){
			jQuery(".ultion-nav-global-box").children().first().click(function(){
				return false;
			});
			
			jQuery(".ultion-nav-sub",".ultion-nav-global-box").click(function () {
				if(jQuery(".ultion-nav-sub-item",this).css('visibility')=='visible'){
					jQuery(".ultion-nav-sub-item ","#top_nav .ultion-nav-global-box").css('visibility','hidden');	
				} else{
					jQuery(".ultion-nav-sub-item ","#top_nav .ultion-nav-global-box").css('visibility','hidden');		
					jQuery(".ultion-nav-sub-item",this).css('visibility','visible');

				}

			});
			
			jQuery(".ultion-nav-sub-item","#top_nav .ultion-nav-global-box").click(function () {
				jQuery(".ultion-nav-sub-item",".ultion-nav-global-box").css('visibility','hidden');
				var url = jQuery(this).attr('href');
				location.href = url;
			});
		}
	}
	
	
    if(jQuery("p.mobile_menu").css('visibility')!='visible' && device_size > 12){

        jQuery(".ultion-nav-sub","#top_nav .ultion-nav-global-box").hover(function () {
			jQuery(".ultion-nav-sub-item", this).css('visibility','visible');
			}, 
			function () {
				jQuery(".ultion-nav-sub-item", this).css('visibility','hidden');
			}
		);
		
		jQuery(".ultion-nav-sub-item","top_nav .ultion-nav-global-box").hover(function () {
			jQuery(".ultion-nav-sub-item", this).css('visibility','visible');
			}, 
			function () {
				jQuery(".ultion-nav-sub-item", this).css('visibility','hidden');
			}
		);
	
	}
	


} );
