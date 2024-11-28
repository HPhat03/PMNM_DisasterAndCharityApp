//****************************************************
//ポップアップロードの処理
//****************************************************
var elearnWin = null;
$(document).ready(function() {

	// get Window width
	var width =  $(window).width() - 76;

    $('.kc-co-slide-open-div-radio-all').click(function(){
        $('.kc-co-slide-open-div-group').slideUp('normal');
        $('.kc-co-slide-open-div-class').slideUp('normal');
    });
    $('.kc-co-slide-open-div-radio-group').click(function(){
        $('.kc-co-slide-open-div-class').slideUp('normal');
        $('.kc-co-slide-open-div-group').slideDown('normal');
    });
    $('.kc-co-slide-open-div-radio-class').click(function(){
        $('.kc-co-slide-open-div-group').slideUp('normal');
        $('.kc-co-slide-open-div-class').slideDown('normal');
    });

    $(".kc-co-close-popup").click(function () {
        window.parent.closeFancyBox();
    });

	// モードレスレイヤ(中サイズ)
	$('.kc-co-modeless-medium').fancybox({
		padding: 0,
		scrolling	: 'no',
		type		: 'iframe',
		width		: '660',
		height		: 'auto',
		minHeight	: '420',
		maxWidth	: width,
		fitToView	: true,
		autoSize	: false,
		autoCenter  : true,
		closeClick	: false,
		closeBtn	: false,
		helpers : {
			overlay : {
				opacity: 0.4,
				locked: true
			},
			css : { 'overflow' : 'hidden' }
		}
	});

	// モードレスレイヤ(大サイズ)
	$('.kc-co-modeless-large').fancybox({
		padding: 0,
		scrolling	: 'no',
		type		: 'iframe',
		width		: '800',
		height		: '600',
		maxWidth	: width,
		fitToView	: true,
		autoSize	: false,
		autoCenter  : true,
		closeClick	: false,
		closeBtn	: false,
		helpers : {
			overlay : {
				opacity: 0.4,
				locked: true
			},
			css : { 'overflow' : 'hidden' }
		}
	});

	// モードレスレイヤ(縦長サイズ)
	$('.kc-co-modeless-vertically-long').fancybox({
		padding: 0,
		scrolling	: 'no',
		type		: 'iframe',
		width		: '660',
		height		: 'auto',
		minHeight	: '723',
		maxWidth	: width,
		fitToView	: true,
		autoSize	: false,
		autoCenter  : true,
		closeClick	: false,
		closeBtn	: false,
		helpers : {
			overlay : {
				opacity: 0.4,
				locked: true
			},
			css : { 'overflow' : 'hidden' }
		}
	});
    // メニュー一覧レイヤ
    $('.kc-co-menu-list').fancybox({
        'width'          : '80%',
        'height'         : '70%',
        'autoScale'      : false,
        'overlayOpacity' : 0,
        'transitionIn'	 : 'elastic',
        'transitionOut'	 : 'elastic',
        'type'           : 'iframe',
		'scrollOutside'		: false,
    });
    // モーダルレイヤ(大サイズ)
    $('.kc-co-modal-large').fancybox({
		padding: 0,
		scrolling	: 'no',
		type		: 'iframe',
		width		: '800px',
		height		: '600px',
		fitToView   : false,
		transitionIn   : 'elastic',
		transitionOut  : 'elastic',
		autoSize	: false,
		autoCenter  : true,
        autoScale   : false,
		closeClick	: false,
		closeBtn	: false,
        modal 		: true,
		helpers : {
			overlay : {
				opacity: 0.4,
				locked: true
			},
			css : { 'overflow' : 'hidden' }
		}
    });

    // モーダルレイヤ(大サイズ)
    $('.kc-co-modal-xlarge').fancybox({
        padding: 0,
        scrolling	: 'no',
        type		: 'iframe',
        width		: '900px',
        height		: '600px',
        fitToView   : false,
        transitionIn   : 'elastic',
        transitionOut  : 'elastic',
        autoSize	: false,
        autoCenter  : true,
        autoScale   : false,
        closeClick	: false,
        closeBtn	: false,
        modal 		: true,
        helpers : {
            overlay : {
                opacity: 0.4,
                locked: true
            },
            css : { 'overflow' : 'hidden' }
        }
    });

    // クローズボタンありモーダルレイヤ(大サイズ)
    $('.kc-co-modal-large-close-btn').fancybox({
		padding: 0,
		scrolling	: 'no',
		type		: 'iframe',
		width		: '800px',
		height		: '600px',
		fitToView   : false,
		autoSize	: false,
		autoCenter  : true,
		helpers : {
			overlay : {
				opacity: 0.4,
				locked: true,
				closeClick: false
			},
			css : { 'overflow' : 'hidden' }
		}
    });

	// クローズボタンありモードレスレイヤ(大サイズ)
	$('.kc-co-modeless-large-close-btn').fancybox({
		padding: 0,
		scrolling	: 'no',
		type		: 'iframe',
		width		: '800',
		height		: '600',
		maxWidth	: width,
		fitToView	: true,
		autoSize	: false,
		autoCenter  : true,
		closeClick	: false,
		helpers : {
			overlay : {
				opacity: 0.4,
				locked: true
			},
			css : { 'overflow' : 'hidden' }
		}
	});

    // ダッシュボードグラフレイヤ
    $('.kc-co-modal-dashboard').fancybox({
        'width'              : 820,
        'height'             : 600,
        'autoScale'          : false,
        'hideOnOverlayClick' : false,
        'hideOnContentClick' : false,
        'transitionIn'       : 'elastic',
        'transitionOut'      : 'elastic',
        // 'type'               : 'iframe',
        'titleShow'          : false,
        'scrolling'          : 'no',
        'autoSize'           : false,
        'fitToView'          : false
    });

    // マイページ設定サンプル画像レイヤ
    $('.kc-sample-img').fancybox({
        scrolling     : 'no',
        type          : 'iframe',
        width         : '1000',
        height        : '600',
        fitToView     : false,
        autoResize    : false,
        autoSize      : false,
        autoCenter    : true,
        helpers : {
            overlay : {
                opacity: 0.4,
                locked: true
            },
            css : { 'overflow' : 'hidden' }
        }
    });

    // プレビュー用モーダルレイヤ
    $('.kc-co-modal-preview').fancybox({
        padding: 0,
        scrolling	: 'no',
        type		: 'iframe',
        width		: '800px',
        height		: '600px',
        fitToView   : false,
        autoSize	: false,
        autoCenter  : true,
        closeClick	: false,
        helpers : {
            overlay : {
                opacity: 0.4,
                locked: true,
                closeClick: false
            },
            css : { 'overflow' : 'hidden' }
        }
    });

	$(window).trigger('resize');
});

function closeFancyBox(){
	$.fancybox.close();
}

$(window).resize(function() {
	// fix fancybox auto reposition
	//$.fancybox.reposition();
	$.fancybox.update();
});

//完了レイヤ起動
function showCompleteModalDialogFancy(hlink){

	// get Window width
	var width =  $(window).width() - 76;
	$.fancybox.open({
		href: hlink,
		padding: 0,
		scrolling	: 'no',
		type		: 'inline',
		width		: '660',
		height		: 'auto',
		maxWidth	: width,
		fitToView	: true,
		autoSize	: false,
		autoCenter  : true,
		closeClick	: false,
		closeBtn	: false,
		helpers : {
			overlay : {
				closeClick:false,
				opacity: 0.4,
				locked: true
			}
		}
	});
}

//削除確認レイヤ起動
function showDeleteModalDialogFancy(hlink){

//	//showdeleteModal tag
//	$('.kc-co-delete-dialog').show();
    // get Window width
    var width =  $(window).width() - 76;
    $.fancybox.open({
        href: '#deleteDialog',
        padding: 0,
        scrolling	: 'no',
        type		: 'inline',
        width		: '660',
        height		: 'auto',
        maxWidth	: width,
        fitToView	: true,
        autoSize	: false,
        autoCenter  : true,
        closeClick	: false,
        closeBtn	: false,
        helpers : {
            overlay : {
                closeClick:false,
                opacity: 0.4,
                closeClick:false
            }
        }
    });
}

//削除確認レイヤ起動
function showDeleteModalDialog(hlink){

//	//showdeleteModal tag
//	$('.kc-co-delete-dialog').show();
	// get Window width
	var width =  $(window).width() - 76;
	$.fancybox.open({
		href: '#deleteDialog',
		padding: 0,
		scrolling	: 'no',
		type		: 'inline',
		width		: '660',
		height		: 'auto',
		maxWidth	: width,
		fitToView	: true,
		autoSize	: false,
		autoCenter  : true,
		closeClick	: false,
		closeBtn	: false,
		helpers : {
			overlay : {
				closeClick:false,
				opacity: 0.4,
				closeClick:false
			}
		}
	});
}

