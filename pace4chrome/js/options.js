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

// Locations for the preset template files.
const presets = [
	"../css/themes/minimal.css",
	"../css/themes/mobile-chrome.css",
	"../css/themes/material.css",
	"../css/themes/barber-shop.css",
	"../css/themes/big-counter.css",
	"../css/themes/bounce.css",
	"../css/themes/center-atom.css",
	"../css/themes/center-circle.css",
	"../css/themes/center-radar.css",
	"../css/themes/center-simple.css",
	"../css/themes/corner-indicator.css",
	"../css/themes/fill-left.css",
	"../css/themes/flash.css",
	"../css/themes/flat-top.css",
	"../css/themes/loading-bar.css",
	"../css/themes/mac-osx.css"
]
// The current preset
let currentPreset = 0

// --- Area Stuff ---
// Area is the textarea in the advanced options. It updates with the presets and ultimately
// is what is saved when changes are saved.

// Hook up the area to reapply the CSS when changed
paceCSSArea.onchange = function() {
	applyCSS(paceCSSArea.value)
}

paceCSSArea.onkeyup = function() {
	applyCSS(paceCSSArea.value)
}

// Obtain the latest stored CSS
function refreshCSSArea() {
	chrome.runtime.sendMessage(null, {"id": messageKeys.get}, function(response) {
		applyCSS(response.css)
	})
}

function refreshBlacklistArea() {
	chrome.runtime.sendMessage(null, {"id": messageKeys.getBlacklistString}, function(response) {
		applyBlacklist(response)
	})	
}

// Save the current area contents
function saveAreas() {
	save.innerHTML = "Saving..."
	// Save the CSS value
	chrome.runtime.sendMessage(null, {"id": messageKeys.set, "newCSS": paceCSSArea.value})

	// Save the blacklist value
	chrome.runtime.sendMessage(null, {"id": messageKeys.setBlacklistString, "blacklistString": blacklistArea.value})

	//
	save.innerHTML = "Changes Saved!"
	setTimeout(function() {
		save.innerHTML = "Save Changes"
	}, 2000)
}

// Reset the area contents to the default settings
// This is colour #2299dd and theme Minimal (0)
function resetAreas() {
	colPicker.value = "2299dd"
	applyCSSFromPreset(colPicker.value, 0)
	applyBlacklist("")
}

// Hook up the save and reset buttons
save.onclick = saveAreas
reset.onclick = resetAreas

// Hook up the "Show advanced options
showAdvanced.onclick = function() {
	// If hidden, then show, if showing then hide.
	if (showAdvanced.className == "pure-button pure-button-primary shidden") {
		showAdvanced.className = "pure-button pure-button-primary sshown"
		showAdvanced.innerHTML = "Hide Advanced Options"
		advanced.className = "sshown"
	} else {
		showAdvanced.className = "pure-button pure-button-primary shidden"
		showAdvanced.innerHTML = "Show Advanced Options"
		advanced.className = ""
	}
}

// --- Presets Stuff ---
// Hook up each presets button so that it sets its preset
for (let presetButton of document.getElementsByClassName("preset")) {
	presetButton.onclick = function() {
		applyCSSFromPreset(colPicker.value, parseInt(this.getAttribute("presID")))
	}
}

// Hook up the colour picker to update the preset when changed.
colPicker.onchange = function() {
	applyCSSFromPreset(this.value, currentPreset)
}

// Load and compile a preset at index with the provided source colour
// The callback has a single argument, which is the compiled CSS string.
function loadPreset(sourceColor, index, callback) {
	// Update the index of the current preset
	currentPreset = index

	// Load the template for the provided preset index
	let request = XMLHttpRequest()
	request.addEventListener("load", function() {
		// Compile the CSS and call the callback when done
		compileCSS(sourceColor, this.responseText, callback)
	})
	request.open("GET", presets[index])
	request.send()
}

// --- Application Stuff ---
// Apply the CSS to the current page and to the area
function applyCSS(css) {
	themeTester.innerHTML = css
	paceCSSArea.value = css
}

// Apply the css to the current page and to the area with a specific
// preset and source colour.
function applyCSSFromPreset(sourceColor, index) {
	loadPreset(sourceColor, index, function(css) {
		applyCSS(css)
	})
}

// Compile the provided CSS template string with the source colour.
// CSS templates are in css/themes
function compileCSS(sourceColor, template, callback) {
	// Evaluate the template and calculate the correct colours
	let newCSS = template.replace(/`([\s\S]*?)`/gm, function(match, code) {
		let ret = "#fff"
		// Args object used in evaled CSS to calculate the correct colours
		let args = {color:"#" + sourceColor};
		try {
			ret = eval(code)
		} catch (e) {
			let fakeFunc = "function evfal(){" + code + "}"
			eval(fakeFunc)
			ret = evfal()
		}
		return ret
	})
	callback(newCSS)
}

function applyBlacklist(blacklistString) {
	blacklistArea.value = blacklistString
}

// --- Setup ---
// Set the initial value of the css area
refreshCSSArea()
// Set the initial value of the blacklist area
refreshBlacklistArea()

// Stop the pace bar for preview.
Pace.stop()
setTimeout(function() {
	Pace.bar.el.className = "pace pace-active"
	Pace.bar.progress = 50
	Pace.bar.lastRenderedProgress = 50
	var progressBar = Pace.bar.el.getElementsByClassName("pace-progress")[0]
	progressBar.style.width = "50%"
	progressBar.setAttribute("data-progress-text", "50%")
	progressBar.setAttribute("data-progress", "50")
	document.body.className = "pace-running"
	Pace.running = true
}, 1000)