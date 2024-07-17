// ==UserScript==
// @name         Game to Results Redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change /game/ to /results/ when 'L' is pressed
// @author       Your Name
// @match        https://www.geoguessr.com/game/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to change URL from /game/ to /results/
    function changeUrlToResults() {
        const currentUrl = window.location.href;
        if (currentUrl.includes('/game/')) {
            const newUrl = currentUrl.replace('/game/', '/results/');
            window.location.href = newUrl;
        }
    }

    // Event listener for keypress
    document.addEventListener('keydown', function(event) {
        if (event.key === 'L' || event.key === 'l') {
            changeUrlToResults();
        }
    });
})();
