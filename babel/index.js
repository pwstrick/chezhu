'use strict';

var $ = require('../../../h5che/src/libs/vendor/zepto/zepto'),
    dom = require('../../../h5che/src/libs/common/js/dom'),
    cookie = require('../../../h5che/src/libs/common/js/cookie'),
    sore = require('../../../h5che/src/libs/common/js/storage'),
    url = require('../../../h5che/src/libs/common/js/url'),
    util = require('../../../h5che/src/libs/common/js/util'),
    Mustache = require('../../../h5che/src/libs/vendor/mustache/mustache');

require('./dialog');

/**
 * 外观模式兼容缓存
 */
var env = function () {
    var name = 'chezhu';
    /**
     * 惰性模式
     */
    var getFn = function () {
        if (sore.enabled) return sore.get;
        return cookie.get;
    }();
    var setFn = function () {
        if (sore.enabled) return sore.set;
        return cookie.set;
    }();
    var h5Url = '';
    var domain = '';
    var serverDomain = '';
    var shareUserUrl = '';
    return {
        domain: domain, //手机信息获取URL
        serverDomain: serverDomain, //优惠券获取URL
        shareUrl: h5Url, //分享URL
        h5Url: h5Url,
        shareUserUrl: shareUserUrl,
        get: function get(key) {
            var data = getFn(name) || {};
            return data[key];
        },
        set: function set(key, value) {
            var data = getFn(name) || {};
            data[key] = value;
            setFn(name, data);
        },
        //优惠券
        setCoupon: function setCoupon(coupon) {
            this.set('coupon', coupon); //缓存起来
        },
        getCoupon: function getCoupon() {
            return this.get('coupon');
        },
        //设置手机号
        setMobile: function setMobile(mobile) {
            this.set('mobile', mobile); //缓存起来
        },
        getMobile: function getMobile() {
            return this.get('mobile');
        },
        //选择的优惠券
        setSelected: function setSelected(selected) {
            this.set('selected', selected); //缓存起来
        },
        getSelected: function getSelected() {
            return this.get('selected');
        },
        //判断是否需要支付
        welfare: function welfare() {
            var selected = this.getSelected(),
                coupon = this.getCoupon(),
                money = 0,
                selectedCoupon = [],
                current,
                msg = '<strong>免费</strong>领取以上福利',
                btn = '立即领取';
            for (var i = 0, len = selected.length; i < len; i++) {
                current = coupon[selected[i]];
                if (current.serviceId == 1) {
                    money = 1;
                    msg = '支付￥<strong>1</strong>元即可获得以上福利';
                    btn = '支付';
                }
                selectedCoupon.push(current);
            }
            return { coupon: selectedCoupon, money: money, msg: msg, btn: btn };
        }
    };
}();

/**
 * Loading载入
 */
var loading = {
    get: function get() {
        return $('#loading');
    },
    show: function show() {
        if (this.get().length > 0) this.get().show();else {
            var $aside = $('<aside>').addClass('ui-loading-wrap').attr('id', 'loading').html('<i class="ui-loading"></i><p>加载中...</p>');
            $('body').append($aside);
        }
    },
    hide: function hide() {
        this.get().hide();
    }
};
loading.show();

/**
 * 预加载
 */
function preImg() {
    $("img[data-src]").each(function () {
        var $this = $(this);
        var src = $this.data('src');
        dom.preImage(src, function () {
            $this.attr('src', src);
        });
    });
}
preImg();
var preImages = ['img/selected.png'
//'img/picture/1.png',
//'img/picture/2.png',
//'img/picture/3.png',
//'img/avatar/1_1.png',
//'img/avatar/1_2.jpg',
//'img/avatar/2_1.jpg',
//'img/avatar/2_2.jpg',
//'img/avatar/3_1.jpg',
//'img/avatar/3_2.jpg',
//'img/avatar/3_3.jpg',
//'img/avatar/4_1.jpg',
//'img/avatar/4_2.jpg'
];
dom.preImage(preImages);

window.onload = function () {
    loading.hide();
};

/**
 * 按中效果
 */
$('button').on('touchstart', function () {
    $(this).addClass('hover');
}).on('touchend', function () {
    $(this).removeClass('hover');
});
$('[data-href]').on('click', function () {
    location.href = $(this).data('href');
});

