// 分页 start

// 分页滚动 start

// 声明page计算页数
var page = 1;
// 判断上拉加载回复是否还有数据
var allpages = false;
// 判断一开始的时候是否有数据，没有的显示说点什么框
var havedata = true;


// 调取分页ajax封装成函数 start
function fenye_ajax() {
    $.ajax({
        // ajax一般不使用同步，因为会出问题，当数据大量的时候，可免会非常卡顿
        // async: false,
        url: "../images/fenye_ajax.json", //json文件位置,必须从images开始写
        type: "GET", //请求方式为get
        dataType: "json", //返回数据格式为json
        success: function(data) { //请求成功完成后要执行的方法 
            // console.log(data);
            // console.log(data.reply.length);
            if (data.reply.length == 0) {
                $('.js_empty_content').removeClass('displaynone');
                havedata = false;
                return;
            };
            $('.js_empty_content').addClass('displaynone');
            var html2 = '';
            $.each(data.reply, function(index, item) {
                // 注意！select值(value)就等于选中option的值，可以找到category_id直接赋值就行，不用转换了
                html2 += `<li class="list_item">
				<div class="user_avatar">
					<img src="${item.user_avatar}" alt="">
				</div>
				<div class="reply_details">
					<p class="username">
					${item.username}
					</p>
					<p class="user_content">
					${item.user_content}
					</p>
					<div class="other">
						<span class="reply_time">${item.reply_time}</span>
						<div class="share_reply_dianzan">
							<img src="${item.shareicon}" alt="" class="shareicon">
							<img src="${item.pinglunicon}" alt="" class="pinglunicon">
							<img src="${item.dianzanicon}" alt="" class="dianzanicon">
						</div>
					</div>
				</div>
			</li>`
            });
            // html方法会把无弄没有，所以用append来添加，无是默认的
            $('#thelist2').append(html2);
            myScroll.refresh();
        }
    })
}
// 调取分页ajax封装成函数 start

var myScroll, pullUpEl, pullUpOffset, generatedCount = 0;

function loaded() {
    //动画部分
    pullUpEl = document.getElementById('pullUp');
    pullUpOffset = pullUpEl.offsetHeight;
    myScroll = new iScroll('wrapper2', {
        useTransition: true,
        // bounce:false,
        // topOffset: pullDownOffset,
        onRefresh: function() {
            if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '';
            }
        },
        onScrollMove: function() {
            if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                if (allpages || !havedata) {
                    $('.pullUpLabel').text('暂无数据');
                } else {
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '释放刷新';
                }
                this.maxScrollY = this.maxScrollY;
            } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '';
                this.maxScrollY = pullUpOffset;
            }
        },
        onScrollEnd: function() {
            if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                if (allpages || !havedata) {
                    $('.pullUpLabel').text('');
                } else {
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中';
                }
                pullUpAction(); // Execute custom function (ajax call?)
            }
        }
    });

    loadAction();
}
document.addEventListener('touchmove', function(e) { e.preventDefault(); }, { passive: false }); //阻止冒泡
document.addEventListener('DOMContentLoaded', function() { setTimeout(loaded, 0); }, false);


//初始状态，加载数据
function loadAction() {
    fenye_ajax();
    myScroll.refresh();
}


//上拉加载更多数据
function pullUpAction() {
    setTimeout(function() {
        if (allpages) {
            myScroll.refresh();
            return;
        }
        if (!havedata) {
            myScroll.refresh();
            return;
        }
        fenye_ajax();
        myScroll.refresh();
        ++page;
        if (page > 3) {
            allpages = true;
        }
    }, 400);
}

// 分页滚动 end

// 分页手机虚拟键盘 start

// 点击input显示遮罩和输入框
$('.js_fenyefooter').on('click', '.pinglunnow', function() {
    var $this = $(this);
    if (temporary_text == '') {
        $this.parents('.js_fenyefooter').siblings('.js_zhezhao_div').find('textarea').val('');
    } else {
        $this.parents('.js_fenyefooter').siblings('.js_zhezhao_div').find('textarea').val(temporary_text);
    }
    $this.parents('.js_fenyefooter').siblings('.js_zhezhao_div').removeClass('displaynone');
    $this.parents('.js_fenyefooter').siblings('.js_zhezhao_div').find('textarea').focus();
});

