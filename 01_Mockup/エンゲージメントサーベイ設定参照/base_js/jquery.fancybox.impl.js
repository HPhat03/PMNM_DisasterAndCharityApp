
$(function(){

	$('.kc-co-calendar-cell').mouseover(function(){
		this.style.backgroundColor='#e1ebff';
		this.style.cursor='pointer';
	});
	$('.kc-co-calendar-cell').mouseout(function(){
		this.style.backgroundColor='#ffffff';
	});

});

$(document).ready(function(){

	// モードレスレイヤ(小サイズ)
	$('.kc-co-modeless-small').fancybox({
		'width'          : '40%',
		'height'         : '40%',
		'autoScale'      : false,
		'overlayOpacity' : 0,
		'transitionIn'	 : 'elastic',
		'transitionOut'	 : 'elastic',
		'type'           : 'iframe'
	});
	
	// モードレスレイヤ(中サイズ)
	$('.kc-co-modeless-medium').fancybox({
		'width'          : '60%',
		'height'         : '60%',
		'autoScale'      : false,
		'overlayOpacity' : 0,
		'transitionIn'	 : 'elastic',
		'transitionOut'	 : 'elastic',
		'type'           : 'iframe'
	});
	
	// モードレスレイヤ(大サイズ)
	$('.kc-co-modeless-large').fancybox({
		'width'          : '80%',
		'height'         : '80%',
		'autoScale'      : false,
		'overlayOpacity' : 0,
		'transitionIn'	 : 'elastic',
		'transitionOut'	 : 'elastic',
		'type'           : 'iframe'
	});
	
	// モーダルレイヤ(小サイズ)
	$('.kc-co-modal-small').fancybox({
		'width'              : '40%',
		'height'             : '40%',
		'autoScale'          : false,
		'hideOnOverlayClick' : false,
		'hideOnContentClick' : false,
		'transitionIn'	     : 'elastic',
		'transitionOut'	     : 'elastic',
		'type'               : 'iframe'
	});
	
	// モーダルレイヤ(中サイズ)
	$('.kc-co-modal-medium').fancybox({
		'width'              : '60%',
		'height'             : '60%',
		'autoScale'          : false,
		'autoSize'           : false,
		'hideOnOverlayClick' : false,
		'hideOnContentClick' : false,
		'transitionIn'	     : 'elastic',
		'transitionOut'	     : 'elastic',
		'type'               : 'iframe'
	});
	
	// モーダルレイヤ(大サイズ)
	$('.kc-co-modal-large').fancybox({
		'width'              : '80%',
		'height'             : '80%',
		'autoScale'          : false,
		'hideOnOverlayClick' : false,
		'hideOnContentClick' : false,
		'transitionIn'	     : 'elastic',
		'transitionOut'	     : 'elastic',
		'type'               : 'iframe',
		
	});
	
	// メニュー一覧レイヤ
	$('.kc-co-menu-list').fancybox({
		'width'          : '80%',
		'height'         : '70%',
		'autoScale'      : false,
		'overlayOpacity' : 0,
		'transitionIn'	 : 'elastic',
		'transitionOut'	 : 'elastic',
		'type'           : 'iframe'
	});
	
	// プレビューレイヤー
	$('.kc-co-modeless-preview').fancybox({
		'width'          : 930,
		'height'         : 600,
		'autoScale'      : false,
		'overlayOpacity' : 0,
		'transitionIn'	 : 'elastic',
		'transitionOut'	 : 'elastic',
		'type'           : 'iframe'
	});
	
	// マイページ設定サンプル画像レイヤ
	$('.kc-sample-img').fancybox({
		'width'          : 580,
		'height'         : 520,
		'autoScale'      : false,
		'overlayOpacity' : 0,
		'transitionIn'	 : 'elastic',
		'transitionOut'	 : 'elastic',
		'type'           : 'iframe'
	});
	
	// メニュー設定レイヤ
    $('.kc-co-menu-setting').fancybox({
    	'width'              : 700,
        'height'             : 400,
        'autoScale'          : false,
        'hideOnOverlayClick' : false,
        'hideOnContentClick' : false,
        'transitionIn'       : 'elastic',
        'transitionOut'      : 'elastic',
        'type'               : 'iframe'
    });
	// 日程コピーレイヤ(中サイズ)
	$('.kc-co-modal-schedule-copy').fancybox({
		'width'              : 660,
        'minHeight'          : 420,
		'hideOnOverlayClick' : false,
		'hideOnContentClick' : false,
		'autoSize'           : false,
		'transitionIn'	     : 'elastic',
		'transitionOut'	     : 'elastic',
		'type'               : 'iframe',
		'padding'            : 0,
		'fitToView'          : false,
		'closeBtn'           : false
	});

    var strUA = "";
	strUA = navigator.userAgent.toLowerCase();
	if (strUA.indexOf("ipad") != -1
		|| strUA.indexOf("iphone") != -1
		|| strUA.indexOf("android") != -1
	) {
		$("#fancybox-tmp").parents("body").children("div:first").addClass("fancybox-mbsafari");
		$("body.fancybox").css("overflow", "scroll");
	}
});
