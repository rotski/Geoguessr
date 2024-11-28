// ==UserScript==
// @name         GeoGuessr Coop
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Toggle between normal mode and full-screen map-only mode in GeoGuessr with notifications and transparency fix.
// @author       You
// @match        https://www.geoguessr.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let mapOnlyMode = false;
    let intervalId;

    // Function to apply necessary styles to the map container
    function applyStyles(mapContainer) {
        mapContainer.style.position = 'fixed';
        mapContainer.style.top = '0';
        mapContainer.style.left = '0';
        mapContainer.style.width = '100%';
        mapContainer.style.height = '100%';
        mapContainer.style.zIndex = '10000'; // Bring to front
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

    // Function to toggle between normal and map-only mode
    function toggleMode() {
        mapOnlyMode = !mapOnlyMode;
        const mapContainer = document.querySelector('.guess-map_canvasContainer__s7oJp'); // Updated map container
        const streetView = document.querySelector('.game_panorama__1moRf'); // Street view container
        const body = document.body;

        if (mapOnlyMode) {
            if (streetView) streetView.style.display = 'none'; // Hide street view
            if (mapContainer) {
                applyStyles(mapContainer);
                fixTransparency(mapContainer); // Ensure map is fully visible
            }
            body.style.overflow = 'hidden'; // Disable scrolling
            intervalId = setInterval(() => ensureStyles(mapContainer), 500); // Continuously ensure styles
            showNotification("Map Mode Active");
        } else {
            if (streetView) streetView.style.display = 'block'; // Restore street view
            if (mapContainer) {
                mapContainer.removeAttribute('style'); // Remove custom styles
            }
            body.style.overflow = ''; // Enable scrolling
            clearInterval(intervalId); // Stop ensuring styles
            showNotification("Driving Mode Active");
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
        notification.style.top = '300px';
        notification.style.right = '50px';
        notification.style.zIndex = '2000';
        notification.style.padding = '10px';
        notification.style.backgroundColor = '#333';
        notification.style.color = 'white';
        notification.style.borderRadius = '5px';
        notification.style.fontSize = '14px';
        notification.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000); // Remove notification after 3 seconds
    }

    // Inject a toggle button into the page
    function addToggleButton() {
        const button = document.createElement('button');
        button.innerText = "Drive/Map";
        button.style.position = "fixed";
        button.style.top = "200px";
        button.style.right = "50px";
        button.style.zIndex = "2000";
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
})();
