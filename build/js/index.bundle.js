/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(1),
	    dom = __webpack_require__(2),
	    cookie = __webpack_require__(6),
	    sore = __webpack_require__(7),
	    url = __webpack_require__(8),
	    util = __webpack_require__(4),
	    Mustache = __webpack_require__(9);

	__webpack_require__(10);

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

/***/ },
/* 1 */
/***/ function(module, exports) {

	;(function (global, factory) {
		if (typeof module === "object" && typeof module.exports === "object") {
			module.exports = factory(global);
		} else {
			factory(global);
		}
	})(typeof window !== "undefined" ? window : this, function (window) {

		var Zepto = (function () {
			var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
				document = window.document,
				elementDisplay = {}, classCache = {},
				cssNumber = {
					'column-count': 1,
					'columns': 1,
					'font-weight': 1,
					'line-height': 1,
					'opacity': 1,
					'z-index': 1,
					'zoom': 1
				},
				fragmentRE = /^\s*<(\w+|!)[^>]*>/,
				singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
				tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
				rootNodeRE = /^(?:body|html)$/i,
				capitalRE = /([A-Z])/g,

			// special attributes that should be get/set via method calls
				methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

				adjacencyOperators = ['after', 'prepend', 'before', 'append'],
				table = document.createElement('table'),
				tableRow = document.createElement('tr'),
				containers = {
					'tr': document.createElement('tbody'),
					'tbody': table, 'thead': table, 'tfoot': table,
					'td': tableRow, 'th': tableRow,
					'*': document.createElement('div')
				},
				readyRE = /complete|loaded|interactive/,
				simpleSelectorRE = /^[\w-]*$/,
				class2type = {},
				toString = class2type.toString,
				zepto = {},
				camelize, uniq,
				tempParent = document.createElement('div'),
				propMap = {
					'tabindex': 'tabIndex',
					'readonly': 'readOnly',
					'for': 'htmlFor',
					'class': 'className',
					'maxlength': 'maxLength',
					'cellspacing': 'cellSpacing',
					'cellpadding': 'cellPadding',
					'rowspan': 'rowSpan',
					'colspan': 'colSpan',
					'usemap': 'useMap',
					'frameborder': 'frameBorder',
					'contenteditable': 'contentEditable'
				},
				isArray = Array.isArray ||
					function (object) {
						return object instanceof Array
					}

			zepto.matches = function (element, selector) {
				if (!selector || !element || element.nodeType !== 1) return false
				var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
					element.oMatchesSelector || element.matchesSelector
				if (matchesSelector) return matchesSelector.call(element, selector)
				// fall back to performing a selector:
				var match, parent = element.parentNode, temp = !parent
				if (temp) (parent = tempParent).appendChild(element)
				match = ~zepto.qsa(parent, selector).indexOf(element)
				temp && tempParent.removeChild(element)
				return match
			}

			function type(obj) {
				return obj == null ? String(obj) :
				class2type[toString.call(obj)] || "object"
			}

			function isFunction(value) {
				return type(value) == "function"
			}

			function isWindow(obj) {
				return obj != null && obj == obj.window
			}

			function isDocument(obj) {
				return obj != null && obj.nodeType == obj.DOCUMENT_NODE
			}

			function isObject(obj) {
				return type(obj) == "object"
			}

			function isPlainObject(obj) {
				return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
			}

			function likeArray(obj) {
				return typeof obj.length == 'number'
			}

			function compact(array) {
				return filter.call(array, function (item) {
					return item != null
				})
			}

			function flatten(array) {
				return array.length > 0 ? $.fn.concat.apply([], array) : array
			}

			camelize = function (str) {
				return str.replace(/-+(.)?/g, function (match, chr) {
					return chr ? chr.toUpperCase() : ''
				})
			}
			function dasherize(str) {
				return str.replace(/::/g, '/')
					.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
					.replace(/([a-z\d])([A-Z])/g, '$1_$2')
					.replace(/_/g, '-')
					.toLowerCase()
			}

			uniq = function (array) {
				return filter.call(array, function (item, idx) {
					return array.indexOf(item) == idx
				})
			}

			function classRE(name) {
				return name in classCache ?
					classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
			}

			function maybeAddPx(name, value) {
				return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
			}

			function defaultDisplay(nodeName) {
				var element, display
				if (!elementDisplay[nodeName]) {
					element = document.createElement(nodeName)
					document.body.appendChild(element)
					display = getComputedStyle(element, '').getPropertyValue("display")
					element.parentNode.removeChild(element)
					display == "none" && (display = "block")
					elementDisplay[nodeName] = display
				}
				return elementDisplay[nodeName]
			}

			function children(element) {
				return 'children' in element ?
					slice.call(element.children) :
					$.map(element.childNodes, function (node) {
						if (node.nodeType == 1) return node
					})
			}

			// `$.zepto.fragment` takes a html string and an optional tag name
			// to generate DOM nodes nodes from the given html string.
			// The generated DOM nodes are returned as an array.
			// This function can be overriden in plugins for example to make
			// it compatible with browsers that don't support the DOM fully.
			zepto.fragment = function (html, name, properties) {
				var dom, nodes, container

				// A special case optimization for a single tag
				if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

				if (!dom) {
					if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
					if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
					if (!(name in containers)) name = '*'

					container = containers[name]
					container.innerHTML = '' + html
					dom = $.each(slice.call(container.childNodes), function () {
						container.removeChild(this)
					})
				}

				if (isPlainObject(properties)) {
					nodes = $(dom)
					$.each(properties, function (key, value) {
						if (methodAttributes.indexOf(key) > -1) nodes[key](value)
						else nodes.attr(key, value)
					})
				}

				return dom
			}

			// `$.zepto.Z` swaps out the prototype of the given `dom` array
			// of nodes with `$.fn` and thus supplying all the Zepto functions
			// to the array. Note that `__proto__` is not supported on Internet
			// Explorer. This method can be overriden in plugins.
			zepto.Z = function (dom, selector) {
				dom = dom || []
				dom.__proto__ = $.fn
				dom.selector = selector || ''
				return dom
			}

			// `$.zepto.isZ` should return `true` if the given object is a Zepto
			// collection. This method can be overriden in plugins.
			zepto.isZ = function (object) {
				return object instanceof zepto.Z
			}

			// `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
			// takes a CSS selector and an optional context (and handles various
			// special cases).
			// This method can be overriden in plugins.
			zepto.init = function (selector, context) {
				var dom
				// If nothing given, return an empty Zepto collection
				if (!selector) return zepto.Z()
				// Optimize for string selectors
				else if (typeof selector == 'string') {
					selector = selector.trim()
					// If it's a html fragment, create nodes from it
					// Note: In both Chrome 21 and Firefox 15, DOM error 12
					// is thrown if the fragment doesn't begin with <
					if (selector[0] == '<' && fragmentRE.test(selector))
						dom = zepto.fragment(selector, RegExp.$1, context), selector = null
					// If there's a context, create a collection on that context first, and select
					// nodes from there
					else if (context !== undefined) return $(context).find(selector)
					// If it's a CSS selector, use it to select nodes.
					else dom = zepto.qsa(document, selector)
				}
				// If a function is given, call it when the DOM is ready
				else if (isFunction(selector)) return $(document).ready(selector)
				// If a Zepto collection is given, just return it
				else if (zepto.isZ(selector)) return selector
				else {
					// normalize array if an array of nodes is given
					if (isArray(selector)) dom = compact(selector)
					// Wrap DOM nodes.
					else if (isObject(selector))
						dom = [selector], selector = null
					// If it's a html fragment, create nodes from it
					else if (fragmentRE.test(selector))
						dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
					// If there's a context, create a collection on that context first, and select
					// nodes from there
					else if (context !== undefined) return $(context).find(selector)
					// And last but no least, if it's a CSS selector, use it to select nodes.
					else dom = zepto.qsa(document, selector)
				}
				// create a new Zepto collection from the nodes found
				return zepto.Z(dom, selector)
			}

			// `$` will be the base `Zepto` object. When calling this
			// function just call `$.zepto.init, which makes the implementation
			// details of selecting nodes and creating Zepto collections
			// patchable in plugins.
			$ = function (selector, context) {
				return zepto.init(selector, context)
			}

			function extend(target, source, deep) {
				for (key in source)
					if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
						if (isPlainObject(source[key]) && !isPlainObject(target[key]))
							target[key] = {}
						if (isArray(source[key]) && !isArray(target[key]))
							target[key] = []
						extend(target[key], source[key], deep)
					}
					else if (source[key] !== undefined) target[key] = source[key]
			}

			// Copy all but undefined properties from one or more
			// objects to the `target` object.
			$.extend = function (target) {
				var deep, args = slice.call(arguments, 1)
				if (typeof target == 'boolean') {
					deep = target
					target = args.shift()
				}
				args.forEach(function (arg) {
					extend(target, arg, deep)
				})
				return target
			}

			// `$.zepto.qsa` is Zepto's CSS selector implementation which
			// uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
			// This method can be overriden in plugins.
			zepto.qsa = function (element, selector) {
				var found,
					maybeID = selector[0] == '#',
					maybeClass = !maybeID && selector[0] == '.',
					nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
					isSimple = simpleSelectorRE.test(nameOnly)
				return (isDocument(element) && isSimple && maybeID) ?
					( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
					(element.nodeType !== 1 && element.nodeType !== 9) ? [] :
						slice.call(
							isSimple && !maybeID ?
								maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
									element.getElementsByTagName(selector) : // Or a tag
								element.querySelectorAll(selector) // Or it's not simple, and we need to query all
						)
			}

			function filtered(nodes, selector) {
				return selector == null ? $(nodes) : $(nodes).filter(selector)
			}

			$.contains = document.documentElement.contains ?
				function (parent, node) {
					return parent !== node && parent.contains(node)
				} :
				function (parent, node) {
					while (node && (node = node.parentNode))
						if (node === parent) return true
					return false
				}

			function funcArg(context, arg, idx, payload) {
				return isFunction(arg) ? arg.call(context, idx, payload) : arg
			}

			function setAttribute(node, name, value) {
				value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
			}

			// access className property while respecting SVGAnimatedString
			function className(node, value) {
				var klass = node.className || '',
					svg = klass && klass.baseVal !== undefined

				if (value === undefined) return svg ? klass.baseVal : klass
				svg ? (klass.baseVal = value) : (node.className = value)
			}

			// "true"  => true
			// "false" => false
			// "null"  => null
			// "42"    => 42
			// "42.5"  => 42.5
			// "08"    => "08"
			// JSON    => parse if valid
			// String  => self
			function deserializeValue(value) {
				try {
					return value ?
					value == "true" ||
					( value == "false" ? false :
						value == "null" ? null :
							+value + "" == value ? +value :
								/^[\[\{]/.test(value) ? $.parseJSON(value) :
									value )
						: value
				} catch (e) {
					return value
				}
			}

			$.type = type
			$.isFunction = isFunction
			$.isWindow = isWindow
			$.isArray = isArray
			$.isPlainObject = isPlainObject

			$.isEmptyObject = function (obj) {
				var name
				for (name in obj) return false
				return true
			}

			$.inArray = function (elem, array, i) {
				return emptyArray.indexOf.call(array, elem, i)
			}

			$.camelCase = camelize
			$.trim = function (str) {
				return str == null ? "" : String.prototype.trim.call(str)
			}

			// plugin compatibility
			$.uuid = 0
			$.support = {}
			$.expr = {}

			$.map = function (elements, callback) {
				var value, values = [], i, key
				if (likeArray(elements))
					for (i = 0; i < elements.length; i++) {
						value = callback(elements[i], i)
						if (value != null) values.push(value)
					}
				else
					for (key in elements) {
						value = callback(elements[key], key)
						if (value != null) values.push(value)
					}
				return flatten(values)
			}

			$.each = function (elements, callback) {
				var i, key
				if (likeArray(elements)) {
					for (i = 0; i < elements.length; i++)
						if (callback.call(elements[i], i, elements[i]) === false) return elements
				} else {
					for (key in elements)
						if (callback.call(elements[key], key, elements[key]) === false) return elements
				}

				return elements
			}

			$.grep = function (elements, callback) {
				return filter.call(elements, callback)
			}

			if (window.JSON) $.parseJSON = JSON.parse

			// Populate the class2type map
			$.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
				class2type["[object " + name + "]"] = name.toLowerCase()
			})

			// Define methods that will be available on all
			// Zepto collections
			$.fn = {
				// Because a collection acts like an array
				// copy over these useful array functions.
				forEach: emptyArray.forEach,
				reduce: emptyArray.reduce,
				push: emptyArray.push,
				sort: emptyArray.sort,
				indexOf: emptyArray.indexOf,
				concat: emptyArray.concat,

				// `map` and `slice` in the jQuery API work differently
				// from their array counterparts
				map: function (fn) {
					return $($.map(this, function (el, i) {
						return fn.call(el, i, el)
					}))
				},
				slice: function () {
					return $(slice.apply(this, arguments))
				},

				ready: function (callback) {
					// need to check if document.body exists for IE as that browser reports
					// document ready when it hasn't yet created the body element
					if (readyRE.test(document.readyState) && document.body) callback($)
					else document.addEventListener('DOMContentLoaded', function () {
						callback($)
					}, false)
					return this
				},
				get: function (idx) {
					return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
				},
				toArray: function () {
					return this.get()
				},
				size: function () {
					return this.length
				},
				remove: function () {
					return this.each(function () {
						if (this.parentNode != null)
							this.parentNode.removeChild(this)
					})
				},
				each: function (callback) {
					emptyArray.every.call(this, function (el, idx) {
						return callback.call(el, idx, el) !== false
					})
					return this
				},
				filter: function (selector) {
					if (isFunction(selector)) return this.not(this.not(selector))
					return $(filter.call(this, function (element) {
						return zepto.matches(element, selector)
					}))
				},
				add: function (selector, context) {
					return $(uniq(this.concat($(selector, context))))
				},
				is: function (selector) {
					return this.length > 0 && zepto.matches(this[0], selector)
				},
				not: function (selector) {
					var nodes = []
					if (isFunction(selector) && selector.call !== undefined)
						this.each(function (idx) {
							if (!selector.call(this, idx)) nodes.push(this)
						})
					else {
						var excludes = typeof selector == 'string' ? this.filter(selector) :
							(likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
						this.forEach(function (el) {
							if (excludes.indexOf(el) < 0) nodes.push(el)
						})
					}
					return $(nodes)
				},
				has: function (selector) {
					return this.filter(function () {
						return isObject(selector) ?
							$.contains(this, selector) :
							$(this).find(selector).size()
					})
				},
				eq: function (idx) {
					return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1)
				},
				first: function () {
					var el = this[0]
					return el && !isObject(el) ? el : $(el)
				},
				last: function () {
					var el = this[this.length - 1]
					return el && !isObject(el) ? el : $(el)
				},
				find: function (selector) {
					var result, $this = this
					if (!selector) result = $()
					else if (typeof selector == 'object')
						result = $(selector).filter(function () {
							var node = this
							return emptyArray.some.call($this, function (parent) {
								return $.contains(parent, node)
							})
						})
					else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
					else result = this.map(function () {
							return zepto.qsa(this, selector)
						})
					return result
				},
				closest: function (selector, context) {
					var node = this[0], collection = false
					if (typeof selector == 'object') collection = $(selector)
					while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
						node = node !== context && !isDocument(node) && node.parentNode
					return $(node)
				},
				parents: function (selector) {
					var ancestors = [], nodes = this
					while (nodes.length > 0)
						nodes = $.map(nodes, function (node) {
							if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
								ancestors.push(node)
								return node
							}
						})
					return filtered(ancestors, selector)
				},
				parent: function (selector) {
					return filtered(uniq(this.pluck('parentNode')), selector)
				},
				children: function (selector) {
					return filtered(this.map(function () {
						return children(this)
					}), selector)
				},
				contents: function () {
					return this.map(function () {
						return slice.call(this.childNodes)
					})
				},
				siblings: function (selector) {
					return filtered(this.map(function (i, el) {
						return filter.call(children(el.parentNode), function (child) {
							return child !== el
						})
					}), selector)
				},
				empty: function () {
					return this.each(function () {
						this.innerHTML = ''
					})
				},
				// `pluck` is borrowed from Prototype.js
				pluck: function (property) {
					return $.map(this, function (el) {
						return el[property]
					})
				},
				show: function () {
					return this.each(function () {
						this.style.display == "none" && (this.style.display = '')
						if (getComputedStyle(this, '').getPropertyValue("display") == "none")
							this.style.display = defaultDisplay(this.nodeName)
					})
				},
				replaceWith: function (newContent) {
					return this.before(newContent).remove()
				},
				wrap: function (structure) {
					var func = isFunction(structure)
					if (this[0] && !func)
						var dom = $(structure).get(0),
							clone = dom.parentNode || this.length > 1

					return this.each(function (index) {
						$(this).wrapAll(
							func ? structure.call(this, index) :
								clone ? dom.cloneNode(true) : dom
						)
					})
				},
				wrapAll: function (structure) {
					if (this[0]) {
						$(this[0]).before(structure = $(structure))
						var children
						// drill down to the inmost element
						while ((children = structure.children()).length) structure = children.first()
						$(structure).append(this)
					}
					return this
				},
				wrapInner: function (structure) {
					var func = isFunction(structure)
					return this.each(function (index) {
						var self = $(this), contents = self.contents(),
							dom = func ? structure.call(this, index) : structure
						contents.length ? contents.wrapAll(dom) : self.append(dom)
					})
				},
				unwrap: function () {
					this.parent().each(function () {
						$(this).replaceWith($(this).children())
					})
					return this
				},
				clone: function () {
					return this.map(function () {
						return this.cloneNode(true)
					})
				},
				hide: function () {
					return this.css("display", "none")
				},
				toggle: function (setting) {
					return this.each(function () {
						var el = $(this)
							;
						(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
					})
				},
				prev: function (selector) {
					return $(this.pluck('previousElementSibling')).filter(selector || '*')
				},
				next: function (selector) {
					return $(this.pluck('nextElementSibling')).filter(selector || '*')
				},
				html: function (html) {
					return 0 in arguments ?
						this.each(function (idx) {
							var originHtml = this.innerHTML
							$(this).empty().append(funcArg(this, html, idx, originHtml))
						}) :
						(0 in this ? this[0].innerHTML : null)
				},
				text: function (text) {
					return 0 in arguments ?
						this.each(function (idx) {
							var newText = funcArg(this, text, idx, this.textContent)
							this.textContent = newText == null ? '' : '' + newText
						}) :
						(0 in this ? this[0].textContent : null)
				},
				attr: function (name, value) {
					var result
					return (typeof name == 'string' && !(1 in arguments)) ?
						(!this.length || this[0].nodeType !== 1 ? undefined :
								(!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
						) :
						this.each(function (idx) {
							if (this.nodeType !== 1) return
							if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
							else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
						})
				},
				removeAttr: function (name) {
					return this.each(function () {
						this.nodeType === 1 && name.split(' ').forEach(function (attribute) {
							setAttribute(this, attribute)
						}, this)
					})
				},
				prop: function (name, value) {
					name = propMap[name] || name
					return (1 in arguments) ?
						this.each(function (idx) {
							this[name] = funcArg(this, value, idx, this[name])
						}) :
						(this[0] && this[0][name])
				},
				data: function (name, value) {
					var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

					var data = (1 in arguments) ?
						this.attr(attrName, value) :
						this.attr(attrName)

					return data !== null ? deserializeValue(data) : undefined
				},
				val: function (value) {
					return 0 in arguments ?
						this.each(function (idx) {
							this.value = funcArg(this, value, idx, this.value)
						}) :
						(this[0] && (this[0].multiple ?
								$(this[0]).find('option').filter(function () {
									return this.selected
								}).pluck('value') :
								this[0].value)
						)
				},
				offset: function (coordinates) {
					if (coordinates) return this.each(function (index) {
						var $this = $(this),
							coords = funcArg(this, coordinates, index, $this.offset()),
							parentOffset = $this.offsetParent().offset(),
							props = {
								top: coords.top - parentOffset.top,
								left: coords.left - parentOffset.left
							}

						if ($this.css('position') == 'static') props['position'] = 'relative'
						$this.css(props)
					})
					if (!this.length) return null
					var obj = this[0].getBoundingClientRect()
					return {
						left: obj.left + window.pageXOffset,
						top: obj.top + window.pageYOffset,
						width: Math.round(obj.width),
						height: Math.round(obj.height)
					}
				},
				css: function (property, value) {
					if (arguments.length < 2) {
						var computedStyle, element = this[0]
						if (!element) return
						computedStyle = getComputedStyle(element, '')
						if (typeof property == 'string')
							return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
						else if (isArray(property)) {
							var props = {}
							$.each(property, function (_, prop) {
								props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
							})
							return props
						}
					}

					var css = ''
					if (type(property) == 'string') {
						if (!value && value !== 0)
							this.each(function () {
								this.style.removeProperty(dasherize(property))
							})
						else
							css = dasherize(property) + ":" + maybeAddPx(property, value)
					} else {
						for (key in property)
							if (!property[key] && property[key] !== 0)
								this.each(function () {
									this.style.removeProperty(dasherize(key))
								})
							else
								css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
					}

					return this.each(function () {
						this.style.cssText += ';' + css
					})
				},
				index: function (element) {
					return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
				},
				hasClass: function (name) {
					if (!name) return false
					return emptyArray.some.call(this, function (el) {
						return this.test(className(el))
					}, classRE(name))
				},
				addClass: function (name) {
					if (!name) return this
					return this.each(function (idx) {
						if (!('className' in this)) return
						classList = []
						var cls = className(this), newName = funcArg(this, name, idx, cls)
						newName.split(/\s+/g).forEach(function (klass) {
							if (!$(this).hasClass(klass)) classList.push(klass)
						}, this)
						classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
					})
				},
				removeClass: function (name) {
					return this.each(function (idx) {
						if (!('className' in this)) return
						if (name === undefined) return className(this, '')
						classList = className(this)
						funcArg(this, name, idx, classList).split(/\s+/g).forEach(function (klass) {
							classList = classList.replace(classRE(klass), " ")
						})
						className(this, classList.trim())
					})
				},
				toggleClass: function (name, when) {
					if (!name) return this
					return this.each(function (idx) {
						var $this = $(this), names = funcArg(this, name, idx, className(this))
						names.split(/\s+/g).forEach(function (klass) {
							(when === undefined ? !$this.hasClass(klass) : when) ?
								$this.addClass(klass) : $this.removeClass(klass)
						})
					})
				},
				scrollTop: function (value) {
					if (!this.length) return
					var hasScrollTop = 'scrollTop' in this[0]
					if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
					return this.each(hasScrollTop ?
						function () {
							this.scrollTop = value
						} :
						function () {
							this.scrollTo(this.scrollX, value)
						})
				},
				scrollLeft: function (value) {
					if (!this.length) return
					var hasScrollLeft = 'scrollLeft' in this[0]
					if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
					return this.each(hasScrollLeft ?
						function () {
							this.scrollLeft = value
						} :
						function () {
							this.scrollTo(value, this.scrollY)
						})
				},
				position: function () {
					if (!this.length) return

					var elem = this[0],
					// Get *real* offsetParent
						offsetParent = this.offsetParent(),
					// Get correct offsets
						offset = this.offset(),
						parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? {top: 0, left: 0} : offsetParent.offset()

					// Subtract element margins
					// note: when an element has margin: auto the offsetLeft and marginLeft
					// are the same in Safari causing offset.left to incorrectly be 0
					offset.top -= parseFloat($(elem).css('margin-top')) || 0
					offset.left -= parseFloat($(elem).css('margin-left')) || 0

					// Add offsetParent borders
					parentOffset.top += parseFloat($(offsetParent[0]).css('border-top-width')) || 0
					parentOffset.left += parseFloat($(offsetParent[0]).css('border-left-width')) || 0

					// Subtract the two offsets
					return {
						top: offset.top - parentOffset.top,
						left: offset.left - parentOffset.left
					}
				},
				offsetParent: function () {
					return this.map(function () {
						var parent = this.offsetParent || document.body
						while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
							parent = parent.offsetParent
						return parent
					})
				}
			}

			// for now
			$.fn.detach = $.fn.remove

				// Generate the `width` and `height` functions
			;
			['width', 'height'].forEach(function (dimension) {
				var dimensionProperty =
					dimension.replace(/./, function (m) {
						return m[0].toUpperCase()
					})

				$.fn[dimension] = function (value) {
					var offset, el = this[0]
					if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
						isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
						(offset = this.offset()) && offset[dimension]
					else return this.each(function (idx) {
						el = $(this)
						el.css(dimension, funcArg(this, value, idx, el[dimension]()))
					})
				}
			})

			function traverseNode(node, fun) {
				fun(node)
				for (var i = 0, len = node.childNodes.length; i < len; i++)
					traverseNode(node.childNodes[i], fun)
			}

			// Generate the `after`, `prepend`, `before`, `append`,
			// `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
			adjacencyOperators.forEach(function (operator, operatorIndex) {
				var inside = operatorIndex % 2 //=> prepend, append

				$.fn[operator] = function () {
					// arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
					var argType, nodes = $.map(arguments, function (arg) {
							argType = type(arg)
							return argType == "object" || argType == "array" || arg == null ?
								arg : zepto.fragment(arg)
						}),
						parent, copyByClone = this.length > 1
					if (nodes.length < 1) return this

					return this.each(function (_, target) {
						parent = inside ? target : target.parentNode

						// convert all methods to a "before" operation
						target = operatorIndex == 0 ? target.nextSibling :
							operatorIndex == 1 ? target.firstChild :
								operatorIndex == 2 ? target :
									null

						var parentInDocument = $.contains(document.documentElement, parent)

						nodes.forEach(function (node) {
							if (copyByClone) node = node.cloneNode(true)
							else if (!parent) return $(node).remove()

							parent.insertBefore(node, target)
							if (parentInDocument) traverseNode(node, function (el) {
								if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
									(!el.type || el.type === 'text/javascript') && !el.src)
									window['eval'].call(window, el.innerHTML)
							})
						})
					})
				}

				// after    => insertAfter
				// prepend  => prependTo
				// before   => insertBefore
				// append   => appendTo
				$.fn[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function (html) {
					$(html)[operator](this)
					return this
				}
			})

			zepto.Z.prototype = $.fn

			// Export internal API functions in the `$.zepto` namespace
			zepto.uniq = uniq
			zepto.deserializeValue = deserializeValue
			$.zepto = zepto

			return $
		})()

		window.Zepto = Zepto
		window.$ === undefined && (window.$ = Zepto)

		;
		(function ($) {
			var _zid = 1, undefined,
				slice = Array.prototype.slice,
				isFunction = $.isFunction,
				isString = function (obj) {
					return typeof obj == 'string'
				},
				handlers = {},
				specialEvents = {},
				focusinSupported = 'onfocusin' in window,
				focus = {focus: 'focusin', blur: 'focusout'},
				hover = {mouseenter: 'mouseover', mouseleave: 'mouseout'}

			specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

			function zid(element) {
				return element._zid || (element._zid = _zid++)
			}

			function findHandlers(element, event, fn, selector) {
				event = parse(event)
				if (event.ns) var matcher = matcherFor(event.ns)
				return (handlers[zid(element)] || []).filter(function (handler) {
					return handler
						&& (!event.e || handler.e == event.e)
						&& (!event.ns || matcher.test(handler.ns))
						&& (!fn || zid(handler.fn) === zid(fn))
						&& (!selector || handler.sel == selector)
				})
			}

			function parse(event) {
				var parts = ('' + event).split('.')
				return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
			}

			function matcherFor(ns) {
				return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
			}

			function eventCapture(handler, captureSetting) {
				return handler.del &&
					(!focusinSupported && (handler.e in focus)) || !!captureSetting
			}

			function realEvent(type) {
				return hover[type] || (focusinSupported && focus[type]) || type
			}

			function add(element, events, fn, data, selector, delegator, capture) {
				var id = zid(element), set = (handlers[id] || (handlers[id] = []))
				events.split(/\s/).forEach(function (event) {
					if (event == 'ready') return $(document).ready(fn)
					var handler = parse(event)
					handler.fn = fn
					handler.sel = selector
					// emulate mouseenter, mouseleave
					if (handler.e in hover) fn = function (e) {
						var related = e.relatedTarget
						if (!related || (related !== this && !$.contains(this, related)))
							return handler.fn.apply(this, arguments)
					}
					handler.del = delegator
					var callback = delegator || fn
					handler.proxy = function (e) {
						e = compatible(e)
						if (e.isImmediatePropagationStopped()) return
						e.data = data
						var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
						if (result === false) e.preventDefault(), e.stopPropagation()
						return result
					}
					handler.i = set.length
					set.push(handler)
					if ('addEventListener' in element)
						element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
				})
			}

			function remove(element, events, fn, selector, capture) {
				var id = zid(element)
					;
				(events || '').split(/\s/).forEach(function (event) {
					findHandlers(element, event, fn, selector).forEach(function (handler) {
						delete handlers[id][handler.i]
						if ('removeEventListener' in element)
							element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
					})
				})
			}

			$.event = {add: add, remove: remove}

			$.proxy = function (fn, context) {
				var args = (2 in arguments) && slice.call(arguments, 2)
				if (isFunction(fn)) {
					var proxyFn = function () {
						return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments)
					}
					proxyFn._zid = zid(fn)
					return proxyFn
				} else if (isString(context)) {
					if (args) {
						args.unshift(fn[context], fn)
						return $.proxy.apply(null, args)
					} else {
						return $.proxy(fn[context], fn)
					}
				} else {
					throw new TypeError("expected function")
				}
			}

			$.fn.bind = function (event, data, callback) {
				return this.on(event, data, callback)
			}
			$.fn.unbind = function (event, callback) {
				return this.off(event, callback)
			}
			$.fn.one = function (event, selector, data, callback) {
				return this.on(event, selector, data, callback, 1)
			}

			var returnTrue = function () {
					return true
				},
				returnFalse = function () {
					return false
				},
				ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
				eventMethods = {
					preventDefault: 'isDefaultPrevented',
					stopImmediatePropagation: 'isImmediatePropagationStopped',
					stopPropagation: 'isPropagationStopped'
				}

			function compatible(event, source) {
				if (source || !event.isDefaultPrevented) {
					source || (source = event)

					$.each(eventMethods, function (name, predicate) {
						var sourceMethod = source[name]
						event[name] = function () {
							this[predicate] = returnTrue
							return sourceMethod && sourceMethod.apply(source, arguments)
						}
						event[predicate] = returnFalse
					})

					if (source.defaultPrevented !== undefined ? source.defaultPrevented :
							'returnValue' in source ? source.returnValue === false :
							source.getPreventDefault && source.getPreventDefault())
						event.isDefaultPrevented = returnTrue
				}
				return event
			}

			function createProxy(event) {
				var key, proxy = {originalEvent: event}
				for (key in event)
					if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

				return compatible(proxy, event)
			}

			$.fn.delegate = function (selector, event, callback) {
				return this.on(event, selector, callback)
			}
			$.fn.undelegate = function (selector, event, callback) {
				return this.off(event, selector, callback)
			}

			$.fn.live = function (event, callback) {
				$(document.body).delegate(this.selector, event, callback)
				return this
			}
			$.fn.die = function (event, callback) {
				$(document.body).undelegate(this.selector, event, callback)
				return this
			}

			$.fn.on = function (event, selector, data, callback, one) {
				var autoRemove, delegator, $this = this
				if (event && !isString(event)) {
					$.each(event, function (type, fn) {
						$this.on(type, selector, data, fn, one)
					})
					return $this
				}

				if (!isString(selector) && !isFunction(callback) && callback !== false)
					callback = data, data = selector, selector = undefined
				if (isFunction(data) || data === false)
					callback = data, data = undefined

				if (callback === false) callback = returnFalse

				return $this.each(function (_, element) {
					if (one) autoRemove = function (e) {
						remove(element, e.type, callback)
						return callback.apply(this, arguments)
					}

					if (selector) delegator = function (e) {
						var evt, match = $(e.target).closest(selector, element).get(0)
						if (match && match !== element) {
							evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
							return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
						}
					}

					add(element, event, callback, data, selector, delegator || autoRemove)
				})
			}
			$.fn.off = function (event, selector, callback) {
				var $this = this
				if (event && !isString(event)) {
					$.each(event, function (type, fn) {
						$this.off(type, selector, fn)
					})
					return $this
				}

				if (!isString(selector) && !isFunction(callback) && callback !== false)
					callback = selector, selector = undefined

				if (callback === false) callback = returnFalse

				return $this.each(function () {
					remove(this, event, callback, selector)
				})
			}

			$.fn.trigger = function (event, args) {
				event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
				event._args = args
				return this.each(function () {
					// handle focus(), blur() by calling them directly
					if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
					// items in the collection might not be DOM elements
					else if ('dispatchEvent' in this) this.dispatchEvent(event)
					else $(this).triggerHandler(event, args)
				})
			}

			// triggers event handlers on current element just as if an event occurred,
			// doesn't trigger an actual event, doesn't bubble
			$.fn.triggerHandler = function (event, args) {
				var e, result
				this.each(function (i, element) {
					e = createProxy(isString(event) ? $.Event(event) : event)
					e._args = args
					e.target = element
					$.each(findHandlers(element, event.type || event), function (i, handler) {
						result = handler.proxy(e)
						if (e.isImmediatePropagationStopped()) return false
					})
				})
				return result
			}

				// shortcut methods for `.bind(event, fn)` for each event type
			;
			('focusin focusout focus blur load resize scroll unload click dblclick ' +
			'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
			'change select keydown keypress keyup error').split(' ').forEach(function (event) {
				$.fn[event] = function (callback) {
					return (0 in arguments) ?
						this.bind(event, callback) :
						this.trigger(event)
				}
			})

			$.Event = function (type, props) {
				if (!isString(type)) props = type, type = props.type
				var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
				if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
				event.initEvent(type, bubbles, true)
				return compatible(event)
			}

		})(Zepto)

		;
		(function ($) {
			var jsonpID = 0,
				document = window.document,
				key,
				name,
				rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
				scriptTypeRE = /^(?:text|application)\/javascript/i,
				xmlTypeRE = /^(?:text|application)\/xml/i,
				jsonType = 'application/json',
				htmlType = 'text/html',
				blankRE = /^\s*$/,
				originAnchor = document.createElement('a')

			originAnchor.href = window.location.href

			// trigger a custom event and return false if it was cancelled
			function triggerAndReturn(context, eventName, data) {
				var event = $.Event(eventName)
				$(context).trigger(event, data)
				return !event.isDefaultPrevented()
			}

			// trigger an Ajax "global" event
			function triggerGlobal(settings, context, eventName, data) {
				if (settings.global) return triggerAndReturn(context || document, eventName, data)
			}

			// Number of active Ajax requests
			$.active = 0

			function ajaxStart(settings) {
				if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
			}

			function ajaxStop(settings) {
				if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
			}

			// triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
			function ajaxBeforeSend(xhr, settings) {
				var context = settings.context
				if (settings.beforeSend.call(context, xhr, settings) === false ||
					triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
					return false

				triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
			}

			function ajaxSuccess(data, xhr, settings, deferred) {
				var context = settings.context, status = 'success'
				settings.success.call(context, data, status, xhr)
				if (deferred) deferred.resolveWith(context, [data, status, xhr])
				triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
				ajaxComplete(status, xhr, settings)
			}

			// type: "timeout", "error", "abort", "parsererror"
			function ajaxError(error, type, xhr, settings, deferred) {
				var context = settings.context
				settings.error.call(context, xhr, type, error)
				if (deferred) deferred.rejectWith(context, [xhr, type, error])
				triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
				ajaxComplete(type, xhr, settings)
			}

			// status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
			function ajaxComplete(status, xhr, settings) {
				var context = settings.context
				settings.complete.call(context, xhr, status)
				triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
				ajaxStop(settings)
			}

			// Empty function, used as default callback
			function empty() {
			}

			$.ajaxJSONP = function (options, deferred) {
				if (!('type' in options)) return $.ajax(options)

				var _callbackName = options.jsonpCallback,
					callbackName = ($.isFunction(_callbackName) ?
							_callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
					script = document.createElement('script'),
					originalCallback = window[callbackName],
					responseData,
					abort = function (errorType) {
						$(script).triggerHandler('error', errorType || 'abort')
					},
					xhr = {abort: abort}, abortTimeout

				if (deferred) deferred.promise(xhr)

				$(script).on('load error', function (e, errorType) {
					clearTimeout(abortTimeout)
					$(script).off().remove()

					if (e.type == 'error' || !responseData) {
						ajaxError(null, errorType || 'error', xhr, options, deferred)
					} else {
						ajaxSuccess(responseData[0], xhr, options, deferred)
					}

					window[callbackName] = originalCallback
					if (responseData && $.isFunction(originalCallback))
						originalCallback(responseData[0])

					originalCallback = responseData = undefined
				})

				if (ajaxBeforeSend(xhr, options) === false) {
					abort('abort')
					return xhr
				}

				window[callbackName] = function () {
					responseData = arguments
				}

				script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
				document.head.appendChild(script)

				if (options.timeout > 0) abortTimeout = setTimeout(function () {
					abort('timeout')
				}, options.timeout)

				return xhr
			}

			$.ajaxSettings = {
				// Default type of request
				type: 'GET',
				// Callback that is executed before request
				beforeSend: empty,
				// Callback that is executed if the request succeeds
				success: empty,
				// Callback that is executed the the server drops error
				error: empty,
				// Callback that is executed on request complete (both: error and success)
				complete: empty,
				// The context for the callbacks
				context: null,
				// Whether to trigger "global" Ajax events
				global: true,
				// Transport
				xhr: function () {
					return new window.XMLHttpRequest()
				},
				// MIME types mapping
				// IIS returns Javascript as "application/x-javascript"
				accepts: {
					script: 'text/javascript, application/javascript, application/x-javascript',
					json: jsonType,
					xml: 'application/xml, text/xml',
					html: htmlType,
					text: 'text/plain'
				},
				// Whether the request is to another domain
				crossDomain: false,
				// Default timeout
				timeout: 0,
				// Whether data should be serialized to string
				processData: true,
				// Whether the browser should be allowed to cache GET responses
				cache: true
			}

			function mimeToDataType(mime) {
				if (mime) mime = mime.split(';', 2)[0]
				return mime && ( mime == htmlType ? 'html' :
						mime == jsonType ? 'json' :
							scriptTypeRE.test(mime) ? 'script' :
							xmlTypeRE.test(mime) && 'xml' ) || 'text'
			}

			function appendQuery(url, query) {
				if (query == '') return url
				return (url + '&' + query).replace(/[&?]{1,2}/, '?')
			}

			// serialize payload and append it to the URL for GET requests
			function serializeData(options) {
				if (options.processData && options.data && $.type(options.data) != "string")
					options.data = $.param(options.data, options.traditional)
				if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
					options.url = appendQuery(options.url, options.data), options.data = undefined
			}

			$.ajax = function (options) {
				var settings = $.extend({}, options || {}),
					deferred = $.Deferred && $.Deferred(),
					urlAnchor
				for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

				ajaxStart(settings)

				if (!settings.crossDomain) {
					urlAnchor = document.createElement('a')
					urlAnchor.href = settings.url
					urlAnchor.href = urlAnchor.href
					settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
				}

				if (!settings.url) settings.url = window.location.toString()
				serializeData(settings)

				var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
				if (hasPlaceholder) dataType = 'jsonp'

				if (settings.cache === false || (
						(!options || options.cache !== true) &&
						('script' == dataType || 'jsonp' == dataType)
					))
					settings.url = appendQuery(settings.url, '_=' + Date.now())

				if ('jsonp' == dataType) {
					if (!hasPlaceholder)
						settings.url = appendQuery(settings.url,
							settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
					return $.ajaxJSONP(settings, deferred)
				}

				var mime = settings.accepts[dataType],
					headers = {},
					setHeader = function (name, value) {
						headers[name.toLowerCase()] = [name, value]
					},
					protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
					xhr = settings.xhr(),
					nativeSetHeader = xhr.setRequestHeader,
					abortTimeout

				if (deferred) deferred.promise(xhr)

				if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
				setHeader('Accept', mime || '*/*')
				if (mime = settings.mimeType || mime) {
					if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
					xhr.overrideMimeType && xhr.overrideMimeType(mime)
				}
				if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
					setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

				if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
				xhr.setRequestHeader = setHeader

				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {
						xhr.onreadystatechange = empty
						clearTimeout(abortTimeout)
						var result, error = false
						if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
							dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
							result = xhr.responseText

							try {
								// http://perfectionkills.com/global-eval-what-are-the-options/
								if (dataType == 'script')    (1, eval)(result)
								else if (dataType == 'xml')  result = xhr.responseXML
								else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
							} catch (e) {
								error = e
							}

							if (error) ajaxError(error, 'parsererror', xhr, settings, deferred)
							else ajaxSuccess(result, xhr, settings, deferred)
						} else {
							ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
						}
					}
				}

				if (ajaxBeforeSend(xhr, settings) === false) {
					xhr.abort()
					ajaxError(null, 'abort', xhr, settings, deferred)
					return xhr
				}

				if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

				var async = 'async' in settings ? settings.async : true
				xhr.open(settings.type, settings.url, async, settings.username, settings.password)

				for (name in headers) nativeSetHeader.apply(xhr, headers[name])

				if (settings.timeout > 0) abortTimeout = setTimeout(function () {
					xhr.onreadystatechange = empty
					xhr.abort()
					ajaxError(null, 'timeout', xhr, settings, deferred)
				}, settings.timeout)

				// avoid sending empty string (#319)
				xhr.send(settings.data ? settings.data : null)
				return xhr
			}

			// handle optional data/success arguments
			function parseArguments(url, data, success, dataType) {
				if ($.isFunction(data)) dataType = success, success = data, data = undefined
				if (!$.isFunction(success)) dataType = success, success = undefined
				return {
					url: url
					, data: data
					, success: success
					, dataType: dataType
				}
			}

			$.get = function (/* url, data, success, dataType */) {
				return $.ajax(parseArguments.apply(null, arguments))
			}

			$.post = function (/* url, data, success, dataType */) {
				var options = parseArguments.apply(null, arguments)
				options.type = 'POST'
				return $.ajax(options)
			}

			$.getJSON = function (/* url, data, success */) {
				var options = parseArguments.apply(null, arguments)
				options.dataType = 'json'
				return $.ajax(options)
			}

			$.fn.load = function (url, data, success) {
				if (!this.length) return this
				var self = this, parts = url.split(/\s/), selector,
					options = parseArguments(url, data, success),
					callback = options.success
				if (parts.length > 1) options.url = parts[0], selector = parts[1]
				options.success = function (response) {
					self.html(selector ?
						$('<div>').html(response.replace(rscript, "")).find(selector)
						: response)
					callback && callback.apply(self, arguments)
				}
				$.ajax(options)
				return this
			}

			var escape = encodeURIComponent

			function serialize(params, obj, traditional, scope) {
				var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
				$.each(obj, function (key, value) {
					type = $.type(value)
					if (scope) key = traditional ? scope :
					scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
					// handle data in serializeArray() format
					if (!scope && array) params.add(value.name, value.value)
					// recurse into nested objects
					else if (type == "array" || (!traditional && type == "object"))
						serialize(params, value, traditional, key)
					else params.add(key, value)
				})
			}

			$.param = function (obj, traditional) {
				var params = []
				params.add = function (key, value) {
					if ($.isFunction(value)) value = value()
					if (value == null) value = ""
					this.push(escape(key) + '=' + escape(value))
				}
				serialize(params, obj, traditional)
				return params.join('&').replace(/%20/g, '+')
			}
		})(Zepto)

		;
		(function ($) {
			$.fn.serializeArray = function () {
				var name, type, result = [],
					add = function (value) {
						if (value.forEach) return value.forEach(add)
						result.push({name: name, value: value})
					}
				if (this[0]) $.each(this[0].elements, function (_, field) {
					type = field.type, name = field.name
					if (name && field.nodeName.toLowerCase() != 'fieldset' && !field.disabled && type != 'submit' && type != 'reset' && type != 'button' && type != 'file' &&
						((type != 'radio' && type != 'checkbox') || field.checked))
						add($(field).val())
				})
				return result
			}

			$.fn.serialize = function () {
				var result = []
				this.serializeArray().forEach(function (elm) {
					result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
				})
				return result.join('&')
			}

			$.fn.submit = function (callback) {
				if (0 in arguments) this.bind('submit', callback)
				else if (this.length) {
					var event = $.Event('submit')
					this.eq(0).trigger(event)
					if (!event.isDefaultPrevented()) this.get(0).submit()
				}
				return this
			}

		})(Zepto)

		;
		(function ($) {
			// __proto__ doesn't exist on IE<11, so redefine
			// the Z function to use object extension instead
			if (!('__proto__' in {})) {
				$.extend($.zepto, {
					Z: function (dom, selector) {
						dom = dom || []
						$.extend(dom, $.fn)
						dom.selector = selector || ''
						dom.__Z = true
						return dom
					},
					// this is a kludge but works
					isZ: function (object) {
						return $.type(object) === 'array' && '__Z' in object
					}
				})
			}

			// getComputedStyle shouldn't freak out when called
			// without a valid element as argument
			try {
				getComputedStyle(undefined)
			} catch (e) {
				var nativeGetComputedStyle = getComputedStyle;
				window.getComputedStyle = function (element) {
					try {
						return nativeGetComputedStyle(element)
					} catch (e) {
						return null
					}
				}
			}
		})(Zepto);

		return window.Zepto = Zepto;

	});




/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * DOM相关操作
	 */
	var is = __webpack_require__(3);
	;(function (global, factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        module.exports = factory(global);
	    } else {
	        factory(global);
	    }
	})(typeof window !== "undefined" ? window : this, function (global) {
	    var dom = {}, pres=[];

	    /**
	     * 预加载私有函数
	     */
	    function _loadImage() {
	        var img = new Image(), callback = arguments[1];
	        img.src = arguments[0];
	        if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
	            callback && callback.call(img);
	            return img; // 直接返回，不用再处理onload事件
	        }
	        img.onload = function () { //图片下载完毕时异步调用callback函数。
	            callback && callback.call(img);//将回调函数的this替换为Image对象
	        };
	        return img;
	    }
	    /**
	     * 预加载图片
	     * @param {Array|String} urls 图片地址
	     * @param {Function} callback 回调函数
	     * @returns {Array} 图片对象数组
	     */
	    dom.preImage = function(urls, callback) {
	        if(is.isArray(urls)) {
	            urls.forEach(function(url) {
	                pres.push(_loadImage(url, callback));
	            });
	        }else {
	            pres.push(_loadImage(urls, callback));
	        }
	        return pres;
	    };

	    /**
	     * 元素偏移尺寸对象
	     * 左、右、宽、高
	     * @param {Element} el 单个元素 通过document.getElementById等方式获取
	     * @returns {Object} {left,top,width,height}
	     */
	    dom.offset = function(el) {
	        var obj = el.getBoundingClientRect();
	        return {
	            left: obj.left + window.pageXOffset,
	            top: obj.top + window.pageYOffset,
	            width: Math.round(obj.width),//整数位 四舍五入
	            height: Math.round(obj.height)
	        };
	    };

	    /**
	     * 获取对象的高度或宽度
	     * 例如屏幕的高度
	     * @param {Element} el 单个元素 通过document.getElementById等方式获取
	     * @returns {Number} 数值
	     */
	    ['width', 'height'].forEach(function(property) {
	        var dimension = property.replace(/./, function(m){ return m[0].toUpperCase()});
	        dom[property] = function(el) {
	            var offset;
	            if(is.isWindow(el)) return el['inner' + dimension];
	            if(is.isDocument(el)) return el.documentElement['scroll' + dimension];
	            return (offset = this.offset(el)) && offset[property];
	        };
	    });

	    /**
	     * 节流
	     * 函数调用的频度控制器，到了时间就执行
	     * 例如mousemove 事件、window对象的resize和scroll事件
	     * 预先设定一个执行周期，当调用动作的时刻大于等于执行周期则执行该动作，然后进入下一个新周期
	     *
	     * @param fn {Function} 要调用的函数
	     * @param delay {Number} 空闲时间
	     * @param immediate {Boolean} 给immediate参数传递false，绑定的函数先执行，而不是delay后执行
	     * @param debounce {Boolean} 是否执行debounce方式
	     * @returns {Function}
	     */
	    dom.throttle = function(fn, delay, immediate, debounce) {
	        var curr = +new Date(),//当前时间
	            last_call = 0,//最后一次回调的时间，用于debounce的重新计算时间
	            last_exec = 0,//最后一次执行传入函数的时间
	            timer = null,//定时器
	            diff, //时间差
	            context,//上下文
	            args,//回调函数的参数
	            exec = function () {
	                last_exec = curr;
	                fn.apply(context, args);
	            };
	        return function () {
	            curr = +new Date();
	            context = this;
	            args = arguments;
	            diff = curr - (debounce ? last_call : last_exec);
	            clearTimeout(timer);
	            if (debounce) {
	                if(immediate) {
	                    timer = setTimeout(exec, delay);
	                }else if(diff >= delay) {
	                    exec();
	                }
	            } else {
	                if(diff >= delay) {
	                    exec();
	                }else if(immediate) {
	                    timer = setTimeout(exec, -diff);
	                }
	            }
	            last_call = curr;
	        }
	    };

	    /**
	     * 去抖动
	     * 空闲时间的间隔控制
	     * 例如文本输入keydown 事件，keyup 事件，做autocomplete等
	     * 当调用动作n毫秒后，才会执行该动作，若在这n毫秒内又调用此动作则将重新计算执行时间
	     */
	    dom.debounce = function(fn, delay, immediate) {
	        return this.throttle(fn, delay, immediate, true);
	    };

	    /**
	     * 判断当前浏览器支持哪种TransitionEnd事件
	     */
	    dom.transitionEnd = function(el){
	        var transitions = {
	            'WebkitTransition' : 'webkitTransitionEnd',
	            'MozTransition'    : 'transitionend',
	            'OTransition'      : 'oTransitionEnd otransitionend',
	            'transition'       : 'transitionend'
	        };
	        for(var t in transitions){
	            if(el.style[t] !== undefined){
	                return transitions[t];
	            }
	        }
	        return null;
	    };

	    return global.dom = dom;
	});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 判断函数
	 */
	var util = __webpack_require__(4);
	var cookie = __webpack_require__(6);
	;(function (global, factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        module.exports = factory(global);
	    } else {
	        factory(global);
	    }
	})(typeof window !== "undefined" ? window : this, function (global) {
	    var is = {}, toString = Object.prototype.toString;
	    /**
	     * 判断是否是数组
	     */
	    is.isArray = Array.isArray || function(obj) {
	            return toString.call(obj) === '[object Array]';
	    };

	    /**
	     * 判断是否是HTML标签
	     */
	    is.isElement = function(obj) {
	        return !!(obj && obj.nodeType === 1);
	    };

	    /**
	     * 判断是函数、日期、字符串、数字、日期、正则、错误
	     */
	    ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'].forEach(function(key) {
	        is['is'+key] = function(obj) {
	            return toString.call(obj) === '[object '+key+']';
	        }
	    });

	    /**
	     * 判断是NaN
	     * 原生的isNaN 函数不一样，如果变量是undefined，原生的isNaN 函数也会返回 true
	     */
	    is.isNaN = function(obj) {
	        return is.isNumber(obj) && obj !== +obj;
	    };

	    /**
	     * 判断是否是车轮App
	     */
	    is.isCheLunApp = function(){
	        return [2,3,4,5].indexOf(util.app()) > -1;
	    };

	    /**
	     * 判断APP中的登录
	     */
	    is.isCheLunLogin = function(){
	        return cookie.get('chelun_isLogin') == 'true' || cookie.get('chelun_isLogin') == '1';
	    };

	    /**
	     * 判断是否是微信
	     */
	    is.isWeiXin = function(){
	        return util.app() == 1;
	    };

	    /**
	     * 判断是window对象
	     */
	    is.isWindow = function(obj) {
	        return obj != null && obj == obj.window;
	    };

	    /**
	     * 判断是document对象
	     */
	    is.isDocument = function(obj) {
	        return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
	    };

	    return global.is = is;
	});

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 工具函数
	 */
	var common = __webpack_require__(5);
	var cookie = __webpack_require__(6);
	;(function (global, factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        module.exports = factory(global);
	    } else {
	        factory(global);
	    }
	})(typeof window !== "undefined" ? window : this, function (global) {
	    var util = {};

	    /**
	     * 获取代理信息
	     */
	    util.getua = function() {
	        var ua = navigator.userAgent;
	        if (ua.indexOf('ChelunWelfare') > -1) return 'ChelunWelfare';
	        if (ua.indexOf('Chelun') > -1) return 'Chelun';
	        if (ua.match(/MicroMessenger/i) == 'micromessenger') return 'weixin';
	        return 'others : ' + ua;
	    };

	    /**
	     * 当前属于哪个环境中
	     */
	    util.app = function() {
	        if (navigator.userAgent.indexOf('MicroMessenger') > -1) return 1;
	        //获取到APP中cookie名
	        var app = cookie.get(common.const.COOKIE_APP_NAME);
	        app =  app && app.toLowerCase();
	        if(app === 'chelun') return 2;
	        if(app == 'queryviolations') return 3;
	        if(app == 'chelunwelfare') return 4;
	        if(app == 'drivingtest') return 5;
	        return 6;
	    };

	    /**
	     * 百度统计按钮追踪
	     */
	    util.baiduTrack = function() {
	        document.documentElement.addEventListener('click', function(e) {
	            var track = e.target.dataset['track'];
	            if(track) {
	                global._hmt && global._hmt.push(['_trackEvent', track, 'click']);
	            }
	            //alert(e.target.dataset['track'])
	        }, false);
	        //[].forEach.call(document.querySelectorAll('[data-track]'), function(el) {
	        //    el.addEventListener('click', function() {
	        //        var label = this.dataset['track'];
	        //        global._hmt && global._hmt.push(['_trackEvent', label, 'click']);
	        //    }, false);
	        //});
	    };

	    /**
	     * 百度统计手动跟踪
	     */
	    util.track = function(label, trackType){
	        if(!trackType || typeof trackType != 'string'){
	            trackType = 'click'
	        }
	        global._hmt && global._hmt.push(['_trackEvent', label, trackType]);
	    };

	    /**
	     * 百度统计设置
	     */
	    util.baidu = function(key) {
	        global._hmt = global._hmt || [];
	        (function() {
	            var hm = document.createElement("script");
	            hm.src = "//hm.baidu.com/hm.js?"+key;
	            var s = document.getElementsByTagName("script")[0];
	            s.parentNode.insertBefore(hm, s);
	        })();
	    };

	    var escapeMap = {
	        '&': '&amp;',
	        '<': '&lt;',
	        '>': '&gt;',
	        '"': '&quot;',
	        "'": '&#x27;',
	        '`': '&#x60;'
	    };
	    var createEscaper = function(map) {
	        var escaper = function(match) {
	            return map[match];
	        };
	        var keys = [];
	        for(var key in map)
	            keys.push(key);
	        var source = '(?:' + keys.join('|') + ')';
	        var testRegexp = RegExp(source);
	        var replaceRegexp = RegExp(source, 'g');
	        return function(string) {
	            string = string == null ? '' : '' + string;
	            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	        };
	    };
	    /**
	     * 转义HTML字符串，替换&, &lt;, &gt;, &quot;, &#96;, 和 &#x2F;字符
	     */
	    util.escape = createEscaper(escapeMap);

	    /**
	     * 倒计时
	     * @param seconds 倒计时秒数
	     * @param endFn 结束事件
	     * @param intervalFn 循环事件
	     * @param interval 倒计时间隔
	     */
	    util.countDown = function(seconds, endFn, intervalFn, interval) {
	        var wait = seconds;
	        interval = interval || 1000;
	        return function(btn) {
	            var _this = this;
	            if (wait == 0) {
	                btn && btn.removeAttribute("disabled");
	                endFn && endFn.call(_this, btn);
	                wait = seconds;
	            }else {
	                btn && btn.setAttribute("disabled", true);
	                intervalFn && intervalFn.call(_this, btn, wait);
	                wait--;
	                var fn = arguments.callee;
	                setTimeout(function() {
	                    fn.call(_this, btn);
	                }, interval);
	            }
	        };
	    };

	    /**
	     * 随机整数
	     * @param max 最大值
	     * @returns {number}
	     */
	    util.random = function(max) {
	        return Math.floor(Math.random() * max);
	    };

	    /**
	     * 打印对象到页面中
	     */
	    util.print = function(obj, space) {
	        space = space || 4;
	        var html = JSON.stringify(obj, null, space);
	        html = html.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp');
	        var pre = document.createElement('pre');
	        var div = document.createElement('code');
	        pre.style.cssText = 'border:1px solid #000;padding:10px;background:#FFF;margin-bottom:20px;';
	        div.innerHTML = html;
	        pre.appendChild(div);
	        var body = document.querySelector('body');
	        body.insertBefore(pre, body.children[0]);
	    };
	    return global.util = util;
	});


