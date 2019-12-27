// 主页 start

// banner图 start
var bannerSlider = $(".js_banner").oSlider({
    loop: true,
    pager: ".js_pager",
    pagerHover: false,
    speed: 3000,
    startFn: function() {
        console.log("开始");
    },
    playFn: function() {
        console.log("play");
    }
});
bannerSlider.init();
// banner图 end


// 上拉加载下拉刷新 start

// 模拟page页
var page = 1;
// 判断时候还有页面数据
var allpages = false;
// //初始状态，加载数据

var myScroll, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset, generatedCount = 0;

function loaded() {
    //动画部分
    pullDownEl = document.getElementById('pullDown');
    pullDownOffset = pullDownEl.offsetHeight;
    pullUpEl = document.getElementById('pullUp');
    pullUpOffset = pullUpEl.offsetHeight;
    myScroll = new iScroll('wrapper', {
        useTransition: true,
        topOffset: pullDownOffset,
        onRefresh: function() {
            if (pullDownEl.className.match('loading')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
            } else if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '';
            }
        },
        onScrollMove: function() {

            if (this.y > 5 && !pullDownEl.className.match('flip')) {
                pullDownEl.className = 'flip';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '释放刷新';
                this.minScrollY = 0;
            } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
                this.minScrollY = -pullDownOffset;
            } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                if (allpages) {
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
            if (pullDownEl.className.match('flip')) {
                pullDownEl.className = 'loading';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中';
                pullDownAction(); // Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                if (allpages) {
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
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false }); //阻止冒泡默认事件
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loaded, 0);
}, false);


// 调取主页ajax封装成函数 start
function zhuye_ajax() {
    $.ajax({
        // ajax一般不使用同步，因为会出问题，当数据大量的时候，可免会非常卡顿
        // async: false,
        url: "../images/zhuye_ajax.json", //json文件位置,必须从images开始写
        type: "GET", //请求方式为get
        dataType: "json", //返回数据格式为json
        success: function(data) { //请求成功完成后要执行的方法 
            // console.log(data);
            ++page;
            var html = '';
            $.each(data.jingxuan, function(index, item) {
                // 注意！select值(value)就等于选中option的值，可以找到category_id直接赋值就行，不用转换了
                // console.log(data.jingxuan);
                if (item.type == 1) {
                    html += `<li class="jingxuan_item o_u">
			                    <a href="./fenye.shtml">
			                    <div class="item_title">
			                        <div class="img_box">
			                            <img src="${item.avatar_src}" alt="">
			                        </div>
			                        <span>${item.username}</span>
			                    </div>
			                    <div class="item_content">
                                    <img src="${item.content_img}" alt="">
			                        <p class='type1p'>${item.bottom_p}</p>
			                    </div>
			                </a>
			                <div class="item_bottom">
			                    <div class="guanjianzi_pinglun_box">
			                        <div class="guanjianzi">
			                            <a href="javascript:;" class="first_guanjianzi guanjian">${item.guanjianzi1}</a>
			                            <a href="javascript:;" class="second_guanjianzi guanjian">${item.guanjianzi2}</a>
			                        </div>
			                        <div class="pinglun_dianzan">
			                            <div class="pinglun_box pinglun_dianzan_item">
			                                <img src="${item.pinglun_icon}" alt="">
			                                <span>${item.pinglun_num}</span>
			                            </div>
			                            <div class="dianzan_box pinglun_dianzan_item">
			                                <img src="${item.dianzan_icon}" alt="">
			                                <span>${item.dianzan_num}</span>
			                            </div>
			                        </div>
			                    </div>
			                </div>
			                </li>`
                } else if (item.type == 2) {
                    html += `<li class="jingxuan_item o_u">
			                    <a href="./fenye.shtml">
			                        <div class="item_title">
			                            <div class="img_box">
			                                <img src="${item.avatar_src}" alt="">
			                            </div>
			                            <span>${item.username}</span>
			                        </div>
			                        <div class="item_content contentflex">
			                            <div class="content_left">
			                                <div class="content_title limit2">
			                                ${item.content_title}
			                                </div>
			                                <p class="content_content limit2">
			                                ${item.content_content}
			                                </p>
			                            </div>
			                            <div class="content_right">
			                                <img src="${item.content_right_img}" alt="">
			                            </div>
			                        </div>
			                    </a>
			                    <div class="item_bottom">
			                        <div class="guanjianzi_pinglun_box">
			                            <div class="guanjianzi">
			                                <a href="javascript:;" class="first_guanjianzi guanjian">${item.guanjianzi1}</a>
			                                <a href="javascript:;" class="second_guanjianzi guanjian">${item.guanjianzi2}</a>
			                            </div>
			                            <div class="pinglun_dianzan">
			                                <div class="pinglun_box pinglun_dianzan_item">
			                                    <img src="${item.pinglun_icon}" alt="">
			                                    <span>${item.pinglun_num}</span>
			                                </div>
			                                <div class="dianzan_box pinglun_dianzan_item">
			                                    <img src="${item.dianzan_icon}" alt="">
			                                    <span>${item.dianzan_num}</span>
			                                </div>
			                            </div>
			                        </div>
			                        </di>
			                    </div>
			                </li>`

                } else if (item.type == 3) {
                    html += `<li class="jingxuan_item o_u">
			                    <a href="./fenye.shtml">
			                        <div class="item_title">
			                            <div class="img_box">
			                                <img src="${item.avatar_src}" alt="">
			                            </div>
			                            <span>${item.username}</span>
			                        </div>
			                        <div class="item_content p_content">
			                            <p class="p_content_title">
			                            ${item.p_content_title}
			                            </p>
			                            <div class="p_content_content_box">
			                                <p class="p_content_content">
			                                ${item.p_content_content}
			                                </p>
			                            </div>
			                        </div>
			                    </a>
			                    <div class="item_bottom">
			                        <div class="guanjianzi_pinglun_box">
			                            <div class="guanjianzi">
			                                <a href="javascript:;" class="first_guanjianzi guanjian">${item.guanjianzi1}</a>
			                                <a href="javascript:;" class="second_guanjianzi guanjian">${item.guanjianzi2}</a>
			                            </div>
			                            <div class="pinglun_dianzan">
			                                <div class="pinglun_box pinglun_dianzan_item">
			                                    <img src="${item.pinglun_icon}" alt="">
			                                    <span>${item.pinglun_num}</span>
			                                </div>
			                                <div class="dianzan_box pinglun_dianzan_item">
			                                    <img src="${item.dianzan_icon}" alt="">
			                                    <span>${item.dianzan_num}</span>
			                                </div>
			                            </div>
			                        </div>
			                        </di>
			                    </div>
			                </li>`
                }
            });
            // html方法会把无弄没有，所以用append来添加，无是默认的
            $('#thelist').append(html);
            myScroll.refresh();
        }
    })

}

// 调取主页ajax封装成函数 end


function loadAction() {
    zhuye_ajax();
    myScroll.refresh();
}


//下拉刷新当前数据
// 注意：因为每一次下拉刷新都要将内容清空添加新的，所以不要判断是否还有数据，默认有数据，否则会造成默认为空
function pullDownAction() {
    setTimeout(function() {
        //这里执行刷新操作
        $('#thelist').empty();
        zhuye_ajax();
        myScroll.refresh();
    }, 400);
}

//上拉加载更多数据
function pullUpAction() {
    setTimeout(function() {
        if (allpages) {
            myScroll.refresh();
            return;
        }
        zhuye_ajax();
        myScroll.refresh();
        if (page > 3) {
            allpages = true;
        }
    }, 400);
}
// 上拉加载下拉刷新 end

// 主页 end