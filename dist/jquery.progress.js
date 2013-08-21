/*
 *  jQuery Progress - v0.1.0
 *  Progress bars for element scroll progress.
 *  https://github.com/ryannielson/jquery-progress
 *
 *  Made by Ryan Nielson
 *  Under MIT License
 */
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
        _isAboveElement: function(elementTop, viewBottom) {
            return (elementTop > viewBottom);
        },
        _isBelowElement: function(elementBottom, viewBottom) {
            return (elementBottom < viewBottom);
        },
        _getBarWidth: function(topDifference, elementHeight) {
            return (topDifference / elementHeight) * 100;
        },
        _setupScrollEvents: function() {
            _this = this;

            var recalculateProgressBar = function() {
                var viewBottom = $(window).scrollTop() + $(window).height(),
                    elementTop = $(_this.element).offset().top,
                    elementBottom = elementTop + $(_this.element).height(),
                    elementHeight = $(_this.element).height(),
                    topDifference = viewBottom - elementTop;

                if (_this._isAboveElement(elementTop, viewBottom)) {
                    _this._progressBar.css({
                        "width": "0"
                    });
                }
                else if (_this._isBelowElement(elementBottom, viewBottom)) {
                    _this._progressBar.css({
                        "width": "100%",
                        "background-color": _this.settings.completeColor
                    });
                }
                else {
                    _this._progressBar.css({
                        "width": _this._getBarWidth(topDifference, elementHeight) + "%",
                        "background-color": _this.settings.color
                    });
                }
            };

            $(window).scroll(recalculateProgressBar);
            $(window).resize(recalculateProgressBar);
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