function showDeleteModalDialogCheckRegist(companyCode, proxy, mode, clickedCompanyCode, clickedCourseCode, nc){
    showDeleteModalDialogFancy();

    if (proxy === undefined) {
        proxy = '';
    }
    if (mode === undefined) {
        mode = '';
    }
    if (clickedCompanyCode === undefined) {
        clickedCompanyCode = '';
    }
    if (clickedCourseCode === undefined) {
        clickedCourseCode = '';
    }
    if (nc === undefined) {
        nc = '';
    }
    $('#deleteDialog .kc-co-btn-yes-popup').attr("onclick", "").unbind("click");
    $('#deleteDialog .kc-co-btn-yes-popup').bind("click", function() {
        $.fancybox.close();
        setTimeout(function(){ 
            checkRegist(companyCode, proxy, mode, clickedCompanyCode, clickedCourseCode, '', '', '', nc);
        }, 500);        
    });
}
function showTransitionModalDialog(hlink){
    // get Window width
    var width =  $(window).width() - 76;
    $.fancybox.open({
        href: '#transitionDialog',
        padding: 0,
        scrolling	: 'no',
        type		: 'inline',
        width		: '660',
        height		: 'auto',
        maxWidth	: width,
        fitToView	: true,
        autoSize	: false,
        autoCenter  : true,
        closeClick	: false,
        closeBtn	: false,
        helpers : {
            overlay : {
                closeClick:false,
                opacity: 0.4,
                closeClick:false
            }
        }
    });
}
//確認メッセージレイヤ起動
function checkRegist(companyCode, proxy, mode, clickedCompanyCode, clickedCourseCode, clickedStartDate, clickedStartTime, clickedRoomCode, nc){
    if (proxy === undefined) {
        proxy = '';
    }
    if (mode === undefined) {
        mode = '';
    }
    if (clickedCompanyCode === undefined) {
        clickedCompanyCode = '';
    }
    if (clickedCourseCode === undefined) {
        clickedCourseCode = '';
    }
    if (clickedStartDate === undefined) {
        clickedStartDate = '';
    }
    if (clickedStartTime === undefined) {
        clickedStartTime = '';
    }
    if (clickedRoomCode === undefined) {
        clickedRoomCode = '';
    }
    if (nc == 'nc') {
        url = '/ncicm/';
    } else {
        url = '/icm/';
    }
    $.ajax({
        url: url+companyCode+'/course-application/check-'+proxy+'regist?lastportaldiv='+lastportaldiv,
        async: false,
        dataType: 'json',
        type: 'POST',
        beforeSend: function (request, settings) {
            $(request).bind("readystatechange", function (e) {
                if (e.target.readyState == 4 && e.target.responseText.indexOf('lastportaldiv = \"login\"') >= 0) {
                    setElementValueById('mode', mode);
                    if (mode == 'detail') {
                        setElementValueById('clickedCompanyCode', clickedCompanyCode);
                        setElementValueById('clickedCourseCode', clickedCourseCode);
                    } else if (mode == 'scheduleList') {
                        setElementValueById('clickedCompanyCode', clickedCompanyCode);
                        setElementValueById('clickedCourseCode', clickedCourseCode);
                        setElementValueById('clickedStartDate', clickedStartDate);
                        setElementValueById('clickedStartTime', clickedStartTime);
                        setElementValueById('clickedRoomCode', clickedRoomCode);
                    }
                    submitForm(url+companyCode+'/course-application/init-'+proxy+'regist');
                }
            });
        },
        success: function(json){
            if (json.code == 1) {
                $('#transitionTitle').text(json.title);
                $('#transitionMessage').text(json.message);
                $('<input>').attr({
                    type: 'hidden',
                    id: 'role',
                    name: 'role'
                }).appendTo('form');
                setElementValueById('role', json.role);
                if (mode == 'detail') {
                    setElementValueById('mode', 'detail');
                    setElementValueById('clickedCompanyCode', clickedCompanyCode);
                    setElementValueById('clickedCourseCode', clickedCourseCode);
                } else if (mode == 'scheduleList') {
                    setElementValueById('mode', 'scheduleList');
                    setElementValueById('clickedCompanyCode', clickedCompanyCode);
                    setElementValueById('clickedCourseCode', clickedCourseCode);
                    setElementValueById('clickedStartDate', clickedStartDate);
                    setElementValueById('clickedStartTime', clickedStartTime);
                    setElementValueById('clickedRoomCode', clickedRoomCode);
                } else {
                    setElementValueById('mode', null);
                    setElementValueById('clickedCompanyCode', null);
                    setElementValueById('clickedCourseCode', null);
                    setElementValueById('clickedStartDate', null);
                    setElementValueById('clickedStartTime', null);
                    setElementValueById('clickedRoomCode', null);
                }
                showTransitionModalDialog();
            } else if (json.code == 0) {
                if (mode == 'detail') {
                    setElementValueById('mode', 'detail');
                    setElementValueById('clickedCompanyCode', clickedCompanyCode);
                    setElementValueById('clickedCourseCode', clickedCourseCode);
                } else if (mode == 'scheduleList') {
                    setElementValueById('mode', 'scheduleList');
                    setElementValueById('clickedCompanyCode', clickedCompanyCode);
                    setElementValueById('clickedCourseCode', clickedCourseCode);
                    setElementValueById('clickedStartDate', clickedStartDate);
                    setElementValueById('clickedStartTime', clickedStartTime);
                    setElementValueById('clickedRoomCode', clickedRoomCode);
                } else {
                    setElementValueById('mode', null);
                    setElementValueById('clickedCompanyCode', null);
                    setElementValueById('clickedCourseCode', null);
                    setElementValueById('clickedStartDate', null);
                    setElementValueById('clickedStartTime', null);
                    setElementValueById('clickedRoomCode', null);
                }
                $('<input>').attr({
                    type: 'hidden',
                    id: 'role',
                    name: 'role'
                }).appendTo('form');
                setElementValueById('role', json.role);
                submitForm(url+companyCode+'/course-application/init-'+proxy+'regist');
            }
        },
        error: function(e){
            if (e.responseText.indexOf('lastportaldiv = \"login\"') >= 0) {
                setElementValueById('mode', mode);
                if (mode == 'detail') {
                    setElementValueById('clickedCompanyCode', clickedCompanyCode);
                    setElementValueById('clickedCourseCode', clickedCourseCode);
                } else if (mode == 'scheduleList') {
                    setElementValueById('clickedCompanyCode', clickedCompanyCode);
                    setElementValueById('clickedCourseCode', clickedCourseCode);
                    setElementValueById('clickedStartDate', clickedStartDate);
                    setElementValueById('clickedStartTime', clickedStartTime);
                    setElementValueById('clickedRoomCode', clickedRoomCode);
                }
                submitForm(url+companyCode+'/course-application/init-'+proxy+'regist');
            } else {
                submitForm(url+companyCode+'/course-application/check-'+proxy+'regist?lastportaldiv='+lastportaldiv);
            }
        }
    });
}


//アラート起動
function startAlertWin(hlink){
	// get Window width
	var width =  $(window).width() - 76;
	$.fancybox.open({
		href: hlink,
		padding: 0,
		scrolling	: 'no',
		type		: 'inline',
		width		: '660',
		height		: 'auto',
		maxWidth	: width,
		fitToView	: true,
		autoSize	: false,
		autoCenter  : true,
		closeClick	: false,
		closeBtn	: false,
		helpers : {
			overlay : {
				opacity: 0.4,
				locked: true
			}
		}
	});
}


/* ================================================== */
/*!
 * jquery.impl.js
 */
$(function(){

    $('.kc-co-calendar-cell').mouseover(function(){
        this.style.backgroundColor='#e1ebff';
        this.style.cursor='pointer';
    });
    $('.kc-co-calendar-cell').mouseout(function(){
        this.style.backgroundColor='#ffffff';
    });

    countText('kc-countup1','kc-count-view1');
    countText('kc-countup2','kc-count-view2');
    countText('kc-countup3','kc-count-view3');

    function countText(inId,outId){

        var elContent = $('#' + inId);
        var elCounter = $('#' + outId);

        elContent
            .focus(function(){
                (function(){
                    var counter = elContent.val().length;
                    elCounter.text(counter);
                    if(counter == 0){
                        elCounter.text("0");
                    }
                    var tm = setTimeout(arguments.callee, 100);
                    elContent.data(inId + 'Timer', tm);
                })();
            }).
                blur(function(){
                var tm = elContent.data(inId + 'Timer');
                clearTimeout(tm);
            });
    }

    /* jqModal */
    $('#dialog').wrap('<div class="kc-co-jqModal-wrap"></div>');
    $('#deleteDialog').wrap('<div class="kc-co-jqModal-wrap"></div>');
    $('#closeDialog').wrap('<div class="kc-co-jqModal-wrap-close"></div>');
    $('#dialog-elearn-open-error').wrap('<div class="kc-co-jqModal-wrap"></div>');
    $('#dialogGroup').wrap('<div class="kc-co-jqModal-wrap"></div>');
    $('#dialogSchedule').wrap('<div class="kc-co-jqModal-wrap"></div>');
    $("#transitionDialog").detach().appendTo("body");
    $('#transitionDialog').wrap('<div class="kc-co-jqModal-wrap"></div>');
    $('#limitOverdialog').wrap('<div class="kc-co-jqModal-wrap"></div>');
});

$(document).ready(function(){
    $('.slide-open01').click(function(){ $('.kc-co-slide01').slideDown('normal'); });
    $('.slide-close01').click(function(){ $('.kc-co-slide01').slideUp('normal'); });

    $('.slide-open02').click(function(){ $('.kc-co-slide02').slideDown('normal'); });
    $('.slide-close02').click(function(){ $('.kc-co-slide02').slideUp('normal'); });

    $('.slide-open07').click(function(){ 
        var autoReceiptFlagRegistChecked = $("input[type='radio'][name='autoReceiptFlag[autoReceiptFlag]']:checked").val();
        var cancelWaitPossibleFlagChecked = $("input[type='radio'][name='cancelWaitPossibleFlag[cancelWaitPossibleFlag]']:checked").val();
        if (cancelWaitPossibleFlagChecked == '1') {
            if (autoReceiptFlagRegistChecked == '1') {
                $('.kc-co-slide07').slideDown('normal');
            }
            $('.kc-co-slide08').slideDown('normal');
        }
     });
    $('.slide-close07').click(function(){$('.kc-co-slide07').slideUp('normal');});
    
    $('.slide-open08').click(function(){ 
        var autoReceiptFlagRegistChecked = $("input[type='radio'][name='autoReceiptFlag[autoReceiptFlag]']:checked").val();
        var autoReceiptFlagEditChecked = $("input[type='hidden'][name='autoReceiptFlag[autoReceiptFlag]']").val();
        var cancelWaitPossibleFlagChecked = $("input[type='radio'][name='cancelWaitPossibleFlag[cancelWaitPossibleFlag]']:checked").val();
        if (cancelWaitPossibleFlagChecked == '1') {
            if (autoReceiptFlagRegistChecked == '1' || autoReceiptFlagEditChecked =='1') {
                $('.kc-co-slide07').slideDown('normal');
            }
            $('.kc-co-slide08').slideDown('normal');
        }
    });
    $('.slide-close08').click(function(){ 
        $('.kc-co-slide08').slideUp('normal');
        $('.kc-co-slide07').slideUp('normal');
     });
    
    $('.slide-open09').click(function(){ $('.kc-co-slide09').slideDown('normal'); });
    $('.slide-close09').click(function(){ $('.kc-co-slide09').slideUp('normal'); });

    $('.kc-co-slide-id-expire-open').click(function(){ $('.kc-co-slide-id-expire').slideDown('normal'); });
    $('.kc-co-slide-id-expire-close').click(function(){ $('.kc-co-slide-id-expire').slideUp('normal'); });

    $('.kc-co-slide-password-expire-open').click(function(){ $('.kc-co-slide-password-expire').slideDown('normal'); });
    $('.kc-co-slide-password-expire-close').click(function(){ $('.kc-co-slide-password-expire').slideUp('normal'); });

    $('.kc-co-slide-billing-open').click(function(){ $('.kc-co-slide-billing').slideDown('normal'); });
    $('.kc-co-slide-billing-close').click(function(){ $('.kc-co-slide-billing').slideUp('normal'); });

    $('.kc-co-slide-delivery-open').click(function(){ $('.kc-co-slide-delivery').slideDown('normal'); });
    $('.kc-co-slide-delivery-close').click(function(){ $('.kc-co-slide-delivery').slideUp('normal'); });

    $('.kc-co-slide-group-open').click(function(){ $('.kc-co-slide-group').slideDown('normal'); });
    $('.kc-co-slide-group-close').click(function(){ $('.kc-co-slide-group').slideUp('normal'); });

    $('.kc-co-slide-billTitle-open').click(function(){ $('.kc-co-slide-billTitle').slideDown('normal'); });
    $('.kc-co-slide-billTitle-close').click(function(){ $('.kc-co-slide-billTitle').slideUp('normal'); });

    $('.kc-co-slide-open-div-flag-open').click(function(){ $('.kc-co-slide-open-div-flag').slideDown('normal'); });
    $('.kc-co-slide-open-div-flag-close').click(function(){ $('.kc-co-slide-open-div-flag').slideUp('normal'); });

    $('.kc-co-slide-open-div-open').click(function(){ $('.kc-co-slide-open-div').slideDown('normal'); });
    $('.kc-co-slide-open-div-close').click(function(){ $('.kc-co-slide-open-div').slideUp('normal'); });

    $('.kc-co-slide-open-div-radio-all').click(function(){
        $('.kc-co-slide-open-div-group').slideUp('normal');
        $('.kc-co-slide-open-div-class').slideUp('normal');
    });
    $('.kc-co-slide-open-div-radio-group').click(function(){
        $('.kc-co-slide-open-div-class').slideUp('normal');
        $('.kc-co-slide-open-div-group').slideDown('normal');
    });
    $('.kc-co-slide-open-div-radio-class').click(function(){
        $('.kc-co-slide-open-div-group').slideUp('normal');
        $('.kc-co-slide-open-div-class').slideDown('normal');
    });

    $('.kc-co-slide-link-url-open').click(function(){ $('.kc-co-slide-link-url').slideDown('normal'); });
    $('.kc-co-slide-link-url-close').click(function(){ $('.kc-co-slide-link-url').slideUp('normal'); });

    $('.kc-co-slide-attached-file-open').click(function(){ $('.kc-co-slide-attached-file').slideDown('normal'); });
    $('.kc-co-slide-attached-file-close').click(function(){ $('.kc-co-slide-attached-file').slideUp('normal'); });

    $("input:radio[name=downloadCharset]").click(function(){addBomCheckByCharset();});
    $('input:radio[name="downloadCharset[downloadCharset]"]').click(function(){addBomCheckByCharsetEx();});

    $('.slide-toSubmit-open').click(function(){
        $('.slide-toSubmit').slideDown('normal');
        if($('input[name=toSubmitUser]:checked').val() === $('#toSubmitGroupStudent').val()){
            $('.slide-ccSubmit').slideDown('normal');
        }
    });
    $('.slide-toSubmit-close').click(function(){
        $('.slide-toSubmit').slideUp('normal');
        $('.slide-ccSubmit').slideUp('normal');
    });

    $('.kc-co-relativeDateCount-disabled').click(function(){
        $("#relativeDateCount").val("");
        $("#relativeDateCount").prop('disabled', true);
    });

    $('.kc-co-relativeDateCount-enable').click(function(){
        $("#relativeDateCount").prop('disabled', false);
    });

    $('.slide-ccSubmit-open').click(function(){ $('.slide-ccSubmit').slideDown('normal'); });
    $('.slide-ccSubmit-close').click(function(){ $('.slide-ccSubmit').slideUp('normal'); });

    excludeEnter();
});

