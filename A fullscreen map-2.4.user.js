// ==UserScript==
// @name         A fullscreen map
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Expand the map to fullscreen in GeoGuessr 
// @author       Your Name
// @match        *://www.geoguessr.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

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
        if (mapContainer) {
            applyStyles(mapContainer);
        }
    }

    // Function to expand the map to fullscreen and prevent transparency
    function expandMap() {
        const mapContainer = document.querySelector('.guess-map_canvasContainer__s7oJp');
        if (mapContainer) {
            applyStyles(mapContainer);
            // Continuously ensure styles are applied to prevent overriding
            setInterval(ensureStyles, 100); // Adjust interval if necessary
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

})();
