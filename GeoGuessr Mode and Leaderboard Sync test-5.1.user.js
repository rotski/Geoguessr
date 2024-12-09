// ==UserScript==
// @name         GeoGuessr Mode and Leaderboard Sync 5.1
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Syncs the leaderboard with the selected game mode.
// @author       Rotski
// @license      MIT
// @match        https://www.geoguessr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520121/GeoGuessr%20Mode%20and%20Leaderboard%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/520121/GeoGuessr%20Mode%20and%20Leaderboard%20Sync.meta.js
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

    // Monitor URL changes and trigger actions if it matches /maps/*
    function monitorUrlChanges() {
        let lastPath = window.location.pathname;
        setInterval(() => {
            const currentPath = window.location.pathname;
            if (currentPath !== lastPath && currentPath.includes('/maps/')) {
                console.log('Detected navigation to /maps/, syncing leaderboard...');
                checkAndSyncLeaderboard();
                lastPath = currentPath;
            }
        }, 1000); // Check every second
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
            monitorUrlChanges(); // Start monitoring URL changes
        }, 200);
    });
})();
