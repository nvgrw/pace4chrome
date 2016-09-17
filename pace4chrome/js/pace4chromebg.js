/*
 *  The MIT License (MIT)
 *
 *  Copyright (c) 2014-2016 Niklas Vangerow
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

// -- Constants are loaded from constants.js in the manifest.

// Reference to storage system so that custom css can be retrieved.
// The .sync allows this data to be synchronised with Google's servers
const storage = chrome.storage.sync

// Same as minimal theme, but with a set color. This is the default.
let defaultCSSToInject = ".pace {\n-webkit-pointer-events: none;\npointer-events: none;\n-webkit-user-select: none;\n-moz-user-select: none;\nuser-select: none;\n}\n.pace-inactive {\ndisplay: none;\n}\n.pace .pace-progress {\nbackground: #2299dd;\nposition: fixed;\nz-index: 2000;\ntop: 0;\nright: 100%;\nwidth: 100%;\nheight: 2px;\n}"

// String that keeps this session's CSS string for easy access
let paceCSSCacheString = defaultCSSToInject

// Load this session's CSS so that the paceCSSCacheString string is populated
reloadCachedCSS()

// Load the provided string into the CSS cache and in permanent storage
function setCustomCSS(newCSS){
	paceCSSCacheString = newCSS
	const cssKey = storageKeys.css
	storage.set({cssKey: newCSS})
}

// Reload the CSS into the cache
function reloadCachedCSS(){
	storage.get(storageKeys.css, function(data) {
		if (data.hasOwnProperty(storageKeys.css)) {
			// Load saved CSS string into cache
			paceCSSCacheString = data[storageKeys.css]
		} else {
			// Otherwise, store whatever css we might be caching right now
			const cssKey = storageKeys.css
			storage.set({cssKey: paceCSSCacheString})
		}
	})
}

// Inject the cached CSS string into the current page
function injectCSS() {
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
		chrome.tabs.insertCSS(tabs[0].id, {
			"code": paceCSSCacheString,
			"runAt": "document_start",
			"allFrames": false
		})
	})
}

chrome.runtime.onMessage.addListener(function(request, sender, response) {
	switch (request.id) {
	case messageKeys.inject:
		injectCSS()
		response({"id": request.id})
		return

	case messageKeys.refresh:
		reloadCachedCSS()
		response({"id": request.id})
		return

	case messageKeys.set:
		setCustomCSS(request.newCSS)
		response({"id": request.id})
		return
	
	case messageKeys.get:
		response({"id": request.id, "css": paceCSSCacheString})
		return

	case messageKeys.reset:
		setCustomCSS(defaultCSSToInject)
		response({"id": request.id})
		return

	case messageKeys.resetAndGet:
		response({"id": request.id, "css": defaultCSSToInject})
		return
	}
})