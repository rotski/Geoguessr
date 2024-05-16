// ==UserScript==
// @name         A fullscreen map Ctrl+i
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Expand the map to fullscreen in GeoGuessr and prevent it from becoming opaque or transparent when the mouse is moved off the map. Ensure it goes fullscreen as soon as the page loads. Press Ctrl+I to toggle the script.
// @author       Your Name
// @match        *://www.geoguessr.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let scriptEnabled = true;

    // Function to apply the necessary styles to the map container
    function applyStyles(mapContainer) {
        mapContainer.style.position = 'fixed';
        mapContainer.style.top = '0';
        mapContainer.style.left = '0';
        mapContainer.style.width = '100%';
        mapContainer.style.height = '100%';
        mapContainer.style.zIndex = '10000'; // Increase the z-index to ensure it's on top
        mapContainer.style.backgroundColor = '#000'; // Set background color to black
        mapContainer.style.opacity = '1'; // Ensure opacity is set to 1
        mapContainer.style.transition = 'none';
        mapContainer.style.pointerEvents = 'auto'; // Ensure pointer events are enabled
        mapContainer.style.setProperty('opacity', '1', 'important'); // Force opacity to 1
        // Prevent the map from becoming transparent on mouseout
        mapContainer.addEventListener('mouseout', function(event) {
            event.stopPropagation();
            mapContainer.style.opacity = '1';
        });
    }

    // Function to continuously apply styles to prevent transparency
    function ensureStyles() {
        const mapContainer = document.querySelector('.guess-map_canvasContainer__s7oJp');
        if (mapContainer && scriptEnabled) {
            applyStyles(mapContainer);
        }
    }

    // Function to expand the map to fullscreen and prevent transparency
    function expandMap() {
        const mapContainer = document.querySelector('.guess-map_canvasContainer__s7oJp');
        if (mapContainer && scriptEnabled) {
            applyStyles(mapContainer);
            // Continuously ensure styles are applied to prevent overriding
            setInterval(ensureStyles, 500); // Adjust interval if necessary
        }
    }

    // Function to toggle the script on/off
    function toggleScript() {
        scriptEnabled = !scriptEnabled;
        if (scriptEnabled) {
            expandMap();
        } else {
            // Remove styles and stop applying them
            const mapContainer = document.querySelector('.guess-map_canvasContainer__s7oJp');
            if (mapContainer) {
                mapContainer.removeAttribute('style');
            }
        }
    }

    // MutationObserver to watch for the element to be added to the DOM
    const observer = new MutationObserver((mutations, obs) => {
        const mapContainer = document.querySelector('.guess-map_canvasContainer__s7oJp');
        if (mapContainer) {
            expandMap();
            obs.disconnect(); // Stop observing after we found the element
        }
    });

    // Start observing the document body for added nodes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Add event listener for Ctrl+I to toggle the script
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'i') {
            toggleScript();
        }
    });

})();
