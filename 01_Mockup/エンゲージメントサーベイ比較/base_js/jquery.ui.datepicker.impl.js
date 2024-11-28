
$(function(){

	$( "#kc-datepicker" ).datepicker({
		showOn: "button",
		buttonImage: "./img/icn_calender@2x.png",
		buttonImageOnly: true,
		firstDay: 1,
		changeMonth: true,
		changeYear: true,
		yearRange: 'c-100,c'
	});

	$( "#kc-datepicker" ).datepicker("option", "dateFormat", "yymmdd");
	$( "#kc-datepicker" ).datepicker("option", "showAnim", "slideDown");


});

$(function() {
  $('.dp').datepicker({
    changeYear: true,
    showOn: 'button',
    buttonImage: './img/icn_calender@2x.png',
	buttonText: 'Calendar',
    buttonImageOnly: true,
	changeMonth: true,
	changeYear: true,
    yearRange: 'c-20:c+20',
    showAnim: ''
  });
	$('.dp').attr("readOnly", "readOnly");

});

$(function() {
  $('.dp-birthday').datepicker({
    changeYear: true,
    showOn: 'button',
    buttonImage: './img/kc-co-calendar-icon.gif',
	buttonText: 'Calender',
    buttonImageOnly: true,
	changeMonth: true,
	changeYear: true,
    yearRange: 'c-100,c'
  });

});

function setDate(obj, yearObj, monthObj, dayObj) {
  var str = obj.value;
  var val = str.split("/");
  yearObj.value = val[0];
  monthObj.value = val[1];
  dayObj.value = val[2];
}

