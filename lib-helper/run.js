var TYPE = getType();
var isbn = getIsbn(TYPE);
var icon;
var title;
chrome.extension.sendRequest({
	method : "getSchool"
}, function (response) {
	var data = JSON.parse(response.data);
	var school = data.school;
	var source = data.source;
	var system = data.system;
	getBookInfo(school, source, system);
});
function getBookInfo(school, source, system) {
	console.log(TYPE + isbn + title + school + source + system);
	//system定义
	//0：未匹配
	//1：旧版汇文
	//2：新版汇文
	addInfo(TYPE, school);
	if (system == 1) {
		$.ajax({
			url : 'http://' + source + '/opac/openlink.php?strSearchType=isbn&strText=' + isbn + '&showmode=table',
			success : function (loginstr) {
				if (loginstr.indexOf('本馆没有您检索的馆藏书目') != -1) {
					$('#isex').html('   我' + school + '竟然没有这本书！<a href="http://' + source + '/asord/asord_redr.php?title=' + title + '">点击荐购</>');
				}
				$.ajax({
					url : 'http://' + source + '/opac/item.php?marc_no=' + loginstr.split('marc_no=')[1].split('">')[0],
					type : 'GET',
					success : function (msg) {
						$('#isex').html('开玩笑！怎么可能没有！');
						var doc_number = msg.split('marc_no=')[1].split('">')[0];
						$('#isex').after('<br><h2 style="color: #007722;">在哪借这本书?</h2>');
						var findurl = 'http://' + source + '/opac/item.php?marc_no=' + doc_number;
						$.ajax({
							url : findurl,
							type : 'GET',
							success : function (detail) {
								var detail_table = detail.split('bgcolor="#d2d2d2">')[1].split('</table>')[0];
								$('#daidilib').append(detail_table + '<br><h2>再具体点?</h2><p><div class="bs" id="mdt"><a href="' + findurl + '" target="_blank">点我！</a></div>');
								$('.text3').eq(0).hide();
								$('.text3').eq(1).hide();
								$('.text3').eq(3).hide();
								$('.text3').eq(6).hide();
								$('.text3').eq(7).hide();
								$('.text3').eq(8).hide();
								$('.text3').eq(9).hide();
								for (var i = 1; i <= $('#daidilib tr').length - 1; i++) {
									$('.td1').eq(10 * i - 10).hide();
									$('.td1').eq(10 * i - 9).hide();
									$('.td1').eq(10 * i - 7).hide();
									$('.td1').eq(10 * i - 4).hide();
									$('.td1').eq(10 * i - 3).hide();
									$('.td1').eq(10 * i - 2).hide();
									$('.td1').eq(10 * i - 1).hide();
								}
							}
						});
					}

				});
			}
		});
	} else if (system == 2) {
		$.ajax({
			url : 'http://' + source + '/opac/openlink.php?strSearchType=isbn&strText=' + isbn + '&showmode=table',
			success : function (loginstr) {
				if (loginstr.indexOf('本馆没有您检索的图书') != -1) {
					$('#isex').html('<br><a href="http://' + source + '/asord/asord_redr.php?title=' + title + '">'+school+'图书馆竟然没有这本书！点击荐购</><br>');
				} else {
					var marc_no = loginstr.split('marc_no=')[1].split('">')[0];
					var findurl = 'http://' + source + '/opac/item.php?marc_no=' + marc_no
						$.ajax({
							url : findurl,
							type : 'GET',
							success : function (detail) {
								var detail_table = '<br><table style="border:2px solid #C1DAD7 ;border-spacing: 0px; padding: 0;" id="daidires">' + detail.split('id="item">')[1].split('</table>')[0].replace(new RegExp("img", "gm"), "p") + '</table><br><a href="' + findurl + '" target="_blank">点击跳转到图书馆对应界面</a>';
								$('#daidilib').append(detail_table);
								var css = '';
								$('#daidires td').css({
									'border' : '2px solid #C1DAD7',
									'font-size' : ' 11px',
									'padding' : '6px 6px 6px 12px',
									'color' : '#4f6b72'
								});
							}
						});
				}

			}
		});
	}

}
function getType() {
	var domain = document.domain;
	console.log(domain);
	var names = ["amazon", "douban", "jd", "dangdang"];
	for (var i in names) {
		if (domain.indexOf(names[i]) != -1)
			return names[i];
	}

}
function getIsbn() {
	switch (TYPE) {
	case 'douban':
		isbn = $('#info').text().split('ISBN:')[1].split(' ')[1].trim();
		title = $('#wrapper h1').text().trim();
		icon = $('div#mainpic img').attr('src');
		break;
	case 'amazon':
		var items = $('tr div.content ul').text();
		var isbntemp;
		var i = items.indexOf("ISBN");
		if (items.indexOf("ISBN") != -1) {
			var isbn = items.substring(i + 5, i + 18)
		}
		title = $("#productTitle").text();
		break;
	case 'dangdang':
		
        if($('.book_messbox').length > 0)
            isbn = $('.book_messbox').text().split('Ｎ')[1].trim().split('\n')[0].replace(/[^0-9]/g,'');
        else
            isbn = $('#detail_all').text().split('Ｎ')[1].split('\n')[0].split(' ')[0].replace(/[^0-9]/g,'');
		break;
	case 'jd':
		isbn = $("#parameter2").text().split('ISBN：')[1].split('\n')[0].trim();
		break;
	default:
	}
	return isbn;
}
function addInfo(TYPE, school) {
	switch (TYPE) {
	case 'douban':
		$('.related_info').before('<div class="gray_ad" id="daidilib"></div>');
		$('#daidilib').append('<h2>' + school + '图书馆馆藏信息</h2><small>powered by 图书馆助手</small><div class="bs" id="isex"></div>');
		break;
	case 'amazon':
		$('#dynamicDeliveryMessage_feature_div').before('<div class="a-box rbbSection"><div class="a-box-inner" id="daidilib"></div></div><hr/>');
		$('#daidilib').append('<h2 style="color: #007722;">' + school + '图书馆馆藏信息</h2><small>powered by 图书馆助手</small><div class="bs" id="isex"></div>');
		break;
	case 'dangdang':
		$('.sale').after('<div style="border: 1px dotted #785;background: #f5f5f5;padding: 10px;margin: 30px 0 30px 0;" id="daidilib"></div>');
		$('#daidilib').append('<h2 style="color: #f44700;font-weight: normal;">' + school + '图书馆馆藏信息</h2><small>powered by 图书馆助手</small><div class="bs" id="isex"></div>');
		break;
	case 'jd':
		$('#choose').before('<hr/><div id="daidilib" class="btns"></div><hr/>');
		$('#daidilib').append('<h2 style="color: #007722;">' + school + '图书馆馆藏信息</h2><small>powered by 图书馆助手</small><hr/><div class="bs" id="isex"></div>');
		break;
	default:
	}

}
