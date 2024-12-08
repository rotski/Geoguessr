// ==UserScript==
// @name         GeoGuessr Button Sync
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Syncs Move, No Move, and NMPZ button actions in GeoGuessr using button classes
// @author       Your Name
// @match        https://www.geoguessr.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Helper function to simulate a click on a switch button
    function simulateClickOnSwitch(labelText) {
        const targetSwitch = [...document.querySelectorAll('.switch_label__KrnMF')].find(label => label.textContent.trim() === labelText);
        if (targetSwitch) {
            targetSwitch.click();
            console.log(`Simulated click on switch: ${labelText}`);
        } else {
            console.warn(`Switch for ${labelText} not found!`);
        }
    }

    // Event listener for clicks on play-setting buttons
    document.addEventListener('click', function (event) {
        const clickedButton = event.target.closest('.play-setting-button_root__AfG8z.play-setting-button_selected__A0_ik');

        if (clickedButton) {
            const buttonLabel = clickedButton.querySelector('.label_label__9xkbh');

            if (buttonLabel) {
                const labelText = buttonLabel.textContent.trim();

                // Determine which switch to activate based on the label text
                if (labelText === 'Move') {
                    console.log('Move button clicked!');
                    simulateClickOnSwitch('Move');
                } else if (labelText === 'No move') {
                    console.log('No move button clicked!');
                    simulateClickOnSwitch('No move');
                } else if (labelText === 'NMPZ') {
                    console.log('NMPZ button clicked!');
                    simulateClickOnSwitch('NMPZ');
                }
            }
        }
    });
})();
