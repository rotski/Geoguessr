// ==UserScript==
// @name         Remove Dude and Globe
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Remove a specific element from the GeoGuessr page after a delay
// @author       Your Name
// @match        https://www.geoguessr.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the specified element
    function removeElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.remove();
        }
    }

    // Specify the selector of the element to remove
    const selectorToRemove = '#__next > div.background_wrapper__OlrxG.background_backgroundHome__lurxW > div.version4_layout__KcIcs > div.version4_content__oaYfe > main > div > div.signed-in-start-page_content__GilyZ > div.signed-in-start-page_avatar__eLI_o > div';

    // Remove the element after a delay to ensure the page has fully loaded
    setTimeout(() => {
        removeElement(selectorToRemove);
    }, 100); // Adjust the delay (in milliseconds) as needed
})();
