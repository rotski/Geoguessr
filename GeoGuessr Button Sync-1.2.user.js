// ==UserScript==
// @name         GeoGuessr Button Sync
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Syncs Move, No Move, and NMPZ button actions in GeoGuessr
// @author       Your Name
// @match        https://www.geoguessr.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Helper function to simulate a click on an element
    function simulateClick(element) {
        if (element) {
            element.click();
        }
    }

    // Event listener for clicks
    document.addEventListener('click', function (event) {
        const clickedElement = event.target;

        // Handle "Move" button
        if (
            clickedElement.matches('.label_label__9xkbh.label_yellowVariant__nO40I') &&
            clickedElement.textContent.trim() === 'Move'
        ) {
            console.log('Move button clicked!');
            const switchMoveButton = [...document.querySelectorAll('.switch_label__KrnMF')].find(label => label.textContent.trim() === 'Move');
            simulateClick(switchMoveButton);
        }

        // Handle "No move" button
        if (
            clickedElement.matches('.label_label__9xkbh.label_yellowVariant__nO40I') &&
            clickedElement.textContent.trim() === 'No move'
        ) {
            console.log('No move button clicked!');
            const switchNoMoveButton = [...document.querySelectorAll('.switch_label__KrnMF')].find(label => label.textContent.trim() === 'No move');
            simulateClick(switchNoMoveButton);
        }

        // Handle "NMPZ" button
        if (
            clickedElement.matches('.label_label__9xkbh.label_yellowVariant__nO40I') &&
            clickedElement.textContent.trim() === 'NMPZ'
        ) {
            console.log('NMPZ button clicked!');
            const switchNmpzButton = [...document.querySelectorAll('.switch_label__KrnMF')].find(label => label.textContent.trim() === 'NMPZ');
            simulateClick(switchNmpzButton);
        }
    });
})();
