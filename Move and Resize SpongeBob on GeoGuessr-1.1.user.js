// ==UserScript==
// @name         Move and Resize SpongeBob on GeoGuessr
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add and move SpongeBob image on GeoGuessr page, with resizing functionality using L and K keys
// @author       ChatGPT
// @match        *://*.geoguessr.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // URL of the SpongeBob image
    const imageUrl = 'https://upload.wikimedia.org/wikipedia/en/3/3b/SpongeBob_SquarePants_character.svg';

    // Create the image element
    const imageElement = document.createElement('img');
    imageElement.src = imageUrl;
    imageElement.style.position = 'absolute';
    imageElement.style.top = '10px';
    imageElement.style.left = '10px';
    imageElement.style.width = '100px';
    imageElement.style.cursor = 'move';
    imageElement.style.zIndex = '1000';
    document.body.appendChild(imageElement);

    // Variables to track dragging state
    let isDragging = false;
    let offsetX, offsetY;

    // Function to handle the start of dragging
    function startDrag(e) {
        isDragging = true;
        offsetX = e.clientX - imageElement.getBoundingClientRect().left;
        offsetY = e.clientY - imageElement.getBoundingClientRect().top;
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
    }

    // Function to handle dragging
    function drag(e) {
        if (isDragging) {
            imageElement.style.left = (e.clientX - offsetX) + 'px';
            imageElement.style.top = (e.clientY - offsetY) + 'px';
        }
    }

    // Function to handle the end of dragging
    function endDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', endDrag);
    }

    // Function to handle resizing
    function resizeImage(e) {
        const currentWidth = parseInt(imageElement.style.width, 10);
        if (e.key === 'L' || e.key === 'l') {
            imageElement.style.width = (currentWidth + 10) + 'px';
        } else if (e.key === 'K' || e.key === 'k') {
            imageElement.style.width = Math.max(10, currentWidth - 10) + 'px';
        }
    }

    // Add event listener to start dragging
    imageElement.addEventListener('mousedown', startDrag);

    // Add event listener for resizing
    document.addEventListener('keydown', resizeImage);
})();
