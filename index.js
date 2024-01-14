import { landing } from './landing.js';
import { options } from './options.js';

export function launchApp() {
    if (!localStorage.getItem('user')) { 
        return options(); 
    } else {
        landing();
    }
}


function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    } else {
        console.log('Service Workers not supported in this browser.');
    }
}

// Listen for an updatefound event
navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (confirm('A new version of the app is available. Would you like to update now?')) {
        window.location.reload();
    }
});

document.addEventListener('DOMContentLoaded', () => {

        registerServiceWorker(); 
        launchApp();

});


