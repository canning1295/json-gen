import { createDeckForm } from "./create-deck.js";
import { downloadDecks } from "./download-decks.js";

export function landing() {
    const newBody = document.body.cloneNode(false);
    document.body.parentNode.replaceChild(newBody, document.body);
    
    let container = document.createElement('div');
    container.className = 'd-flex flex-column justify-content-center align-items-center';
    container.style.height = '100vh';

    // Create buttons
    let downloadDecksButton = createButton('downloadDecksButton', 'btn', 'Download Decks', 'blue', '200px', downloadDecks);
    let createDeckButton = createButton('createDeckButton', 'btn', 'Create Deck', 'blue', '200px', createDeckForm);

    container.appendChild(downloadDecksButton);
    container.appendChild(createDeckButton);

    // Append the container to the body
    document.body.appendChild(container);
}

// Function to create a button
export function createButton(id, classes, text, color, width, importFunction) {
    let button = document.createElement('button');
    button.id = id;
    button.textContent = text;
    button.className = classes;
    button.style.backgroundColor = '#6cc7a5'; 
    button.style.marginBottom = '20px';
    button.style.width = width;
    button.addEventListener('click', function() {
        importFunction();
    });
    return button;
}