/**
 * 模版操作
 */
var template = {
    img_str: function img_str(sort) {
        return 'img/coupon/' + sort + '.jpg';
    },
    coupon: function coupon() {
        //选择的优惠券列表
        var _this = this;
        var json = {
            "code": 0,
            "msg": "success",
            "message": "success",
            "data": {
                "aidaijia_1220_2": {
                    "code": "aidaijia_1220_2",
                    "originPrice": 18,
                    "num": 1,
                    "name": "18元代驾券",
                    "rule": 38,
                    "serviceId": 2,
                    "servicePro": "由爱代驾提供",
                    "anotherName": "代驾礼券",
                    "validDateTimestamp": 1503030300,
                    "validDate": "2017-08-18",
                    "sort": 10
                },
                "aotuzuchequan_1220_1": {
                    "code": "aotuzuchequan_1220_1",
                    "originPrice": 128,
                    "num": 1,
                    "name": "128元国内租车券",
                    "rule": 0,
                    "serviceId": 2,
                    "servicePro": "由凹凸租车提供",
                    "anotherName": "国内租车",
                    "validDateTimestamp": 1516250220,
                    "validDate": "2018-01-18",
                    "sort": 7
                },
                "buhuanjiazhao_1220_1": {
                    "code": "buhuanjiazhao_1220_1",
                    "originPrice": 50,
                    "num": 1,
                    "name": "50元补换驾照券",
                    "rule": 0,
                    "serviceId": 1,
                    "servicePro": "由车轮查违章提供",
                    "anotherName": "补换驾照",
                    "validDateTimestamp": 1513573800,
                    "validDate": "2017-12-18",
                    "sort": 3
                },
                "edaipo_1220_1": {
                    "code": "edaipo_1220_1",
                    "originPrice": 20,
                    "num": 1,
                    "name": "20元机场代泊券",
                    "rule": 0,
                    "serviceId": 2,
                    "servicePro": "由e代泊提供",
                    "anotherName": "代泊礼券",
                    "validDateTimestamp": 1510979580,
                    "validDate": "2017-11-18",
                    "sort": 9
                },
                "huizuche_1220_2": {
                    "code": "huizuche_1220_2",
                    "originPrice": 1518,
                    "num": 1,
                    "name": "1518元海外租车",
                    "rule": 0,
                    "serviceId": 2,
                    "servicePro": "由惠租车提供",
                    "anotherName": "海外租车",
                    "validDateTimestamp": 1505709720,
                    "validDate": "2017-09-18",
                    "sort": 11
                },
                "jieting_1220_1": {
                    "code": "jieting_1220_1",
                    "originPrice": 20,
                    "num": 1,
                    "name": "20元停车券",
                    "rule": 0,
                    "serviceId": 2,
                    "servicePro": "由捷停提供",
                    "anotherName": "停车礼券",
                    "validDateTimestamp": 1510980420,
                    "validDate": "2017-11-18",
                    "sort": 6
                },
                "nianjiandaiban_1220_1": {
                    "code": "nianjiandaiban_1220_1",
                    "originPrice": 80,
                    "num": 1,
                    "name": "80元年检代办券",
                    "rule": 0,
                    "serviceId": 1,
                    "servicePro": "由车轮查违章提供",
                    "anotherName": "年检代办",
                    "validDateTimestamp": 1510981860,
                    "validDate": "2017-11-18",
                    "sort": 2
                },
                "okchexian_1220_1": {
                    "code": "okchexian_1220_1",
                    "originPrice": 300,
                    "num": 1,
                    "name": "300元车险券",
                    "rule": 0,
                    "serviceId": 2,
                    "servicePro": "由OK车险提供",
                    "anotherName": "车险优惠",
                    "validDateTimestamp": 1510979760,
                    "validDate": "2017-11-18",
                    "sort": 8
                },
                "shoujichongzhi_1220_1": {
                    "code": "shoujichongzhi_1220_1",
                    "originPrice": 0.5,
                    "num": 1,
                    "name": "0.5元手机充值券",
                    "rule": 99,
                    "serviceId": 1,
                    "servicePro": "由车轮查违章提供",
                    "anotherName": "手机充值",
                    "validDateTimestamp": 1508315040,
                    "validDate": "2017-10-18",
                    "sort": 12
                },
                "tiantianpaiche_1220_1": {
                    "code": "tiantianpaiche_1220_1",
                    "originPrice": 200,
                    "num": 1,
                    "name": "500元卖车礼包",
                    "rule": 0,
                    "serviceId": 2,
                    "servicePro": "由天天拍车提供",
                    "anotherName": "卖车大礼",
                    "validDateTimestamp": 1511061060,
                    "validDate": "2017-11-19",
                    "sort": 4
                },
                "tuhu_1220_1": {
                    "code": "tuhu_1220_1",
                    "originPrice": 200,
                    "num": 1,
                    "name": "200元养车礼包",
                    "rule": 0,
                    "serviceId": 2,
                    "servicePro": "由途虎养车提供",
                    "anotherName": "养车礼包",
                    "validDateTimestamp": 1508302140,
                    "validDate": "2017-10-18",
                    "sort": 5
                },
                "weizhangdaijiao_1220_1": {
                    "code": "weizhangdaijiao_1220_1",
                    "originPrice": 15,
                    "num": 1,
                    "name": "15元违章代缴券",
                    "rule": 0,
                    "serviceId": 1,
                    "servicePro": "由车轮查违章提供",
                    "anotherName": "违章代缴",
                    "validDateTimestamp": 1513573980,
                    "validDate": "2017-12-18",
                    "sort": 0
                },
                "youka_1220_1": {
                    "code": "youka_1220_1",
                    "originPrice": 5,
                    "num": 1,
                    "name": "5元油卡充值券",
                    "rule": 0,
                    "serviceId": 1,
                    "servicePro": "由车轮查违章提供",
                    "anotherName": "油卡充值",
                    "validDateTimestamp": 1510979280,
                    "validDate": "2017-11-18",
                    "sort": 1
                }
            }
        };

        env.setCoupon(json.data);

        var chelun = [],
            other = [];
        //适配数据
        //{ul:[
        //    {li:[]},
        //    {li:[]}
        //]}
        $.each(json.data, function (key, value) {
            //车轮优惠券
            if (value.serviceId == 1 && value.code != 'shoujichongzhi_1220_1') {
                chelun.push(value);
            } else {
                //合作方优惠券
                other.push(value);
            }
        });
        chelun.sort(function (a, b) {
            if (a.sort > b.sort) return 1;
            if (a.sort < b.sort) return -1;
            return 0;
        });
        other.sort(function (a, b) {
            if (a.sort > b.sort) return 1;
            if (a.sort < b.sort) return -1;
            return 0;
        });
        //console.log(chelun, other);
        var chelunData = { ul: [] },
            otherData = { ul: [] },
            li = [];
        for (var i = 0, len = chelun.length; i < len; i++) {
            li.push(chelun[i]);
            if (i != 0 && i % 2 == 1 || i == len - 1) {
                chelunData.ul.push({ li: li });
                li = [];
            }
        }
        for (i = 0, len = other.length; i < len; i++) {
            li.push(other[i]);
            if (i != 0 && i % 3 == 2 || i == len - 1) {
                otherData.ul.push({ li: li });
                li = [];
            }
        }
        var html = Mustache.render($('#template').html(), {
            data: chelunData, name_str: function name_str() {
                return this.name.substr(0, 4);
            }, img_str: function img_str() {
                return _this.img_str(this.sort);
            }
        });
        $('#secondContainer').append(html);
        html = Mustache.render($('#template2').html(), {
            data: otherData, name_str: function name_str() {
                return this.name.substr(0, 4);
            }, css: function css() {
                if (this.num == 1) return '';
                return 'disabled';
            }, img_str: function img_str() {
                return _this.img_str(this.sort);
            }
        });
        $('#borderContainer').html(html);
    },
    welfare: function welfare() {
        //选中的优惠券列表
        var _this = this;
        var coupon = env.welfare();
        var html = Mustache.render($('#template').html(), { data: coupon.coupon, img_str: function img_str() {
                return _this.img_str(this.sort);
            } });
        $('#selectedCoupon').append(html);
        $('#payMoney').html(coupon.msg);
        if (coupon.money == 1) {
            $('#btnPay').show();
        } else {
            $('#btnUnPay').show();
        }
        return coupon;
    },
    result: function result() {
        //优惠券结果
        var _this = this;
        var coupon = env.welfare();
        var html = Mustache.render($('#template').html(), { data: coupon.coupon, name_str: function name_str() {
                return this.name.substr(0, 4);
            }, img_str: function img_str() {
                return _this.img_str(this.sort);
            } });
        $('#resultCoupon').append(html);
    }
};

