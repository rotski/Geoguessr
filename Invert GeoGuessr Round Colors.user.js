// ==UserScript==
// @name         Invert GeoGuessr Round Colors
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Invert the colors of the GeoGuessr round
// @author       Your Name
// @match        https://www.geoguessr.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS to invert colors
    GM_addStyle(`
        body {
            filter: invert(100%);
        }
    `);
})();