/* ================================================== */
/*!
 * kc-co.js
 */
doublePostFlg = false;

function preSubmitForm(keyCode, url)
{
    if (keyCode == 13 || keyCode == 3) {
        submitForm(url);
    }
}

function submitForm(url)
{
    if (!doublePostFlg) {
    	if (document.getElementById('headerAuth')) {
            setElementValueById('headerAuth', lastportaldiv);
        }
        doublePostFlg = true;
        document.forms[0].action = url;
        document.forms[0].submit();
    }
}

function submitMenuListForm(url)
{
    if (!doublePostFlg) {
        doublePostFlg = true;
        document.forms[0].action = url;
        document.forms[0].submit();
    }
}

function submitDownloadForm(url)
{
    if (!doublePostFlg) {
        if (document.getElementById('headerAuth')) {
            setElementValueById('headerAuth', lastportaldiv);
        }
        document.forms[0].action = url;
        document.forms[0].submit();
    }
}

function clearElementValue(elementName)
{
    if (isArray(elementName)) {
        for (i = 0; i < elementName.length; i++) {
            if (document.getElementsByName(elementName[i])[0]) {
                if (elementName[i] == 'perPage') {
                    document.getElementById(elementName[i]).selectedIndex = 0;
                } else {
                    document.getElementsByName(elementName[i])[0].value = '';
                }
            }
        }
    } else {
        if (document.getElementsByName(elementName)[0]) {
            document.getElementsByName(elementName)[0].value = '';
        }
    }
}

function setElementValue(elementName, value)
{
    document.forms[0][elementName].value = value;
}

function setNoticeNo(noticeNo)
{
    document.getElementById("noticeNo").value = noticeNo;
}

function isArray(array)
{
    return !(
        !array || (!array.length || array.length == 0) || typeof array !== 'object' || !array.constructor || array.nodeType || array.item
    );
}

/*
 * パスワード変更画面
 * onloadイベント時に、現在の入力文字数をセットします。
 */
function countTextOnload(inId, outId) {

    var elContent = $('#' + inId);
    var elCounter = $('#' + outId);

    var counter = elContent.val().length;
    elCounter.text(counter);
    if(counter == 0){
        elCounter.text("0");
    }
}

/*
 * 表示有無を指定して対象エレメントの表示・非表示を切り替える
 */
function slideElement(varBool, targetElement)
{
    if (varBool == true) {
        $('#' + targetElement).slideDown('normal');
    } else {
        $('#' + targetElement).slideUp('normal');
    }
}

/*
 * キャンセル待ち：利用する ＋ 自動受付：受付する の場合、キャンセル待ち・繰り上がりメールフォロー表示
 * 上記以外場合、キャンセル待ち・繰り上がりメールフォロー表示
 */
function slideElementFromGroup(varBool1, varBool2, targetElement)
{
    if (varBool1 == true && varBool2 == true) {
        $('#' + targetElement).slideDown('normal');
    } else {
        $('#' + targetElement).slideUp('normal');
    }
}

/*
 * レイヤから親画面を操作
 * 表示有無を指定して対象エレメントの表示・非表示を切り替える
 */
function slideElementFromLayer(varBool, targetElement)
{
    if (varBool == true) {
        parent.$('#' + targetElement).slideDown('normal');
    } else {
        parent.$('#' + targetElement).slideUp('normal');
    }
}

/*
 * イベント発生のたびに、対象エレメントの表示・非表示を切り替える
 */
function toggleSlideElement(targetElement)
{
    if ($('#' + targetElement).css('display') == 'none') {
        $('#' + targetElement).slideDown('normal');
    } else {
        $('#' + targetElement).slideUp('normal');
    }
}

/*
 * 対象エレメントをidで特定し、値をセットする
 */
function setElementValueById(elementId, value)
{
    $('#' + elementId).val(value);
}

/*
 * 学習形態すべてcheck on時
 */
function checkedAll(isChecked, allValue)
{
    if (isChecked) {
        $("input:checkbox[value!='" + allValue + "']").prop('checked', false);
    }
}

/*
 * 学習形態すべて以外check on時
 */
function checkedOther(isChecked, allElementName)
{
    if (isChecked) {
        $("*[name='" + allElementName + "']").prop('checked', false);
    }
}

/*
 * チェックBOX共通 すべてcheck on時(同画面に2項目以上チェックBOXがある場合）
 */
function commonCheckedAll(isChecked, elementName, allNo ,count)
{
    if (isChecked) {
        for (i = allNo; i <= count; i++) {
            var targetElemtName = elementName +'['+ i +']';
            $("*[name='" + targetElemtName + "']").prop('checked', false);
        }
    }
}

/*
 * 全選択チェックボックスの動作
 * 全選択チェック有り → 引数で渡されるエレメント名の全チェックボックスをON
 * 全選択チェック無し → 引数で渡されるエレメント名の全チェックボックスをOFF
 * obj → 全選択チェックボックスオブジェクト
 * targetElemName → 選択対象のチェックボックス名 ex)hogehoge[]
 */
function checkedAllSelect(obj, targetElemName)
{
    for (i = 0; i < document.getElementsByName(targetElemName).length; i++) {
        if (obj.checked) {
            document.getElementsByName(targetElemName)[i].checked = true;
        } else {
            document.getElementsByName(targetElemName)[i].checked = false;
        }
    }

    for (i = 0; i < document.getElementsByName(obj.name).length; i++) {
        if (obj.checked) {
            document.getElementsByName(obj.name)[i].checked = true;
        } else {
            document.getElementsByName(obj.name)[i].checked = false;
        }
    }
}

/*
 * 新しいウィンドウを開く
 * name → ウィンドウ名
 * url  → アクセスURL
 */
function openWindow(url, name)
{
    window.open(url, name);
}

function openElearnWindow(url, name, params)
{
    if (params == null || params == '') {
        var win = window.open("/blank.html", name);
    } else {
        var win = window.open("/blank.html", name, params);
    }
    document.forms[0].target = name;
    document.forms[0].action = url;
    document.forms[0].submit();
    document.forms[0].target = "_top";
    win.focus();
}

function openCharacterWindow(url, name)
{
    var submitType = $("input:radio[name=submitType]:checked").val();
    var toSubmitUser = $("input:radio[name=toSubmitUser]:checked").val();
    var bossCcSubmitFlag = $("input:radio[name=bossCcSubmitFlag]:checked").val();
    var onlineDisplayFlag = $("#onlineDisplayFlag").val();
    var remarksDisplayFlag = $("#remarksDisplayFlag").val();

    url = url + '?submitType=' + submitType + '&toSubmitUser=' + toSubmitUser + '&bossCcSubmitFlag=' + bossCcSubmitFlag
    + '&onlineDisplayFlag=' + onlineDisplayFlag + '&remarksDisplayFlag=' +remarksDisplayFlag;
    window.open(url, name);
}

function openElearnWindowWithSupressMultipleOpen(subModule, companyCode, applyId)
{
    var name = "elearnWindow";
    var url  = "";
    url = "/" + subModule + "/" + companyCode + "/elearn/list-page";

    // if (checkIos()){
    //     if (elearnWin != null) {
    //         if ($('#apply_id').val() == applyId) {
    //             elearnWin.focus();
    //             return true;
    //         }else{
    //             startAlertWin('#dialog-elearn-open-error');
    //             return true;
    //         }
    //     }
    // }

    elearnWin = window.open("", name, "width=1040,height=640,scrollbars=yes,resizable=yes,status=no");
    if (elearnWin.location.href != 'about:blank') {

        elearnWin.blur();
        window.focus();

        startAlertWin('#dialog-elearn-open-error');

        return true;
    }

    // 受付番号保存
    $('#apply_id').val(applyId);
    document.forms[0].target = name;
    document.forms[0].action = url;
    document.forms[0].submit();
    document.forms[0].target = "_top";
    elearnWin.focus();
}


function openElearnFCWindowWithSupressMultipleOpen(subModule, companyCode, coursePublisherCompanyCode, courseCode, elib){
    if(typeof elib === 'undefined') elib = 0;
    var applyInfo = undefined;
    var resApply  = undefined;
    applyInfo = registFreeCourse(subModule, companyCode, coursePublisherCompanyCode, courseCode, elib);
}

/*
 * freeCourse登録
 */
function registFreeCourse(subModule, companyCode, coursePublisherCompanyCode, courseCode, elib){
    if(typeof elib === 'undefined') elib = 0;
    var url = "/icm/"+companyCode+"/course-application/regist-free-course";
    if($('#parentsForm > input[name="clickedCourseCode"]').length === 0) {
        $('#parentsForm').append('<input name="clickedCourseCode" type="hidden">');
    }
    if($('#parentsForm > input[name="clickedCompanyCode"]').length === 0) {
        $('#parentsForm').append('<input name="clickedCompanyCode" type="hidden">');
    }
    $('#parentsForm input[name="clickedCompanyCode"]').val(coursePublisherCompanyCode);
    $('#parentsForm input[name="clickedCourseCode"]').val(courseCode);

    // フリーコース受講可能フラグ
    var openFlg = false;
    // 受付番号
    var applyNo = '';

    $.ajax({
        type: "POST",
        dataType: "json",
        url: url,
        data: $("#parentsForm").serialize(true),
        async: false,
        success: function(res) {
            if('suspended' in res ) {
                showApplyErr(res.error);
            }else if('not_exists' in res) {
                showApplyErr(res.error);
            }else if('out_of_service' in res){
                showApplyErr(res.error);
            // フリーコースが受講可能になる場合
            }else if ('apply_receipt_no' in res){
                openFlg = true;
                applyNo = res.apply_receipt_no;
            }
        },
        error: function(xhr, status, e) {
            alert('error!');
        }
    });

    // フリーコースが受講可能になる場合
    if(openFlg) {
        // ライブラリコースの場合
        if (elib == 1) {
            openElibWindowWithSupressMultipleOpen('emvs', companyCode, applyNo);
        } else {
            // 普通のコースの場合
            openElearnWindowWithSupressMultipleOpen(subModule, companyCode, applyNo);
        }
    }
    }

function showApplyErr(msg){
    if ( msg == "" || msg == undefined ) return true;
    // $(".fancybox").fancybox();
    $.fancybox({
        'width'          : '80%',
        'height'         : '70%',
        'autoScale'      : false,
        'overlayOpacity' : 0,
        'transitionIn'   : 'elastic',
        'transitionOut'  : 'elastic',
        'type'           : 'iframe',
        'scrollOutside'  : false,
    });
    $('div.fancybox-inner').text("");
    $('div.fancybox-inner').text(msg);
}

