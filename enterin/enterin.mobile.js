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

var ORIENTATION = {};

ORIENTATION.VERTICAL 	= 'VERTICAL';
ORIENTATION.HORIZONTAL 	= 'HORIZONTAL';

$.EnterIN.mobile = {};

$.EnterIN.mobile.init = function(){

	$.EnterIN.mobile.bindOrientationChange();
	$.EnterIN.mobile.bindSwipe();

};

$.EnterIN.mobile.bindOrientationChange = function(){
	
	$.EnterIN.mobile.orientation = $.EnterIN.mobile.detectOrientation();

	window.addEventListener("orientationchange", function() {
		$.EnterIN.mobile.detectOrientation();
	}, false);

};

$.EnterIN.mobile.detectOrientation = function(orientation){

	if($.jQuery(window).width()>$.jQuery(window).height()){
		$.EnterIN.mobile.orientation = ORIENTATION.HORIZONTAL;
	}
	else {
		$.EnterIN.mobile.orientation = ORIENTATION.VERTICAL;
	}

};

$.EnterIN.mobile.bindSwipe= function(){

};

$.EnterIN.mobile.init();