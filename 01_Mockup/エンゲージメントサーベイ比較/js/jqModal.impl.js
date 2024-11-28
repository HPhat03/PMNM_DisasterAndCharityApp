$(document).ready(function() {

	$('#accessRegist').jqm({
		ajax: 'init-regist.html', 
		trigger: 'a.entryTrigger',
		/*onShow: function(h) {
			h.w.css('opacity',0.92).slideDown(); 
		}*/
		modal:true

	});

	$('#accessEdit').jqm({
		ajax: 'init-edit.html', 
		trigger: 'a.editTrigger',
		/*onShow: function(h) {
			h.w.css('opacity',0.92).slideDown(); 
		}*/
		modal:true

	});


	$('#menuRegist').jqm({
		ajax: 'init-regist.html', 
		trigger: 'a.entryTrigger',
		/*onShow: function(h) {
			h.w.css('opacity',0.92).slideDown(); 
		}*/
		modal:true

	});

	$('#menuEdit').jqm({
		ajax: 'init-edit.html', 
		trigger: 'a.editTrigger',
		/*onShow: function(h) {
			h.w.css('opacity',0.92).slideDown(); 
		}*/
		modal:true

	});


});

function showCompleteModalDialog(){
	$('#dialog').jqm({
        // onShow: function(h) {
        // 	h.w.css('opacity',0.92).slideDown(); 
        // },
		modal: true,
		overlay: 72
	});
	$('#dialog').jqmShow();
}

function showDeleteModalDialog(){
	$('#deleteDialog').jqm({
        // onShow: function(h) {
        //     h.w.css('opacity',0.92).slideDown(); 
        // },
		modal: true,
		overlay: 72
	});
	$('#deleteDialog').jqmShow();
}

function showCloseWaitingModalDialog(){
	$('#closeDialog').jqm({
        // onShow: function(h) {
        //     h.w.css('opacity',0.92).slideDown; 
        // },
		modal: true
	});
	$('#closeDialog').jqmShow();
}

function registForm(url, fmName, divName, listName){
	$('#'+ divName).jqmHide();
}
function editForm(url, fmName, divName, listName) {

//	alert('登録情報をセッションにセットする予定。');

	$.ajax({
		type: "POST",
		url: url,
		data: $('#'+fmName).serialize(),
		async: false,
		success: function(msg) {
		  	var div = document.getElementById(listName);
		 // div.innerHTML = msg;
		//$('.jqmWindow').jqmHide(); 
		  $('#'+ divName).jqmHide();
		},
		error: function(xhr, status, e) {
			alert('error');
		}
	});
}
