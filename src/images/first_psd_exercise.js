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