// 声明一个变量来暂时存储取消输入的内容
var temporary_text = '';
// 声明一个变量来存储发送的内容
var determine_text = '';


// 全部回复选项卡替换 start
$('.js_reply_title').on('click', '.js_all', function() {
    var $this = $(this);
    $this.addClass('color2283e2');
    $this.find('.hengxian').removeClass('displaynone');
    $this.siblings('.js_hot').removeClass('color2283e2');
    $this.siblings('.js_hot').find('.hengxian').addClass('displaynone');
    // 有数据时候
    $('#thelist2').empty();
    fenye_ajax();
    havedata = false;
});
// 全部回复选项卡替换 end

// 热门回复默认就是选中的，但是点击全部回复之后再点击热门需要判断 start
$('.js_reply_title').on('click', '.js_hot', function() {
    var $this = $(this);
    $this.addClass('color2283e2');
    $this.find('.hengxian').removeClass('displaynone');
    $this.siblings('.js_all').removeClass('color2283e2');
    $this.siblings('.js_all').find('.hengxian').addClass('displaynone');
    // 有数据时候
    $('#thelist2').empty();
    fenye_ajax();
    havedata = true;
    page = 1;
    allpages = false;
});
// 热门回复默认就是选中的，但是点击全部回复之后再点击热门需要判断 end


// 点击,取消，发送或者黑色遮罩关闭遮罩 start
// 阻止内部的冒泡事件
$('.js_zhezhao_div').on('click', '.js_input_text_box', function(e) {
    e.stopPropagation();
    // 手机端会有判断，只要是有焦点，就会弹出虚拟键盘，所以在输入框中点击除了取消，发送外，
    // 其他地方仍然要保持有焦点
    var $this = $(this);
    $this.find('textarea').focus();
});
//取消
$('.js_zhezhao_div').on('click', '.js_cancel', function() {
    var $this = $(this);
    temporary_text = $this.parents('.js_title').siblings('.js_textarea_box').find('textarea').val();
    $this.parents('.js_zhezhao_div').addClass('displaynone');
});

// 声明一个变量获取当前位置到头部的距离
var reply_top = $('.js_reply').offset().top;

// 发送
$('.js_zhezhao_div').on('click', '.js_determine', function() {
    var $this = $(this);
    determine_text = $this.parents('.js_title').siblings('.js_textarea_box').find('textarea').val();
    temporary_text = '';
    $this.parents('.js_zhezhao_div').addClass('displaynone');
    send_out();
    // 使页面回滚到评论顶部
    myScroll.scrollToElement('.js_reply', 100, 0, reply_top, true);
});

// 黑色遮罩
$('.js_zhezhao_div').on('click', function() {
    var $this = $(this);
    temporary_text = $this.find('textarea').val();
    $this.addClass('displaynone');
});
// 点击,取消，发送或者黑色遮罩关闭遮罩 end

// 点击发送模拟添加信息 封装成函数 start
function send_out() {
    var send_out_content = '';
    send_out_content = `<li class="list_item">
				<div class="user_avatar">
					<img src="./images/avatargirl.jpg" alt="">
				</div>
				<div class="reply_details">
					<p class="username">
					刚刚发表的评论
					</p>
					<p class="user_content">
					${determine_text}
					</p>
					<div class="other">
						<span class="reply_time">12.20 11:30</span>
						<div class="share_reply_dianzan">
							<img src="./images/pinglunicon.png" alt="" class="shareicon">
							<img src="./images/fenyedianzan.png" alt="" class="pinglunicon">
							<img src="./images/headershare.png" alt="" class="dianzanicon">
						</div>
					</div>
				</div>
            </li>`
    $('#thelist2').prepend(send_out_content);
    myScroll.refresh();
}
// 点击发送模拟添加信息 封装成函数 end

// 分页手机虚拟键盘 end

// 分页 end