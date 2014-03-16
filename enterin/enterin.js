/*
* 
* enterin.js
* Copyright (c) 2014 Gianfilippo Balestriero <info@enterinjs.com>
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

var $old    = jQuery;

var $       = {};

$.jQuery    = $old;

$.log = function($obj){
    console.log("%c[--- EnterIN Log -", 'color: #2980b9; font-weight:bold;');
    console.log($obj);
    console.log("%c- EnterIN Log ---]", 'color: #2980b9; font-weight:bold;');
};

$.MOBILE = [
    'Android',
    'iPhone',
    'iPad',
    'iPod',
    'BlackBerry',
    'Windows Phone',
    'webOS'
];

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

$.EnterIN.detectMobile = function(){
    $.EnterIN.isMobile = false;
    for(var m in $.MOBILE){
        var $mobile  = $.MOBILE[m];
        var $pattern = new RegExp($mobile, 'i');
        var $match   = navigator.userAgent.match($pattern);
        if($match){
            $.EnterIN.isMobile = true;
            break;
        }
    }
};

$.EnterIN.cssLoad = function(path, rel){
    var link = $.jQuery('<link>');
    link.attr("rel", 'stylesheet/less');
    link.attr('href', path);

    $.jQuery("head").append(link);
};

$.EnterIN.jsLoad = function(path){
    var script = $.jQuery('<script>');
    script.attr('src', path);

    $.jQuery("head").append(script);  
};

$.EnterIN.endCallback = function(){};

$.EnterIN.run = function(){

    var path = document.querySelector('script[rel="js/enterin"]').getAttribute("src");

    path = path.replace(/\/enterin\/enterin\.js/, '')+"/";

    $.EnterIN.cssLoad(path+$.LESS[0]);
    $.EnterIN.jsLoad(path+$.LESS[1]);

    $.EnterIN.detectMobile();

    if($.EnterIN.isMobile) {
        $.LIBS.push('enterin/libs/touch-swipe/jquery.touchswipe.js');
        $.LIBS.push('enterin/mobile.enterin.js');
    }

    for(var i in $.CSS) {
        $.EnterIN.cssLoad(path+$.CSS[i]);
    }
    for(var i in $.LIBS) {
       $.EnterIN.jsLoad(path+$.LIBS[i]);
    }

    window.onload = function(){
        $.EnterIN.call();
    }

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

    if(!$.EnterIN.isMobile){
        $.EnterIN.bindKeyAndMouseEvents();
    }

    $.EnterIN.bindControllers();

    $.EnterIN.bindAnimation();

    if(!$.EnterIN.isMobile){
        $.EnterIN.bindHoverSlides();
    }

    $.EnterIN.isInit = false;

    $.EnterIN.changeSlide(1);

    if($.EnterIN.isMobile) {
        $.EnterIN.mobile.init();
    }

};

$.EnterIN.detectCenterClick = function(event){

        var centerClick = false;
        
        if (!event) {
            var event = window.event;
        } 

        if (event.which) {
            centerClick = (event.which == 2);
        }
        else if (event.button) {
            centerClick = (event.button == 2);           
        } 

        return centerClick
};

$.EnterIN.bindControllers = function(){
    $.jQuery("body").find("[data-enterin-to]").click(function(event){
        if($.EnterIN.detectCenterClick(event)){
            return;
        }
        $.EnterIN.to = $.jQuery(this).data("enterin-to");
        $.EnterIN.changeSlide($.EnterIN.to);        
        if($.EnterIN.inGrid){
            $.EnterIN.hideGrid();
        }
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

    $.EnterIN.wrapper.bind('mousedown', function(event) {

        if($.EnterIN.detectCenterClick(event)) {
            event.preventDefault();
            if($.EnterIN.inGrid) {
                $.EnterIN.hideGrid();
            }
            else {
                $.EnterIN.showGrid();
            }
        }

    });

    $.EnterIN.wrapper.bind("mousewheel", function(event, delta){

        if( ( $.EnterIN.kmTime && (event.timeStamp-$.EnterIN.kmTime) < 300 ) || $.EnterIN.inSlide == true || $.EnterIN.inGrid){
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

    $.jQuery("body").keyup(function (event) {

        if($.EnterIN.kmTime && (event.timeStamp-$.EnterIN.kmTime) < 300 ){
            return;
        }
        
        $.EnterIN.kmTime = event.timeStamp;

        var keyCode = event.keyCode || event.which;

        arrow   = {left: 37, up: 38, right: 39, down: 40};
        letters = {g:71, z: 90};

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
            case letters.g:
                event.preventDefault();
                if(!$.EnterIN.inGrid){
                    $.EnterIN.showGrid();
                }
                else {
                    $.EnterIN.hideGrid();
                }
                $.log($.EnterIN.inGrid);
                    
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

$.EnterIN.showGrid = function(){
    $.EnterIN.wrapper.addClass('show-grid');
    $.EnterIN.changeSlide(1);
    if($.EnterIN.isMobile){
        $.EnterIN.wrapper.swipe("disable");
    }
    $.EnterIN.inGrid = true;
};

$.EnterIN.hideGrid = function(){
    $.EnterIN.inGrid = false;
    $.EnterIN.wrapper.removeClass('show-grid');
    if($.EnterIN.isMobile){
        $.EnterIN.wrapper.swipe("enable");
    }    
};

$.EnterIN.run();
