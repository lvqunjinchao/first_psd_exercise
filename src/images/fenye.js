// 分页 start

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
            console.log(data);
            console.log(data.reply.length);
            if (data.reply.length == 0) {
                $('.js_empty_content').removeClass('displaynone');
                havedata = false;
                return;
            };
            ++page;
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
        if (page > 3) {
            allpages = true;
        }
    }, 400);
}


// 分页 end