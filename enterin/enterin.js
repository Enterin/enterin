/*
* EnterIN
* 
* Copyright 2013 Gianfilippo Balestriero < enterin.github@gmail.com >
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* 
*/

var $ = {};

$.jQueryCDN = '//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js';

$.log = function($obj){
    console.log("%c[--- EnterIN Log -", 'color: #2980b9; font-weight:bold;');
    console.log($obj);
    console.log("%c- EnterIN Log ---]", 'color: #2980b9; font-weight:bold;');
};

$.LESS = [
    'enterin/core/style.enterin.css',
    'enterin/libs/less/less.js'
];

$.LIBS = [
    'enterin/libs/mousewheel/jquery.mousewheel.js'
];
if(typeof $LIBS != "undefined"){
    for(var l in $LIBS){
        $.LIBS.push($LIBS[l]);
    }
}

$.CSS = [];
if(typeof $CSS != "undefined"){
    for(var l in $CSS){
        $.CSS.push($CSS[l]);
    }
}


$.EnterIN = {};

$.EnterIN.endCallback = function(){};

$.EnterIN.run = function(){

    var lessHTML        = [];

    $.jQuery("body").append('<link rel="stylesheet/less" href="'+$.LESS[0]+'" />');
    $.jQuery("body").append('<script src="'+$.LESS[1]+'"></script>');

    var cssAndLibsHTML  = [];

    for(var i in $.CSS) {
        $.jQuery("body").append('<link rel="stylesheet/less" href="'+$.CSS[i]+'" />');
    }
    for(var i in $.LIBS) {
       $.jQuery("body").append('<script src="'+$.LIBS[i]+'"></script>');
    }

    $.EnterIN.call();

};


$.EnterIN.call = function() {

    return $.jQuery('section[data-enterin="true"], div[data-enterin="true"]').each(function() {
        $.EnterIN.init(this);
    });

};

$.EnterIN.init = function(element) {

    $.EnterIN.wrapper = $.jQuery(element);

    $.EnterIN.isInit  = true;

    $.EnterIN.to      = 1;

    $.EnterIN.ctrl    = false

    $.EnterIN.mouseWheelRun = true;

    $.EnterIN.reorderSlide();

    $.EnterIN.bindKeyAndMouseEvents();

    $.EnterIN.bindControllers();

    $.EnterIN.bindAnimation();

    $.EnterIN.bindHoverSlides();

    $.EnterIN.isInit = false;

    $.EnterIN.changeSlide(1);

};

$.EnterIN.bindControllers = function(){
    $.jQuery("body").find("[data-enterin-to]").click(function(){
        $.EnterIN.to = $.jQuery(this).data("enterin-to");
        $.EnterIN.changeSlide($.EnterIN.to);
    });
};

$.EnterIN.reorderSlide = function() {

    var markupHtml = $.EnterIN.wrapper.clone();

    var max = markupHtml.find(".enterin-slide").length-1;

    $.EnterIN.wrapper.text("");

    var html;

    for(var i = 0; i<max+1; i++) {
        html = markupHtml.find(".enterin-slide").eq(max-i);
        $.EnterIN.wrapper.append(html);
    }

    $.EnterIN.slides    = $.EnterIN.wrapper.find(".enterin-slide");
    $.EnterIN.count     = $.EnterIN.slides.length;

};

$.EnterIN.bindKeyAndMouseEvents =  function(){

    $.EnterIN.wrapper.bind("mousewheel", function(event, delta){

        if($.EnterIN.kmTime && (event.timeStamp-$.EnterIN.kmTime) < 300 ){
            return;
        }
        
        $.EnterIN.kmTime = event.timeStamp;

        if($.jQuery(event.target).parent(".enterin-slide").outerHeight()>$.jQuery(event.target).parent(".enterin-slide").height()){
            return;
        }

        if(delta=="-1") {
            $.EnterIN.to = $.EnterIN.to+1;
        }
        else {
            $.EnterIN.to = $.EnterIN.to-1;
        }

        $.EnterIN.keyFire();

    });

    $.jQuery("body").keydown(function (event) {

        if($.EnterIN.kmTime && (event.timeStamp-$.EnterIN.kmTime) < 300 ){
            return;
        }
        
        $.EnterIN.kmTime = event.timeStamp;        

        var keyCode = event.keyCode || event.which,

        arrow = {left: 37, up: 38, right: 39, down: 40 };

        switch (keyCode) {
            case arrow.left:
                event.preventDefault();
                $.EnterIN.to = $.EnterIN.to-1;

            break;
            case arrow.right:
                event.preventDefault();
                $.EnterIN.to = $.EnterIN.to+1;
            break;                            
            case arrow.up:
                event.preventDefault();
                $.EnterIN.to = $.EnterIN.to-1;
            break;

            case arrow.down:
                event.preventDefault();
                $.EnterIN.to = $.EnterIN.to+1;
            break;
        }

        $.EnterIN.keyFire();

        return;

    });                    
};