/*
 * オンラインミーティング用ウィンドウを開く
 * @param int omId
 * @param string meetingUrl アクセスURL
 * @param string applyReceiptNo 申込受付番号
 * @param string companyCode 会社コード
 */
function openOnlineMeetingWindow(omId, meetingUrl, applyReceiptNo, companyCode)
{
    var name = "";
    var win = null;
    var url = "";
    
    if (omId.length > 0) {
        name = "onlineMeetingWindow";
        win = window.open("/blank.html", name);
        url = document.getElementById(omId).value;
        document.forms[0].target = name;
        document.forms[0].action = url;
        document.forms[0].submit();
        document.forms[0].target = "_top";
        win.focus();
    } else {
        url = meetingUrl;
        name = "onlineMeetingWindow_" + applyReceiptNo;
        win = window.open(url, name, "width=1040,height=640,scrollbars=yes,resizable=yes,status=no");
        win.focus();
        
        // 受講ステータス更新
        var updateUrl = "/" + companyCode + "/index/update-lecture-status-div";
        $.ajax({
            type: "POST",
            dataType: "json",
            url: updateUrl,
            data: {applyReceiptNo:applyReceiptNo},
            async: true,
            success: function (json) {
                // 何もしない
            },
            error: function (xhr, status, e) {
                // 何もしない
            }
        });
    }
}

function openElibWindow(url, name, params)
{
    if (params == null || params == '') {
        var win = window.open("/blank.html", name);
    } else {
        var win = window.open("/blank.html", name, params);
    }
    document.forms[0].target = name;
    document.forms[0].action = url;
    document.forms[0].submit();
    document.forms[0].target = "_top";
    win.focus();
}

var elibWin;
function openElibWindowWithSupressMultipleOpen(subModule, companyCode, applyId)
{
    var name = "elibWindow";
    var url  = "";

    url = "/" + subModule + "/" + companyCode + "/elib/tile";

    elibWin = window.open("", name, "scrollbars=yes,resizable=yes,status=no"); //width=1020,height=640,
    elibWin.moveTo(0,0);
    elibWin.resizeTo(screen.availWidth,screen.availHeight);
    if (elibWin.location.href != 'about:blank') {

        elibWin.blur();
        window.focus();

        $('#dialog-elib-open-error').jqm({
           modal: true
        });
        $('#dialog-elib-open-error').jqmShow();

        return true;
    }


    // 受付番号保存
    $('#apply_id').val(applyId);

    document.forms[0].target = name;
    document.forms[0].action = url;
    document.forms[0].submit();
    document.forms[0].target = "_top";
    elibWin.focus();
}


/*
* POSTで新しいウィンドウを開く
* name → ウィンドウ名
* url  → アクセスURL
*/
function openWindowPost(url)
{
    document.forms[0].target = "_blank";
    document.forms[0].action = url;
    document.forms[0].submit();
    document.forms[0].target = "_top";
}

/*
 * returnキー押下時自動サブミット防止
 */
function excludeEnter(){
    var buttons = document.getElementsByTagName("button");
    for (var i = 0; i<buttons.length; i++) {
        if (buttons[i].type != 'button') {
            buttons[i].setAttribute('type', 'button');
        }
    }

    window.addEventListener('keydown', function(event){
        var targetElement = event.target;
        var elementName = targetElement.type;
        var userAgent = window.navigator.userAgent.toLowerCase();
        if (elementName == 'text' || elementName == 'password' || elementName == 'radio' 
            || elementName == 'checkbox' || elementName == 'select-multiple' || (elementName == 'file' && (userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1))) {
            if (!event) var event = window.event;
            if (event.keyCode == 13 || event.keyCode == 3) {
                event.preventDefault();
                return false;
            }
        }
    });

    $(document).on('click', 'button, a', function() {
        $(this).blur();
    });
}

//申込受付詳細画面
//テンプレート読込をします。
function readTemplate(url, companyCode)
{
    $.ajax({
        type: "POST",
        dataType: "json",
        url: url,
        data: $("#parentsForm").serialize(true),
        async: true,
        success: function(json) {
            if (checkArrayAjaxResponse(json, companyCode)) {
                if (json) {
                    $('#mailTemplateCode').val(json.templateCode);
                    $('#mailTitle').val(json.mailTitle);
                    $('#mailBody').val(json.mailBody);
                }
            }
        },
        error: function(xhr, status, e) {alert('error');}
    });

}
//受講者検索をします。
function searchUser(url, companyCode)
{
    $.ajax({
      type: "POST",
      dataType: "json",
      url: url,
      data: $("#parentsForm").serialize(true),
      async: true,
      success: function(json) {
            if (checkArrayAjaxResponse(json, companyCode)) {
                if (json) {
                    $('#stUserName').val(json.st_user_name);
                    $('#stUserNameKana').val(json.st_user_name_kana);
                    $('#stUserMail').val(json.st_user_mail);
                    $('#stCompanyName').val(json.st_company_name);
                    $('#stOrganizationName').val(json.st_organization_name);
                }
            }
      },
      error: function(xhr, status, e) {alert('error');}
    });
}

/*
 * Ajaxアクセス時の共通エラー処理
 */
function checkAjaxResponse(obj, companyCode)
{
    try {
        for (var i in obj) {
            if (i == "id") {
                // 強制エラー画面遷移
                location.href = "/" + companyCode + "/ajax/error/msgId/" + obj.id;
                return false;
            }
        }
        if (obj.indexOf("KC00E000") != "-1") {
            location.href = "/" + companyCode + "/ajax/error/msgId/KC00E002";
            return false;
        }
        return true;
    } catch (e) {
        location.href = "/" + companyCode + "/ajax/error/msgId/KC00E002";
        return false;
    }
}

/*
 * マイページFAQ読み込みイベント
 */
function loadFaqContents(url, companyCode)
{
    var faqDivDisplay = $("div.kc-co-contents-faq-box").css("display");
    if (faqDivDisplay != "none") {
        $.ajax({
            type: "POST",
            url: url,
            async: true,
            success: function(src, dataType) {
                if (checkAjaxResponse(src, companyCode)) {
                    $("#faqContents").html(src);
                }
            },
            error: function(xhr, status, e) {}
        });
    }
}

/*
 * 管理者トップ 直近のアクティビティ表示
 */
function showActivityGraph(checkUrl, getUrl, companyCode)
{

    setElementValueById("activityMode", "show");

    $.ajax({
        type: "POST",
        url: checkUrl,
        data: $('#parentsForm').serialize(),
        async: false,
        success: function(src) {
            if (checkAjaxResponse(src, companyCode)) {
                str ='noError';
                if(!src.match(str)){
                    var msg = '<div class="kc-co-alert-area"><ul>';
                    var messages = src.split('|');
                    for (var i = 0; i < messages.length; i++) {
                        msg += "<li>" + messages[i] + "</li>";
                    }
                    msg += "</ul></div>";
                    $('#errMsg').html(msg);
                    $('#errMsg').show();
                    $(document).ready(function(){
                        /* メッセージエリア */
                        $('.kc-co-message-box').wrap('<div class="kc-co-message-box-wrap"></div>');
                        //$('.kc-co-message-box').corner('round 5px').parent().corner('round 5px');

                        /* エラーメッセージエリア */
                        $('.kc-co-alert-area').wrap('<div class="kc-co-alert-area-wrap"></div>');
                        //$('.kc-co-alert-area').corner('round 5px').parent().corner('round 10px');
                    });
                } else {
                    $('#errMsg').hide();
                    getUrl = location.protocol + "//" + location.hostname + getUrl;
                    $('#recent-activity-wrap').slideDown('normal');
                    $('#recent-activity-wrap').css("background-color", "rgb(255, 250, 235)");
                    $('#recent-activity-loading').show();
                    $('#recent-activity').hide();
                    $.ajax({
                        type: "POST",
                        url: getUrl,
                        data: $('#parentsForm').serialize(),
                        async: true,
                        dataType: "json",
                        success: function(src) {
                            $('#recent-activity-loading').hide();
                            $('#recent-activity').show();
                            drawActivityGraph("recent-activity", src);
                        },
                        error: function(xhr, status, e) {
                            $('#recent-activity-loading').hide();
                        }
                    });
                }
            }
        },
        error: function(xhr, status, e) {}
    });
}

/*
 * 管理者トップ 直近のアクティビティCSVダウンロード
 */
function downloadActivityFile(checkUrl, submitUrl, companyCode)
{

    setElementValueById("activityMode", "download");

    $.ajax({
        type: "POST",
        url: checkUrl,
        data: $('#parentsForm').serialize(),
        async: false,
        success: function(src) {
            if (checkAjaxResponse(src, companyCode)) {
                str ='noError';
                if(!src.match(str)){
                    var msg = '<div class="kc-co-alert-area"><ul>';
                    var messages = src.split('|');
                    for (var i = 0; i < messages.length; i++) {
                        msg += "<li>" + messages[i] + "</li>";
                    }
                    msg += "</ul></div>";
                    $('#errMsg').html(msg);
                    $('#errMsg').show();
                    $(document).ready(function(){
                        /* メッセージエリア */
                        $('.kc-co-message-box').wrap('<div class="kc-co-message-box-wrap"></div>');
                        //$('.kc-co-message-box').corner('round 5px').parent().corner('round 5px');

                        /* エラーメッセージエリア */
                        $('.kc-co-alert-area').wrap('<div class="kc-co-alert-area-wrap"></div>');
                        //$('.kc-co-alert-area').corner('round 5px').parent().corner('round 10px');
                    });
                } else {
                    $('#errMsg').hide();
                    submitDownloadForm(submitUrl);
                }
            }
        },
        error: function(xhr, status, e) {}
    });
}

/*
 * 管理者トップ 現在のステータス
 */
