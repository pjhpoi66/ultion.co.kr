jQuery( function() { 

    jQuery(".text-box-section").hide();
    jQuery("#tab-1-1").show();
    jQuery(".text-box-toc a:first").attr("class","on");
    
    jQuery(".text-box-toc a").click(function () {
        
        jQuery(".text-box-toc a").attr("class","off");
        jQuery(this).attr("class","on");
        
        var showValue = jQuery(this).attr("aria-controls");      
        //alert(showValue);
        
        jQuery(".text-box-section").hide();
        jQuery("#"+showValue).fadeIn();
        
    });
} );