/**
 * 选择页面
 */
var $btnSelect = $('#btnSelect');
if ($btnSelect.length > 0) {
    template.coupon(); //可选的优惠券列表
    /**
     * 优惠券选择
     */
    $('.container').on('click', '[name=select] li', function () {
        var $this = $(this);
        if ($this.hasClass('disabled')) {
            return;
        }
        var currentLength = $('li.selected').length;
        if ($this.hasClass('selected')) {
            $this.removeClass('selected');
            currentLength--;
        } else {
            if (currentLength == 3) {
                Alert('只能选择三张优惠券');
                return;
            }
            $this.addClass('selected');
            currentLength++;
        }
        //修改按钮文案
        switch (currentLength) {
            case 1:
                $btnSelect.html('三缺二');
                break;
            case 2:
                $btnSelect.html('只剩一个啦');
                break;
            case 3:
                $btnSelect.html('我选好啦');
                break;
            default:
                $btnSelect.html('挑3个呗');
                break;
        }
    });

    $btnSelect.on('click', function () {
        var $selected = $('li.selected');
        if ($selected.length < 3) {
            Alert('请选择三张优惠券');
            return;
        }
        var selected = [];
        $selected.each(function (key, value) {
            selected.push($(value).data('key'));
        });
        //console.log(selected)
        env.setSelected(selected);
        location.href = "selected.html";
    });

    /**
     * Logo滚动
     */
    var $partner = $('#partner'),
        $ul = $partner.find('ul'),
        $li = $ul.find('li'),
        liWidth = $li.width() + Math.ceil(parseFloat($li.css('margin-right'))),
        partnerLeft = 0,

    //partnerWidth = $ul[0].offsetWidth,
    ulWidth = $li.length * liWidth;
    $ul.css({ 'width': ulWidth, 'overflow': 'hidden' });
    //alert(liWidth);
    $partner.width(ulWidth * 2);
    $partner.append($ul.clone());
    preImg();
    (function move() {
        $partner.css('-webkit-transform', 'translate3d(-' + partnerLeft + 'px,0,0)');
        partnerLeft++;
        if (partnerLeft > ulWidth) {
            $partner.find('ul').eq(0).remove();
            $partner.append($ul.clone());
            partnerLeft = 0;
            //preImg();
        }
        window.requestAnimationFrame(move);
    })();
}