$.EnterIN.keyFire = function(){

    if($.EnterIN.to < 1) {
        $.EnterIN.to = $.EnterIN.count;
    }
    else if($.EnterIN.to > $.EnterIN.count) {
        $.EnterIN.to = 1;
    }

    $.EnterIN.changeSlide($.EnterIN.to);



};

$.EnterIN.bindAnimation = function(){

    $.EnterIN.slides.unbind('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd');

    $.EnterIN.slides.eq($.EnterIN.to-1).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd', function(){
        if($.EnterIN.isInit) {
            $.EnterIN.isInit = false;
            return;
        }
        else {
            $.EnterIN.endCallback($.EnterIN.to-1);
        }

    });
};

$.EnterIN.bindHoverSlides = function() {
    $.EnterIN.slides.bind("mouseenter", function(){
        $.EnterIN.slides.removeClass("mouseenter");
        $.jQuery(this).addClass("mouseenter");
    });
    $.EnterIN.slides.bind("mouseleave", function(){
        $.EnterIN.slides.removeClass("mouseenter");
    });     
};

$.EnterIN.changeZindex = function(){
    $.EnterIN.slides.each(function(i, val){
        var a = (($.EnterIN.count-i)-1);
        var b = ($.EnterIN.to-1)
        $.EnterIN.slides.eq(i).css("z-index", i);
        if(a == b) {
            $.EnterIN.slides.eq(i).css("z-index", $.EnterIN.count*2);
        }
    });
};

$.EnterIN.changeActive = function(){
    $.EnterIN.wrapper.slides.removeClass("enterin-active");
    $.EnterIN.wrapper.slides.eq($.EnterIN.count-$.EnterIN.to).addClass("enterin-active");

    $.EnterIN.slides.eq($.EnterIN.to).focus();
};

$.EnterIN.changeSlide = function(to){

    $.EnterIN.slides.each(function(i, val){

        var a = (1/$.EnterIN.count)*(i+1);
        var b = (1/$.EnterIN.count);

        var s = a+((to-1)*b);

        var o = s;

        var v = "visible";

        if(o>1){
            o = 0;
            v = "hidden"
        }

        $.jQuery(this).css({
            transform: 'scale('+s+')',
            opacity: o,
            visibility: v
        });

    });

    $.EnterIN.to = to;

    $.EnterIN.bindAnimation();

    $.EnterIN.changeZindex();

    $.EnterIN.changeActive();

};

$.EnterIN.changeActive = function(){
    $.EnterIN.slides.removeClass("enterin-active");
    $.EnterIN.slides.eq($.EnterIN.count-$.EnterIN.to).addClass("enterin-active");
};

$.EnterIN.goToSlide = function(slideIndex, scaleOverride){
    setTimeout(function(){
        $.EnterIN.changeSlide(slideIndex, scaleOverride);
    },30);
};

function run(){

    var JQUERYSCRIPT = document.createElement('script');

    JQUERYSCRIPT.src = '//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js';

    document.querySelector('body').appendChild(JQUERYSCRIPT);

    var $old = $;

    JQUERYSCRIPT.onload = function(){

        $           = {};
        
        $.jQuery    = jQuery;

        $.EnterIN   = $old.EnterIN;

        $.log       = $old.log;

        $.LESS      = $old.LESS;

        $.LIBS      = $old.LIBS;
        $.CSS       = $old.CSS;

        $.EnterIN.run();

    };   
};

run();
