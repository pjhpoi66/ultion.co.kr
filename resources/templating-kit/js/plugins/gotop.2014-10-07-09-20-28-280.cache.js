jQuery( function() { 
    var viewpoint = jQuery("#footer").offset().top;
    jQuery(".gotop").hide();

    jQuery(window).scroll(function() {
        if(jQuery(window).scrollTop() + jQuery(window).height() > viewpoint) {
            jQuery(".gotop").show('slow');
        }
        if(jQuery(window).scrollTop() + jQuery(window).height() < viewpoint) {
            jQuery(".gotop").hide('slow');
        }
    });


  
    var speed = 500; // 스크롤속도
    jQuery(".gotop").css("cursor", "pointer").click(function()
    {
        jQuery('body, html').animate({scrollTop:0}, speed);
    });
        
} );
