;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "progress",
        defaults = {
            height: "2px",
            color: "#FF0000",
            completeColor: "#00FF00"
        };

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            this._prepareProgressBar();
            this._setupScrollEvents();
        },
        _prepareProgressBar: function() {
            this._progressBar = $("<div>").css({
                "height": this.settings.height,
                "background-color": this.settings.color,
                "position": "fixed",
                "left": "0",
                "top": "0"
            });

            $("body").append(this._progressBar);
        },
        _isAboveElement: function() {
            var docViewTop = $(window).scrollTop(),
                docViewBottom = docViewTop + $(window).height(),
                elemTop = $(this.element).offset().top;

            return (elemTop > docViewBottom);
        },
        _isBelowElement: function() {
            var docViewTop = $(window).scrollTop(),
                docViewBottom = docViewTop + $(window).height(),
                elemTop = $(this.element).offset().top,
                elemBottom = elemTop + $(this.element).height();

            return (elemBottom < docViewBottom);
        },
        _getBarWidth: function() {
            var docViewTop = $(window).scrollTop(),
                docViewBottom = docViewTop + $(window).height(),
                elemTop = $(this.element).offset().top,
                elemHeight = $(this.element).height(),
                topDifference = docViewBottom - elemTop;

            return (topDifference / elemHeight) * 100;
        },
        _setupScrollEvents: function() {
            _this = this;

            $(window).scroll(function() {
                if (_this._isAboveElement()) {
                    _this._progressBar.css({
                        "width": "0"
                    });
                }
                else if (_this._isBelowElement()) {
                    _this._progressBar.css({
                        "width": "100%",
                        "background-color": _this.settings.completeColor
                    });
                }
                else {
                    _this._progressBar.css({
                        "width": _this._getBarWidth() + "%",
                        "background-color": _this.settings.color
                    });
                }
            });

            $(window).scroll();
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
    };

})( jQuery, window, document );