;(function (global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory(global);
    } else {
        factory(global);
    }
})(typeof window !== "undefined" ? window : this, function (global) {
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
        for(var key in defaults) {
            if(options[key] != null && options[key] != undefined)
                object[key] = options[key];
            else
                object[key] = defaults[key];
        }
    }
    var iDialog = function(options) {
        extend(this, options || {});
        this.init();
    };
    /**
     * 弹出框基类
     * @type {{init: Dialog.init, confirm: Dialog.confirm, cancel: Dialog.cancel, close: Dialog.close}}
     */
    iDialog.prototype = {
        init: function() {
            var _this = this;
            //外容器
            var $aside = $('<aside>').addClass('ex-dialog');
            //内容器
            var $div = $('<div>').addClass('ex-dialog-container');
            //顶部
            if(this.isTitle) {
                var $h3 = $('<h3>').addClass('ex-title').html(this.title);
                if(this.isClose) {
                    var $i = $('<i>').addClass('ex-icon-close').attr('name', 'close');
                    $i.on('touchstart', function(e) {
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
            this.$confirm = $('<button>').addClass('ex-btn ex-btn-lg ex-btn-angle').attr({name:'confirm', type:'button'});
            //确定按钮
            this.changeConfirm();

            if(this.isConfirm) {
                //确定与取消
                $footer.addClass('ex-footer-btn');
                var $innerDIV = $('<div>').addClass('ex-btn-list ui-flex');
                this.$confirm.removeClass('ex-btn-lg ex-btn-angle').addClass('ex-btn-blue ui-col-1').html(this.confirmTxt || '确定');
                //取消按钮
                this.$cancel = $('<button>').addClass('ex-btn ex-btn-blue ui-col-1').attr({name:'cancel', type:'button'});
                this.$cancel.html(this.cancelTxt);
                this.changeCancel();

                $innerDIV.append(this.$cancel);
                $innerDIV.append(this.$confirm);
                $footer.append($innerDIV);
            }else {
                //确定按钮
                $footer.addClass('ex-footer');
                this.$confirm.html(this.confirmTxt || '我知道了');
                $footer.append(this.$confirm);
            }

            $footer.addClass(this.isConfirm ? 'ex-footer-btn' : 'ex-footer');
            $div.append($footer);
            $aside.append($div);
            this.$innerDiv = $div;
            this.$container = $aside;//容器
            //console.log($aside.html());
        },
        confirm: function() {
            //var attrs = [].slice.call(this, arguments);
            //console.log(attrs)
            this.$confirm.focus();
            var result = this.confirmFn && this.confirmFn.call(this);
            if(result !== false)
                //默认关闭
                this.remove();
        },
        cancel: function() {
            this.cancelFn && this.cancelFn.call(this);
            //默认关闭
            this.remove();
        },
        close: function() {
            this.closeFn && this.closeFn.call(this);
            //默认关闭
            this.remove();
        },
        changeContent: function(content) {
            //改变内容
            this.$section.html(content);
            return this;
        },
        changeConfirm: function(fn) {
            var _this = this;
            //重新绑定确定按钮
            if(fn) {
                this.confirmFn = fn;
            }

            this.$confirm.off('touchstart');
            this.$confirm.on('touchstart', function(e) {
                e.preventDefault();
                _this.confirm();
            });
            return this;
        },
        changeCancel: function(fn) {
            var _this = this;
            //重新绑定取消按钮
            if(fn) {
                this.cancelFn = fn;
            }
            this.$cancel.off('touchstart');
            this.$cancel.on('touchstart', function(e) {
                e.preventDefault();
                _this.cancel();
            });
            return this;
        },
        show: function() {
            //计算高度
            $('body').append(this.$container);
            if(!this.$container.data('height')) {
                var height = this.$innerDiv.height();
                this.$container.data('height', height);
                this.$innerDiv.css('margin-top', -height/2);
            }
            return this;
        },
        remove: function() {
            this.$container.remove();
            return this;
        }
    };

    /**
     * 弹出框单例模式
     */
    var factories = {};
    var DialogFactory = function(type, options) {
        if(factories[type])
            return factories[type];
        return factories[type] = new iDialog(options);
    };

    /**
     * 提示框
     */
    var Alert = function(content, options, key) {
        key = key || 'alert';
        var d = DialogFactory(key, options);
        d.changeContent(content).show();
        return d;
    };

    /**
     * 确认框
     */
    var Confirm = function(content, options) {
        options = options || {};
        options['isTitle'] = false;
        options['isConfirm'] = true;
        var d = DialogFactory('confirm', options);
        d.changeContent(content)
            .changeConfirm(options['confirmFn'])
            .changeCancel(options['cancelFn']).show();
        return d;
    };

    /**
     * 内容框
     */
    var Dialog = function(content, options) {
        options = options || {};
        options['isClose'] = true;
        options['title'] = '考试场地详情';
        var d = DialogFactory('dialog', options);
        d.changeContent(content)
            .changeConfirm(options['confirmFn']).show();
        return d;
    };

    global.iDialog = iDialog;
    global.DialogFactory = DialogFactory;
    global.Alert = Alert;
    global.Confirm = Confirm;
    global.Dialog = Dialog;
});