/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * 常量与正则
	 */
	;(function (global, factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        module.exports = factory(global);
	    } else {
	        factory(global);
	    }
	})(typeof window !== "undefined" ? window : this, function (global) {
	    var common = {};

	    /**
	     * 常量
	     */
	    common.const = {
	        //cookie常量
	        COOKIE_APP_NAME: 'chelun_appName',//车轮APP名称，比如 查违章，车轮社区
	        COOKIE_APP_VERSION: 'chelun_appVersion',//APP版本号
	        COOKIE_APP_TOKEN: 'chelun_acToken',//车轮统一登录态，去服务端校验
	        COOKIE_DEVICE: 'chelun_device',//机型，主要针对安卓，读取系统设备信息来做兼容性判断和数据统计
	        COOKIE_OS_TYPE: 'chelun_osType',//操作系统 ios android
	        COOKIE_OS_VERSION: 'chelun_osVersion',//IOS版本号   安卓版本号
	        COOKIE_IS_LOGIN: 'chelun_isLogin',//是否登录
	        //菜单
	        MENU_WX_F: 'menu:share:wxMessage', //分享微信好友按钮
	        MENU_WX_T: 'menu:share:wxTimeline', //分享朋友圈按钮
	        MENU_REFRESH: 'menu:refresh', //刷新按钮
	        MENU_CL_F: 'menu:share:clMessage', //分享车轮车友按钮
	        MENU_QQ: 'menu:share:qq', //分享QQ按钮
	        MENU_SINA: 'menu:share:sina', //分享新浪微博按钮
	        MENU_SMS: 'menu:share:sms', //分享短信按钮
	        MENU_COPY: 'menu:share:copyUrl', //复制链接
	        MENU_OPEN: 'menu:share:openWithBrowser', //打开第三方浏览器
	        //分享回调中设置的TO
	        TO_WX_F: 'wxMessage',
	        TO_WX_T: 'wxTimeline',
	        TO_CL_F: 'clMessage',
	        TO_QQ: 'qq',
	        TO_SINA: 'sina',
	        TO_SMS: 'sms',
	        //JSBridge
	        BRIDGE_SHOW_MENU : 'CHELUN_SHOW_OPTION_MENU',//是否显示右上角菜单按钮
	        BRIDGE_MENU_ITEMS: 'CHELUN_SHOW_MENU_ITEMS',//显示的功能按钮列表
	        BRIDGE_SHARE_CLMESSAGE : 'CHELUN_SHARE_DATA_CLMESSAGE',//车轮车友分享内容
	        BRIDGE_SHARE_WXTIMELIN : 'CHELUN_SHARE_DATA_WXTIMELINE',//微信朋友圈分享内容
	        BRIDGE_SHARE_WXMESSAGE : 'CHELUN_SHARE_DATA_WXMESSAGE',//微信朋友分享内容
	        BRIDGE_SHARE_QQ : 'CHELUN_SHARE_DATA_QQ',//QQ好友分享内容
	        BRIDGE_SHARE_SINA : 'CHELUN_SHARE_DATA_SINA',//新浪微博分享内容
	        BRIDGE_SHARE_SMS : 'CHELUN_SHARE_DATA_SMS',//发短信内容
	        BRIDGE_CUSTOM_CONFIG : 'CHELUN_CUSTOM_CONFIG',//自定义配置
	        BRIDGE_DISSYS_URLLIST : 'CHELUN_DISSYS_URLLIST' //禁止拼系统参数的url配置列表
	    };
	    /**
	     * 正则
	     */
	    common.regex = {
	        mobile: /^1[0-9]{10}$/,//手机号码
	        chinese: /^[\u4E00-\u9FA5]+$/, //全部是中文
	        card: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/, //简单的身份证
	        email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, //邮箱
	        digits: /^\d+$/ //整数
	    };
	    return global.common = common;
	});

