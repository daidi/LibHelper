var TYPE = getType();
var isbn = getIsbn(TYPE);
var icon;
var title;
chrome.extension.sendRequest({
	method : "getSchool"
}, function(response) {
	var data = JSON.parse(response.data);
	var school = data.school;
    var source = data.source;
	getBookInfo(school, source);
  }
);
function getBookInfo(school, source) {
console.log(TYPE+isbn+title+school+source);
addInfo(TYPE,school);
	$.ajax({
		url : 'http://'+source+'/opac/openlink.php?strSearchType=isbn&strText='+isbn+'&showmode=table',
		success : function (loginstr) {
		if (loginstr.indexOf('本馆没有您检索的馆藏书目') != -1) {
						$('#isex').html('   我大'+school+'竟然没有这本书！<a href="http://'+source+'/asord/asord_redr.php?title='+title+'">点击荐购</>');
					}
			$.ajax({
				url : 'http://'+source+'/opac/item.php?marc_no='+loginstr.split('marc_no=')[1].split('">')[0],
				type : 'GET',
				success : function (msg) {
						$('#isex').html('开玩笑！怎么可能没有！');
						var doc_number = msg.split('marc_no=')[1].split('">')[0];
						$('#isex').after('<br><h2 style="color: #007722;">在哪借这本书?</h2>');
						var findurl = 'http://'+source+'/opac/item.php?marc_no='+doc_number;
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
			title= $('#wrapper').text().split('作者')[0].trim();
            icon = $('div#mainpic img').attr('src');
            break;
        case 'amazon':
            var items = $('div.content b');
            var isbntemp;
            var i;
            for (i = 0; i < items.length; i++) {
                if (items[i].innerText == "ISBN:") {
                    isbook = 1;
                }
                if (items[i].innerText == "条形码:") {
                    var isbntemp = items[i].nextSibling.nodeValue.trim();
                }
            }
            if (isbntemp && isbook)
                var isbn = isbntemp;
            icon = $("#prodImageCell img").attr("src");
            title = $("#btAsinTitle").text();
            title = title.split(' [')[0];
            break;
        case 'dangdang':
            isbn =$('.show_info').text().split('N：')[1].split('包')[0].trim();
            break;
        case 'jd':
            isbn = $("#summary li:eq(10)").text().split('Ｎ：')[1].trim();
            break;
        default:
    }
    return isbn;
}
function addInfo(TYPE,school) {
    switch (TYPE) {
        case 'douban':
			$('#buyinfo').before('<div class="gray_ad" id="daidilib"></div>');
			$('#daidilib').append('<h2>'+school+'图书馆有没有?</h2><div class="bs" id="isex"></div>');
            break;
        case 'amazon':
            $('.twisterMediaMatrix').after('<hr/><div class="buyingDetailsGrid" id="daidilib"></div><hr/>'); 
            $('#daidilib').append('<h2 style="color: #007722;">'+school+'图书馆有没有?</h2><div class="bs" id="isex"></div>');
            break;
        case 'dangdang':
            $('.sale').after('<div class="buy_area" id="daidilib"></div>');
            $('#daidilib').append('<h2 style="color: #007722;">'+school+'图书馆有没有?</h2><div class="bs" id="isex"></div>');
            break;
        case 'jd':
            $('#choose').before('<hr/><div id="daidilib" class="btns"></div><hr/>');
            $('#daidilib').append('<h1 style="color: #007722;">'+school+'图书馆有没有?</h2><div class="bs" id="isex"></div>');
            break;
        default:
    }

}