function showCurrentGraph(diskUrl, userUrl, courseUrl, companyCode)
{
    var domain = location.protocol + "//" + location.hostname;
    showDiskPieGraph(domain+diskUrl, companyCode);
    showUserPieGraph(domain+userUrl, companyCode);
    showCoursePieGraph(domain+courseUrl, companyCode);
}
function showDiskPieGraph(url, companyCode)
{
    $('#diskGraph-loading').show();
    $('#diskGraph').hide();
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        dataType: "json",
        success: function(data) {
            var graphData = [];
            var graphLabel = [];
            var backgroundColor = [
                data["elements"][0]["colours"][0].replace('rgb', 'rgba').replace(')', ','+data["elements"][0]["alpha"]+')'),
                data["elements"][0]["colours"][1].replace('rgb', 'rgba').replace(')', ','+data["elements"][0]["alpha"]+')')
            ];
            var hoverBackgroundColor = data["elements"][0]["colours"];
            var graphBackgroundColor = data["bg_colour"];
            var color = [backgroundColor, hoverBackgroundColor];
            var graphType = data["elements"][0]["type"];
            var tip = data["elements"][0]["tip"];
            var degrees = data["elements"][0]["start-angle"];
            var count = 0;
            //グラフデータを取得する
            $.each(data["elements"][0]["values"], function(index, value) {
                graphData.push(Math.abs(value["value"]));
                if (parseFloat(value["value"]) > 0) {
                    count++;
                }
                graphLabel.push(value["label"]);
            });
            $('#diskGraph-loading').hide();
            $('#diskGraph').show();
            if(count > 0) {
                //グラフデータがある場合
                drawPieGraph('diskGraph', graphBackgroundColor, graphType, graphData, graphLabel, color, tip, degrees);
            } else {
                //グラフデータがない場合
                var parent = $("#diskGraph").parent();
                $("#diskGraph").remove();
                parent.prepend("<canvas id='"+'diskGraph'+"' style='width:305px;height:200px;background-color: "+data["bg_colour"]+";'></canvas>");
            }
        },
        error: function(xhr, status, e) {
            $('#diskGraph-loading').hide();
        }
    });
}
function showUserPieGraph(url, companyCode)
{
    $('#userGraph-loading').show();
    $('#userGraph').hide();
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        dataType: "json",
        success: function(data) {
            var graphData = [];
            var graphLabel = [];
            var backgroundColor = [
                data["elements"][0]["colours"][0].replace('rgb', 'rgba').replace(')', ','+data["elements"][0]["alpha"]+')'),
                data["elements"][0]["colours"][1].replace('rgb', 'rgba').replace(')', ','+data["elements"][0]["alpha"]+')')
            ];
            var hoverBackgroundColor = data["elements"][0]["colours"];
            var graphBackgroundColor = data["bg_colour"];
            var color = [backgroundColor, hoverBackgroundColor];
            var graphType = data["elements"][0]["type"];
            var tip = data["elements"][0]["tip"];
            var degrees = data["elements"][0]["start-angle"];
            var count = 0;
            //グラフデータを取得する
            $.each(data["elements"][0]["values"], function(index, value) {
                graphData.push(Math.abs(value["value"]));
                if (parseFloat(value["value"]) > 0) {
                    count++;
                }
                graphLabel.push(value["label"]);
            });
            $('#userGraph-loading').hide();
            $('#userGraph').show();
            if(count > 0) {
                //グラフデータがある場合
                drawPieGraph('userGraph', graphBackgroundColor, graphType, graphData, graphLabel, color, tip, degrees);
            } else {
                //グラフデータがない場合
                var parent = $("#userGraph").parent();
                $("#userGraph").remove();
                parent.prepend("<canvas id='"+'userGraph'+"' style='width:305px;height:200px;background-color: "+data["bg_colour"]+";'></canvas>");
            }
        },
        error: function(xhr, status, e) {
            $('#userGraph-loading').hide();
        }
    });
}
function showCoursePieGraph(url, companyCode)
{
    $('#courseGraph-loading').show();
    $('#courseGraph').hide();
    $.ajax({
        type: "POST",
        url: url,
        async: true,
        dataType: "json",
        success: function(data) {
            var graphData = [];
            var graphLabel = [];
            var backgroundColor = [
                data["elements"][0]["colours"][0].replace('rgb', 'rgba').replace(')', ','+data["elements"][0]["alpha"]+')'),
                data["elements"][0]["colours"][1].replace('rgb', 'rgba').replace(')', ','+data["elements"][0]["alpha"]+')')
            ];
            var hoverBackgroundColor = data["elements"][0]["colours"];
            var graphBackgroundColor = data["bg_colour"];
            var color = [backgroundColor, hoverBackgroundColor];
            var graphType = data["elements"][0]["type"];
            var tip = data["elements"][0]["tip"];
            var degrees = data["elements"][0]["start-angle"];
            var count = 0;
            //グラフデータを取得する
            $.each(data["elements"][0]["values"], function(index, value) {
                graphData.push(Math.abs(value["value"]));
                if (parseFloat(value["value"]) > 0) {
                    count++;
                }
                graphLabel.push(value["label"]);
            });
            $('#courseGraph-loading').hide();
            $('#courseGraph').show();
            if(count > 0) {
                //グラフデータがある場合
                drawPieGraph('courseGraph', graphBackgroundColor, graphType, graphData, graphLabel, color, tip, degrees);
            } else {
                //グラフデータがない場合
                var parent = $("#courseGraph").parent();
                $("#courseGraph").remove();
                parent.prepend("<canvas id='"+'courseGraph'+"' style='width:305px;height:200px;background-color: "+data["bg_colour"]+";'></canvas>");
            }
        },
        error: function(xhr, status, e) {
            $('#courseGraph-loading').hide();
        }
    });
}

/*
 * 住所検索
 */
function setAddress(getId, setId, url, companyCode)
{

    postCode = document.getElementById(getId).value;
    setElementValue('searchPostCode',postCode);

    $.ajax({
        type: "POST",
        dataType: "json",
        url: url,
        data: $("#parentsForm").serialize(true),
        async: true,
        success: function(json) {

            if (json) {
                if (checkAjaxResponse(json, companyCode)) {
                    document.getElementById(setId).value = json;
                }
            } else {
                document.getElementById(setId).value = "";
            }
        },
        error: function(xhr, status, e) {}
    });
}


/*
 * ブレンド・教材 ajax
 */
function loadHtml(url, companyCode)
{
    $.ajax({
        type: "POST",
        url: url,
        data: $('#parentsForm').serialize(),
        async: false,
        success: function(html) {
            if (checkAjaxResponse(html, companyCode)) {
                parent.$('#org-data').hide();
                parent.$('#new-data').html(html);
                parent.window.focus();
                parent.$.fancybox.close();
            }
        },
        error: function(xhr, status, e) {}
    });
}
/*
 * アクセス制御
 * メニュー一覧
 *
 *  ajax
 */
function innerSubmit(url, companyCode)
{
  $.ajax({
    type: "POST",

    url: url,
    data: $('#parentsForm').serialize(),
    async: false,
    success: function(msg) {
        if (checkAjaxResponse(msg, companyCode)) {
            str ='alert';
            if(msg.match(str)){
                $('#errMsg').show();
                $('#errMsg').html(msg);
                $(document).ready(function(){
                    /* メッセージエリア */
                    $('.kc-co-message-box').wrap('<div class="kc-co-message-box-wrap"></div>');
                    /* $('.kc-co-message-box').corner('round 5px').parent().corner('round 5px'); */

                    /* エラーメッセージエリア */
                    $('.kc-co-alert-area').wrap('<div class="kc-co-alert-area-wrap"></div>');
                    /* $('.kc-co-alert-area').corner('round 5px').parent().corner('round 10px'); */
                });
            } else {
                parent.$('#org-data').hide();
                parent.$('#new-data').html(msg);
                parent.$.fancybox.close();
            }
        }
    },

    error: function(xhr, status, e) {}
  });
}

/*
 * 更新
 * アクセス制御
 * メニュー一覧
 *  ajax
 */
function innerEditSubmit(url,objNm1, objNm2, companyCode)
{
  $.ajax({
    type: "POST",
    url: url,
    data: $('#parentsForm').serialize(),
    async: false,
    success: function(msg) {
        if (checkAjaxResponse(msg, companyCode)) {
            str ='alert';
            if(msg.match(str)){
                $('#errMsg').show();
            $('#errMsg').html(msg);
            $(document).ready(function(){
            /* メッセージエリア */
            $('.kc-co-message-box').wrap('<div class="kc-co-message-box-wrap"></div>');
            /* $('.kc-co-message-box').corner('round 5px').parent().corner('round 5px'); */

            /* エラーメッセージエリア */
            $('.kc-co-alert-area').wrap('<div class="kc-co-alert-area-wrap"></div>');
            /* $('.kc-co-alert-area').corner('round 5px').parent().corner('round 10px'); */
                });
            } else {
               //parent.$('#org-data').hide();
            no = $('#applyOrder').val();
            parent.$(objNm1 + '_' + no).html($(objNm1).val());
            parent.$(objNm2 + '_' + no).html(msg);
                parent.$.fancybox.close();
            }
        }
    },
    error: function(xhr, status, e) {}
  });
}

/*
 * 更新
 * アクセス制御
 *  ajax
 */
function innerDeviceEditSubmit(url, objNm1, objNm2, companyCode)
{
    $.ajax({
        type: "POST",
        url: url,
        data: $('#parentsForm').serialize(),
        async: false,
        success: function(msg) {
            if (checkAjaxResponse(msg, companyCode)) {
                str ='alert';
                if(msg.match(str)){
                    $('#errMsg').show();
                    $('#errMsg').html(msg);
                    $(document).ready(function(){
                        /* メッセージエリア */
                        $('.kc-co-message-box').wrap('<div class="kc-co-message-box-wrap"></div>');
                        /* $('.kc-co-message-box').corner('round 5px').parent().corner('round 5px'); */

                        /* エラーメッセージエリア */
                        $('.kc-co-alert-area').wrap('<div class="kc-co-alert-area-wrap"></div>');
                        /* $('.kc-co-alert-area').corner('round 5px').parent().corner('round 10px'); */
                    });
                } else {
                    //parent.$('#org-data').hide();
                    device = $('#deviceType').val();
                    no = $('#applyOrder').val();
                    parent.$(objNm1 + '_' + device + '_' + no).html($(objNm1).val());
                    parent.$(objNm2 + '_' + device + '_' + no).html(msg);
                    parent.$.fancybox.close();
                }
            }
        },
        error: function(xhr, status, e) {}
    });
}

/*
 * JSON形式の戻り値から
 * リストを作成する
 *  ajax
 */

function getDefaultList(idName, url, companyCode) {
    new $.ajax({
            type: "POST",
            dataType: "json",
            url: url,
            data: $("#parentsForm").serialize(true),
            async: true,
            success: function(json) {
                if (checkArrayAjaxResponse(json, companyCode)) {
                    FillDropDown(json, idName)
                }
            },
            error: function(xhr, status, e) {}
     });
}

/*
 * リストを作成する
 *  ajax
 */
function FillDropDown(result, idName)
{
    var itemValue =$(idName).val();
    var num = result.length;
    $(idName).children().remove();

    for (var i=0; i<num; i++) {
        $("<OPTION></OPTION>").val(result[i].jsonid).text(result[i].name).appendTo(idName);


    }
    $(idName).val(itemValue);
}

/*
 * Ajaxアクセス時の共通エラー処理
 * 正常系の場合、戻り値がJSON形式で2次元配列の場合
 */
function checkArrayAjaxResponse(obj, companyCode)
{
    try {

        for (var i in obj) {
            if (i == "id") {
                // 強制エラー画面遷移
                location.href = "/" + companyCode + "/ajax/error/msgId/" + obj.id;
                return false;
            }
        }
        return true;
    } catch (e) {
        location.href = "/" + companyCode + "/ajax/error/msgId/KC00E002";
    }

}

/*
 * ボタンの有効／無効化
 */
function changeBtnByCheck(name)
{
    if ($("input[name='"+name+"']:checked").length) {
        $("div.toggle-btn").children("span").hide();
        $("div.toggle-btn").children("a").show();
    } else {
        $("div.toggle-btn").children("a").hide();
        $("div.toggle-btn").children("span").show();
    }
}

function clearErrorMessage()
{
    if ("block" == $("div#errMsg").css("display")) {
        $("div#errMsg").css("display", "none");
    }
}

function deleteApproval(type)
{
    if (type == "superior") {
        document.getElementById("superiorApprovalUserCode").value = '';
        if (document.getElementById("superiorApprovalUserName") != null
            && document.getElementById("superiorApprovalUserName") != "undefined"
        ) {
            document.getElementById("superiorApprovalUserName").value = '';
        }
        if (document.getElementById("superiorApprovalCompanyName") != null
            && document.getElementById("superiorApprovalCompanyName") != "undefined"
        ) {
            document.getElementById("superiorApprovalCompanyName").value = '';
        }
        if (document.getElementById("superiorApprovalGroupName") != null
            && document.getElementById("superiorApprovalGroupName") != "undefined"
        ) {
            document.getElementById("superiorApprovalGroupName").value = '';
        }
        document.getElementById("kc-co-td-superior-user").innerHTML = '';
        document.getElementById("kc-co-td-superior-company").innerHTML = '';
        if (document.getElementById("kc-co-td-superior-group") != null
            && document.getElementById("kc-co-td-superior-group") != "undefined"
        ) {
            document.getElementById("kc-co-td-superior-group").innerHTML = '';
        }
    } else if (type == "budget") {
        document.getElementById("budgetApprovalUserCode").value = '';
        if (document.getElementById("budgetApprovalUserName") != null
            && document.getElementById("budgetApprovalUserName") != "undefined"
        ) {
            document.getElementById("budgetApprovalUserName").value = '';
        }
        if (document.getElementById("budgetApprovalCompanyName") != null
            && document.getElementById("budgetApprovalCompanyName") != "undefined"
        ) {
            document.getElementById("budgetApprovalCompanyName").value = '';
        }
        if (document.getElementById("budgetApprovalGroupName") != null
            && document.getElementById("budgetApprovalGroupName") != "undefined"
        ) {
            document.getElementById("budgetApprovalGroupName").value = '';
        }
        if (document.getElementById("budgetApprovalGroupShortName") != null
            && document.getElementById("budgetApprovalGroupShortName") != "undefined"
        ) {
            document.getElementById("budgetApprovalGroupShortName").value = '';
        }
        document.getElementById("kc-co-td-budget-user").innerHTML = '&nbsp;';
        document.getElementById("kc-co-td-budget-company").innerHTML = '&nbsp;';
        if (document.getElementById("kc-co-td-budget-group") != null
            && document.getElementById("kc-co-td-budget-group") != "undefined"
        ) {
            document.getElementById("kc-co-td-budget-group").innerHTML = '&nbsp;';
        }
    }
    parent.window.focus();
    parent.$.fancybox.close();
}

