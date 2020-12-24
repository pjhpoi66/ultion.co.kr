jQuery( function() { 
    var m_search = 0;
    var m_menu = 0;

    var offset=location.href.indexOf(location.host)+location.host.length;
    var ctxPath=location.href.substring(offset,location.href.indexOf('index.html',offset+1));

    var widthSize = jQuery(window).width();
    
	jQuery(window).resize(function(){
		if( widthSize >= 680){
			
            jQuery('.ultion-nav-global','#mobile_nav').css("visibility","hidden");
            jQuery('.ultion-nav-global','#mobile_nav').css("position","fixed");    
            jQuery('#m_menu').css("background","url(/resources/templating-kit/themes/pop/img/icons/m_menu.png) no-repeat 0px -4px");      
			
            jQuery('#search-box, #search-box-area').css("visibility","");
            jQuery('#search-box, #search-box-area').css("position","");    
            jQuery('#m_search').css("background","url(/resources/templating-kit/themes/pop/img/icons/m_search.png) no-repeat 0px -4px");  
				
			jQuery('#wrapper-2').show();
			jQuery('#stage').show();
			jQuery('#site-info').show();
			
			m_search = 0;
			m_menu = 0;
		};
	}).resize();
    
	
	
    jQuery('#m_search').click(function() {
        if(m_menu == 1){
            jQuery('.ultion-nav-global','#mobile_nav').css("visibility","hidden");
            jQuery('.ultion-nav-global','#mobile_nav').css("position","fixed");    
            jQuery('#m_menu').css("background","url(/resources/templating-kit/themes/pop/img/icons/m_menu.png) no-repeat 0px -4px");       
            jQuery('#wrapper-2').show();
            jQuery('#stage').show();
            jQuery('#site-info').show();
            m_menu = 0;
        }
        if(m_search == 0){
            jQuery('#search-box, #search-box-area').css("visibility","visible");
            jQuery('#search-box, #search-box-area').css("position","relative");
            jQuery('#m_search').css("background","url(/resources/templating-kit/themes/pop/img/icons/m_search.png) no-repeat -31px -3px");    
            m_search = 1;
        }else{
            jQuery('#search-box, #search-box-area').css("visibility","hidden");
            jQuery('#search-box, #search-box-area').css("position","fixed");    
            jQuery('#m_search').css("background","url(/resources/templating-kit/themes/pop/img/icons/m_search.png) no-repeat 0px -4px");    
            m_search = 0;
        }        
    });
    jQuery('#m_menu').click(function() {
        if(m_search == 1){
            jQuery('#search-box, #search-box-area').css("visibility","hidden");
            jQuery('#search-box, #search-box-area').css("position","fixed");    
            jQuery('#m_search').css("background","url(/resources/templating-kit/themes/pop/img/icons/m_search.png) no-repeat 0px -4px");    
            m_search = 0;
        }
        if(m_menu == 0){
            jQuery('.ultion-nav-global','#mobile_nav').css("visibility","visible");
            jQuery('.ultion-nav-global','#mobile_nav').css("position","relative");
            jQuery('#m_menu').css("background","url(/resources/templating-kit/themes/pop/img/icons/m_menu.png) no-repeat -36px -3px");    
    		jQuery('#wrapper-2').hide();
            jQuery('#stage').hide();
            jQuery('#site-info').hide();
            m_menu = 1;
        }else{
            jQuery('.ultion-nav-global','#mobile_nav').css("visibility","hidden");
            jQuery('.ultion-nav-global','#mobile_nav').css("position","fixed");    
            jQuery('#m_menu').css("background","url(/resources/templating-kit/themes/pop/img/icons/m_menu.png) no-repeat 0px -4px");    
			jQuery('#wrapper-2').show();
            jQuery('#stage').show();
            jQuery('#site-info').show();
            m_menu = 0;
        }   
    });
});

