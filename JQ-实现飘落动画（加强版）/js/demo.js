        (function ($) {
            $.fn.snow = function (options) {
                $.each(options,(k,v)=>{ 
                    switch(k){
                        case 'unicodeType':
                            if(typeof(v) !== 'string') throw new Error('Type of unicodeType is error, should Type -> String');
                            break;
                        case 'minSize':
                            if(typeof(v) !== 'number') throw new Error('Type of minSize is error, should Type -> Number');
                                break;
                        case 'maxSize':
                            if(typeof(v) !== 'number') throw new Error('Type of maxSize is error, should Type -> Number');
                            break;
                        case 'newOn':
                            if(typeof(v) !== 'number') throw new Error('Type of newOn is error, should Type -> Number');
                            break;
                        case 'flakeColor':
                            if(typeof(v) !== 'string') throw new Error('Type of flakeColor is error, should Type -> String');
                            break;
                        default:
                            console.warn(`This field is ${k}. It is recommended to delete it.`)
                    }
                })
                if(!options.unicodeType){
                    console.warn('Please enter unicode characters, otherwise the default is snowflake shape')
                }
                options.unicodeType = (options.unicodeType.substring(0,2) !== '&#') ? '&#'+ options.unicodeType:options.unicodeType
                var documentHeight = $(document).height(),
                    documentWidth = $(document).width(),
                    defaults = {
                        unicodeType: '&#10052',
                        minSize: 10,
                        maxSize: 20,
                        newOn: 500,
                        flakeColor: "#FFFFFF"
                    },
                    options = $.extend({},
                        defaults, options);
                var $flake = $('<div id="flake" />').css({
                    'position': 'absolute',
                    'top': '-50px'
                }).html(options.unicodeType)
                var interval = setInterval(function () {
                        var startPositionLeft = Math.random() * documentWidth - 100,
                            startOpacity = 0.5 + Math.random(),
                            sizeFlake = Math.abs((options.minSize + Math.random() * options.maxSize) > options.maxSize ? options.maxSize : options.minSize + Math.random() * options.maxSize),
                            endPositionTop = documentHeight - 40,
                            endPositionLeft = startPositionLeft - 100 + Math.random() * 200,
                            durationFall = documentHeight * 10 + Math.random() * 5000;
                        $flake.clone().appendTo('body').css({
                            left: startPositionLeft,
                            opacity: startOpacity,
                            'font-size': sizeFlake,
                            color: options.flakeColor
                        }).animate({
                                top: endPositionTop,
                                left: endPositionLeft,
                                opacity: 0.2
                            },
                            durationFall, 'linear',
                            function () {
                                $(this).remove()
                            });
                    },
                    options.newOn);
            };
        })(jQuery);

        // 飘落动画调用
        $.fn.snow({
            unicodeType: '&#9730',
            minSize: 5,
            maxSize: 50,
            newOn: 1000,
            flakeColor: '#FFF'
        });