function isMobileAgent() {
    strUA = navigator.userAgent.toLowerCase();
    if (strUA.indexOf("ipad") != -1
        || strUA.indexOf("iphone") != -1
        || strUA.indexOf("android") != -1
    ) {
        return true;
    }
    return false;
}

/*
* パスワード変更画面
* onloadイベント時に、現在の入力文字数をセットします。
*/
function countTextOnload(inId, outId) {

   var elContent = $('#' + inId);
   var elCounter = $('#' + outId);

   var counter = elContent.val().length;
   elCounter.text(counter);
   if(counter == 0){
       elCounter.text("0");
   }
}

/* ================================================== */
/*!
 * jquery.droppy.js
 */
/*
 * Droppy 0.1.2
 * (c) 2008 Jason Frame (jason@onehackoranother.com)
 */

  $(function() {
    $('#kc-co-nav').droppy({speed:1});
  });


$.fn.droppy = function(options) {

  options = $.extend({speed: 250}, options || {});

  this.each(function() {

    var root = this, zIndex = 1000;

    function getSubnav(ele) {
      if (ele.nodeName.toLowerCase() == 'li') {
        var subnav = $('> ul', ele);
        return subnav.length ? subnav[0] : null;
      } else {
        return ele;
      }
    }

    function getActuator(ele) {
      if (ele.nodeName.toLowerCase() == 'ul') {
        return $(ele).parents('li')[0];
      } else {
        return ele;
      }
    }

    function hide() {
      var subnav = getSubnav(this);
      if (!subnav) return;
      $.data(subnav, 'cancelHide', false);
      setTimeout(function() {
        if (!$.data(subnav, 'cancelHide')) {
          $(subnav).css({zIndex: 0}).slideUp(options.speed);
        }
      }, 1);
    }

    function show() {
      var subnav = getSubnav(this);
      if (!subnav) return;
      $.data(subnav, 'cancelHide', true);
      $(this).css('z-index', zIndex);
      $(subnav).css({zIndex: zIndex++}).slideDown(options.speed);
      if (this.nodeName.toLowerCase() == 'ul') {
        var li = getActuator(this);
        $(li).addClass('hover');
        $('> a', li).addClass('hover');
      }

    }

    $('li', this).hover(show, hide);
    $('li', this).hover(
      function() { $(this).addClass('hover'); $('> a', this).addClass('hover'); },
      function() { $(this).removeClass('hover'); $('> a', this).removeClass('hover'); }
    );

  });

};

/* ================================================== */
/*!
/ * jquery.accordion.impl.js
/ */
jQuery().ready(function(){
    // simple accordion
    jQuery('#list1b').accordion({
        header: '.kc-co-accordion-head',
        autoheight: false,
        collapsible: true,
        heightStyle: "content"
    });

    // bind to change event of select to control first and seconds accordion
    // similar to tab's plugin triggerTab(), without an extra method
    var accordions = jQuery('#list1b');

    jQuery('#switch select').change(function() {
        accordions.accordion("activate", this.selectedIndex-1 );
    });
    jQuery('#close').click(function() {
        accordions.accordion("activate", -1);
    });
    jQuery('#switch2').change(function() {
        accordions.accordion("activate", this.value);
    });
    jQuery('#enable').click(function() {
        accordions.accordion("enable");
    });
    jQuery('#disable').click(function() {
        accordions.accordion("disable");
    });
    jQuery('#remove').click(function() {
        accordions.accordion("destroy");
        wizardButtons.unbind("click");
    });
});

jQuery().ready(function(){
    jQuery('#free-course-table-title').click(function() {
        var tableDisplay = jQuery('#free-course-table-body').css('display');
        if (tableDisplay === 'none') {
            jQuery('#free-course-table-head').css('display', '');
            jQuery('#free-course-table-body').css('display', '');
        } else {
            jQuery('#free-course-table-head').css('display', 'none');
            jQuery('#free-course-table-body').css('display', 'none');
        }

        var linkDisplay = jQuery('#to-free-course-list-link').css('display');
        if (linkDisplay === 'none') {
            jQuery('#to-free-course-list-link').css('display', '');
        } else {
            jQuery('#to-free-course-list-link').css('display', 'none');
        }
    });
});

/* ================================================== */
/*!
/ * jquery.accordion.impl.js
/ */
jQuery().ready(function(){
    // simple accordion
    jQuery('#list2b').accordion({
        header: '.kc-co-accordion-head',
        autoheight: false,
        collapsible: true,
        heightStyle: "content"
    });

    // bind to change event of select to control first and seconds accordion
    // similar to tab's plugin triggerTab(), without an extra method
    var accordions = jQuery('#list2b');

        jQuery('#kc-co-accordion-free-course').click(function() {
        var linkDisplay = jQuery('#to-free-course-list-link').css('display');
        if (linkDisplay === 'none') {
            jQuery('#to-free-course-list-link').css('display', '');
        } else {
            jQuery('#to-free-course-list-link').css('display', 'none');
        }
    });
});
/*
 * アクセス制御
 *
 *  ajax
 */
function innerDeviceSubmit(url, companyCode)
{
    var showDeviceType = parent.$('#showDeviceType').val();
    $('#deviceType').val(showDeviceType);

    $.ajax({
        type: "POST",

        url: url,
        data: $('#parentsForm').serialize(),
        async: false,
        success: function(msg) {
            if (checkAjaxResponse(msg, companyCode)) {
                str ='alert';
                if(msg.match(str)){
                    $('#errMsg').show();
                    $('#errMsg').html(msg);
                    $(document).ready(function(){
                        /* メッセージエリア */
                        $('.kc-co-message-box').wrap('<div class="kc-co-message-box-wrap"></div>');
                        /* $('.kc-co-message-box').corner('round 5px').parent().corner('round 5px'); */

                        /* エラーメッセージエリア */
                        $('.kc-co-alert-area').wrap('<div class="kc-co-alert-area-wrap"></div>');
                        /* $('.kc-co-alert-area').corner('round 5px').parent().corner('round 10px'); */
                    });
                } else {
                    parent.$('#org-data').hide();
                    parent.$('#new-data').html(msg);
                    parent.$.fancybox.close();
                }
            }
        },

        error: function(xhr, status, e) {}
    });
}

/**
 * アクセス制御一覧タブ変更
 * @param {string} deviceType
 * @returns {void}
 */
function changeAccessListTab(deviceType) {
    $('.kc-co-tab-on').addClass('kc-co-tab-off').removeClass('kc-co-tab-on');
    $('#tab_' + deviceType).addClass('kc-co-tab-on').removeClass('kc-co-tab-off');
    $('#showDeviceType').val(deviceType);
    $('.kc-co-tab-box tbody tr.device-' + deviceType).show();
    $('.kc-co-tab-box tbody tr').not('.device-' + deviceType).hide();
    $('.kc-co-tab-box tbody tr.device-' + deviceType + ':first input[type="radio"]').prop('checked', true);
}

function showDownloadConfirmModalDialog(){
    $('#dialog').jqm({
        modal: true
    });
    $('#dialog').jqmShow();
}

function searchCourseModalDialog(idName){
    if (idName == 'dialogGroup') {
        $('#dialogGroup').jqm({
            modal: true
        });
        $('#dialogGroup').jqmShow();
    } else if (idName == 'dialogSchedule') {
        $('#dialogSchedule').jqm({
            modal: true
        });
        $('#dialogSchedule').jqmShow();
    }
}

/*
 * slide down/up bom check area
 */
function addBomCheckByCharset()
{
    var val1 = $("input[type='radio'][name=downloadCharset]:checked").val();
    if(val1 == "UTF-8"){
        $('.kc-co-slide01').slideDown('normal');
    } else {
        $('.kc-co-slide01').slideUp('normal');
    }
}

/*
 * slide down/up bom check area for Ex
 */
function addBomCheckByCharsetEx()
{
    var val1 = $('input:radio[name="downloadCharset[downloadCharset]"]:checked').val();
    if(val1 == "UTF-8"){
        $('.kc-co-slide01').slideDown('normal');
    } else {
        $('.kc-co-slide01').slideUp('normal');
    }
}

/*
 * 社内IPアクセス設定解除
 *  ajax
 */
function innerInternalIpSubmit(url, companyCode)
{
    $.ajax({
        type: "POST",

        url: url,
        data: $('#parentsForm').serialize(),
        async: false,
        success: function(msg) {
            if (checkAjaxResponse(msg, companyCode)) {
                str ='alert';
                if(msg.match(str)){
                    $('#errMsg').show();
                    $('#errMsg').html(msg);
                    $(document).ready(function(){
                        /* エラーメッセージエリア */
                        $('.kc-co-alert-area').wrap('<div class="kc-co-alert-area-wrap"></div>');
                        /* $('.kc-co-alert-area').corner('round 5px').parent().corner('round 10px'); */
                    });
                } else {
                    parent.$('#org-data').hide();
                    parent.$('#new-data').html(msg);
                    parent.$.fancybox.close();
                }
            }
        },
        error: function(xhr, status, e) {}
    });
}

/*
 * 社内IPアドレス設定登録
 *  ajax
 */
function innerInternalIpRegistSubmit(url, companyCode)
{
    $.ajax({
        type: "POST",

        url: url,
        data: $('#parentsForm').serialize(),
        async: false,
        success: function(msg) {
            if (checkAjaxResponse(msg, companyCode)) {
                str ='alert';
                if(msg.match(str)){
                    $('#errMsg').show();
                    $('#errMsg').html(msg);
                    $(document).ready(function(){
                        /* エラーメッセージエリア */
                        $('.kc-co-alert-area').wrap('<div class="kc-co-alert-area-wrap"></div>');
                        /* $('.kc-co-alert-area').corner('round 5px').parent().corner('round 10px'); */
                    });
                } else {
                    parent.$('#org-data').hide();
                    parent.$('#new-data').html(msg);
                    parent.$.fancybox.close();
                }
            }
        },
        error: function(xhr, status, e) {}
    });
}

/*
 * 社内IPアドレス設定変更
 *  ajax
 */
function innerInternalIpEditSubmit(url, objNm1, companyCode)
{
    $.ajax({
        type: "POST",
        url: url,
        data: $('#parentsForm').serialize(),
        async: false,
        success: function(msg) {
            if (checkAjaxResponse(msg, companyCode)) {
                str ='alert';
                if(msg.match(str)){
                    $('#errMsg').show();
                    $('#errMsg').html(msg);
                    $(document).ready(function(){
                        /* エラーメッセージエリア */
                        $('.kc-co-alert-area').wrap('<div class="kc-co-alert-area-wrap"></div>');
                        /* $('.kc-co-alert-area').corner('round 5px').parent().corner('round 10px'); */
                    });
                } else {
                    no = $('#applyOrder').val();
                    parent.$(objNm1 + '_' + no).html($(objNm1).val());
                    parent.$.fancybox.close();
                }
            }
        },
        error: function(xhr, status, e) {}
    });
}

