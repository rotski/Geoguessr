// ==UserScript==
// @name         Invert GeoGuessr Map Colors
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Invert the colors on the GeoGuessr guess map
// @author       Your Name
// @match        https://www.geoguessr.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS to invert the map colors
    GM_addStyle(`
        .guess-map_guessMap__wuNbK {
            filter: invert(100%);
        }
    `);
})();
