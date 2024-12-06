// ==UserScript==
// @name         GeoGuessr Co-op
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Toggle between normal mode and full-screen map-only mode in GeoGuessr, ensuring the map stays fully visible and the guess button appears at all times.
// @author       You
// @match        https://www.geoguessr.com/*
// @license      MIT
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let mapOnlyMode = false;
    let intervalId;
    let hoverIntervalId;

    // Function to apply necessary styles to the map container
    function applyStyles(mapContainer) {
        mapContainer.style.position = 'fixed';
        mapContainer.style.top = '0';
        mapContainer.style.left = '0';
        mapContainer.style.width = '100%';
        mapContainer.style.height = '100%';
        mapContainer.style.zIndex = '10000'; // Bring map to front
        mapContainer.style.backgroundColor = '#000'; // Black background
        mapContainer.style.opacity = '1'; // Full opacity
        mapContainer.style.transition = 'none';
        mapContainer.style.pointerEvents = 'auto'; // Ensure interaction
        mapContainer.style.setProperty('opacity', '1', 'important'); // Prevent transparency
    }

    // Function to fix transparency by simulating a mouse hover
    function fixTransparency(mapContainer) {
        const hoverEvent = new MouseEvent('mouseover', { bubbles: true, cancelable: true });
        mapContainer.dispatchEvent(hoverEvent); // Simulate mouse hover
    }

    // Function to continuously simulate hover over the map in map-only mode
    function simulateHover(mapContainer) {
        hoverIntervalId = setInterval(() => {
            if (mapOnlyMode) {
                fixTransparency(mapContainer); // Keep simulating hover to prevent transparency in map-only mode
            }
        }, 500); // Trigger hover simulation every 500ms
    }

    // Function to stop simulating hover (when we exit full-screen map mode)
    function stopSimulatingHover() {
        clearInterval(hoverIntervalId); // Stop the hover simulation
    }

    // Function to toggle between normal and map-only mode
    function toggleMode() {
        mapOnlyMode = !mapOnlyMode;
        const mapContainer = document.querySelector('.guess-map_canvasContainer__s7oJp'); // Updated map container
        const streetView = document.querySelector('.game_panorama__1moRf'); // Street view container
        const body = document.body;
        const guessButton = document.querySelector('.button_button__aR6_e.button_variantBlack__UsxpK.button_disabled__rTguF'); // Guess button

        if (mapOnlyMode) {
            if (streetView) streetView.style.display = 'none'; // Hide street view
            if (mapContainer) {
                applyStyles(mapContainer);
                fixTransparency(mapContainer); // Fix map transparency
                simulateHover(mapContainer); // Simulate hover to keep the map fully visible
            }
            body.style.overflow = 'hidden'; // Disable scrolling

            // Make sure the Guess button stays visible and at the bottom
            if (guessButton) {
                guessButton.style.position = 'fixed';
                guessButton.style.bottom = '20px'; // Move it to the bottom
                guessButton.style.left = '50%'; // Center the button horizontally
                guessButton.style.transform = 'translateX(-50%)'; // Adjust centering
                guessButton.style.zIndex = '10001'; // Bring Guess button in front of the map
            }

            intervalId = setInterval(() => ensureStyles(mapContainer), 500); // Continuously ensure styles
            showNotification("Mapping Active");
        } else {
            if (streetView) streetView.style.display = 'block'; // Restore street view
            if (mapContainer) {
                mapContainer.removeAttribute('style'); // Remove custom styles
            }
            body.style.overflow = ''; // Enable scrolling
            if (guessButton) {
                guessButton.style.position = ''; // Remove fixed position
                guessButton.style.bottom = ''; // Restore bottom positioning
                guessButton.style.left = ''; // Reset horizontal centering
                guessButton.style.transform = ''; // Reset centering
                guessButton.style.zIndex = ''; // Restore the original z-index of the Guess button
            }
            clearInterval(intervalId); // Stop ensuring styles
            stopSimulatingHover(); // Stop hover simulation
            showNotification("Driving Active");
        }
    }

    // Function to ensure styles stay applied when the round starts
    function ensureRoundStartStyles() {
        const mapContainer = document.querySelector('.guess-map_canvasContainer__s7oJp');
        const guessButton = document.querySelector('.button_button__aR6_e.button_variantBlack__UsxpK.button_disabled__rTguF');

        if (mapContainer && mapOnlyMode) {
            applyStyles(mapContainer);
            fixTransparency(mapContainer); // Fix map transparency
            simulateHover(mapContainer); // Simulate hover to ensure map visibility
        }

        if (guessButton && mapOnlyMode) {
            guessButton.style.position = 'fixed';
            guessButton.style.bottom = '20px'; // Move the guess button to the bottom
            guessButton.style.left = '50%'; // Center horizontally
            guessButton.style.transform = 'translateX(-50%)'; // Center adjustment
            guessButton.style.zIndex = '10001'; // Ensure guess button stays above map
        }
    }

    // Function to ensure styles stay applied
    function ensureStyles(mapContainer) {
        if (mapContainer && mapOnlyMode) {
            applyStyles(mapContainer);
        }
    }

    // Function to show a notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.innerText = message;
        notification.style.position = 'fixed';
        notification.style.top = '220px';
        notification.style.right = '50px';
        notification.style.zIndex = '2000';
        notification.style.padding = '10px';
        notification.style.backgroundColor = '#333';
        notification.style.color = 'white';
        notification.style.borderRadius = '5px';
        notification.style.fontSize = '14px';
        notification.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000); // Remove notification after 2 seconds
    }

    // Inject a toggle button into the page (always in front of map)
    function addToggleButton() {
        const button = document.createElement('button');
        button.innerText = "Drive/Map";
        button.style.position = "absolute";
        button.style.top = "180px";
        button.style.right = "50px";
        button.style.zIndex = "99999";  // Ensure it's above the map
        button.style.padding = "10px";
        button.style.backgroundColor = "#007bff";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.onclick = toggleMode;
        document.body.appendChild(button);
    }

    // MutationObserver to handle dynamic content
    const observer = new MutationObserver(() => {
        const mapContainer = document.querySelector('.guess-map_canvasContainer__s7oJp');
        if (mapContainer && mapOnlyMode) {
            ensureStyles(mapContainer);
        }
    });

    // Start observing the document body for added nodes
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Initialize the script
    function init() {
        addToggleButton();
    }

    // Wait for the page to load before initializing
    window.addEventListener('load', init);

    // Observe when a new round starts and apply styles
    const roundObserver = new MutationObserver(() => {
        const roundStart = document.querySelector('.game_guessMap__8jK3B');
        if (roundStart && mapOnlyMode) {
            ensureRoundStartStyles();
        }
    });

    // Start observing for round start
    roundObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