/*
 * precondition judgment
 */
function preconditionCheck(cartNo, courseRegistNo, courseCode, companyCode, publisherCompanyCode)
{
    if (cartNo == null || courseRegistNo == null || courseCode == null || companyCode == null || publisherCompanyCode == null) {
        return null;
    }
    $('.c_precond_' + courseRegistNo).css('display', 'none');
    $.ajax({
        type: "POST",
        url: "/" + companyCode + "/ajax/get-precondition-result",
        data: {'cartNo':cartNo, 'courseRegistNo':courseRegistNo, 'courseCode':courseCode, 'publisherCompanyCode':publisherCompanyCode},
        dataType:'json',
        async: false,
        success: function(result) {
            $('#errMsg').hide();
            if (result === null) {
                var msg = '<div class="kc-co-alert-area"><ul>';
                var message = jsonMessage;
                msg += "<li>" + message + "</li>";
                msg += "</ul></div>";
                $('#errMsg').html(msg);
                $('#errMsg').show();
                $(document).ready(function(){
                    /* エラーメッセージエリア */
                    $('.kc-co-alert-area').wrap('<div class="kc-co-alert-area-wrap"></div>');
                    /* $('.kc-co-alert-area').corner('round 5px').parent().corner('round 10px'); */
                });
            } else {
                $.each(result, function(userCode, suc) {
                    id = 'precondition-mark-'+courseRegistNo+'-'+userCode;
                    element = document.getElementById(id);
                    $(element).show();
                    if (suc == false) {
                        $(element).children("#precondition-mark").attr('src','/img/icon_precondition_fail.gif');
                    }
                });
            }
        },
        error: function(xhr, status, e) {}
    });
}
function clearElementValueSortContent()
{
    $(document).ready(function(){
        document.getElementById('sortContentsId').value;
    });
}
function cancelUndetermined()
{
    document.getElementById('unDetermined').value = CANCEL_FILTER_UNDETERMINED;
}
function filterUndetermined()
{
    document.getElementById('unDetermined').value = FILTER_UNDETERMINED;
}
function clearnCategory()
{
    document.getElementById('categoryCode').disabled = true;
}
function checkIos()
{
    var strUA = navigator.userAgent.toLowerCase();
    if (strUA.indexOf("ipad") != -1 || strUA.indexOf("iphone") != -1 || (strUA.indexOf("macintosh") != -1 && typeof document.ontouchstart !== 'undefined')) {
        return true;
    } else {
        return false;
    }
}
function openUdemyWindow(url)
{
    var win = window.open(url);
}

/*
 * ダウンロード時のメッセージ表示処理
 *  ajax
 */
function checkDownloadMessage(ajaxUrl, downloadUrl){
    $.ajax({
        url: ajaxUrl,
        async: false,
        dataType: 'json',
        type: 'POST',
        success: function(json){
            if (json.showConfirmModalDialog == true) {
                $('#confirmTitle').text(json.confirmTitle);
                $('#confirmMsg').text(json.confirmMsg);
                $('#cancelButton').text(json.cancelButton);
                $('#downloadButton').text(json.downloadButton);
                $('#downloadButton').attr('onclick', "javascript:submitDownloadForm('"+downloadUrl+"');$('#dialog').jqmHide();return false;");

                 showDownloadConfirmModalDialog();

            } else {
                submitDownloadForm(downloadUrl);
            }
        },
        error: function(e){
            alert('error!');
        }
    });
}

/*
 * 重複申込チェックと既受講チェックを実行します。
 * 戻る：trueの場合、ダイアログが表示します。
 * 戻る：falseの場合、ダイアログが表示されない。次の処理を実行します
 * ajax
 */
function checkCourseConfirmMessage(ajaxUrl, downloadUrl, confirmUrl, companyCode, proxy, mode, clickedCompanyCode, clickedCourseCode, clickedStartDate, clickedStartTime, clickedRoomCode, checkApply){
    if(mode == 'scheduleList') {
        ajaxUrl = ajaxUrl + '?mode=' + mode + '&clickedCompanyCode=' + clickedCompanyCode + '&clickedCourseCode=' + clickedCourseCode + '&clickedStartDate=' + clickedStartDate + '&clickedStartTime=' + clickedStartTime + '&clickedRoomCode=' + clickedRoomCode;
    } else if(mode == 'detail') {
        ajaxUrl = ajaxUrl + '?mode=' + mode + '&clickedCompanyCode=' + clickedCompanyCode + '&clickedCourseCode=' + clickedCourseCode;
    }
    $.ajax({
        url: ajaxUrl,
        async: false,
        dataType: 'json',
        data: $("#parentsForm").serialize(),
        type: 'POST',
        success: function(json){
            if (json.showCourseConfirmDialog == true) {
                $('#confirmTitle').text(json.confirmTitle);
                $('#confirmMsg').html(json.confirmMsg);
                $('#duplicateCourseList').text(json.duplicateCourseList);
                $('#courseInCart1').text(json.courseInCart1);
                $('#courseInCart2').text(json.courseInCart2);
                $('#courseDuplicateTitle').text(json.courseDuplicateTitle);
                $('#attendedCourseList').text(json.attendedCourseList);
                $('#courseAttendedTitle').text(json.courseAttendedTitle);
                $('#cancelButton').text(json.cancelButton);
                $('#downloadButton').text(json.downloadButton);
                $('#downloadButton').attr('onclick', "javascript:setValueDownloadCharset();submitDownloadForm('"+downloadUrl+"');$('#dialog').jqmHide();return false;");
                $('#continueButton').text(json.continueButton);
                if(companyCode == null && clickedCompanyCode == null && clickedCourseCode == null && clickedStartDate == null && clickedStartTime == null && clickedRoomCode == null){
                    $('#continueButton').attr('onclick', "javascript:submitForm('"+confirmUrl+"');$('#dialog').jqmHide();return false;");
                } else {
                    if(clickedStartTime != "") {
                        $('#continueButton').attr('onclick', "javascript:checkRegist('"+companyCode+"', '"+proxy+"', 'scheduleList', '"+clickedCompanyCode+"', '"+clickedCourseCode+"', '"+clickedStartDate+"', '"+clickedStartTime+"', '"+clickedRoomCode+"');$('#dialog').jqmHide();return false;");
                    } else if(clickedStartTime == "") {
                        if(checkApply) {
                            $('#continueButton').attr('onclick', "javascript:showDeleteModalDialogCheckRegist('"+companyCode+"', '"+proxy+"', 'detail', '"+clickedCompanyCode+"', '"+clickedCourseCode+"');$('#dialog').jqmHide();return false;");
                        } else {
                            $('#continueButton').attr('onclick', "javascript:checkRegist('"+companyCode+"', '"+proxy+"', 'detail', '"+clickedCompanyCode+"', '"+clickedCourseCode+"');$('#dialog').jqmHide();return false;");
                        }
                    }
                }
                if(json.mode == 'detail'){
                    removeRenderAttendedCourses();
                    if(json.attendedCourses != null && json.attendedCourses.length != 0) {
                        renderAttendedCourses(json.attendedCourses);
                    }
                }else if(json.mode == 'scheduleList') {
                    removeRenderDuplicateCourses();
                    removeRenderAttendedCourses();
                    if(json.duplicateCourses != null && json.duplicateCourses.length != 0) {
                        renderDuplicateCourses(json.duplicateCourses);
                    }
                    if(json.attendedCourses != null && json.attendedCourses.length != 0) {
                        renderAttendedCourses(json.attendedCourses);
                    }
                }
                showDownloadConfirmModalDialog();
                settingScrollTopDialogContent();
            } else {
                if(companyCode == null && clickedCompanyCode == null && clickedCourseCode == null && clickedStartDate == null && clickedStartTime == null && clickedRoomCode == null){
                    submitForm(confirmUrl);
                } else {
                    if(clickedStartTime != "") {
                        checkRegist(companyCode, proxy, mode, clickedCompanyCode, clickedCourseCode, clickedStartDate, clickedStartTime, clickedRoomCode);
                    } else if (clickedStartTime == "") {
                        if(checkApply) {
                            showDeleteModalDialogCheckRegist(companyCode, proxy, mode, clickedCompanyCode, clickedCourseCode);
                        } else {
                            checkRegist(companyCode, proxy, mode, clickedCompanyCode, clickedCourseCode);
                        }
                    }
                }
            }
       },
        error: function(e){
            alert("error!");
        }
    });
}

/*
 * ダイアログで重複申込の表示処理
 */
