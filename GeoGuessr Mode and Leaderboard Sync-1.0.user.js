// ==UserScript==
// @name         GeoGuessr Mode and Leaderboard Sync
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ensure the leaderboard is synced with the selected mode on page load and upon mode changes.
// @author       Your Name
// @match        https://www.geoguessr.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to simulate a mouse click on switch labels
    function simulateClickOnSwitch(labelText) {
        const targetSwitch = [...document.querySelectorAll('.switch_label__KrnMF')].find(label => label.textContent.trim() === labelText);
        if (targetSwitch) {
            targetSwitch.click();
            console.log(`Leaderboard synced to: ${labelText}`);
        } else {
            console.warn(`Leaderboard switch for "${labelText}" not found.`);
        }
    }

    // Check if the correct leaderboard mode is selected and update if not
    function checkAndSyncLeaderboard() {
        const activeModeButton = document.querySelector('.play-setting-button_root__AfG8z.play-setting-button_selected__A0_ik label');
        if (activeModeButton) {
            const activeModeText = activeModeButton.textContent.trim();
            simulateClickOnSwitch(activeModeText);
            console.log(`Leaderboard updated to: ${activeModeText}`);
        } else {
            console.error('Active mode button not found.');
        }
    }

    // Setup observer to ensure the DOM is fully ready and elements are interactable
    function setupObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length || mutation.attributeName) {
                    checkAndSyncLeaderboard();
                    observer.disconnect(); // Disconnect after successful update
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    // Event listener for clicks on mode buttons for dynamic updates
    document.addEventListener('click', function(event) {
        const clickedButton = event.target.closest('.play-setting-button_root__AfG8z.play-setting-button_selected__A0_ik');
        if (clickedButton) {
            console.log('Mode button clicked, updating leaderboard...');
            setTimeout(checkAndSyncLeaderboard, 100); // Delay to allow any page scripts to process the change
        }
    });

    // Delay initial check to cope with dynamically loaded content
    window.addEventListener('load', () => {
        setTimeout(() => {
            console.log('Page loaded. Initializing leaderboard sync...');
            setupObserver();
            checkAndSyncLeaderboard(); // Perform an initial check in case the observer setup misses the initial state
        }, 200);
    });
})();
