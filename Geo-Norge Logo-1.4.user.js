// ==UserScript==
// @name         Geo-Norge Logo
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds a custom image to the top left of the GeoGuessr page and hides the default logo
// @author       YourName
// @match        *://www.geoguessr.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // URL of the custom image
    const imageUrl = 'https://res.cloudinary.com/dmuecdqxy/q_auto/v1721140263/static/geonorge-logopng_1721140289_50626.png';

    // Create a new image element
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.position = 'fixed';
    img.style.top = '10px';
    img.style.left = '10px';
    img.style.zIndex = '1000'; // Ensure the image is on top of other elements
    img.style.width = '75px'; // Adjust the width as needed
    img.style.height = 'auto'; // Maintain aspect ratio
    img.style.display = 'none'; // Initially hide the image

    // Append the image to the body
    document.body.appendChild(img);

    // Function to check the current URL and toggle the image visibility
    function checkUrlAndToggleImage() {
        const url = window.location.href;
        if (url.includes('geoguessr.com/game/') ||
            url.includes('geoguessr.com/challenge/') ||
            url === 'https://www.geoguessr.com/') {
            img.style.display = 'block';
        } else {
            img.style.display = 'none';
        }
    }

    // Initial check
    checkUrlAndToggleImage();

    // Observe changes in the URL
    const observer = new MutationObserver(checkUrlAndToggleImage);
    observer.observe(document.body, { childList: true, subtree: true });

    // Listen for pushstate and popstate events to detect URL changes
    (function(history){
        const pushState = history.pushState;
        history.pushState = function(state) {
            if (typeof history.onpushstate == "function") {
                history.onpushstate({state: state});
            }
            const result = pushState.apply(history, arguments);
            checkUrlAndToggleImage();
            return result;
        };

        window.addEventListener('popstate', function() {
            checkUrlAndToggleImage();
        });
    })(window.history);

    // Function to hide the specific logo element
    function hideLogo() {
        const logo = document.querySelector('img[src*="/_next/static/media/logo.6958f2fb.svg"]');
        if (logo) {
            logo.style.display = 'none';
        }
    }

    // Initial logo hide
    hideLogo();

    // Observe changes in the DOM to hide the logo if it reappears
    const logoObserver = new MutationObserver(hideLogo);
    logoObserver.observe(document.body, { childList: true, subtree: true });

})();