/**
 * 支付页面
 */
var $txtMobile = $('#txtMobile'),
    $existMobile = $('#existMobile');
if ($txtMobile.length > 0) {
    template.welfare(); //选中的优惠券信息
    $txtMobile.show();
    //修改手机号码
    $('#editMobile').click(function () {
        $txtMobile.val('').show();
        $existMobile.hide();
    });

    /**
     * 支付
     */
    $('#btnPay').on('click', function () {
        var mobile = $txtMobile.val();
        if (!/^\d{11}$/.test(mobile)) {
            Alert('请输入正确的手机号码');
            return;
        }
        env.setMobile(mobile);

        //优惠券已领过券
        Alert('此号码已领取过优惠券', { confirmFn: function confirmFn() {
                location.href = 'result.html';
            }, confirmTxt: '点击查看' }, 'alert2'); //重新生成
    });
}

/**
 * 结果页面
 */
var $resultMobile = $('#resultMobile'),
    $appShare = $('#appShare'),
    $otherShare = $('#otherShare');

if ($resultMobile.length > 0) {
    template.result();
    $resultMobile.find('h4').html(env.getMobile());
    $otherShare.show();
    //返回上一页监听
    (function () {
        pushHistory();
        window.addEventListener("popstate", function (e) {
            location.href = 'selected.html';
        }, false);
        function pushHistory() {
            var state = {
                title: "title",
                url: "#"
            };
            window.history.pushState(state, "title", "#");
        }
    })();
}