/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * cookie
	 * JavaScript Cookie v2.1.1
	 * https://github.com/js-cookie/js-cookie
	 */
	;(function (global, factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        module.exports = factory(global);
	    } else {
	        factory(global);
	    }
	})(typeof window !== "undefined" ? window : this, function (global) {
	    function extend () {
	        var i = 0;
	        var result = {};
	        for (; i < arguments.length; i++) {
	            var attributes = arguments[ i ];
	            for (var key in attributes) {
	                result[key] = attributes[key];
	            }
	        }
	        return result;
	    }

	    function init (converter) {
	        function api (key, value, attributes) {
	            var result;
	            if (typeof document === 'undefined') {
	                return;
	            }

	            // Write

	            if (arguments.length > 1) {
	                attributes = extend({
	                    path: '/'
	                }, api.defaults, attributes);

	                if (typeof attributes.expires === 'number') {
	                    var expires = new Date();
	                    expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
	                    attributes.expires = expires;
	                }

	                try {
	                    result = JSON.stringify(value);
	                    if (/^[\{\[]/.test(result)) {
	                        value = result;
	                    }
	                } catch (e) {}

	                if (!converter.write) {
	                    value = encodeURIComponent(String(value))
	                        .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
	                } else {
	                    value = converter.write(value, key);
	                }

	                key = encodeURIComponent(String(key));
	                key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
	                key = key.replace(/[\(\)]/g, escape);

	                return (document.cookie = [
	                    key, '=', value,
	                    attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE
	                    attributes.path    && '; path=' + attributes.path,
	                    attributes.domain  && '; domain=' + attributes.domain,
	                    attributes.secure ? '; secure' : ''
	                ].join(''));
	            }

	            // Read

	            if (!key) {
	                result = {};
	            }

	            // To prevent the for loop in the first place assign an empty array
	            // in case there are no cookies at all. Also prevents odd result when
	            // calling "get()"
	            var cookies = document.cookie ? document.cookie.split('; ') : [];
	            var rdecode = /(%[0-9A-Z]{2})+/g;
	            var i = 0;

	            for (; i < cookies.length; i++) {
	                var parts = cookies[i].split('=');
	                var name = parts[0].replace(rdecode, decodeURIComponent);
	                var cookie = parts.slice(1).join('=');

	                if (cookie.charAt(0) === '"') {
	                    cookie = cookie.slice(1, -1);
	                }

	                try {
	                    cookie = converter.read ?
	                        converter.read(cookie, name) : converter(cookie, name) ||
	                    cookie.replace(rdecode, decodeURIComponent);

	                    if (this.json) {
	                        try {
	                            cookie = JSON.parse(cookie);
	                        } catch (e) {}
	                    }

	                    if (key === name) {
	                        result = cookie;
	                        break;
	                    }

	                    if (!key) {
	                        result[name] = cookie;
	                    }
	                } catch (e) {}
	            }

	            return result;
	        }

	        api.set = api;
	        api.get = function (key) {
	            return api(key);
	        };
	        api.getJSON = function () {
	            return api.apply({
	                json: true
	            }, [].slice.call(arguments));
	        };
	        api.defaults = {};

	        api.remove = function (key, attributes) {
	            api(key, '', extend(attributes, {
	                expires: -1
	            }));
	        };
	        api.withConverter = init;
	        return api;
	    }

	    return global.cookie = init(function () {});
	});

/***/ },
/* 7 */
/***/ function(module, exports) {

	/**
	 * localStorage
	 * https://github.com/marcuswestin/store.js
	 */
	;(function (global, factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        module.exports = factory(global);
	    } else {
	        factory(global);
	    }
	})(typeof window !== "undefined" ? window : this, function (global) {
	    var store = {},
	        win = global,
	        doc = win.document,
	        localStorageName = 'localStorage',
	        scriptTag = 'script',
	        storage;

	    store.disabled = false
	    store.version = '1.3.20'
	    store.set = function(key, value) {}
	    store.get = function(key, defaultVal) {}
	    store.has = function(key) { return store.get(key) !== undefined }
	    store.remove = function(key) {}
	    store.clear = function() {}
	    store.transact = function(key, defaultVal, transactionFn) {
	        if (transactionFn == null) {
	            transactionFn = defaultVal
	            defaultVal = null
	        }
	        if (defaultVal == null) {
	            defaultVal = {}
	        }
	        var val = store.get(key, defaultVal)
	        transactionFn(val)
	        store.set(key, val)
	    }
	    store.getAll = function() {
	        var ret = {}
	        store.forEach(function(key, val) {
	            ret[key] = val
	        })
	        return ret
	    }
	    store.forEach = function() {}
	    store.serialize = function(value) {
	        return JSON.stringify(value)
	    }
	    store.deserialize = function(value) {
	        if (typeof value != 'string') { return undefined }
	        try { return JSON.parse(value) }
	        catch(e) { return value || undefined }
	    }

	    // Functions to encapsulate questionable FireFox 3.6.13 behavior
	    // when about.config::dom.storage.enabled === false
	    // See https://github.com/marcuswestin/store.js/issues#issue/13
	    function isLocalStorageNameSupported() {
	        try { return (localStorageName in win && win[localStorageName]) }
	        catch(err) { return false }
	    }

	    if (isLocalStorageNameSupported()) {
	        storage = win[localStorageName]
	        store.set = function(key, val) {
	            if (val === undefined) { return store.remove(key) }
	            storage.setItem(key, store.serialize(val))
	            return val
	        }
	        store.get = function(key, defaultVal) {
	            var val = store.deserialize(storage.getItem(key))
	            return (val === undefined ? defaultVal : val)
	        }
	        store.remove = function(key) { storage.removeItem(key) }
	        store.clear = function() { storage.clear() }
	        store.forEach = function(callback) {
	            for (var i=0; i<storage.length; i++) {
	                var key = storage.key(i)
	                callback(key, store.get(key))
	            }
	        }
	    } else if (doc && doc.documentElement.addBehavior) {
	        var storageOwner,
	            storageContainer
	        // Since #userData storage applies only to specific paths, we need to
	        // somehow link our data to a specific path.  We choose /favicon.ico
	        // as a pretty safe option, since all browsers already make a request to
	        // this URL anyway and being a 404 will not hurt us here.  We wrap an
	        // iframe pointing to the favicon in an ActiveXObject(htmlfile) object
	        // (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
	        // since the iframe access rules appear to allow direct access and
	        // manipulation of the document element, even for a 404 page.  This
	        // document can be used instead of the current document (which would
	        // have been limited to the current path) to perform #userData storage.
	        try {
	            storageContainer = new ActiveXObject('htmlfile')
	            storageContainer.open()
	            storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
	            storageContainer.close()
	            storageOwner = storageContainer.w.frames[0].document
	            storage = storageOwner.createElement('div')
	        } catch(e) {
	            // somehow ActiveXObject instantiation failed (perhaps some special
	            // security settings or otherwse), fall back to per-path storage
	            storage = doc.createElement('div')
	            storageOwner = doc.body
	        }
	        var withIEStorage = function(storeFunction) {
	            return function() {
	                var args = Array.prototype.slice.call(arguments, 0)
	                args.unshift(storage)
	                // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
	                // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
	                storageOwner.appendChild(storage)
	                storage.addBehavior('#default#userData')
	                storage.load(localStorageName)
	                var result = storeFunction.apply(store, args)
	                storageOwner.removeChild(storage)
	                return result
	            }
	        }

	        // In IE7, keys cannot start with a digit or contain certain chars.
	        // See https://github.com/marcuswestin/store.js/issues/40
	        // See https://github.com/marcuswestin/store.js/issues/83
	        var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
	        var ieKeyFix = function(key) {
	            return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
	        }
	        store.set = withIEStorage(function(storage, key, val) {
	            key = ieKeyFix(key)
	            if (val === undefined) { return store.remove(key) }
	            storage.setAttribute(key, store.serialize(val))
	            storage.save(localStorageName)
	            return val
	        })
	        store.get = withIEStorage(function(storage, key, defaultVal) {
	            key = ieKeyFix(key)
	            var val = store.deserialize(storage.getAttribute(key))
	            return (val === undefined ? defaultVal : val)
	        })
	        store.remove = withIEStorage(function(storage, key) {
	            key = ieKeyFix(key)
	            storage.removeAttribute(key)
	            storage.save(localStorageName)
	        })
	        store.clear = withIEStorage(function(storage) {
	            var attributes = storage.XMLDocument.documentElement.attributes
	            storage.load(localStorageName)
	            for (var i=attributes.length-1; i>=0; i--) {
	                storage.removeAttribute(attributes[i].name)
	            }
	            storage.save(localStorageName)
	        })
	        store.forEach = withIEStorage(function(storage, callback) {
	            var attributes = storage.XMLDocument.documentElement.attributes
	            for (var i=0, attr; attr=attributes[i]; ++i) {
	                callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
	            }
	        })
	    }

	    try {
	        var testKey = '__storejs__';
	        store.set(testKey, testKey)
	        if (store.get(testKey) != testKey) { store.disabled = true }
	        store.remove(testKey);
	    } catch(e) {
	        store.disabled = true;
	    }
	    store.enabled = !store.disabled;

	    return global.storage = store;
	});

/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * URL地址
	 */
	;(function (global, factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        module.exports = factory(global);
	    } else {
	        factory(global);
	    }
	})(typeof window !== "undefined" ? window : this, function (global) {
	    var jurl = {};

	    /**
	     * 创建地址
	     */
	    jurl.buildUrl = function (url, params) {
	        if(!url) return '';
	        var last = url[url.length - 1];
	        var args = [], params = params || {}, has=false;
	        for (var key in params) {
	            if(params.hasOwnProperty(key)) {
	                args.push(key + '=' + encodeURIComponent(params[key]));
	                has = true;//判断是否传参进来
	            }
	        }
	        //有参数就加符号 排除params是{}情况
	        if(!has) return url;
	        if (url.indexOf('?') == -1) {
	            url += '?';
	        } else if (last != '&' && last != '?') {
	            url += '&';
	        }
	        return url + args.join('&');
	    };

	    /**
	     * 格式化地址参数
	     */
	    jurl.parseUrl = function(url) {
	        var parsed = {};
	        url = url || global.location.search;
	        if (typeof url !== "string" || url.length < 0) return parsed;
	        var urls = url.split('?');
	        if(urls.length == 1 || !urls[1]) return parsed;
	        var params = urls[1].split('&');
	        //参数赋值
	        for(var i= 0, length=params.length; i<length; i++) {
	            var element = params[i],
	                eqPos = element.indexOf('='),
	                keyValue, elValue;
	            if (eqPos >= 0) {
	                keyValue = element.substr(0, eqPos);//参数名
	                elValue = element.substr(eqPos + 1);//参数值
	            } else {
	                keyValue = element;
	                elValue = '';
	            }
	            parsed[keyValue] = decodeURIComponent(elValue); //简单点操作，将后面的值覆盖前面赋的值
	        }
	        return parsed;
	    };

	    /**
	     * 测试环境返回测试地址
	     * 正式环境返回正式地址
	     */
	    jurl.current = function(h5, dev, signs) {
	        signs = signs || ['dev.','10.10.'];//辨别测试环境的条件
	        var length = signs.length;
	        var url = global.location.href;
	        for(var i=0; i<length; i++) {
	            if(url.indexOf(signs[i]) > 0)
	                return dev;
	        }
	        //if(url.indexOf('dev.') > 0 || url.indexOf('10.10.') > 0)
	        //    return dev;
	        return h5;
	    };

	    return global.jurl = jurl;
	});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * mustache.js - Logic-less {{mustache}} templates with JavaScript
	 * http://github.com/janl/mustache.js
	 */

	/*global define: false Mustache: true*/

	(function defineMustache (global, factory) {
	  if (typeof module === "object" && typeof module.exports === "object") {
	    module.exports = factory({});// UMD
	  }else if (typeof exports === 'object' && exports && typeof exports.nodeName !== 'string') {
	    factory(exports); // CommonJS
	  } else if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	  } else {
	    global.Mustache = {};
	    factory(global.Mustache); // script, wsh, asp
	  }
	}(this, function mustacheFactory (mustache) {

	  var objectToString = Object.prototype.toString;
	  var isArray = Array.isArray || function isArrayPolyfill (object) {
	    return objectToString.call(object) === '[object Array]';
	  };

	  function isFunction (object) {
	    return typeof object === 'function';
	  }

	  /**
	   * More correct typeof string handling array
	   * which normally returns typeof 'object'
	   */
	  function typeStr (obj) {
	    return isArray(obj) ? 'array' : typeof obj;
	  }

	  function escapeRegExp (string) {
	    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
	  }

	  /**
	   * Null safe way of checking whether or not an object,
	   * including its prototype, has a given property
	   */
	  function hasProperty (obj, propName) {
	    return obj != null && typeof obj === 'object' && (propName in obj);
	  }

	  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
	  // See https://github.com/janl/mustache.js/issues/189
	  var regExpTest = RegExp.prototype.test;
	  function testRegExp (re, string) {
	    return regExpTest.call(re, string);
	  }

	  var nonSpaceRe = /\S/;
	  function isWhitespace (string) {
	    return !testRegExp(nonSpaceRe, string);
	  }

	  var entityMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#39;',
	    '/': '&#x2F;',
	    '`': '&#x60;',
	    '=': '&#x3D;'
	  };

	  function escapeHtml (string) {
	    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
	      return entityMap[s];
	    });
	  }

	  var whiteRe = /\s*/;
	  var spaceRe = /\s+/;
	  var equalsRe = /\s*=/;
	  var curlyRe = /\s*\}/;
	  var tagRe = /#|\^|\/|>|\{|&|=|!/;

	  /**
	   * Breaks up the given `template` string into a tree of tokens. If the `tags`
	   * argument is given here it must be an array with two string values: the
	   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
	   * course, the default is to use mustaches (i.e. mustache.tags).
	   *
	   * A token is an array with at least 4 elements. The first element is the
	   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
	   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
	   * all text that appears outside a symbol this element is "text".
	   *
	   * The second element of a token is its "value". For mustache tags this is
	   * whatever else was inside the tag besides the opening symbol. For text tokens
	   * this is the text itself.
	   *
	   * The third and fourth elements of the token are the start and end indices,
	   * respectively, of the token in the original template.
	   *
	   * Tokens that are the root node of a subtree contain two more elements: 1) an
	   * array of tokens in the subtree and 2) the index in the original template at
	   * which the closing tag for that section begins.
	   */
	  function parseTemplate (template, tags) {
	    if (!template)
	      return [];

	    var sections = [];     // Stack to hold section tokens
	    var tokens = [];       // Buffer to hold the tokens
	    var spaces = [];       // Indices of whitespace tokens on the current line
	    var hasTag = false;    // Is there a {{tag}} on the current line?
	    var nonSpace = false;  // Is there a non-space char on the current line?

	    // Strips all whitespace tokens array for the current line
	    // if there was a {{#tag}} on it and otherwise only space.
	    function stripSpace () {
	      if (hasTag && !nonSpace) {
	        while (spaces.length)
	          delete tokens[spaces.pop()];
	      } else {
	        spaces = [];
	      }

	      hasTag = false;
	      nonSpace = false;
	    }

	    var openingTagRe, closingTagRe, closingCurlyRe;
	    function compileTags (tagsToCompile) {
	      if (typeof tagsToCompile === 'string')
	        tagsToCompile = tagsToCompile.split(spaceRe, 2);

	      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
	        throw new Error('Invalid tags: ' + tagsToCompile);

	      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
	      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
	      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
	    }

	    compileTags(tags || mustache.tags);

	    var scanner = new Scanner(template);

	    var start, type, value, chr, token, openSection;
	    while (!scanner.eos()) {
	      start = scanner.pos;

	      // Match any text between tags.
	      value = scanner.scanUntil(openingTagRe);

	      if (value) {
	        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
	          chr = value.charAt(i);

	          if (isWhitespace(chr)) {
	            spaces.push(tokens.length);
	          } else {
	            nonSpace = true;
	          }

	          tokens.push([ 'text', chr, start, start + 1 ]);
	          start += 1;

	          // Check for whitespace on the current line.
	          if (chr === '\n')
	            stripSpace();
	        }
	      }

	      // Match the opening tag.
	      if (!scanner.scan(openingTagRe))
	        break;

	      hasTag = true;

	      // Get the tag type.
	      type = scanner.scan(tagRe) || 'name';
	      scanner.scan(whiteRe);

	      // Get the tag value.
	      if (type === '=') {
	        value = scanner.scanUntil(equalsRe);
	        scanner.scan(equalsRe);
	        scanner.scanUntil(closingTagRe);
	      } else if (type === '{') {
	        value = scanner.scanUntil(closingCurlyRe);
	        scanner.scan(curlyRe);
	        scanner.scanUntil(closingTagRe);
	        type = '&';
	      } else {
	        value = scanner.scanUntil(closingTagRe);
	      }

	      // Match the closing tag.
	      if (!scanner.scan(closingTagRe))
	        throw new Error('Unclosed tag at ' + scanner.pos);

	      token = [ type, value, start, scanner.pos ];
	      tokens.push(token);

	      if (type === '#' || type === '^') {
	        sections.push(token);
	      } else if (type === '/') {
	        // Check section nesting.
	        openSection = sections.pop();

	        if (!openSection)
	          throw new Error('Unopened section "' + value + '" at ' + start);

	        if (openSection[1] !== value)
	          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
	      } else if (type === 'name' || type === '{' || type === '&') {
	        nonSpace = true;
	      } else if (type === '=') {
	        // Set the tags for the next time around.
	        compileTags(value);
	      }
	    }

	    // Make sure there are no open sections when we're done.
	    openSection = sections.pop();

	    if (openSection)
	      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

	    return nestTokens(squashTokens(tokens));
	  }

	  /**
	   * Combines the values of consecutive text tokens in the given `tokens` array
	   * to a single token.
	   */
	  function squashTokens (tokens) {
	    var squashedTokens = [];

	    var token, lastToken;
	    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
	      token = tokens[i];

	      if (token) {
	        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
	          lastToken[1] += token[1];
	          lastToken[3] = token[3];
	        } else {
	          squashedTokens.push(token);
	          lastToken = token;
	        }
	      }
	    }

	    return squashedTokens;
	  }

	  /**
	   * Forms the given array of `tokens` into a nested tree structure where
	   * tokens that represent a section have two additional items: 1) an array of
	   * all tokens that appear in that section and 2) the index in the original
	   * template that represents the end of that section.
	   */
	  function nestTokens (tokens) {
	    var nestedTokens = [];
	    var collector = nestedTokens;
	    var sections = [];

	    var token, section;
	    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
	      token = tokens[i];

	      switch (token[0]) {
	        case '#':
	        case '^':
	          collector.push(token);
	          sections.push(token);
	          collector = token[4] = [];
	          break;
	        case '/':
	          section = sections.pop();
	          section[5] = token[2];
	          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
	          break;
	        default:
	          collector.push(token);
	      }
	    }

	    return nestedTokens;
	  }

	  /**
	   * A simple string scanner that is used by the template parser to find
	   * tokens in template strings.
	   */
	  function Scanner (string) {
	    this.string = string;
	    this.tail = string;
	    this.pos = 0;
	  }

	  /**
	   * Returns `true` if the tail is empty (end of string).
	   */
	  Scanner.prototype.eos = function eos () {
	    return this.tail === '';
	  };

	  /**
	   * Tries to match the given regular expression at the current position.
	   * Returns the matched text if it can match, the empty string otherwise.
	   */
	  Scanner.prototype.scan = function scan (re) {
	    var match = this.tail.match(re);

	    if (!match || match.index !== 0)
	      return '';

	    var string = match[0];

	    this.tail = this.tail.substring(string.length);
	    this.pos += string.length;

	    return string;
	  };

	  /**
	   * Skips all text until the given regular expression can be matched. Returns
	   * the skipped string, which is the entire tail if no match can be made.
	   */
	  Scanner.prototype.scanUntil = function scanUntil (re) {
	    var index = this.tail.search(re), match;

	    switch (index) {
	      case -1:
	        match = this.tail;
	        this.tail = '';
	        break;
	      case 0:
	        match = '';
	        break;
	      default:
	        match = this.tail.substring(0, index);
	        this.tail = this.tail.substring(index);
	    }

	    this.pos += match.length;

	    return match;
	  };

	  /**
	   * Represents a rendering context by wrapping a view object and
	   * maintaining a reference to the parent context.
	   */
	  function Context (view, parentContext) {
	    this.view = view;
	    this.cache = { '.': this.view };
	    this.parent = parentContext;
	  }

	  /**
	   * Creates a new context using the given view with this context
	   * as the parent.
	   */
	  Context.prototype.push = function push (view) {
	    return new Context(view, this);
	  };

	  /**
	   * Returns the value of the given name in this context, traversing
	   * up the context hierarchy if the value is absent in this context's view.
	   */
	  Context.prototype.lookup = function lookup (name) {
	    var cache = this.cache;

	    var value;
	    if (cache.hasOwnProperty(name)) {
	      value = cache[name];
	    } else {
	      var context = this, names, index, lookupHit = false;

	      while (context) {
	        if (name.indexOf('.') > 0) {
	          value = context.view;
	          names = name.split('.');
	          index = 0;

	          /**
	           * Using the dot notion path in `name`, we descend through the
	           * nested objects.
	           *
	           * To be certain that the lookup has been successful, we have to
	           * check if the last object in the path actually has the property
	           * we are looking for. We store the result in `lookupHit`.
	           *
	           * This is specially necessary for when the value has been set to
	           * `undefined` and we want to avoid looking up parent contexts.
	           **/
	          while (value != null && index < names.length) {
	            if (index === names.length - 1)
	              lookupHit = hasProperty(value, names[index]);

	            value = value[names[index++]];
	          }
	        } else {
	          value = context.view[name];
	          lookupHit = hasProperty(context.view, name);
	        }

	        if (lookupHit)
	          break;

	        context = context.parent;
	      }

	      cache[name] = value;
	    }

	    if (isFunction(value))
	      value = value.call(this.view);

	    return value;
	  };

	  /**
	   * A Writer knows how to take a stream of tokens and render them to a
	   * string, given a context. It also maintains a cache of templates to
	   * avoid the need to parse the same template twice.
	   */
	  function Writer () {
	    this.cache = {};
	  }

	  /**
	   * Clears all cached templates in this writer.
	   */
	  Writer.prototype.clearCache = function clearCache () {
	    this.cache = {};
	  };

	  /**
	   * Parses and caches the given `template` and returns the array of tokens
	   * that is generated from the parse.
	   */
	  Writer.prototype.parse = function parse (template, tags) {
	    var cache = this.cache;
	    var tokens = cache[template];

	    if (tokens == null)
	      tokens = cache[template] = parseTemplate(template, tags);

	    return tokens;
	  };

	  /**
	   * High-level method that is used to render the given `template` with
	   * the given `view`.
	   *
	   * The optional `partials` argument may be an object that contains the
	   * names and templates of partials that are used in the template. It may
	   * also be a function that is used to load partial templates on the fly
	   * that takes a single argument: the name of the partial.
	   */
	  Writer.prototype.render = function render (template, view, partials) {
	    var tokens = this.parse(template);
	    var context = (view instanceof Context) ? view : new Context(view);
	    return this.renderTokens(tokens, context, partials, template);
	  };

	  /**
	   * Low-level method that renders the given array of `tokens` using
	   * the given `context` and `partials`.
	   *
	   * Note: The `originalTemplate` is only ever used to extract the portion
	   * of the original template that was contained in a higher-order section.
	   * If the template doesn't use higher-order sections, this argument may
	   * be omitted.
	   */
	  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate) {
	    var buffer = '';

	    var token, symbol, value;
	    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
	      value = undefined;
	      token = tokens[i];
	      symbol = token[0];

	      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
	      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
	      else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);
	      else if (symbol === '&') value = this.unescapedValue(token, context);
	      else if (symbol === 'name') value = this.escapedValue(token, context);
	      else if (symbol === 'text') value = this.rawValue(token);

	      if (value !== undefined)
	        buffer += value;
	    }

	    return buffer;
	  };

	  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate) {
	    var self = this;
	    var buffer = '';
	    var value = context.lookup(token[1]);

	    // This function is used to render an arbitrary template
	    // in the current context by higher-order sections.
	    function subRender (template) {
	      return self.render(template, context, partials);
	    }

	    if (!value) return;

	    if (isArray(value)) {
	      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
	        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
	      }
	    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
	      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
	    } else if (isFunction(value)) {
	      if (typeof originalTemplate !== 'string')
	        throw new Error('Cannot use higher-order sections without the original template');

	      // Extract the portion of the original template that the section contains.
	      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

	      if (value != null)
	        buffer += value;
	    } else {
	      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
	    }
	    return buffer;
	  };

	  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate) {
	    var value = context.lookup(token[1]);

	    // Use JavaScript's definition of falsy. Include empty arrays.
	    // See https://github.com/janl/mustache.js/issues/186
	    if (!value || (isArray(value) && value.length === 0))
	      return this.renderTokens(token[4], context, partials, originalTemplate);
	  };

	  Writer.prototype.renderPartial = function renderPartial (token, context, partials) {
	    if (!partials) return;

	    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
	    if (value != null)
	      return this.renderTokens(this.parse(value), context, partials, value);
	  };

	  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
	    var value = context.lookup(token[1]);
	    if (value != null)
	      return value;
	  };

	  Writer.prototype.escapedValue = function escapedValue (token, context) {
	    var value = context.lookup(token[1]);
	    if (value != null)
	      return mustache.escape(value);
	  };

	  Writer.prototype.rawValue = function rawValue (token) {
	    return token[1];
	  };

	  mustache.name = 'mustache.js';
	  mustache.version = '2.2.1';
	  mustache.tags = [ '{{', '}}' ];

	  // All high-level mustache.* functions use this writer.
	  var defaultWriter = new Writer();

	  /**
	   * Clears all cached templates in the default writer.
	   */
	  mustache.clearCache = function clearCache () {
	    return defaultWriter.clearCache();
	  };

	  /**
	   * Parses and caches the given template in the default writer and returns the
	   * array of tokens it contains. Doing this ahead of time avoids the need to
	   * parse templates on the fly as they are rendered.
	   */
	  mustache.parse = function parse (template, tags) {
	    return defaultWriter.parse(template, tags);
	  };

	  /**
	   * Renders the `template` with the given `view` and `partials` using the
	   * default writer.
	   */
	  mustache.render = function render (template, view, partials) {
	    if (typeof template !== 'string') {
	      throw new TypeError('Invalid template! Template should be a "string" ' +
	                          'but "' + typeStr(template) + '" was given as the first ' +
	                          'argument for mustache#render(template, view, partials)');
	    }

	    return defaultWriter.render(template, view, partials);
	  };

	  // This is here for backwards compatibility with 0.4.x.,
	  /*eslint-disable */ // eslint wants camel cased function name
	  mustache.to_html = function to_html (template, view, partials, send) {
	    /*eslint-enable*/

	    var result = mustache.render(template, view, partials);

	    if (isFunction(send)) {
	      send(result);
	    } else {
	      return result;
	    }
	  };

	  // Export the escaping function so that the user may override it.
	  // See https://github.com/janl/mustache.js/issues/244
	  mustache.escape = escapeHtml;

	  // Export these mainly for testing, but also for advanced usage.
	  mustache.Scanner = Scanner;
	  mustache.Context = Context;
	  mustache.Writer = Writer;

	  return mustache;
	}));


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	;(function (global, factory) {
	    if (( false ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
	        module.exports = factory(global);
	    } else {
	        factory(global);
	    }
	})(typeof window !== "undefined" ? window : undefined, function (global) {
	    var defaults = {
	        title: '温馨提示',
	        content: '',
	        isClose: false,
	        isConfirm: false,
	        isTitle: true,
	        confirmFn: null,
	        confirmTxt: null,
	        cancelTxt: '取消',
	        cancelFn: null,
	        closeFn: null
	    };
	    function extend(object, options) {
	        for (var key in defaults) {
	            if (options[key] != null && options[key] != undefined) object[key] = options[key];else object[key] = defaults[key];
	        }
	    }
	    var iDialog = function iDialog(options) {
	        extend(this, options || {});
	        this.init();
	    };
	    /**
	     * 弹出框基类
	     * @type {{init: Dialog.init, confirm: Dialog.confirm, cancel: Dialog.cancel, close: Dialog.close}}
	     */
	    iDialog.prototype = {
	        init: function init() {
	            var _this = this;
	            //外容器
	            var $aside = $('<aside>').addClass('ex-dialog');
	            //内容器
	            var $div = $('<div>').addClass('ex-dialog-container');
	            //顶部
	            if (this.isTitle) {
	                var $h3 = $('<h3>').addClass('ex-title').html(this.title);
	                if (this.isClose) {
	                    var $i = $('<i>').addClass('ex-icon-close').attr('name', 'close');
	                    $i.on('touchstart', function (e) {
	                        e.preventDefault();
	                        _this.close();
	                    });
	                    $h3.append($i);
	                }
	                $div.append($h3);
	            }
	            //中间
	            this.$section = $('<section>').addClass('ex-content').html(this.content);
	            $div.append(this.$section);
	            //底部
	            var $footer = $('<footer>');
	            this.$confirm = $('<button>').addClass('ex-btn ex-btn-lg ex-btn-angle').attr({ name: 'confirm', type: 'button' });
	            //确定按钮
	            this.changeConfirm();

	            if (this.isConfirm) {
	                //确定与取消
	                $footer.addClass('ex-footer-btn');
	                var $innerDIV = $('<div>').addClass('ex-btn-list ui-flex');
	                this.$confirm.removeClass('ex-btn-lg ex-btn-angle').addClass('ex-btn-blue ui-col-1').html(this.confirmTxt || '确定');
	                //取消按钮
	                this.$cancel = $('<button>').addClass('ex-btn ex-btn-blue ui-col-1').attr({ name: 'cancel', type: 'button' });
	                this.$cancel.html(this.cancelTxt);
	                this.changeCancel();

	                $innerDIV.append(this.$cancel);
	                $innerDIV.append(this.$confirm);
	                $footer.append($innerDIV);
	            } else {
	                //确定按钮
	                $footer.addClass('ex-footer');
	                this.$confirm.html(this.confirmTxt || '我知道了');
	                $footer.append(this.$confirm);
	            }

	            $footer.addClass(this.isConfirm ? 'ex-footer-btn' : 'ex-footer');
	            $div.append($footer);
	            $aside.append($div);
	            this.$innerDiv = $div;
	            this.$container = $aside; //容器
	            //console.log($aside.html());
	        },
	        confirm: function confirm() {
	            //var attrs = [].slice.call(this, arguments);
	            //console.log(attrs)
	            this.$confirm.focus();
	            var result = this.confirmFn && this.confirmFn.call(this);
	            if (result !== false)
	                //默认关闭
	                this.remove();
	        },
	        cancel: function cancel() {
	            this.cancelFn && this.cancelFn.call(this);
	            //默认关闭
	            this.remove();
	        },
	        close: function close() {
	            this.closeFn && this.closeFn.call(this);
	            //默认关闭
	            this.remove();
	        },
	        changeContent: function changeContent(content) {
	            //改变内容
	            this.$section.html(content);
	            return this;
	        },
	        changeConfirm: function changeConfirm(fn) {
	            var _this = this;
	            //重新绑定确定按钮
	            if (fn) {
	                this.confirmFn = fn;
	            }

	            this.$confirm.off('touchstart');
	            this.$confirm.on('touchstart', function (e) {
	                e.preventDefault();
	                _this.confirm();
	            });
	            return this;
	        },
	        changeCancel: function changeCancel(fn) {
	            var _this = this;
	            //重新绑定取消按钮
	            if (fn) {
	                this.cancelFn = fn;
	            }
	            this.$cancel.off('touchstart');
	            this.$cancel.on('touchstart', function (e) {
	                e.preventDefault();
	                _this.cancel();
	            });
	            return this;
	        },
	        show: function show() {
	            //计算高度
	            $('body').append(this.$container);
	            if (!this.$container.data('height')) {
	                var height = this.$innerDiv.height();
	                this.$container.data('height', height);
	                this.$innerDiv.css('margin-top', -height / 2);
	            }
	            return this;
	        },
	        remove: function remove() {
	            this.$container.remove();
	            return this;
	        }
	    };

	    /**
	     * 弹出框单例模式
	     */
	    var factories = {};
	    var DialogFactory = function DialogFactory(type, options) {
	        if (factories[type]) return factories[type];
	        return factories[type] = new iDialog(options);
	    };

	    /**
	     * 提示框
	     */
	    var Alert = function Alert(content, options, key) {
	        key = key || 'alert';
	        var d = DialogFactory(key, options);
	        d.changeContent(content).show();
	        return d;
	    };

	    /**
	     * 确认框
	     */
	    var Confirm = function Confirm(content, options) {
	        options = options || {};
	        options['isTitle'] = false;
	        options['isConfirm'] = true;
	        var d = DialogFactory('confirm', options);
	        d.changeContent(content).changeConfirm(options['confirmFn']).changeCancel(options['cancelFn']).show();
	        return d;
	    };

	    /**
	     * 内容框
	     */
	    var Dialog = function Dialog(content, options) {
	        options = options || {};
	        options['isClose'] = true;
	        options['title'] = '考试场地详情';
	        var d = DialogFactory('dialog', options);
	        d.changeContent(content).changeConfirm(options['confirmFn']).show();
	        return d;
	    };

	    global.iDialog = iDialog;
	    global.DialogFactory = DialogFactory;
	    global.Alert = Alert;
	    global.Confirm = Confirm;
	    global.Dialog = Dialog;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)(module)))

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }
/******/ ]);