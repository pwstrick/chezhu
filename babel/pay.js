'use strict';

var pay = {
    exist: false,
    callback_url: '',
    domain: /h5.chelun.com/.test(window.location.host) ? '//pay.chelun.com' : '//test.pay.chelun.com',
    $deposit: '',
    $payAli: '',
    $payBd: '',
    $payFq: '',
    $canBtn: '',
    $mask: '',
    getParam: function getParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        }
    },
    getCookie: function getCookie(name) {
        var maps = {};
        var cookArr = document.cookie.split(';');
        for (var i in cookArr) {
            var tmp = cookArr[i].replace(/^\s*/, '');
            if (tmp) {
                var nv = tmp.split('=');
                maps[nv[0]] = nv[1] || '';
            }
        }
        return maps[name];
    },
    /**
     * 获取当前环境
     * @return wx   微信环境
     *         app  车轮应用
     *         h5   第三方h5
     */
    getEnv: function getEnv() {
        var ua = navigator.userAgent;
        if (/MicroMessenger/i.test(ua)) {
            return 'wx';
        } else if (this.getCookie('chelun_acToken')) {
            return 'app';
        } else {
            return 'h5';
        }
    },
    /**
     * 初始化
     * @param options 初始化参数 object
     *        order_url     订单请求地址
     *        oreder_param  订单参数
     *        pay_channel   支付方式 支持(wx,h5,app)
     *        callback_url  支付成功的前端回调地址
     */
    init: function init(options) {
        var self = this,
            order_id = '';
        var pay_channel = options.pay_channel ? options.pay_channel : this.getEnv();
        pay_channel == 'h5' ? this.loadImg() : '';
        pay_channel != 'app' ? options.order_param.wapPay = 1 : '';
        this.callback_url = options.callback_url || '';
        this.ac_token = options.order_param.ac_token || '';
        if (options.order_param.order_type == 'get') {
            $.get(options.order_url, options.order_param, function (res) {
                if (res.code == 0) {
                    order_id = res.data.payInfo.orderid;
                    if (pay_channel == 'wx') {
                        if (/\?/.test(self.callback_url)) {
                            self.callback_url += '&order_id=' + order_id;
                        } else {
                            self.callback_url += '?order_id=' + order_id;
                        }
                        self.wxPay(res.data);
                    } else if (pay_channel == 'app') {
                        if (/\?/.test(self.callback_url)) {
                            self.callback_url += '&order_id=' + order_id;
                        } else {
                            self.callback_url += '?order_id=' + order_id;
                        }
                        self.appPay(res.data);
                    } else {
                        if (/\?/.test(self.callback_url)) {
                            self.callback_url += '&order_id=' + order_id;
                        } else {
                            self.callback_url += '?order_id=' + order_id;
                        }
                        self.h5Pay(res.data);
                    }
                } else {
                    alert(res.msg);
                }
            }, 'json');
        } else {
            $.post(options.order_url, options.order_param, function (res) {
                if (res.code == 0) {
                    order_id = res.data.payInfo.orderid;
                    if (pay_channel == 'wx') {
                        if (/\?/.test(self.callback_url)) {
                            self.callback_url += '&order_id=' + order_id;
                        } else {
                            self.callback_url += '?order_id=' + order_id;
                        }
                        self.wxPay(res.data);
                    } else if (pay_channel == 'app') {
                        if (/\?/.test(self.callback_url)) {
                            self.callback_url += '&order_id=' + order_id;
                        } else {
                            self.callback_url += '?order_id=' + order_id;
                        }
                        self.appPay(res.data);
                    } else {
                        if (/\?/.test(self.callback_url)) {
                            self.callback_url += '&order_id=' + order_id;
                        } else {
                            self.callback_url += '?order_id=' + order_id;
                        }
                        self.h5Pay(res.data);
                    }
                } else {
                    alert(res.msg);
                }
            }, 'json');
        }
    },
    /**
     * 微信支付接口
     * @param param object wxJSBridge 支付参数
     */
    wxPay: function wxPay(data) {
        var self = this;
        var ac_token = data.ac_token,
            order_id = data.payInfo.orderid,
            serial_number = data.payInfo.serial_number ? data.payInfo.serial_number : data.payInfo.orderid;
        var param = '';
        param += '?platform=wap';
        param += '&channel=weixin_mp';
        param += '&ac_token=' + ac_token;
        param += '&order_id=' + order_id;
        param += '&serial_number=' + serial_number;
        param += '&callback_url=' + this.callback_url;
        param += '&openid=' + self.getParam('openid');
        param += '&c=order&v=pay2&app=AgentNumberPlate';
        $.get(self.domain + '/api.php' + param, function (res) {
            if (res.code == 1) {
                //调用微信支付jsApi

                var onBridgeReady = function onBridgeReady() {
                    WeixinJSBridge.invoke('getBrandWCPayRequest', res.data.order_param, function (res) {
                        if (/ok/.test(res.err_msg)) {
                            self.callback_url ? window.location = self.callback_url : '';
                        }
                    });
                };

                res.data.order_param.timeStamp = '' + res.data.order_param.timeStamp;
                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                } else {
                    onBridgeReady();
                }
            } else {
                alert(res.message);
            }
        }, 'json');
    },
    /**
     * 客户端支付
     * @param param object 客户端JSBridge 支付参数
     */
    appPay: function appPay(data) {
        var pay_param = {
            price: data.payMoney,
            orderNum: data.payInfo.serial_number,
            channels: data.payInfo.channels,
            callbackUrl: this.callback_url,
            payCallback: function payCallback() {}
        };
        chelunJSBridge.invoke('app', 'pay', pay_param);
    },
    /**
     * h5支付接口
     * @param param object 支付参数
     */
    h5Pay: function h5Pay(data) {
        var self = this,
            pay_way = '',
            channels = data.payInfo.channels;
        if (channels.length) {
            this.deposit = data.payMoney;
            channels.forEach(function (item, index) {
                if (item == 'alipay') {
                    pay_way += '<li class="pay-item pay-ali" id="payAli">\
                                <img src="//h5.chelun.com/libs/widget/h5Pay/img/ali.png"/>\
                                <p>支付宝</p>\
                            </li>';
                } else if (item == 'bdpay' || item == 'baidu') {
                    pay_way += ' <li class="pay-item pay-bd"  id="payBd">\
                                <img src="//h5.chelun.com/libs/widget/h5Pay/img/bd.png"/>\
                                <p>百度钱包</p>\
                            </li>';
                } else if (item == 'fql') {
                    pay_way += '<li class="pay-item pay-fq"  id="payFq">\
                                <img src="//h5.chelun.com/libs/widget/h5Pay/img/fq.png"/>\
                                <p>分期乐</p>\
                            </li>';
                }
            });
        }
        if (!this.exist && pay_way) {
            var html = ' <div id="pay">\
                <div class="pay-info">\
                    <div class="pay-num">\
                        <p>支付金额</p>\
                        <p>￥<span id="payMoney">' + data.payMoney + '</span></p>\
                    </div>\
                    <div class="pay-type">\
                        <ol>' + pay_way + '\
                        </ol>\
                    </div>\
                    <div id="canBtn" class="pay-action">取消</div>\
                </div>\
            </div>';
            var $html = $(html);
            this.$mask = $html;
            this.$deposit = $html.find("#payMoney");
            this.$payAli = $html.find("#payAli");
            this.$payBd = $html.find("#payBd");
            this.$payFq = $html.find("#payFq");
            this.$canBtn = $html.find("#canBtn").on("click", function () {
                self.hide();
            });
            this.exist = true;
            $(document.body).append($html);
        } else {
            this.$deposit && this.$deposit.text(this.deposit);
            this.show();
        }
        var ac_token = data.ac_token || this.ac_token,
            serial_number = data.payInfo.serial_number ? data.payInfo.serial_number : data.payInfo.orderid,
            order_id = data.payInfo.orderid;
        if (channels.length) {
            channels.forEach(function (item, index) {
                if (item == 'alipay') {
                    //阿里支付
                    self.$payAli.off('click').on("click", function () {
                        $('#loading').show();
                        $.get(self.domain + '/api.php?platform=wap&channel=alipay&ac_token=' + ac_token + '&order_id=' + order_id + '&c=order&v=pay2&' + 'app=AgentNumberPlate&serial_number=' + serial_number + '&callback_url=' + encodeURIComponent(self.callback_url), function (res) {
                            $('#loading').hide();
                            window.location = res.data.url;
                        }, 'json');
                    });
                } else if (item == 'bdpay' || item == 'baidu') {
                    //百度支付
                    self.$payBd.off('click').on("click", function () {
                        $.get(self.domain + '/api.php?platform=wap&channel=baidu&ac_token=' + ac_token + '&order_id=' + order_id + '&c=order&v=pay2&' + 'app=AgentNumberPlate&serial_number=' + serial_number + '&callback_url=' + encodeURIComponent(self.callback_url), function (res) {
                            window.location = res.data.url;
                        }, 'json');
                    });
                } else if (item == 'fql') {
                    //分期乐支付
                    self.$payFq.off('click').on("click", function () {
                        $.get(self.domain + '/api.php?platform=wap&channel=baidu&ac_token=' + ac_token + '&order_id=' + order_id + '&c=order&v=pay2&' + 'app=AgentNumberPlate&serial_number=' + serial_number + '&callback_url=' + encodeURIComponent(self.callback_url), function (res) {
                            window.location = res.data.url;
                        }, 'json');
                    });
                }
            });
        }
    },
    show: function show() {
        this.$mask && this.$mask.show();
    },
    hide: function hide() {
        this.$mask.hide();
    },
    loadImg: function loadImg() {
        var ali = new Image(),
            bd = new Image(),
            fq = new Image();
        ali.src = '//h5.chelun.com/libs/widget/h5Pay/img/ali.png';
        bd.src = '//h5.chelun.com/libs/widget/h5Pay/img/bd.png';
        fq.src = '//h5.chelun.com/libs/widget/h5Pay/img/fq.png';
    }
};

module.exports = pay;