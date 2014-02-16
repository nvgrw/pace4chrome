/*
 *	The MIT License (MIT)
 *
 *	Copyright (c) 2014 Niklas Vangerow
 *
 *	Permission is hereby granted, free of charge, to any person obtaining a copy
 *	of this software and associated documentation files (the "Software"), to deal
 *	in the Software without restriction, including without limitation the rights
 *	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *	copies of the Software, and to permit persons to whom the Software is
 *	furnished to do so, subject to the following conditions:
 *
 *	The above copyright notice and this permission notice shall be included in all
 *	copies or substantial portions of the Software.
 *
 *	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *	SOFTWARE.
 */
var storage = chrome.storage.sync,
	tabs = chrome.tabs;
var hasSetting = false;
var defaultCSSToInject = ".pace .pace-progress {\n    background: #29d;\n    position: fixed;\n    z-index: 2000;\n    top: 0;\n    left: 0;\n    height: 2px;\n    -webkit-transition: width 1s;\n    transition: width 1s;\n}\n\n.pace-inactive {\n    display: none;\n}";
var cssToInject = defaultCSSToInject;

refreshCustomCSS();

function injectCSS(){
	tabs.query({currentWindow:true, active:true}, function(tabb){
		tabs.insertCSS(tabb[0].id, {
			"code" : cssToInject,
			"runAt" : "document_start",
			"allFrames" : false
		});
	});
}

function refreshCustomCSS(){
	storage.get("pace4chrome-custom-css", function(data){
		if(data.hasOwnProperty("pace4chrome-custom-css")){
			cssToInject = data["pace4chrome-custom-css"];
		}else{
			storage.set({"pace4chrome-custom-css":cssToInject});
		}
	});
}

function setCustomCSS(newCSS){
	cssToInject = newCSS;
	storage.set({"pace4chrome-custom-css":newCSS});
}

chrome.runtime.onMessage.addListener(function(request, sender, response){
	if(request.id == "pace4chrome-cssinject"){
		injectCSS();
		response({"id" : request.id});
		return;
	}
	if(request.id == "pace4chrome-cssrefresh"){
		refreshCustomCSS();
		response({"id" : request.id});
		return;
	}
	if(request.id == "pace4chrome-cssset"){
		setCustomCSS(request.newCSS);
		response({"id" : request.id});
		return;
	}
	if(request.id == "pace4chrome-cssget"){
		response({"id" : request.id, "css" : cssToInject});
		return;
	}
	if(request.id == "pace4chrome-cssreset"){
		setCustomCSS(defaultCSSToInject);
		response({"id" : request.id});
		return;
	}
	if(request.id == "pace4chrome-cssresetget"){
		response({"id" : request.id, "css" : defaultCSSToInject});
		return;
	}
});