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

// This script runs whenever a new page is loaded. The background script does not have the same
// lifecycle, so here we send a message to the background script so that it can inject the custom
// CSS and pace.js into the active page.

chrome.runtime.sendMessage(null, {"id": messageKeys.checkBlacklisted, "href": window.location.href}, function(isBlacklisted) {
    // if the page is blacklisted, don't inject any scripts.
    if (!isBlacklisted) {
        chrome.runtime.sendMessage(null, {"id": messageKeys.inject})
    } else {
        // Let the user know, might be useful for debugging regular expressions for the blacklist.
        console.info("This page is blacklisted. Pace4Chrome will not run.")
    }
})