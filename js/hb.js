require.config({
    baseUrl: 'js/',
    paths: {
        'zepto': 'zepto.min',
        'hongbao': 'hongbao'
    }
});
require(['zepto', 'hongbao'], function() {
    $(function() {
        var hb = new HongBao({
            time: 15,
            timeBox: $('#timeing-box')[0],
            progressBox: $('#progress-box')[0],
            statusBox: $('#status-box')[0],
            move: function() {
                var animation = $("#hongbao_list [class=hb-fly]").first();
                animation.addClass("hb-fly-animation");
                var endList = $("#hongbao_list .hb-fly-animation");
                endList.length >= 20 && endList.removeClass("hb-fly-animation");
                switch (hb.count) {
                    case 18:
                        $('.hb-dom')[0].src = 'images/dom.png';
                        break;
                    case 50:
                        $('.hb-dom')[1].src = 'images/dom.png';
                        break;
                    case 100:
                        $('.hb-dom')[2].src = 'images/dom.png';
                        break;
                }
                // console.log(hb.count)
            },
            end: function() {
                $('#result_box').show();
                $('#result_num').text(hb.count);
            }
        });
        $('#play_tips_box').on('click', function() {
            $(this).hide();
            hb.play(); //游戏开始
        });
        $('#playAgain').on('click', function(e) {
            e.preventDefault();
            $('.hb-dom').attr('src', 'images/dom-gray.png')
            $('#result_box').hide();
            hb.replay(); //游戏重新开始
        });
    });
});