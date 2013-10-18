/* Author:

*/
var notificationCheckbox = $('#notification-checkbox');
var school = $('#school');
var option = $('option[selected]');

$(document).ready(function(){
  var myschool = localStorage.getItem('my_school');  
  if (myschool) {
    $("#school option[value="+myschool+"]").attr('selected', 'selected');
	} 
});


$("#save-button").on('click', function() {
  var school_id = school.val();
  var source = $('option[selected]').data('source');
  var olddata = localStorage.getItem("data");
  if(olddata){
  var oldschool=olddata.split('source')[0];
  var oldsource=olddata.split('source')[1];
  }
  if(school_id!="暂无")
  {
  var data = {"school": school_id, "source": source };
  localStorage.setItem('my_school', school_id);
  localStorage.setItem('data', JSON.stringify(data));
  var newdata = localStorage.getItem("data");
  var newschool=newdata.split('source')[0];
  var newsource=newdata.split('source')[1];
  if(newsource==oldsource)
  {
    if(newschool!=oldschool)
		alert('由于chrome内核追求极致速度，省略了一些dom的属性的加载,您需要再点击一次保存确认！');
		else
		alert('您的学校信息没有发生变化！');
  } 
  else
  alert('信息保存成功！您可以到本页面最底部我们提供的测试页面查看效果！');
  }
  else
  alert('对不起，您的学校尚未添加支持！由于本人精力有限，适配学校速度进度极慢，但是对于单独邮件申请，一般会立刻更新。所以烦请请发送邮件到daidi88@sina.com，让我知道你在这里！');
});