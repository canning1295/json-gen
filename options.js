import { landing } from "./landing.js";

export function options() {
    // Retrieve the current user and newCardsLeft from local storage
    const user = localStorage.getItem('user') || '';
    const isAuthenticated = localStorage.getItem('auth') === 'true';
    let apiKey = localStorage.getItem('apiKey') || '';

    document.body.innerHTML = /*html*/`
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-body">
                            <form id="optionsForm" novalidate>
                                <div class="mb-3 row">
                                    <label for="user" class="col-sm-4 col-form-label">User:</label>
                                    <div class="col-sm-8">
                                        <select class="form-control" id="user" required>
                                            <option value="" ${user === '' ? 'selected' : ''}>Select User</option>
                                            <option value="Angie" ${user === 'Angie' ? 'selected' : ''}>Angie</option>
                                            <option value="Caden" ${user === 'Caden' ? 'selected' : ''}>Caden</option>
                                            <option value="Chris" ${user === 'Chris' ? 'selected' : ''}>Chris</option>
                                            <option value="Toby" ${user === 'Toby' ? 'selected' : ''}>Toby</option>
                                        </select>
                                        <div class="invalid-feedback">
                                            Please select a user.
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3 row" id="password-div">
                                    <label for="password" class="col-sm-4 col-form-label">Password:</label>
                                    <div class="col-sm-8">
                                        <input type="password" class="form-control" id="password"required>
                                        <div class="invalid-feedback">
                                            Please enter your password.
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="apiKey" class="col-sm-4 col-form-label">API Key:</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" id="apiKey" value="${apiKey}" required>
                                        <div class="invalid-feedback">
                                            Please enter your API key.
                                        </div>
                                    </div>
                                </div>
                            <div class="d-flex justify-content-end">
                                <div class="d-flex justify-content-end">
                                    <button type="button" id="cancelButton" class="btn btn-secondary me-2">Cancel</button>
                                    <button type="submit" id="saveButton" class="btn btn-primary">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // document.getElementById('saveButton').addEventListener('click', saveFlashyOptions); 
    document.getElementById('optionsForm').addEventListener('submit', async (event) => {
        event.preventDefault();
    
        if (!event.target.checkValidity()) {
            event.stopPropagation();
        } else {
            const passwordVerified = await verifyPassword(); // Store return value
            if (passwordVerified) {
                saveFlashyOptions(); // Proceed with saving options
            }
        }
    
        event.target.classList.add('was-validated'); // Add this class to show validation feedback
    });
}

function saveFlashyOptions() {
    const form = document.getElementById('optionsForm');
    if (form.checkValidity()) {
        const user = document.getElementById('user').value;
        let apiKey = document.getElementById('apiKey').value; // Get the API key from the form

        localStorage.setItem('user', user);
        localStorage.setItem('apiKey', apiKey); 

        landing();
    }
}

async function verifyPassword() {
    const inputPassword = document.getElementById('password').value;

    // Encrypted password and key from your provided data
    let encryptedPassword = 'ohMSqzv8TbiOqxaCLfPinFHkO88iSUjn';
    let keyBase64 = 'UEK0yOygU14cfytywC19edFakHZiY7s8d2NeYO9nyC0=';
    let IV = new Uint8Array([
        227, 209, 157, 175, 199, 86, 169, 79, 50, 251, 74, 176
    ]);

    try {
        // Convert Base64 key to ArrayBuffer
        const keyBuffer = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0)).buffer;

        // Import the key
        const key = await window.crypto.subtle.importKey(
            "raw",
            keyBuffer,
            { name: "AES-GCM" },
            true,
            ["decrypt"]
        );

        // Convert Base64 encrypted password to ArrayBuffer
        const encryptedData = Uint8Array.from(atob(encryptedPassword), c => c.charCodeAt(0)).buffer;

        // Decrypt the password
        const decryptedData = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: IV },
            key,
            encryptedData
        );

        const decryptedPassword = new TextDecoder().decode(decryptedData);
        if (inputPassword === decryptedPassword) {
            return true; // Return true if password matches
        } else {
            showToast('Incorrect password.');
            return false; // Return false if password does not match
        }
    } catch (e) {
        console.error('Decryption failed:', e);
        showToast('An error occurred during password verification.');
        return false;
    }
}

function showToast(message) {
    // Create toast element
    const toastDiv = document.createElement('div');
    toastDiv.classList.add('toast', 'align-items-center', 'text-white', 'bg-primary', 'border-0');
    toastDiv.setAttribute('role', 'alert');
    toastDiv.setAttribute('aria-live', 'assertive');
    toastDiv.setAttribute('aria-atomic', 'true');

    // Toast content
    toastDiv.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    // Append toast to body
    document.body.appendChild(toastDiv);

    // Initialize toast with Bootstrap Toast
    const bsToast = new bootstrap.Toast(toastDiv, {
        delay: 1000 // Show for 1 second
    });

    // Show the toast
    bsToast.show();

    // Remove the toast after it's hidden
    toastDiv.addEventListener('hidden.bs.toast', () => {
        toastDiv.parentNode.removeChild(toastDiv);
    });
}