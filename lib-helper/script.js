var notificationCheckbox = $('#notification-checkbox');
var school = $('#school');
var system = $('#system');
var source = $('#source');

$(document).ready(function () {
	var myschool = localStorage.getItem('my_school');
	if (myschool) {
		$('#school').val(myschool);
	}
});
$("#school").on('click', function () {
	makeCenter();
	initProvince();
	$('[province-id="1"]').addClass('choosen');
	initSchool(1);
});

$("#close-button").on('click', function () {
	$('#choose-box-wrapper').css("display", "none");
}
	function initProvince() {
	$('#choose-a-province').html('');
	for (i = 0; i < schoolList.length; i++) {
		$('#choose-a-province').append('<a class="province-item" province-id="' + schoolList[i].id + '">' + schoolList[i].name + '</a>');
	}
	$('.province-item').bind('click', function () {
		var item = $(this);
		var province = item.attr('province-id');
		var choosenItem = item.parent().find('.choosen');
		if (choosenItem)
			$(choosenItem).removeClass('choosen');
		item.addClass('choosen');
		//更新大学列表
		initSchool(province);
	});
}
	function initSchool(provinceID) {
	//原先的学校列表清空
	$('#choose-a-school').html('');
	var schools = schoolList[provinceID - 1].school;
	for (i = 0; i < schools.length; i++) {
		$('#choose-a-school').append('<a class="school-item" school-name="' + schools[i].name + '" school-url="' + schools[i].url + '" school-sys="' + schools[i].system + '">' + schools[i].name + '</a>');
	}
	//添加大学列表项的click事件
	$('.school-item').bind('click', function () {
		var item = $(this);
		var school = item.attr('school-name');
		var url = item.attr('school-url');
		var system = item.attr('school-sys');
		//更新选择大学文本框中的值
		$('#source').val(url);
		$('#system').val(system);
		$('#school').val(school);
		//关闭弹窗
		hide();
	});
}
	function makeCenter() {
	$('#choose-box-wrapper').css("display", "block");
	$('#choose-box-wrapper').css("position", "absolute");
	$('#choose-box-wrapper').css("top", Math.max(0, (($(window).height() - $('#choose-box-wrapper').outerHeight()) / 2) + $(window).scrollTop()) + "px");
	$('#choose-box-wrapper').css("left", Math.max(0, (($(window).width() - $('#choose-box-wrapper').outerWidth()) / 2) + $(window).scrollLeft()) + "px");
}

	$("#save-button").on('click', function () {
		var _school = school.val();
		var _source = source.val();
		var _system = system.val();

		var olddata = JSON.parse(localStorage.getItem("data"));
		var oldschool = olddata.school;
		if (_school == oldschool) {
			alert('信息没有变化！');
			return;
		}
		if (_system != 0) {
			var data = {
				"school" : _school,
				"source" : _source,
				"system" : _system
			};
			localStorage.setItem('my_school', _school);
			localStorage.setItem('data', JSON.stringify(data));
			alert('信息保存成功！您可以到本页面最底部我们提供的测试页面查看效果！');
		} else {
			alert('对不起，您的学校尚未添加支持！由于本人精力有限，适配学校速度进度极慢，但是对于单独邮件申请，一般会立刻更新。所以烦请请发送邮件到daidi88@sina.com，让我知道你在这里！');
		}
	});
