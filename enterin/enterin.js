/*
* 
* EnterIN JS | The new frontier of web development
* Copyright (c) 2013 Gianfilippo Balestriero <enterin.github@gmail.com>
* 
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
* 
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
* 
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
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

    var path = document.querySelector('script[rel="js/enterin"]').getAttribute("src");

    path = path.replace(/\/enterin\/enterin\.js/, '')+"/";

    $.jQuery("body").append('<link rel="stylesheet/less" href="'+path+$.LESS[0]+'" />');
    $.jQuery("body").append('<script src="'+path+$.LESS[1]+'"></script>');

    for(var i in $.CSS) {
        $.jQuery("body").append('<link rel="stylesheet/less" href="'+path+$.CSS[i]+'" />');
    }
    for(var i in $.LIBS) {
       $.jQuery("body").append('<script src="'+path+$.LIBS[i]+'"></script>');
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

    $.EnterIN.bindMouseTrack();

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

$.EnterIN.bindMouseTrack = function(){
    $.jQuery("body").mousemove(function(event){
        $.EnterIN.xMouse = event.pageX;
        $.EnterIN.yMouse = event.pageY;
        $.EnterIN.fireNavbars();
    });
};

$.EnterIN.fireNavbars = function(){
    var leftNavWidth, rightNavWidth;
    
    if(!$.jQuery("div[data-enterin-nav='true'][data-enterin-nav-side='left']").length){
        leftNavWidth = false;
    }
    else {
        leftNavWidth  = $.jQuery("div[data-enterin-nav='true'][data-enterin-nav-side='left']").width();
    }
    if(!$.jQuery("div[data-enterin-nav='true'][data-enterin-nav-side='right']").length){
        rightNavWidth = false;
    } 
    else {
        rightNavWidth = $.jQuery("div[data-enterin-nav='true'][data-enterin-nav-side='right']").width();
    }   

    if(!leftNavWidth && !rightNavWidth){
        return false;
    }

    if(leftNavWidth && $.EnterIN.xMouse<=(leftNavWidth/3)){
        $.jQuery("div[data-enterin-nav='true'][data-enterin-nav-side='left']").addClass('enterin-nav-in');
    }
    else {
        $.jQuery("div[data-enterin-nav='true'][data-enterin-nav-side='left']").removeClass('enterin-nav-in');
    }

    if(rightNavWidth && ($.jQuery(window).width()-$.EnterIN.xMouse)<=(rightNavWidth/3)){
        $.jQuery("div[data-enterin-nav='true'][data-enterin-nav-side='right']").addClass('enterin-nav-in');
    }
    else {
        $.jQuery("div[data-enterin-nav='true'][data-enterin-nav-side='right']").removeClass('enterin-nav-in');
    }    

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

        if( ( $.EnterIN.kmTime && (event.timeStamp-$.EnterIN.kmTime) < 300 ) || $.EnterIN.inSlide == true){
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

        var keyCode = event.keyCode || event.which;

        arrow   = {left: 37, up: 38, right: 39, down: 40};
        letters = {z: 90};

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
            case letters.z:
                event.preventDefault();
                $.EnterIN.makeZoom();
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

$.EnterIN.makeZoom = function(){
    if(!$.EnterIN.isZoom){
        $.jQuery("body[data-enterin-zoom='true']").addClass("enterin-zoom");
        $.EnterIN.isZoom = true;
    }
    else {
        $.jQuery("body[data-enterin-zoom='true']").removeClass("enterin-zoom");
        $.EnterIN.isZoom = false;
    }
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
        if($.jQuery(this).hasClass("enterin-active")){
            $.EnterIN.inSlide = true;
        }
       
    });
    $.EnterIN.slides.bind("mouseleave", function(){
        $.EnterIN.slides.removeClass("mouseenter");
        if($.jQuery(this).hasClass("enterin-active")){
            $.EnterIN.inSlide = false;
        }
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

    document.querySelector('body').appendChild(JQUERYSCRIPT);


};

document.querySelector("body").style.opacity=0;

window.onload = function(){
    document.querySelector("body").style.opacity=1;
    run();
};