function renderDuplicateCourses(duplicateCourseList){
    var duplicateCourse = [];
    duplicateCourse.push('<div class="kc-co-header-duplicate-course" id="duplicateCourseList">'+getMessageResource('duplicateCourseList')+'</div>');
    duplicateCourse.push('<div class="kc-co-table-course-content">');
    duplicateCourse.push('<table class="kc-co-table-course-format">');
    duplicateCourse.push('<colgroup><col style="width:19%"><col style="width:10.5%"><col style="width:9.5%"><col style="width:4px"><col style="width:9%;"><col style="width:1%"><col style="width:19%"><col style="width:10.5%"><col style="width:9.5%"><col style="width:4px"><col style="width:9%"></colgroup>');
    duplicateCourse.push('<tbody>');
    duplicateCourse.push('<tr>');
    duplicateCourse.push('<td colspan = "5" class="kc-co-header-course-list" id="courseInCart1">'+getMessageResource('courseAppliedTitle')+'</td>');
    duplicateCourse.push('<td colspan = "1"></td>');
    duplicateCourse.push('<td colspan = "5" class="kc-co-header-course-list" id="courseDuplicateTitle">'+getMessageResource('courseDuplicateTitle')+'</td>');
    duplicateCourse.push('</tr>');
    duplicateCourse.push('<tr>');
    duplicateCourse.push('<td colspan = "1" class="kc-co-header-course-list">'+getMessageResource('courseName')+'('+getMessageResource('courseCode')+')</td>');
    duplicateCourse.push('<td colspan = "1" class="kc-co-header-course-list" style="text-align: right;">'+getMessageResource('startTime')+'</td>');
    duplicateCourse.push('<td colspan = "1" class="kc-co-header-course-list" style="text-align: right;">'+getMessageResource('endTime')+'</td>');
    duplicateCourse.push('<td colspan = "1" class="kc-co-header-course-list"></td>');
    duplicateCourse.push('<td colspan = "1" class="kc-co-header-course-list">'+getMessageResource('roomName')+'</td>');
    duplicateCourse.push('<td colspan = "1"></td>');
    duplicateCourse.push('<td colspan = "1" class="kc-co-header-course-list">'+getMessageResource('courseName')+'('+getMessageResource('courseCode')+')</td>');
    duplicateCourse.push('<td colspan = "1" class="kc-co-header-course-list" style="text-align: right;">'+getMessageResource('startTime')+'</td>');
    duplicateCourse.push('<td colspan = "1" class="kc-co-header-course-list" style="text-align: right;">'+getMessageResource('endTime')+'</td>');
    duplicateCourse.push('<td colspan = "1" class="kc-co-header-course-list"></td>');
    duplicateCourse.push('<td colspan = "1" class="kc-co-header-course-list">'+getMessageResource('roomName')+'</td></tr>');
    
    for (let i = 0; i < duplicateCourseList.length; i++) {
        const course = duplicateCourseList[i];
        const duplicateCourses = course.duplicate_courses;
        
        for (let j = 0; j < duplicateCourses.length; j++) {
          const duplicateCourseInfo = duplicateCourses[j];
            duplicateCourse.push('<tr>')
            if(j==0){
                duplicateCourse.push('<td id="courseInCart" style="word-break: break-word;">');
                if(course.parent_course_code!=null){
                    duplicateCourse.push('<img src="/img/blend.gif" alt="'+getMessageResource('blendSub')+'" width="34" height="18">');
                }
                duplicateCourse.push(course.course_name+'&nbsp;('+course.course_code+')</td>');
                if(course.start_date == null){
                    duplicateCourse.push('<td id="courseCartStartDate" style="text-align: right;">');
                } else {
                    duplicateCourse.push('<td id="courseCartStartDate" style="text-align: right;">'+convertFormatDate(course.start_date));
                }
                if(course.start_time == null){
                    duplicateCourse.push('</td>');
                } else {
                    duplicateCourse.push('<br/>'+convertFormatTime(course.start_time)+'</td>');
                }
                if(course.end_date == null){
                    duplicateCourse.push('<td id="courseCartEndDate" style="text-align: right;">');
                } else {
                    duplicateCourse.push('<td id="courseCartEndDate" style="text-align: right;">'+convertFormatDate(course.end_date));
                }
                if(course.end_time == null){
                    duplicateCourse.push('</td>');
                } else {
                    duplicateCourse.push('<br/>'+convertFormatTime(course.end_time)+'</td>');
                }
                duplicateCourse.push('<td></td>');
                if(course.room_name == null){
                    duplicateCourse.push('<td id="courseCartRoom" style="word-break: break-word;"></td>');
                } else {
                    duplicateCourse.push('<td id="courseCartRoom" style="word-break: break-word;">'+course.room_name+'</td>');
                }
                duplicateCourse.push('<td></td>');
            } else {
                duplicateCourse.push('<td id="courseInCart" style="word-break: break-word;"></td>');
                duplicateCourse.push('<td id="courseCartStartDate" style="text-align: right;"></td>');
                duplicateCourse.push('<td id="courseCartEndDate" style="text-align: right;"></td>');
                duplicateCourse.push('<td></td>');
                duplicateCourse.push('<td id="courseCartRoom" style="word-break: break-word;"></td>');
                duplicateCourse.push('<td></td>');
            }
            duplicateCourse.push('<td id="courseDuplicate" style="word-break: break-word;">');
            if(duplicateCourseInfo.parent_course_code!=null){
                duplicateCourse.push('<img src="/img/blend.gif" alt="'+getMessageResource('blendSub')+'" width="34" height="18">');
            }
            duplicateCourse.push(duplicateCourseInfo.course_name+'&nbsp;('+duplicateCourseInfo.course_code+')</td>');
            if(duplicateCourseInfo.fixed_start_date == null){
                duplicateCourse.push('<td id="courseDuplicateStartDate" style="text-align: right;">');
            } else {
                duplicateCourse.push('<td id="courseDuplicateStartDate" style="text-align: right;">'+convertFormatDate(duplicateCourseInfo.fixed_start_date));
            }
            if(duplicateCourseInfo.fixed_start_time == null){
                duplicateCourse.push('</td>');
            } else {
                duplicateCourse.push('<br/>'+convertFormatTime(duplicateCourseInfo.fixed_start_time)+'</td>');
            }
            if(duplicateCourseInfo.fixed_end_date == null){
                duplicateCourse.push('<td id="courseDuplicateEndDate" style="text-align: right;">');
            } else {
                duplicateCourse.push('<td id="courseDuplicateEndDate" style="text-align: right;">'+convertFormatDate(duplicateCourseInfo.fixed_end_date));
            }
            if(duplicateCourseInfo.fixed_end_time == null){
                duplicateCourse.push('</td>');
            } else {
                duplicateCourse.push('<br/>'+convertFormatTime(duplicateCourseInfo.fixed_end_time)+'</td>');
            }
            duplicateCourse.push('<td></td>');
            if(duplicateCourseInfo.room_name == null){
                duplicateCourse.push('<td id="courseDuplicateRoom" style="word-break: break-word;"></td>');
            } else {
                duplicateCourse.push('<td id="courseDuplicateRoom" style="word-break: break-word;">'+duplicateCourseInfo.room_name+'</td>');
            }
            duplicateCourse.push('</tr>');

        }
    }
    duplicateCourse.push('</tbody>');
    duplicateCourse.push('</table>');
    duplicateCourse.push('</div>');
    const element = document.querySelectorAll('.kc-co-content-area div');
    element[0].innerHTML = duplicateCourse.join('');
}

/*
 * ダイアログで既受講の表示処理
 */
function renderAttendedCourses(attendedCourseList){
    var attendedCourse = [];
    attendedCourse.push('<div class="kc-co-header-attentdance-course" id="attendedCourseList">'+getMessageResource('attendedCourseList')+'</div>');
    attendedCourse.push('<div class="kc-co-table-course-content">');
    attendedCourse.push('<table class="kc-co-table-course-format">');
    attendedCourse.push('<colgroup><col style="width:19%"><col style="width:10.5%"><col style="width:4px"><col style="width:18.5%"><col style="width:1%"><col style="width:19%"><col style="width:10.5%"><col style="width:4px"><col style="width:18.5%"></colgroup>');
    attendedCourse.push('<tbody>');
    attendedCourse.push('<tr>');
    attendedCourse.push('<td colspan = "4" class="kc-co-header-course-list" id="courseInCart2">'+getMessageResource('courseAppliedTitle')+'</td>');
    attendedCourse.push('<td colspan = "1"></td>');
    attendedCourse.push('<td colspan = "4" class="kc-co-header-course-list" id="courseAttendedTitle">'+getMessageResource('courseAttendedTitle')+'</td>');
    attendedCourse.push('</tr>');
    attendedCourse.push('<tr>');
    attendedCourse.push('<td colspan = "1" class="kc-co-header-course-list">'+getMessageResource('courseName')+'('+getMessageResource('courseCode')+')</td>')
    attendedCourse.push('<td colspan = "1" class="kc-co-header-course-list" style="text-align: right;">'+getMessageResource('startTime')+'</td>');
    attendedCourse.push('<td colspan = "1" class="kc-co-header-course-list"></td>');
    attendedCourse.push('<td colspan = "1" class="kc-co-header-course-list">'+getMessageResource('roomName')+'</td>');
    attendedCourse.push('<td colspan = "1"></td>');
    attendedCourse.push('<td colspan = "1" class="kc-co-header-course-list">'+getMessageResource('courseName')+'('+getMessageResource('courseCode')+')</td>');
    attendedCourse.push('<td colspan = "1" class="kc-co-header-course-list" style="text-align: right;">'+getMessageResource('startTime')+'</td>');
    attendedCourse.push('<td colspan = "1" class="kc-co-header-course-list"></td>');
    attendedCourse.push('<td colspan = "1" class="kc-co-header-course-list">'+getMessageResource('roomName')+'</td>');
    attendedCourse.push('</tr>');

    for (let i = 0; i < attendedCourseList.length; i++) {
        const course = attendedCourseList[i];
        const attendedCourses = course.attended_courses;
        
        for (let j = 0; j < attendedCourses.length; j++) {
          const attendedCourseInfo = attendedCourses[j];
            attendedCourse.push('<tr>')
            if(j==0){
                attendedCourse.push('<td id="courseInCart" style="word-break: break-word;">');
                if(course.parent_course_code!=null){
                    attendedCourse.push('<img src="/img/blend.gif" alt="'+getMessageResource('blendSub')+'" width="34" height="18">');
                }
                attendedCourse.push(course.course_name+'&nbsp;('+course.course_code+')</td>');
                if(course.start_date == null){
                    attendedCourse.push('<td id="courseCartStartDate"style="text-align: right;">');
                } else {
                    attendedCourse.push('<td id="courseCartStartDate"style="text-align: right;">'+convertFormatDate(course.start_date));
                }
                if(course.start_time == null){
                    attendedCourse.push('</td>');
                } else {
                    attendedCourse.push('<br/>'+convertFormatTime(course.start_time)+'</td>');
                }
                attendedCourse.push('<td></td>');
                if(course.room_name == null){
                    attendedCourse.push('<td id="courseCartRoom" style="word-break: break-word;"></td>');
                } else {
                    attendedCourse.push('<td id="courseCartRoom" style="word-break: break-word;">'+course.room_name+'</td>');
                }
                attendedCourse.push('<td></td>');
            } else {
                attendedCourse.push('<td id="courseInCart" style="word-break: break-word;"></td>');
                attendedCourse.push('<td id="courseCartStartDate"style="text-align: right;"></td>');
                attendedCourse.push('<td></td>');
                attendedCourse.push('<td id="courseCartRoom" style="word-break: break-word;"></td>');
                attendedCourse.push('<td></td>');
            }
            attendedCourse.push('<td id="courseAttended" style="word-break: break-word;">');
            if(attendedCourseInfo.parent_course_code!=null){
                attendedCourse.push('<img src="/img/blend.gif" alt="'+getMessageResource('blendSub')+'" width="34" height="18">');
            }
            attendedCourse.push(attendedCourseInfo.course_name+'&nbsp;('+attendedCourseInfo.course_code+')</td>');
            if(attendedCourseInfo.fixed_start_date == null){
                attendedCourse.push('<td id="courseAttendedStartDate" style="text-align: right;">');
            } else {
                attendedCourse.push('<td id="courseAttendedStartDate" style="text-align: right;">'+convertFormatDate(attendedCourseInfo.fixed_start_date));
            }
            if(attendedCourseInfo.fixed_start_time == null){
                attendedCourse.push('</td>');
            } else {
                attendedCourse.push('<br/>'+convertFormatTime(attendedCourseInfo.fixed_start_time)+'</td>');
            }
            attendedCourse.push('<td></td>');
            if(attendedCourseInfo.room_name == null){
                attendedCourse.push('<td id="courseAttendedRoom" style="word-break: break-word;"></td>');
            } else {
                attendedCourse.push('<td id="courseAttendedRoom" style="word-break: break-word;">'+attendedCourseInfo.room_name+'</td>');
            }
            attendedCourse.push('</tr>');
        }
    }
    attendedCourse.push('</tbody>');
    attendedCourse.push('</table>');
    attendedCourse.push('</div>');
    const element = document.querySelectorAll('.kc-co-separate');
    element[0].innerHTML = attendedCourse.join('');
}

/*
 * Resourceのデータから取得（ダイアログの項目表示）
 */
function getMessageResource(key){
    var keys = key.split('.');
    var res = messageResource;
    for(var i=0; i<keys.length; i++){
        if (!res.hasOwnProperty(keys[i])) return "";
        res = res[keys[i]];
    }
    return res;
}

/*
 * 日付フォーマット変換
 */
function convertFormatDate(dateStr){
    const dateConvert = dateStr.split("-").join("/");
    return dateConvert;
}

/*
 * 時間フォーマット変換
 */
function convertFormatTime(timeStr){
    const timeConvert = timeStr.slice(0, 2) + ':' + timeStr.slice(2);
    return timeConvert;
}

function removeRenderAttendedCourses(){
    const div = document.querySelector(".kc-co-separate");
    while (div.childNodes.length > 0) {
      div.removeChild(div.firstChild);
    }
}

function removeRenderDuplicateCourses(){
    const div = document.querySelector(".kc-co-content-area div");
    while (div.childNodes.length > 0) {
      div.removeChild(div.firstChild);
    }
}

function settingScrollTopDialogContent() {
    $('#dialog').scrollTop(0);
    var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if(is_safari){
        document.getElementById('dialog').scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function setValueDownloadCharset(){
    var charset =  $('.kc-co-download-code-div  input[type="radio"]:checked').val()
    const charsetDownloadElement = document.getElementById('charsetDownloadVal');
    charsetDownloadElement.value = charset; 
}